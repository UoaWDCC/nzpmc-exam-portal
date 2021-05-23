<template>
    <div class="exam">
        <AnswerList :optionsList="answers" />
    </div>
</template>

<script>
import AnswerList from './../components/AnswerList.vue'

export default {
    setup() {},
    components: {
        AnswerList,
    },
    data() {
        return {
            answers: [
                { text: 'First Answer', id: 1 },
                { text: 'Second Answer', id: 2 },
                { text: 'Third Answer', id: 3 },
                { text: 'Fourth Answer', id: 4 },
            ],
        }
    },
}
</script>
