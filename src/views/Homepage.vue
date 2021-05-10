<template>
    <div class="Welcome Page">
        <img
            class="logo"
            alt="NZPMC logo"
            src="../assets/logo-cropped.png"
            width="400"
        />
        <h1>
            "Welcome to New Zealand Physics and Mathematics Competition 2021!"
        </h1>
        <p></p>
        <section>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Des5TrztWRU"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </section>
        <button class="button">I'm Ready</button>
        <v-btn>I'm Ready</v-btn>
        <h3>Add other external links here</h3>
        <ul>
            <li>
                <a
                    href="https://router.vuejs.org"
                    target="_blank"
                    rel="noopener"
                    >vue-router</a
                >
            </li>
            <li>
                <a href="https://vuex.vuejs.org" target="_blank" rel="noopener"
                    >vuex</a
                >
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/vue-devtools#vue-devtools"
                    target="_blank"
                    rel="noopener"
                    >vue-devtools</a
                >
            </li>
            <li>
                <a
                    href="https://vue-loader.vuejs.org"
                    target="_blank"
                    rel="noopener"
                    >vue-loader</a
                >
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/awesome-vue"
                    target="_blank"
                    rel="noopener"
                    >awesome-vue</a
                >
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        msg: String,
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
    margin-top: 20px;
    background-color: #189a87; /* Green */
    border: none;
    color: white;
    padding: 20px 80px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    font-weight: 550;
    transition-duration: 0.4s;
}
.button:hover {
    background-color: #6ae8cb;
    color: white;
}

button:active {
    background-color: #9bd49d;
    box-shadow: 0 5px rgb(43, 129, 101);
    transform: translateY(4px);
}

h1 {
    margin: 0px;
    font-weight: 1000;
    font-size: 30px;
    margin-bottom: 40px;

    font-style: italic;
}

h3 {
    margin: 40px 0 0;
    margin-bottom: 0;
}
ul {
    list-style-type: none;
    padding: 10;
}
li {
    display: inline-block;
    margin: 5px 5px;
    margin-bottom: 20px;
}
a {
    color: #d0e0d8;
}
</style>
