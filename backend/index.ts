import { Elysia, status, t } from "elysia"
import cors from "@elysia/cors"
import ValidationFacade from "./src/validation/ValidationFacade"

let data: { id: number, author: string, message: string }[] = []
let id = 0
const subscribers = new Set()

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
                console.log(`About to publish: ${entry}`)
                for (const user of (subscribers as Set<typeof ws>)) {
                    user.send(JSON.stringify({type: "message", payload: entry}))
                }
                console.log("Published")
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
                subscribers.add(ws)
                console.log(ws.subscriptions)
                console.log(`Connection established with device with id ${ws.id}`)
                ws.send(JSON.stringify({ payload: data, type: "history" }))
            } catch (err: unknown) {
                console.log(err)
            }
        },

        close(ws) {
            subscribers.delete(ws)
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