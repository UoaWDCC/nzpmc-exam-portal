<template>
    <div align="center">
        <v-container style="background-color: #ecf0f1; max-width: 400px">
            <div
                style="padding-bottom: 20px"
                v-for="option in optionsList"
                :key="option.id"
            >
                <SingleAnswer
                    :ans="option.text"
                    :optionID="option.id"
                    :selectedID="currentOptionID"
                    @selectanswer="selectOneAnswer"
                />
            </div>
            <v-btn
                style="max-width: 100%; color: white; background-color: #03a9f5"
                x-large
            >
                Next
            </v-btn>
        </v-container>
    </div>
</template>

<script>
import SingleAnswer from './SingleAnswer.vue'

export default {
    components: {
        SingleAnswer,
    },
    methods: {
        selectOneAnswer(number) {
            this.currentOptionID = number
        },
    },
    props: {
        optionsList: Array,
    },
    data() {
        return {
            currentOptionID: null,
        }
    },
}
</script>
