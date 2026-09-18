import { FormEventHandler, useRef, useState } from "react"
import "../styles/Login.css"
import { useNavigate } from "react-router"
import { useCookies } from "react-cookie"

export default function Login() {
    const [error, setError] = useState<string>()
    const navigate = useNavigate()
    const [_, setCookies] = useCookies()

    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const wsRef = useRef<WebSocket | undefined>()

    const connect: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        wsRef.current?.close()
        
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value
        const user = { username: username, password: password }
        const data = await fetch("http://localhost:3000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }).then(res => res.json())
        
        if (!data.token) {
            setError("Invalid credentials for admin")
            return
        }
        setCookies("user_cred", data.token)
        navigate("/admin")
    }

    return (
        <>
            <div id="login-container">
                <form onSubmit={connect}>
                    <div>
                        <label>Username:</label>
                        <input className="form-input" type="password" placeholder="username" ref={usernameRef} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input className="form-input" type="password" placeholder="password" ref={passwordRef} />
                    </div>
                    <input id="submit-button" type="submit" value={"Login as admin"} />
                    <p id="error-message">{error}</p>
                </form>
            </div>
        </>
    )
}