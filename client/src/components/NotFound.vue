<script setup lang="ts">
import logoBg from '@/assets/background_unsplash_1.png'
import nzpmcLogo from '@/assets/nzpmc_logo_2.png'
</script>

<template>
    <!-- <div class="not-found">
        <div class="message pa-4 red--text">
            <h1 class="mb-4 text-h4">Page Not Found</h1>

            <p>Sorry about that.</p>

            <v-btn color="white" outlined :to="{ name: 'AppExams' }">
                <v-icon left>mdi-home</v-icon>

                <span>Go Home</span>
            </v-btn>
        </div>

        <v-img width="100%" height="100vh" :src="logoBg"></v-img>
    </div> -->

    <div id="background">
        <img :src='nzpmcLogo' id="logo"/>

        <h1 class="text">404</h1>
        <text class="text">page not found</text>

        <v-btn id="home-button" :to="{ name: 'AppExams' }" rounded="lg">
            <span>Go Home</span>
        </v-btn>
    </div>
</template>

<script lang="ts">
export default {
    name: 'NotFound',

    metaInfo: {
        title: 'Not Found - NZPMC',
    },
}
</script>

<style scoped lang="scss">
@import '@/styles/globals.scss';

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
}


#background {
    background-image: url(@/assets/background_unsplash_1.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#logo {
    height: 8vw;
}

.text {
    color: $white;
}

h1 {
    font-size: 15vmax;
    font-weight: 700;
    line-height: 12vw;
    padding: 0;
    margin: 8vh 0 3vh 0;
}

text {
    font-size: 3.5vmax;
    letter-spacing: 0.5vw;
    padding: 0;
    margin: 0 0 0 1vw;
}

#home-button {
    width: max(23vw, 20vh);
    height: 7vh;
    background-color: $secondary;
    margin: 8vh 0 3vh 0;
}

#home-button span {
    color: $white;
    font-size: 1.5vmax;
    font-weight: 600;
}


</style>
