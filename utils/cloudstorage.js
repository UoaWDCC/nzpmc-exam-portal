import { auth, bucket } from './firebase'

export const imageController = async (req, res) => {
    const authCheck = auth()
    const user = await authCheck({ req })
    if (user == null) {
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
    stream.on('end', (data) => {
        res.status(200).send()
    })
    stream.on('error', (err) => {
        res.status(err.code).send(err.message)
    })
}
