import { Request, Response } from 'express'
import { auth, bucket } from './firebase'

interface RequestError extends Error {
    code?: string
    errors?: Error[]
}

export const imageController = async (req: Request, res: Response) => {
    const user = await auth({ req, res })
    if (!user) {
        res.status(401).send('Unauthorized')
        return
    }

    const image = bucket.file(
        `images/${req.params.questionID}/${req.params.filename}`,
    )

    const stream = image.createReadStream()
    stream.on('data', (data) => {
        res.write(data)
    })
    stream.on('end', () => {
        res.status(200).send()
    })
    stream.on('error', (err: RequestError) => {
        if (err.code) {
            return res.status(Number(err.code)).send(err.message)
        }
        return res.status(500).send(err.message)
    })
}
