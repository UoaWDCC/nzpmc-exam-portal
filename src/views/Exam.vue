<template>
    <div class="exam">
        <v-app>
            <Sidebar />

            <v-app-bar app>
                <!-- to be changed to Topbar component-->
            </v-app-bar>

            <!-- Sizes your content based upon application components -->
            <v-main>
                <!-- Provides the application the proper gutter -->
                <v-container fluid>
                    <v-row>
                        <v-col cols="8">
                            <!-- to be changed to single question component -->
                            <v-sheet
                                class="d-flex align-center justify-center"
                                height="90vh"
                                elevation="3"
                                >Single Question Component</v-sheet
                            >
                        </v-col>
                        <v-col>
                            <v-card
                                class="d-flex align-center justify-center"
                                height="90vh"
                                elevation="3"
                            >
                                <AnswerList :optionsList="answers" />
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-main>

            <v-footer app>
                <!-- -->
            </v-footer>
        </v-app>
    </div>
</template>

<script>
import AnswerList from './../components/AnswerList.vue'
import Sidebar from '../components/Sidebar'

export default {
    setup() {},
    components: {
        AnswerList,
        Sidebar,
    },
    data() {
        return {
            answers: [
                { text: 'First Answer', id: 1 },
                { text: 'Second Answer', id: 2 },
                { text: 'Third Answer', id: 3 },
                { text: 'Fourth Answer', id: 4 },
            ],
        }
    },
}
</script>
