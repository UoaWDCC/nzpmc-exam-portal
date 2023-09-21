<template>
  <div v-html="htmlContent" class="question-form"></div>
</template>

<script lang="ts">
import { Converter } from 'showdown'
import 'katex/dist/katex.min.css'
import katex from 'katex'

export default {
  name: 'AppDisplayText',
  props: {
    text: { type: String, required: true }
  },

  data() {
    return {
      converter: new Converter(),
      htmlContent: '<strong>This is bold text.</strong>'
    }
  },

  mounted() {
    this.parsed()
  },

  methods: {
    parsed() {
      this.htmlContent = ''
      const regex = /\$(\$?)(.*?)\1\$/g

      const latexStrings = []
      let match
      while ((match = regex.exec(this.text.replace(/\$\$/gi, '$'))) !== null) {
        latexStrings.push('$' + match[2] + '$')
      }

      let html = ''
      let workingString = this.text.replace(/\$\$/gi, '$')

      latexStrings.forEach((latexString) => {
        const parts = workingString.split(latexString)
        html += parts[0] //add non latex part

        //add the latex part
        html += `<div class="latex">${latexString}</div>`

        workingString = parts[1]
      })

      html += workingString

      this.htmlContent = this.converter.makeHtml(html)

      this.$nextTick(() => {
        document.querySelectorAll('.latex').forEach((node) => {
          let latex = node.textContent
          let convertedLatex = latex?.slice(1, -1)
          katex.render(convertedLatex, node, {
            throwOnError: false
          })
        })
      })
    }
  }
}
</script>

<style>
img {
  max-width: min(100%, 300px);
  margin: 0 auto;
  display: block;
}
</style>
