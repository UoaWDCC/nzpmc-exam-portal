<template>
    <v-radio
        :value="answer.id"
        on-icon="check_circle"
        off-icon="radio_button_unchecked"
        class="mb-2"
    >
        <template v-slot:label>
            <v-text-field
                v-model="answer.option"
                label="..."
                solo
                :background-color="
                    correctAnswerId === answer.id ? 'primary' : 'white'
                "
                :class="
                    (correctAnswerId === answer.id
                        ? 'white--text'
                        : 'black--text') + ' ml-2'
                "
                ref="input"
                @click.stop
            >
                <template v-slot:append>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                small
                                icon
                                @click="openLatex"
                                v-bind="attrs"
                                v-on="on"
                                :color="
                                    correctAnswerId === answer.id
                                        ? 'white'
                                        : null
                                "
                            >
                                <v-icon>functions</v-icon>
                            </v-btn>
                            <QuizAdminLatexDialog
                                :showDialog="showDialog"
                                :defaultValue="currentSelected"
                                @cancel="showDialog = false"
                                @insertLatex="insertLatex"
                            />
                        </template>
                        <span>Insert LaTeX Equation</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                small
                                icon
                                @click="deleteAnswer"
                                v-bind="attrs"
                                v-on="on"
                                :color="
                                    correctAnswerId === answer.id
                                        ? 'white'
                                        : null
                                "
                            >
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete answer</span>
                    </v-tooltip>
                </template>
            </v-text-field>
        </template>
    </v-radio>
</template>

<script>
import QuizAdminLatexDialog from './QuizAdminLatexDialog'
export default {
    components: {
        QuizAdminLatexDialog,
    },
    data() {
        return {
            currentSelected: null,
            showDialog: false,
        }
    },
    props: ['answer', 'correctAnswerId'],
    methods: {
        openLatex() {
            // Calculate the currently selected text and inject into the latex editor
            const input = this.$refs.input.$el.querySelector('input')
            this.currentSelected = this.answer.text.slice(
                input.selectionStart,
                input.selectionEnd,
            )

            // Open the latex dialog
            this.showDialog = true
        },
        insertLatex(value) {
            // Calculate the new value of the question input
            const input = this.$refs.input.$el.querySelector('input')
            this.currentSelected = this.answer.text.slice(
                input.selectionStart,
                input.selectionEnd,
            )
            this.answer.text =
                this.answer.text.slice(0, input.selectionStart) +
                value +
                this.answer.text.slice(input.selectionEnd)

            // Hide the latex dialog
            this.showDialog = false
        },
        deleteAnswer() {
            this.$emit('delete', this.answer.id)
        },
    },
}
</script>
