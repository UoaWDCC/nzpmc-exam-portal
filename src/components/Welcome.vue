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
                                Mathematics Competition 2022. Please ensure you
                                have watched the introduction video before you
                                start.
                            </p>
                        </v-col>
                        <v-col class="col-12 col-md-6">
                            <v-responsive
                                style="width: 100%"
                                :aspect-ratio="16 / 9"
                            >
                                <h2 class="text-center">Quizzes</h2>
                                <v-container>
                                    <template
                                        v-for="(item, index) in userQuizzes"
                                    >
                                        <v-row :key="index" justify="center">
                                            <v-list-item
                                                v-if="item.startTime != null"
                                                @click="continueQuiz(index)"
                                                large
                                                color="secondary"
                                                class="my-3"
                                            >
                                                Continue: {{ item.name }}
                                                <v-icon
                                                    right
                                                    class="material-icons"
                                                >
                                                    navigate_next
                                                </v-icon>
                                            </v-list-item>
                                            <v-list-item
                                                v-else
                                                @click="startQuiz(index)"
                                                large
                                                color="primary"
                                                class="mb-3"
                                            >
                                                {{ item.name }}
                                                <v-icon
                                                    right
                                                    class="material-icons"
                                                >
                                                    navigate_next
                                                </v-icon>
                                            </v-list-item>
                                        </v-row>
                                    </template>
                                </v-container>
                            </v-responsive>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import SignOutMenu from './SignOutMenu.vue'
import { EditQuizMutation } from '../gql/mutations/userQuiz.js'
import { UserQuizzesQuery } from '../gql/queries/userQuiz'

export default {
    components: {
        SignOutMenu,
    },
    data() {
        return {
            userQuizzes: null,
            overlay: false,
        }
    },
    apollo: {
        userQuizzes: {
            query: UserQuizzesQuery,
            update: (data) => {
                return data.userQuizzes
            },
        },
    },
    methods: {
        getLocalStorage(key) {
            return localStorage.getItem(key)
        },
        async startQuiz(index) {
            await this.$apollo.mutate({
                mutation: EditQuizMutation,
                variables: {
                    input: {
                        userQuizID: this.userQuizzes[index].id,
                        startTime: new Date().valueOf(),
                    },
                },
            })
            localStorage.setItem('currentQuizID', this.userQuizzes[index].id)
            this.$router.push({
                name: 'Quiz',
                params: { quizId: this.userQuizzes[index].id },
            })
        },
        continueQuiz(index) {
            const quizIdTemp =
                typeof index === 'number'
                    ? this.userQuizzes[index].id
                    : localStorage.getItem('currentQuizID')

            this.$router.push({
                name: 'Quiz',
                params: { quizId: quizIdTemp },
            })
        },
    },
}
</script>
