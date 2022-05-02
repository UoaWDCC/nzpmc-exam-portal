<template>
    <latex :content="parsed" style="margin-bottom: -16px" />
</template>

<script>
import showdown from 'showdown'

export default {
    props: ['text'],

    data() {
        return {
            converter: new showdown.Converter(),
        }
    },

    computed: {
        parsed() {
            return this.converter.makeHtml(this.text)
        },
    },
}
</script>
