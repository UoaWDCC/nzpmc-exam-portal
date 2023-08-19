<template>
    <v-dialog persistent v-model="examStore.submitting">
        <v-card width="50%">love</v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useExamStore } from './examStore'

export default defineComponent({
    name: 'AppSubmittingOverlay',

    data() {
        return {
            examStore: useExamStore()
        }
    }

})
</script>

<style scoped></style>
