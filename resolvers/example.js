const exampleResolvers = {
    Query: {
        numberSix(parent, args, context, info) {
            return 6
        },
        numberSeven(parent, args, context, info) {
            return 7
        },
    },
}

export default exampleResolvers
