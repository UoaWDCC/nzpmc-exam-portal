<template>
    <v-toolbar
        elevation="0"
        dense
        class="app-exam-topbar"
        style="border-bottom: thin solid rgba(0, 0, 0, 0.12)"
    >
        <v-toolbar-title>{{ name }}</v-toolbar-title>

        <v-spacer />

        <AppExamTopbarSpinner />

        <AppExamTopbarTimer />

        <v-btn color="secondary" depressed class="ml-2">Submit</v-btn>
    </v-toolbar>
</template>

<script>
import AppExamTopbarSpinner from './TopbarSpinner'
import AppExamTopbarTimer from './TopbarTimer'

export default {
    name: 'AppExamTopbar',

    components: { AppExamTopbarSpinner, AppExamTopbarTimer },

    props: {
        name: {
            type: String,
            required: true,
        },
    },
}
</script>
