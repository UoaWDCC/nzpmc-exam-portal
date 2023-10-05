<template>
  <v-textarea :model-value="text" @change="handleDescriptionChange" v-if="isAdminAndEditing"></v-textarea>
  <div v-show="!isAdminAndEditing" v-html="htmlContent" class="question-form"></div>
</template>

<script lang="ts">
import 'katex/dist/katex.min.css'
import quizEditingMixin from '@/utils/quizEditingMixin'
import { Converter } from 'showdown'
import katex from 'katex'

import { debounce } from '@/utils/quizManagement'

export default {
  name: 'AppDisplayText',
  emits: ['question-changed', 'ready-to-fetch'],
  mixins: [quizEditingMixin],
  props: {
    text: { type: String, required: true }
  },

  data() {
    return {
      converter: new Converter(),
      htmlContent: ''
    }
  },
  methods: {
    async handleDescriptionChange(event: Event) {
      const currentDescription: string = event.target.value
      this.$emit('question-changed', {
        questionID: this.questionID,
        questionDescription: currentDescription
      })
      const debouncedEdit = debounce(this.editQuestionInfo)
      const res = await debouncedEdit(this.$apollo.getClient(), {
        questionID: this.questionID,
        quizID: this.quizID,
        questionDescription: currentDescription
      })
      if (res) {
        this.$emit('ready-to-fetch')
      }
    },
    parsed() {
      const latexRegex = /\$(\$?)(.*?)\1\$/g
      const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g


      const latexStrings = []
      const imageSubstrings = []
      let match
      while ((match = latexRegex.exec(this.text.replace(/\$\$/gi, '$'))) !== null) {
        latexStrings.push('$' + match[2] + '$')
      }

      while ((match = imageRegex.exec(this.text.replace(/\$\$/gi, '$'))) !== null) {
        imageSubstrings.push(match[0])
      }

      let html = '<div>'
      let workingString = this.text.replace(/\$\$/gi, '$').replace(imageRegex, '')

      latexStrings.forEach((latexString) => {
        if (workingString) {
          const parts = workingString.split(latexString)
          html += `${parts[0]}` //add non latex part

          //add the latex part
          html += `<div class="latex">${latexString}</div>`

          workingString = parts[1]
        }
      })

      html += `<p>${workingString}</p></div>`
      imageSubstrings.forEach((img) => {
        html += img
      })

      this.htmlContent = this.converter.makeHtml(html)
      this.renderLatex()

    },
    renderLatex() {
      this.$nextTick(() => {
        document.querySelectorAll('.latex').forEach((node) => {
          console.log('fuck all here')
          let latex = node.textContent
          let convertedLatex = latex?.slice(1, -1)
          katex.render(convertedLatex, node, {
            throwOnError: true
          })
        })
      })
    }

  },

  mounted() {
    this.parsed()

  },
  watch: {
    text: {
      handler() {
        this.parsed()

      }
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
  >div {
    display: flex;
    flex-direction: column;
  }
}

.latex {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
