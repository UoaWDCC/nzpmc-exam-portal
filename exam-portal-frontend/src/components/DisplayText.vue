<template>
    <p v-html="parsed"></p>
</template>

<style>
/* Sizing will depend on screen size*/
img {
    width: 100%;
    height: 100%;
}
</style>

<script>
import 'katex/dist/katex.min.css'
import showdown from 'showdown'
import showdownKatex from 'showdown-katex'

export default {
    props: ['text'],

    data() {
        return {
            converter: new showdown.Converter({
                extensions: [
                    showdownKatex({
                        displayMode: true,
                        throwOnError: false, // allows katex to fail silently
                        errorColor: '#ff0000',
                        delimiters: [
                            { left: '$', right: '$' },
                            {
                                left: '~',
                                right: '~',
                                display: false,
                                asciimath: true,
                            },
                        ],
                    }),
                ],
            }),
        }
    },

    computed: {
        parsed() {
            let newText = this.text
            // The regex expression is used to find
            // substrings which are latex blocks and ignores \$
            const latexRegex = /(?<!\\)\$.*?(?<!\\)\$/g
            const matches = [...newText.matchAll(latexRegex)]
            // Reverses array, so that indexing is still correct
            // while modifying the string
            matches.reverse()
            for (const match of matches) {
                const startIndex = match.index
                const endIndex = match.index + match[0].length
                const leftSubstring = newText.slice(0, startIndex)
                const rightSubstring = newText.slice(endIndex)
                let midSubstring = newText.slice(startIndex, endIndex)
                midSubstring = midSubstring.replaceAll('*', '\\*')
                midSubstring = midSubstring.replaceAll('_', '\\_')
                newText = leftSubstring + midSubstring + rightSubstring
            }
            return this.converter.makeHtml(newText)
        },
    },
}
</script>
