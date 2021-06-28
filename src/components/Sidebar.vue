<template>
    <v-navigation-drawer
        v-model="drawer"
        class="questionDrawer"
        mobile-breakpoint="sm"
        absolute
    >
        <v-list-item>
            <v-list-item-content>
                <img
                    style="width: 100%; max-width: 300px"
                    class="d-block mx-auto"
                    alt="NZPMC Logo"
                    src="../assets/logo.png"
                />
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
            <v-list-item-group
                v-model="selectedQuestion"
                color="primary"
                mandatory
            >
                <v-list-item
                    v-for="question in questions"
                    :key="question.id"
                    link
                >
                    <v-list-item-content>
                        <v-list-item-title>{{
                            question.text
                        }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    data() {
        return {
            selectedQuestion: 2,
            drawer: null,
            questions: [
                { text: 'Question 1', id: '1' },
                { text: 'Question 2', id: '2' },
                { text: 'Question 3', id: '3' },
                { text: 'Question 4', id: '4' },
            ],
        }
    },
    watch: {
        sidebarOpen(val) {
            this.drawer = val
        },
        drawer(val) {
            if (val === true) {
                this.$emit('drawerOpen')
            } else {
                this.$emit('drawerClosed')
            }
        },
    },
    props: ['sidebarOpen'],
}
</script>
<style></style>
