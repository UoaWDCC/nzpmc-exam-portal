<template>
    <v-row style="height: 100%">
        <v-col class="col-12 col-md-4 col-xl-3">
            <QuizAdminSidebar :key="$route.path" />
        </v-col>
        <v-col class="col">
            <router-view :key="$route.path"></router-view>
        </v-col>
    </v-row>
</template>

<script>
import QuizAdminSidebar from '../components/QuizAdminSidebar.vue'

export default {
    components: {
        QuizAdminSidebar,
    },
}
</script>
