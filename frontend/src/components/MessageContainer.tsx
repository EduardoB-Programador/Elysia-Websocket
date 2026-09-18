import "../styles/MessageContainer.css"

type Data = {
    author: string
    message: string
}

export default function MessageContainer(props: Data) {
    const { author, message } = props

    return (
        <div className="message-container">
            <label className="author">{author}</label>
            <div className="message">{message}</div>
        </div>
    )
}