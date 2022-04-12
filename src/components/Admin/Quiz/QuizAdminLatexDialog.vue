<template>
    <v-dialog
        v-model="showDialog"
        persistent
        max-width="500"
        overflow="visible"
        eager
    >
        <v-card>
            <v-toolbar color="primary" dark>
                <h3>LaTeX Editor</h3>
            </v-toolbar>
            <v-card-text class="body-1 pa-8 pb-6">
                <v-card elevation="2" class="pa-2">
                    <math-field virtual-keyboard-mode="manual" ref="latexEl">
                    </math-field>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn large text @click="cancel"> Cancel </v-btn>
                <v-btn color="primary" large @click="insertLatex">
                    Insert LaTeX
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style>
.v-dialog {
    overflow: visible;
}
math-field:focus,
math-field:focus-within {
    outline: none;
}
.ML__keyboard {
    z-index: 203;
}
</style>

<script>
export default {
    data() {
        return {
            latexDialog: false,
        }
    },
    props: ['showDialog', 'defaultValue'],
    methods: {
        insertLatex() {
            this.$emit('insertLatex', this.$refs.latexEl.value)
            this.$refs.latexEl.value = ''
        },
        cancel() {
            this.$emit('cancel')
        },
    },
    watch: {
        defaultValue(val) {
            this.$refs.latexEl.value = val
        },
    },
}
</script>
