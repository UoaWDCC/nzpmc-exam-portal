<style scoped lang="scss">
.app-admin {
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 31px 0;
  margin: 0;
}
</style>

<template>
  <v-container class="app-admin" fluid>
    <v-container v-if="store.userIsAdmin" fluid class="pa-0">
      <v-container fluid class="pa-0">
        <v-tabs v-model="currentTab" grow>
          <v-tab v-for="(tab, index) in tabs" :key="index" :value="tab.value">
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </v-container>

      <v-container> <component :is="currentTabComponent" /> </v-container>
    </v-container>
    <v-container v-else>Not Admin</v-container>
  </v-container>
</template>

<script lang="ts">
import { useMainStore } from '@/stores/main'
import UserManagement from './UserManagement.vue'
import QuizManagement from './QuizManagement.vue'

export default {
  name: 'AppAdmin',

  components: {
    UserManagement,
    QuizManagement
  },

  data() {
    return {
      store: useMainStore(),
      currentTab: 'Quiz Management', // Default to Quiz Management tab
      tabs: [
        { value: 'QuizManagement', label: 'Exam Management', component: QuizManagement },
        { value: 'UserManagement', label: 'User Management', component: UserManagement }
      ]
    }
  },

  computed: {
    currentTabComponent() {
      const selectedTab = this.tabs.find((tab) => tab.value === this.currentTab)
      return selectedTab ? selectedTab.component : null
    }
  },

  metaInfo: {
    title: 'Admin'
  }
}
</script>
