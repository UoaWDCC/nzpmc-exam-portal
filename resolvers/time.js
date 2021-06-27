const resolvers = {
    Query: {
        currentTime: (parents,arg,ctx) => {
            return new Date();
        }
    },
}

export default resolvers
