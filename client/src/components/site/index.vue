<script lang="ts" setup>
import logoBg from '@/assets/logo-background.jpg'
</script>

<template>
    <div class="site">
        <v-img width="100%" aspect-ratio="3" :src="logoBg" class="d-none d-sm-block"></v-img>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Site',

    metaInfo: {
        title: 'Welcome',
        titleTemplate: '%s - NZPMC',
    },
}
</script>
