<template>
    <v-card
        dark
        @click="selectanswer"
        :color="selectedID === optionID ? '#03a9f5' : '#385F73'"
    >
        <div class="d-flex">
            <latex class="font-weight-bold flex-grow-1 pa-4" :content="text" />
            <span v-if="selectedID === optionID" class="material-icons ma-4">
                check_circle
            </span>
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        text: String,
        selectedID: String,
        optionID: String,
    },
    methods: {
        selectanswer() {
            this.$emit('selectanswer', this.optionID)
        },
    },
}
</script>
