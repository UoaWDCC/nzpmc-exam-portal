<template>
    <v-container class="d-flex flex-column" style="height: 100%">
        <v-row>
            <v-col class="col-12">
                <AdminTopbar />
            </v-col>
        </v-row>
        <v-row style="height: 100%">
            <v-col class="col-12 col-md-4 col-xl-3">
                <QuizAdminSidebar />
            </v-col>
            <v-col class="col">
                <QuizAdminDetails />
                <QuizAdminUsers />
                <QuizAdminQuestion />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AdminTopbar from '../components/AdminTopbar.vue'
import QuizAdminSidebar from '../components/QuizAdminSidebar.vue'
import QuizAdminDetails from '../components/QuizAdminDetails.vue'
import QuizAdminUsers from '../components/QuizAdminUsers.vue'
import QuizAdminQuestion from '../components/QuizAdminQuestion.vue'

export default {
    components: {
        AdminTopbar,
        QuizAdminSidebar,
        QuizAdminDetails,
        QuizAdminUsers,
        QuizAdminQuestion,
    },
}
</script>
