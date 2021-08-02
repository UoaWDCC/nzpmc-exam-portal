<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="text-h5 mb-2">
            {{ createQuestionMode ? 'Create question' : 'Question #' }}
        </h1>
        <v-form ref="questionForm" v-model="formIsValid">
            <v-row>
                <v-col class="col col-12 col-sm-3 col-lg-2 col-xl-1">
                    <v-text-field
                        label="ID"
                        value="aaaa"
                        disabled
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <h2 class="text-h6 mb-4">Question text</h2>
                    <Editor
                        v-model="content"
                        label="Questions text"
                        value="Yeet"
                        @input="updateText"
                        :rules="[rules.required]"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <h2 class="text-h6 mb-4">Answers</h2>
                    <v-radio-group
                        v-model="correctAnswer"
                        :rules="[rules.required]"
                        mandatory
                        class="mt-0 pt-0"
                    >
                        <div v-for="answer in answers" :key="answer.answerId">
                            <AdminSingleAnswer
                                :answer="answer"
                                :correctAnswerId="correctAnswer"
                                @deleteAnswer="deleteAnswer"
                            />
                        </div>
                        <v-card
                            elevation="2"
                            class="text--secondary pa-3 ml-8"
                            style="height: 3rem"
                            @click="
                                newAnswers.push({
                                    answerId: Math.random(),
                                    text: null,
                                })
                            "
                        >
                            <v-icon class="text--secondary">add</v-icon>
                            <span style="vertical-align: middle">
                                Add answer
                            </span>
                        </v-card>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-12 d-flex justify-end">
                    <v-btn
                        type="submit"
                        color="primary"
                        :disabled="!formIsValid"
                    >
                        <v-icon left class="material-icons">
                            {{ createQuestionMode ? 'add' : 'save' }}
                        </v-icon>
                        {{ createQuestionMode ? 'Create question' : 'Save' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>
<style>
input {
    color: inherit !important;
}
.v-application .v-input--is-focused.primary--text {
    color: #000000 !important;
}
.v-application .v-input--is-focused.primary--text.white--text {
    color: #ffffff !important;
}
</style>

<script>
import Editor from '../components/Editor'
import AdminSingleAnswer from '../components/AdminSingleAnswer'
export default {
    components: {
        Editor,
        AdminSingleAnswer,
    },
    data() {
        return {
            showDialog: false,
            questionForm: null,
            formIsValid: null,
            questionText: null,
            questionAnswers: [
                { answerId: 'zzzz', text: 'Maths' },
                { answerId: 'yyyy', text: 'Physics' },
                { answerId: 'xxxx', text: 'English' },
            ],
            newAnswers: [],
            correctAnswer: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },
            content: '',
        }
    },
    computed: {
        createQuestionMode() {
            return this.$route.name === 'QuizAdminCreateQuestion'
        },
        answers() {
            return this.questionAnswers.concat(this.newAnswers)
        },
    },
    methods: {
        updateText(value) {
            this.questionText = value
        },
        insertLatex(value) {
            this.showDialog = false
            console.log(value)
        },
        deleteAnswer(answerId) {
            // Functionality not yet implemented
            console.log(answerId)
        },
    },
}
</script>
