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
                        <v-col class="col-12">
                            <h1>That's it, well done!</h1>
                            <p>
                                Ka pai! This year's questions were particularly
                                challenging, so do not be dismayed if you were
                                not able to complete the entire exam.
                            </p>
                            <p>
                                We'll update you regarding your scores through
                                email, and they'll also be published on our
                                website at
                                <a href="https://www.nzpmc.com">nzpmc.com</a>.
                            </p>
                            <p>
                                If you have any feedback about or encountered
                                any issues during the exam, please email
                                <a href="mailto:contact@nzpmc.com"
                                    >contact@nzpmc.com</a
                                >.
                            </p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SignOutMenu from './SignOutMenu.vue'

export default {
    components: {
        SignOutMenu,
    },
}
</script>
