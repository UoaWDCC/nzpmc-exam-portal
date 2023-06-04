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
			<UserManagement />
		</v-container>
		<v-container v-else>Not Admin</v-container>
	</v-container>
</template>

<script lang="ts">
import {useMainStore} from '@/stores/main';
import UserManagement from './UserManagement.vue'

export default {
    name: 'AppAdmin',

	components: {
		UserManagement,
	},

	data() {
		return {
			store: useMainStore()
		}
	},

    metaInfo: {
        title: 'Admin',
    },
}
</script>
    
