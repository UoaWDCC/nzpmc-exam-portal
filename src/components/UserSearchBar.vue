<template>
    <v-container>
        <v-toolbar dark color="primary">
            <v-toolbar-title>Start typing to search...</v-toolbar-title>
            <v-autocomplete
                v-model="select"
                :loading="loading"
                :items="users"
                :search-input.sync="search"
                cache-items
                class="mx-4"
                flat
                hide-no-data
                hide-details
                label="User"
                solo-inverted
            ></v-autocomplete>
            <CreateUser />
        </v-toolbar>
    </v-container>
</template>

<script>
import CreateUser from '../components/CreateUser.vue'

export default {
    data() {
        return {
            users: ['Daniel', 'Will', 'CZ', 'Ruby', 'Matthew', 'Alex', 'Lance'],
        }
    },
    components: {
        CreateUser,
    },
}
</script>
