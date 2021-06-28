<template>
    <v-card
        dark
        @click="selectanswer"
        :color="selectedID === optionID ? '#03a9f5' : '#385F73'"
    >
        <div class="d-flex">
            <div class="font-weight-bold flex-grow-1 pa-4">{{ text }}</div>
            <span class="material-icons ma-4"> check_circle </span>
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        text: String,
        selectedID: Number,
        optionID: Number,
    },
    methods: {
        selectanswer() {
            this.$emit('selectanswer', this.optionID)
        },
    },
}
</script>
