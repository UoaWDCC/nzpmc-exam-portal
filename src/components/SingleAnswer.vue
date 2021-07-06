<template>
    <v-card
        dark
        @click="selectanswer"
<<<<<<< HEAD
        :color="this.selectedID === this.optionID ? '#03a9f5' : '#385F73'"
    >
        <div class="d-flex">
            <latex class="font-weight-bold flex-grow-1 pa-4" :content="text" />
            <span
                v-if="this.selectedID === this.optionID"
                class="material-icons ma-4"
            >
=======
        :color="selectedID === optionID ? '#03a9f5' : '#385F73'"
        style="height: 100%"
    >
        <div class="d-flex" style="height: 100%; align-items: center">
            <latex
                class="font-weight-bold pa-4"
                :content="text"
                style="width: calc(100% - 3.5rem); display: block"
            />
            <span v-if="selectedID === optionID" class="material-icons ma-4">
>>>>>>> master
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
