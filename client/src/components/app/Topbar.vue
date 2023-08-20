<script setup lang="ts">
import topbar_nzpmc_logo from '@/assets/topbar_nzpmc_logo.png'
</script>

<style scoped lang="scss">
.app-topbar {
  background-color: $primary;
  color: $white;
}

.logo-container {
  margin: 1rem;
}

.home-link {
  height: 100%;

  &__logo {
    max-height: 2rem;
    width: 200px;
    padding: 1rem;
  }
}

.account-menu {
  .v-list {
    border-radius: 0;
  }
}
</style>

<template>
  <v-app-bar class="app-topbar">
    <v-toolbar-title class="logo-container">
      <router-link :to="{ name: 'App' }" class="home-link">
        <v-img contain class="home-link__logo" :src="topbar_nzpmc_logo" aspect-ratio="1" />
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="mr-1">
      <v-btn v-if="store.userIsAdmin" :to="{ name: 'AppAdmin' }">Admin</v-btn>
      <v-btn :to="{ name: 'AppExams' }">My Exams</v-btn>
      <v-menu class="account-menu">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">
            <Icon icon="healthicons:ui-user-profile" style="font-size: 35px" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <h2>{{ nameCase(store.user!.displayName) }}</h2>
            <p>{{ store.user!.email }}</p>
          </v-list-item>
          <v-list-item>
            <v-btn flat color="secondary" @click="signOut(auth)">Log Out </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { mapWritableState } from 'pinia'
import { useMainStore } from '@/stores/main'
import { Icon } from '@iconify/vue'
import formattingMixin from '@/utils/formattingMixin'

export default {
  name: 'AppTopbar',
  mixins: [formattingMixin],

  computed: {
    // Get state from Pinia store
    ...mapWritableState(useMainStore, ['snackbarQueue'])
  },
  data() {
    return {
      store: useMainStore()
    }
  },

  methods: {
    signOut() {
      signOut(auth).catch(() => {
        // An error happened.
        this.snackbarQueue.push('An error occurred when signing out.')
      })
    }
  }
}
</script>
