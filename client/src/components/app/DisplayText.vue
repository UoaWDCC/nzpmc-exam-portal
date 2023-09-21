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
      htmlContent: ''
    }
  },

  mounted() {
    this.parsed()
  },

  methods: {
    parsed() {
      const latexRegex = /\$(\$?)(.*?)\1\$/g
      const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g

      const latexStrings = []
      const imageSubstrings = []
      let match;
      while ((match = latexRegex.exec(this.text.replace(/\$\$/gi, '$'))) !== null) {
        latexStrings.push('$' + match[2] + '$')
      }

      while ((match = imageRegex.exec(this.text.replace(/\$\$/gi, '$'))) !== null) {
        imageSubstrings.push(match[0])
      }

      let html = '<div>'
      let workingString = this.text.replace(/\$\$/gi, '$').replace(imageRegex, "");

      latexStrings.forEach((latexString) => {
        const parts = workingString.split(latexString)
        html += `${parts[0]}` //add non latex part

        //add the latex part
        html += `<div class="latex">${latexString}</div>`

        workingString = parts[1]
      })

      html += `<p>${workingString}</p></div>`
      imageSubstrings.forEach(img => {
        html += img;
      })

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

.question-form {
  > div {
    display: flex;
  }
}

.latex {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
