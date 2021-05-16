<template>
    <div class="welcome">
        <h1>This is a welcome page</h1>
        <v-container style="background-color: #ecf0f1; max-width: 1200px">
            <img
                class="logo"
                alt="NZPMC logo"
                src="../assets/nzpmclogo.jpg"
                width="400"
            />
            <h1>
                Welcome to New Zealand Physics and Mathematics Competition 2021!
            </h1>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Des5TrztWRU"
                title="YouTube video player"
                frameborder="10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
            <v-container class="d-flex justify-center mb-6" max-width="10%">
                <v-btn x-large color="#03a9f4" style="max-width: 100%"
                    >I'm ready!</v-btn
                >
            </v-container>
        </v-container>
    </div>
</template>
