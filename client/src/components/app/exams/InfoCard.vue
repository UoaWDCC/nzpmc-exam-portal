<template>
    <v-sheet color="white" class="app-exams-card mb-3 pa-4" rounded>
        <h3 class="text-h6">{{ title }}</h3>

        <span class="text--secondary text-subtitle-2">
            {{ description }} &middot;
            {{ generateDurationString(duration) }} &middot;
            {{ generateDateString(startTime) }} until
            {{ generateDateString(endTime) }}
        </span>
    </v-sheet>
</template>

<script>
import { generateDateString, generateDurationString } from '@/helpers'

export default {
    name: 'AppExamsInfoCard',

    props: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    },

    methods: {
        generateDateString,
        generateDurationString,
    },
}
</script>
