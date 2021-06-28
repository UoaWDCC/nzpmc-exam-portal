<template>
    <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
                <span class="material-icons">account_circle</span>
            </v-btn>
        </template>

        <v-list>
            <v-list-item-group>
                <v-list-item @click="signOut()" style="min-width: 128px">
                    <v-list-item-title>Sign out</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>

<script>
import firebase from 'firebase'
export default {
    methods: {
        signOut() {
            firebase.auth().signOut()
        },
    },
}
</script>
