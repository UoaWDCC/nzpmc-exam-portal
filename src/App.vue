<template>
    <div id="app">
        <router-link to="/">Login</router-link> |
        <router-link to="/welcome">Welcome</router-link> |
        <router-link to="/exam">Exam</router-link> |
        <router-link to="/submission">Submissions</router-link>
        <router-view />
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');

body {
    /* The image used */
    background-image: url('/assets/background-colour.png');
    background-attachment: fixed;
    background-position: center;
    background-repeat: repeat;
    background-size: auto;
}

#app {
    font-family: 'Nunito Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
}
</style>
