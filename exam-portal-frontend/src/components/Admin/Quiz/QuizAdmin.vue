<template>
    <v-row class="flex-nowrap" style="height: 100%">
        <v-col class="col-12 col-md-4 col-lg-3 col-xl-2">
            <QuizAdminSidebar :key="$route.path" />
        </v-col>
        <v-col class="col">
            <router-view :key="$route.path"></router-view>
        </v-col>
    </v-row>
</template>

<script>
import QuizAdminSidebar from './QuizAdminSidebar.vue'

export default {
    components: {
        QuizAdminSidebar,
    },
}
</script>
