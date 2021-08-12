<template>
    <v-card elevation="2">
        <v-toolbar>
            <a href="../views/Welcome">
                <img
                    style="width: 100%; max-width: 50px; padding-right: 10px"
                    class="d-block mx-auto"
                    alt="NZPMC"
                    src="../assets/logo_small.png"
                />
            </a>
            <v-toolbar-title class="me-4"><b>NZPMC Admin</b></v-toolbar-title>
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
