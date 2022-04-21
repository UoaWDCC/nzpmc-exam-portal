import { AuthenticationError } from '../utils/errors'
import { bucket } from '../utils/firebase'
import { ImageResolvers } from './resolvers-types'

const resolvers: ImageResolvers = {
    Mutation: {
        image: async (parent: any, { input }: any, ctx: { user: any }) => {
            if (!ctx.user) throw new AuthenticationError()
            const { questionID, image } = input
            const { createReadStream, filename, mimetype, encoding } =
                await image
            const stream = createReadStream()

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
                        imageURI: `${process.env.BACKEND_URL}images/${questionID}/${filename}`,
                    })
                })

                pipedStreams.on('error', (err: any) => {
                    console.log(err)
                    reject(err)
                })
            })
            return result
        },
    },
}

export default resolvers
