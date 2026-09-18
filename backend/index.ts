import { Elysia, status, t } from "elysia"
import cors from "@elysia/cors"
import ValidationFacade from "./src/validation/ValidationFacade"

let data: { id: number, author: string, message: string }[] = []
let id = 0
const TOPIC1 = "GENERAL" as const

const app = new Elysia()
    .use(cors())
    .ws('/ws/admin', {
        query: t.Object({
            token: t.String()
        }),

        body: t.Object({
            message: t.String(),
            author: t.String()
        }),

        beforeHandle({ query }) {
            if (!ValidationFacade.validateToken(query.token))
                return status(401, "Unauthorized, invalid token for admin.")

        },

        open(ws) {
            console.log("Connection established with device with id: " + ws.id)
            ws.send("Connection established!")
        },

        message(ws, message) {
            try {
                const entry = { ...message, id: id }
                data.push(entry)
                id++
                ws.publish(TOPIC1, { type: "message", payload: entry })
            } catch (err: unknown) {
                console.log(err)
            }
        },

        close(ws) {
            console.log("Connection ended with device id: " + ws.id)
        }
    })
    .ws("/ws/user", {
        open(ws) {
            try {
                ws.subscribe(TOPIC1)
                console.log(`Connection established with device with id ${ws.id}`)
                ws.send({ payload: data, type: "history" })
            } catch (err: unknown) {
                console.log(err)
            }
        },

        close(ws) {
            ws.unsubscribe(TOPIC1)
            console.log("Connection ended with device with id " + ws.id)
        }
    })
    .post('/api/admin/login', ({ body }) => {
        try {
            if (!ValidationFacade.validateAdmin(body))
                return status(401, "Unauthorized, Invalid admin credentials.")
            const token = Buffer.from(JSON.stringify(body), "utf-8").toString("base64")
            return status(200, { token: token })
        } catch (err:unknown) {
            console.log(err)
            return status(500)
        }
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(3000)

console.log("Websocket listening on ws://localhost:3000/")