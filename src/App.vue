<template>
    <v-app id="app">
        <v-progress-linear
            :active="$loading"
            :indeterminate="$loading"
            absolute
            top
            color="secondary darken-2"
            style="z-index: 2"
        ></v-progress-linear>
        <router-view />
    </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');

html {
    overflow: auto !important;
}

body {
    background-image: url('./assets/background-colour.png');
    background-attachment: fixed;
    background-position: center;
    background-repeat: repeat;
    background-size: auto;
}

#app {
    font-family: 'Nunito Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background: none;
}

.v-application--wrap {
    justify-content: center;
}
</style>
