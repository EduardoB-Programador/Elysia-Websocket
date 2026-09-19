import { useCookies } from "react-cookie"
import "../styles/AdminPage.css"
import { FormEventHandler, useEffect, useRef } from "react"
import { useNavigate } from "react-router"

type Textarea = HTMLTextAreaElement

function base64ToUtf8(b64:string) {
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}


export default function AdminPage() {
    const [cookies, _, removeCookies] = useCookies()
    const navigate = useNavigate()
    const textRef = useRef<Textarea>(null)
    const wsRef = useRef<WebSocket | undefined>()

    useEffect(() => {
        if (wsRef.current)
            wsRef.current.close()
        if (!("user_cred" in cookies))
            navigate("/login")

        const socket = new WebSocket(`ws://localhost:3000/ws/admin?token=${cookies.user_cred}`)

        wsRef.current = socket

        socket.onopen = () => {
            console.log("Connected!")
        }

        socket.onclose = () => {
            console.log("Connection ended")
            removeCookies("user-cred")
        }
    }, [])

    const send: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        console.log("trigger")
        const text = textRef.current?.value
        textRef.current!.value = ""

        const data = base64ToUtf8(cookies.user_cred)

        console.log(data)
        const user = JSON.parse(data) as { username: string }

        wsRef.current?.send(JSON.stringify({ author: user.username, message: text }))
    }

    return (
        <>
            <main>
                <form onSubmit={send}>
                    <textarea placeholder="Type your message..." ref={textRef}></textarea>
                    <input id="submit-button" type="submit" value="Send" />
                </form>
            </main>
        </>
    )
}