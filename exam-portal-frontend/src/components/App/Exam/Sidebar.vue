<template>
    <v-list
        dense
        nav
        class="app-exam-sidebar"
        style="max-height: 100%; overflow: auto"
    >
        <v-list-item-group v-model="selected" color="primary">
            <AppExamSidebarLink
                v-for="(question, index) in questions"
                :id="question.id"
                :key="index"
                :number="index + 1"
                :answered="question.userAnswer !== null"
                :flagged="question.flag"
            />
        </v-list-item-group>
    </v-list>
</template>

<script>
import AppExamSidebarLink from './SidebarLink.vue'
const SIDEBAR_WIDTH = 56

export default {
    name: 'AppExamSidebar',

    components: { AppExamSidebarLink },

    props: {
        questions: {
            type: Array,
            required: true,
            validator(v) {
                return v.every(
                    (question) =>
                        'id' in question &&
                        typeof question.id === 'string' &&
                        'flag' in question &&
                        typeof question.flag === 'boolean' &&
                        'userAnswer' in question,
                )
            },
        },
    },

    data() {
        return {
            SIDEBAR_WIDTH,

            selected: 0,
        }
    },

    watch: {
        // If no question is selected, go to the first one
        selected: {
            handler(v) {
                if (v === undefined && this.questions[0])
                    this.$router.push({
                        name: 'AppExamQuestion',
                        params: {
                            quizID: this.$route.params.quizID,
                            questionID: this.questions[0]?.id,
                        },
                    })
            },
        },
    },
}
</script>
