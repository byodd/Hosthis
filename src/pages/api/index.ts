import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const apiUrl = process.env.API_URL
        const apiKey = process.env.HOSTHIS_API_KEY
        if (!apiUrl || !apiKey) {
            res.status(400).json({ error: "Env variable not found" })
            return
        }

        axios.get(apiUrl + "/V1/hello", {
            "headers": {
                "Authorization": `Bearer ${apiKey}`
            }
        })
            .then(e => {
                res.status(200).json(e.data)
                return
            })
            .catch(() => {
                res.status(400).json({ message: "Cannot fetch API" })
                return
            })
    } else {
        res.status(405).json({ error: "This route only accepts GET requests !" })
    }

}