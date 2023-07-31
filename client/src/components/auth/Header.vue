<template>
    <div class="align-center auth-header d-flex header">
        <v-btn v-if="showBack" icon flat @click="$emit('back')">
            <v-icon color="secondary" size="40">mdi-chevron-left</v-icon>
        </v-btn>

        <div class="header__text">
            <div class="header__text__title">{{ title }}</div>
            <div class="header__text__caption">{{ text }}</div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'AuthHeader',

    props: {
        title: { type: String, required: true },
        text: { type: String, required: true },
        showBack: Boolean,
    },
}
</script>

<style scoped lang="scss">
@import '@/styles/globals.scss';

.header {
    margin-top: 10px;
    margin-bottom: 20px;

    &__text {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        color: $primary;

        &__title {
            font-weight: bold;
            font-size: 22px;
        }

        &__caption {
            font-size: 12px;
        }
    }
}

</style>