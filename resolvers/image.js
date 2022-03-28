import { AuthenticationError } from 'apollo-server-express'
import { bucket } from '../utils/firebase'

const resolvers = {
    Query: {
        image: async (parent, { questionID }, context) => {
            if (!context.user) throw new AuthenticationError()

            const [files] = await bucket.getFiles({
                prefix: `images/${questionID}`,
            })

            const images = files.map((file) => ({
                imageURI: `${process.env.BACKEND_URL}${file.name}`,
            }))

            return images
        },
    },
    Mutation: {
        image: async (parent, { input }, ctx) => {
            if (!ctx.user) throw new AuthenticationError()
            const { questionID, image } = input
            const { createReadStream, filename, mimetype, encoding } = await image
            const stream = createReadStream();

            const writeStream = bucket
                .file(`images/${questionID}/${filename}`)
                .createWriteStream({
                    metadata: {
                        contentType: mimetype,
                    },
                })

            const pipedStreams = stream.pipe(writeStream)

            const result = new Promise((resolve, reject) => {
                pipedStreams.on('finish', () => {
                    resolve({
                        imageURI: 
                            `${process.env.BACKEND_URL}images/${questionID}/${filename}`,
                    })
                })

                pipedStreams.on('error', (err) => {
                    console.log(err)
                    reject(err)
                })
            })
            return result
        },
    },
}

export default resolvers
