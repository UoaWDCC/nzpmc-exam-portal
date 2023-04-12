<template>
    <div class="align-center auth-header d-flex">
        <v-btn
            v-if="showBack"
            icon
            color="primary"
            class="ml-4"
            large
            @click="$emit('back')"
        >
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>
            <v-card-title>{{ title }}</v-card-title>

            <v-card-subtitle>{{ text }}</v-card-subtitle>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthHeader',

    props: {
        title: { type: String, required: true },
        text: { type: String, required: true },
        showBack: Boolean,
    },
}
</script>
