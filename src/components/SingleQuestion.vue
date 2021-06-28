<template>
    <v-card class="pa-4 fill-height" elevation="2">
        <v-card-title> Question 1 </v-card-title>
        <v-card-text>
            <latex :content="question" />
        </v-card-text>
        <img
            style="width: 100%; max-width: 300px"
            alt="NZPMC Logo"
            src="../assets/logo.png"
        />
    </v-card>
</template>
<script>
export default {
    props: {
        question: String,
    },
}
</script>
