<template>
    <v-list
        dense
        nav
        class="app-exam-sidebar-loader fill-height mb-n1"
        style="overflow-y: hidden"
    >
        <v-skeleton-loader
            v-for="i in 50"
            :key="i"
            height="40"
            type="list-item"
            class="mb-1 sidebar-link-skeleton"
        />
    </v-list>
</template>

<script>
export default {
    name: 'AppExamSidebarLoader',
}
</script>

<style>
.sidebar-link-skeleton > * {
    height: 100%;
}
</style>
