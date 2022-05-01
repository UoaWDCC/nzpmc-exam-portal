<template>
    <div>
        <latex :content="parsed" />
    </div>
</template>

<script>
import showdown from 'showdown'

export default {
    props: ['question'],

    data() {
        return {
            converter: new showdown.Converter(),
        }
    },

    computed: {
        parsed() {
            return this.converter.makeHtml(this.question)
        },
    },
}
</script>
