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
            const matches = newText.matchAll(latexRegex)
            for (const match of matches) {
                const startIndex = match.index
                const endIndex = match.index + match[0].length
                let substring = newText.slice(startIndex, endIndex)
                substring = substring.replaceAll('*', '\\*')
                substring = substring.replaceAll('_', '\\_')

                newText =
                    newText.slice(0, startIndex) +
                    substring +
                    newText.slice(endIndex)
            }
            return this.converter.makeHtml(newText)
        },
    },
}
</script>
