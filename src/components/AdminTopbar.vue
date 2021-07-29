<template>
    <v-card elevation="2">
        <v-toolbar>
            <v-toolbar-title class="me-4">NZPMC Admin</v-toolbar-title>

            <v-toolbar-items>
                <v-btn text to="/admin/quiz">Quizzes</v-btn>
                <v-btn text to="/admin/user">Users</v-btn>
            </v-toolbar-items>

            <v-spacer />

            <SignOutMenu />
        </v-toolbar>
    </v-card>
</template>

<script>
import SignOutMenu from '../components/SignOutMenu.vue'

export default {
    components: {
        SignOutMenu,
    },
}
</script>
