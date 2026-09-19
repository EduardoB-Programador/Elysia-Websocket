import "../styles/UserPage.css"
import MessageContainer from '../components/MessageContainer';
import { useEffect, useRef, useState } from "react";

type Data = {
	id: number
	author: string
	message: string
}

export default function UserPage() {
	const [data, setData] = useState<Data[]>()
	const wsRef = useRef<WebSocket | undefined>()

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3000/ws/user")
		wsRef.current = socket
		socket.onopen = () => {
			console.log("Connected to websocket")
		}

		socket.onmessage = (event) => {
			console.log("Reached")
			const { payload, type } = JSON.parse(event.data) as { type: string, payload: Data|Data[] }
			console.log(payload)

			if (type === "history")
				setData(payload as Data[])
			else if (type === "message")
				setData((prev) => [...(prev ?? []), payload as Data])
		}

		return () => {
			socket.close()
		}
	}, [])

	return (
		<>
			<a id="login-link" href="/login">Login as Admin</a>
			<main>
				{
					data?.map((v) => {
						return <MessageContainer key={v.id} author={v.author} message={v.message} />
					})
				}
			</main>
		</>
	)
}