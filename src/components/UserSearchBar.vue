<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>Start typing to search...</v-toolbar-title>
            <v-autocomplete
                v-model="searchedUser"
                :loading="loading"
                :items="users"
                :search-input.sync="search"
                cache-items
                class="mx-4"
                flat
                hide-no-data
                hide-details
                label="User"
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
            searchedUser: null,
        }
    },
    components: {
        CreateUser,
    },
}
</script>
