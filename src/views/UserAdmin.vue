<template>
    <v-row>
        <v-col class="col-12">
            <UserSearchBar />
        </v-col>
    </v-row>
</template>

<script>
import UserSearchBar from './../components/UserSearchBar.vue'

export default {
    components: {
        UserSearchBar,
    },
}
</script>
