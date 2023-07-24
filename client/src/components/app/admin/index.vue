<style scoped lang="scss">
.app-admin{
	padding-top: 64px;
	display:flex;
	flex-direction:column;
	max-width: 1400px;
	align-items: center;
}
</style>

<template>
	<v-container class="app-admin">
	  <v-container v-if="store.userIsAdmin">
		<h1>Admin</h1>
		<v-container>
		  <v-tabs v-model="currentTab">
			<v-tab v-for="(tab, index) in tabs" :key="index" :value="tab.value">
			  {{ tab.label }}
			</v-tab>
		  </v-tabs>
		</v-container>
  
		<v-container>
		  <component :is="currentTabComponent" />
		</v-container>
	  </v-container>
	  <v-container v-else>Not Admin</v-container>
	</v-container>
  </template>
  
  <script lang="ts">
  import { useMainStore } from '@/stores/main';
  import UserManagement from './UserManagement.vue';
  import QuizManagement from './QuizManagement.vue';
  
  export default {
	name: 'AppAdmin',
  
	components: {
	  UserManagement,
	  QuizManagement,
	},
  
	data() {
	  return {
		store: useMainStore(),
		currentTab: 'UserManagement', // Default to User Management tab
		tabs: [
		  { value: 'UserManagement', label: 'User Management', component: UserManagement },
		  { value: 'QuizManagement', label: 'Quiz Management', component: QuizManagement },
		],
	  };
	},
  
	computed: {
	  currentTabComponent() {
		const selectedTab = this.tabs.find((tab) => tab.value === this.currentTab);
		return selectedTab ? selectedTab.component : null;
	  },
	},
  
	metaInfo: {
	  title: 'Admin',
	},
  };
  </script>
  