<template>
    <v-container class="d-flex flex-column" style="height: 100%">
        <v-row>
            <v-col class="col-12">
                <AdminTopbar />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AdminTopbar from '../components/AdminTopbar.vue'

export default {
    components: {
        AdminTopbar,
    },
}
</script>
