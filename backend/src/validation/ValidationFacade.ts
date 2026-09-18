import ValidationError from "../errors/ValidationError"

type User = {
    username: string
    password: string
}

let users:User[] = [
    {
        username: "hychilaa",
        password: "|-a_a-| N=1"
    }
]

export default class ValidationFacade {

    public static validateAdmin(obj:User) {
        for (const u of users) {
            if (obj.username === u.username && obj.password === u.password)
                return true
        }

        return false
    }

    public static validateToken(token:string) {
        for (const u of users) {
            if (token === Buffer.from(JSON.stringify(u), "utf-8").toString("base64"))
                return true
        }

        return false
    }
}