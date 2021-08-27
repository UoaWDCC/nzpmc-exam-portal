<template>
    <v-container>
        <v-toolbar
            class="rounded-bl-xl rounded-br-0"
            style="position: fixed; top: 0; right: 0; z-index: 1"
            collapse
        >
            <SignOutMenu />
        </v-toolbar>
        <v-row class="justify-center">
            <v-col class="col-12 col-xl-8">
                <v-card class="pa-4" elevation="2">
                    <v-row>
                        <v-col class="col-12">
                            <img
                                style="width: 100%; max-width: 300px"
                                class="d-block mx-auto"
                                alt="NZPMC Logo"
                                src="../assets/logo.png"
                            />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col class="col-12 col-xl-8">
                <v-card class="pa-4" elevation="2">
                    <v-row>
                        <v-col class="col-12 col-md-6">
                            <h1>Kia ora!</h1>
                            <p>
                                Welcome to the New Zealand Physics and
                                Mathematics Competition 2021. Please ensure you
                                have watched the introduction video before you
                                start.
                            </p>
                        </v-col>
                        <v-col class="col-12 col-md-6">
                            <v-responsive
                                style="width: 100%"
                                :aspect-ratio="16 / 9"
                            >
                                <iframe
                                    style="width: 100%; height: 100%"
                                    src="https://www.youtube.com/embed/Des5TrztWRU"
                                    title="YouTube video player"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                ></iframe>
                            </v-responsive>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="col-12 text-center">
                            <v-btn
                                v-if="
                                    userQuiz != null &&
                                    userQuiz.startTime == null
                                "
                                @click="startQuiz()"
                                large
                                color="primary"
                            >
                                Start
                                <v-icon right class="material-icons">
                                    navigate_next
                                </v-icon>
                            </v-btn>
                            <v-btn
                                v-else
                                to="/exam"
                                large
                                color="primary"
                                :disabled="!userQuiz"
                            >
                                Continue
                                <v-icon right class="material-icons">
                                    navigate_next
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import SignOutMenu from '../components/SignOutMenu.vue'
import { EditQuizMutation } from '../gql/mutations/userQuiz.js'
import { UserQuizzesQuery } from '../gql/queries/userQuiz'

export default {
    components: {
        SignOutMenu,
    },
    data() {
        return {
            userQuiz: null,
        }
    },
    apollo: {
        userQuiz: {
            query: UserQuizzesQuery,
            update: (data) => {
                return data.userQuizzes[0]
            },
        },
    },
    methods: {
        async startQuiz() {
            await this.$apollo.mutate({
                mutation: EditQuizMutation,
                variables: {
                    input: {
                        userQuizID: this.userQuiz.id,
                        startTime: new Date().valueOf(),
                    },
                },
            })
            this.$router.push({
                name: 'Exam',
                params: { quizId: this.userQuiz.id },
            })
        },
    },
}
</script>
