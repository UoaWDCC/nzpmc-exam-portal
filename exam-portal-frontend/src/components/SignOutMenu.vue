<template>
    <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
                <span class="material-icons">more_vert</span>
            </v-btn>
        </template>

        <v-list>
            <v-list-item-group>
                <v-list-item
                    v-if="isAdmin()"
                    to="/admin"
                    style="min-width: 128px"
                >
                    <v-list-item-title>Admin</v-list-item-title>
                </v-list-item>
                <v-list-item @click="signOut()" style="min-width: 128px">
                    <v-list-item-title>Sign out</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>

<script>
import { getAuth } from '@firebase/auth'
import { onLogout } from '../vue-apollo'
export default {
    methods: {
        signOut() {
            getAuth().signOut()
            onLogout(this.$apollo.provider.defaultClient)
        },
        async isAdmin() {
            // Check if auth token shows admin access
            const jwt = await getAuth().currentUser.getIdToken(true)
            const payload = jwt.split('.')[1]
            const isAdmin = JSON.parse(atob(payload)).admin

            return isAdmin
        },
    },
}
</script>
