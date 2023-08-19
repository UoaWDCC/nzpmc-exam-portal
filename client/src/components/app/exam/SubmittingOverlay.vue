<template>
    <v-dialog persistent v-model="examStore.submitting">
        <v-card class="overlay-card">
            <div class="logo-container mb-6">
                <v-img contain id="logo" :src="logo" />
            </div>
            <h2>We are submitting your exam.</h2>
            <p>Please wait...</p>
            <v-progress-circular class="mt-4" color="secondary" :size="50" indeterminate></v-progress-circular>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useExamStore } from './examStore'
import topbar_nzpmc_logo from '@/assets/topbar_nzpmc_logo.png'

export default defineComponent({
    name: 'AppSubmittingOverlay',

    data() {
        return {
            examStore: useExamStore(),
            logo: topbar_nzpmc_logo
        }
    }

})
</script>

<style scoped lang="scss">
.overlay-card {
    justify-content: center;
    align-items: center;
    color: $white;
    background-color: $primary;
    width: 40rem;
    height: 20rem;
    align-self: center;

    .logo-container {

        #logo {
            width: 30rem;
        }
    }
}
</style>

