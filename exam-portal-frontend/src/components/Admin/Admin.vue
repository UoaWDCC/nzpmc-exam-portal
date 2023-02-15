<template>
    <v-container fluid class="d-flex flex-column" style="height: 100%">
        <v-row>
            <v-col class="col-12">
                <AdminTopbar />
            </v-col>
        </v-row>
        <router-view></router-view>
    </v-container>
</template>

<script>
import AdminTopbar from './AdminTopbar.vue'

export default {
    components: {
        AdminTopbar,
    },
}
</script>
