export default {
    methods: {
        nameCase(name: string | undefined | null) {
            if (!name) return ""
            const trimmedName = name.trim()
            const formattedName = trimmedName
                .toLowerCase()
                .split(' ')
                // Concats first letter capitalised and includes rest of string
                .map((substring: string) => substring.charAt(0).toUpperCase() + substring.substring(1))
                .join(' ')

            return formattedName
        },
    },
}