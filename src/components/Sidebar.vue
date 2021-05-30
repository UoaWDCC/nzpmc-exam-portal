<template>
    <v-navigation-drawer permanent expand-on-hover app>
        <v-list v-for="question in questions" :key="question.id" nav dense>
            <v-list-item class="px-2" link>
                <v-list-item-icon>
                    <v-icon>mdi-star</v-icon>
                    <v-list-item-title>{{ question.text }}</v-list-item-title>
                </v-list-item-icon>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    data() {
        return {
            questions: [
                { text: 'Question 1', id: '1' },
                { text: 'Question 2', id: '2' },
                { text: 'Question 3', id: '3' },
                { text: 'Question 4', id: '4' },
            ],
        }
    },
}
</script>
<style></style>
