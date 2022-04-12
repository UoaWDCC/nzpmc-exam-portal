<template>
    <v-row>
        <v-col class="col-12">
            <UsersDataTable />
        </v-col>
    </v-row>
</template>

<script>
import UsersDataTable from '../components/UsersDataTable.vue'

export default {
    components: {
        UsersDataTable,
    },
}
</script>
