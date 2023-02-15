<template>
    <v-list-item
        :to="{
            name: 'AppExamQuestion',
            params: { quizID: $route.params.quizID, questionID: id },
        }"
        link
        class="app-exam-sidebar-link"
        :class="{ answered: answered }"
    >
        <v-list-item-icon>
            <div class="number-icon">{{ number }}</div>
        </v-list-item-icon>

        <v-list-item-content>
            <v-list-item-title>Question {{ number }}</v-list-item-title>
        </v-list-item-content>

        <v-icon v-if="flagged" class="corner-icon" color="red">
            mdi-flag
        </v-icon>
    </v-list-item>
</template>

<script>
export default {
    name: 'AppExamSidebarLink',

    props: {
        id: { type: String, required: true },
        number: { type: Number, required: true },
        answered: Boolean,
        flagged: Boolean,
    },
}
</script>

<style scoped>
.number-icon {
    display: flex;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-weight: bold;
    font-size: 24px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.54);
}

.v-list-item:not(.answered) .number-icon {
    color: transparent;
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.54);
}

.v-list .v-list-item--active .number-icon {
    -webkit-text-stroke: unset;
    color: inherit;
}

.v-navigation-drawer .v-list-item .corner-icon {
    overflow: visible;
    top: 0;
    right: 0;
    height: 16px;
    width: 16px;
    font-size: 16px;
    clip: revert;
    vertical-align: baseline;
}
</style>
