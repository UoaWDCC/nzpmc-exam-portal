<template>
    <latex :content="parsed" style="margin-bottom: -16px" />
</template>

<style>
/* Sizing will depend on screen size*/
img {
    width: 100%;
    height: 100%;
}
</style>

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
