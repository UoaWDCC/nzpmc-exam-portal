<template>
    <div class="app-exams-list">
        <v-alert v-if="!userQuizzes.length" type="info" class="my-6">
            You're not enrolled in any exam.
        </v-alert>

        <div v-if="currentExams.length" class="my-6">
            <h2 class="mb-6 text-h5">Current Exams</h2>

            <AppExamsLinkCard
                v-for="exam in currentExams"
                :key="exam.id"
                :title="exam.name"
                :description="exam.description"
                :duration="exam.duration"
                :start-time="exam.startTime"
                :end-time="exam.endTime"
                :to="{ name: 'AppExam', params: { quizID: exam.id } }"
            />
        </div>

        <div
            v-if="upcomingExams.length || pastExams.length"
            class="d-flex my-6"
            style="gap: 24px"
        >
            <div
                v-if="upcomingExams.length"
                class="flex-grow-1 mb-n3"
                style="min-width: 50%"
            >
                <h2 class="mb-6 text-h5">Upcoming Exams</h2>

                <AppExamsInfoCard
                    v-for="exam in upcomingExams"
                    :key="exam.id"
                    :title="exam.name"
                    :description="exam.description"
                    :duration="exam.duration"
                    :start-time="exam.startTime"
                    :end-time="exam.endTime"
                />
            </div>

            <div
                v-if="pastExams.length"
                class="flex-grow-1 mb-n3"
                style="min-width: 50%"
            >
                <h2 class="mb-6 text-h5">Past Exams</h2>

                <AppExamsInfoCard
                    v-for="exam in pastExams"
                    :key="exam.id"
                    :title="exam.name"
                    :description="exam.description"
                    :duration="exam.duration"
                    :start-time="exam.startTime"
                    :end-time="exam.endTime"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import AppExamsLinkCard from './LinkCard.vue'
import AppExamsInfoCard from './InfoCard.vue'
import type { UserQuiz } from '@nzpmc-exam-portal/common'
import type { PropType } from 'vue'

export default {
    name: 'AppExamsList',

    components: { AppExamsLinkCard, AppExamsInfoCard },

    props: {
        // An array of objects, each representing a quiz the user is enrolled in
        userQuizzes: {
            type: Object as PropType<UserQuiz[]>,
            required: true,
            validator(v: UserQuiz[]) {
                return v.every(
                    (quiz) =>
                        'description' in quiz &&
                        typeof quiz.description === 'string' &&
                        'duration' in quiz &&
                        typeof quiz.duration === 'number' &&
                        'endTime' in quiz &&
                        typeof quiz.endTime === 'string' &&
                        'id' in quiz &&
                        typeof quiz.id === 'string' &&
                        'name' in quiz &&
                        typeof quiz.name === 'string' &&
                        'startTime' in quiz &&
                        typeof quiz.startTime === 'string',
                )
            },
        },
    },

    computed: {
        // Exams that have started, and have not finished
        currentExams() {
            return this.userQuizzes.filter(
                (quiz) =>
                    new Date(quiz.startTime) <= new Date() &&
                    new Date() < new Date(quiz.endTime),
            )
        },

        // Exams that have not yet started
        upcomingExams() {
            return this.userQuizzes.filter(
                (quiz) => new Date() < new Date(quiz.startTime),
            )
        },

        // Exams that finished
        pastExams() {
            return this.userQuizzes.filter(
                (quiz) => new Date() >= new Date(quiz.endTime),
            )
        },
    },
}
</script>
