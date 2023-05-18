<template>
    <div class="app-admin">
		<div v-if="store.userIsAdmin">
			Admin
		</div>
		<div v-else>Not Admin</div>
	</div>
</template>

<script>
import {useMainStore} from '@/stores/main';

export default {
    name: 'AppAdmin',

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
