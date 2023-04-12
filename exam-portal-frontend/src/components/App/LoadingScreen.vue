<template>
    <div
        class="app-loading-screen d-flex fill-height flex-column justify-center pa-4 primary"
    >
        <v-img
            src="@/assets/logo-white.svg"
            height="96"
            max-width="calc(100vw - 2rem)"
            contain
            class="flex-grow-0 mb-4"
        />

        <div class="align-self-center text-center white--text">
            <v-progress-circular
                indeterminate
                color="white"
                class="mr-4"
            ></v-progress-circular>

            <span style="vertical-align: middle">{{ message }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppLoadingScreen',

    props: {
        message: {
            type: String,
            required: true,
        },
    },
}
</script>
