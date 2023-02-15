<template>
    <v-snackbar v-model="snackbar" class="snackbar" :timeout="-1">
        {{ text }}

        <template #action="{ attrs }">
            <v-btn
                color="primary"
                text
                v-bind="attrs"
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useMainStore } from '@/stores/main'

export default {
    name: 'AppSnackbar',

    data() {
        return { snackbar: false, text: '' }
    },

    computed: {
        // Get state from Pinia store
        ...mapWritableState(useMainStore, ['snackbarQueue']),
    },

    watch: {
        // If the queue updated, check if a new message needs to be displayed
        snackbarQueue: {
            handler() {
                this.checkQueue()
            },

            immediate: true,
        },

        // Snackbar state changed, check if a new message needs to be displayed
        async snackbar() {
            this.$nextTick(() => {
                setTimeout(this.checkQueue, 150)
            })
        },
    },

    methods: {
        checkQueue() {
            // Ensure no snackbar is currently shown
            if (this.snackbar) return
            // Ensure there is a snackbar in the queue
            if (this.snackbarQueue.length === 0) return

            // Show snackbar and remove from queue
            this.snackbar = true
            this.text = this.snackbarQueue[0]
            this.snackbarQueue = this.snackbarQueue.splice(1)
        },
    },
}
</script>
