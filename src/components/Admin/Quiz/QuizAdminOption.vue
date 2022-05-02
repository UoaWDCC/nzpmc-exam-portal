<template>
    <v-sheet
        rounded
        :style="{ borderColor: selected ? '#03a9f5' : '#385F73' }"
        outlined
    >
        <div
            class="d-flex justify-space-between pa-2 font-weight-bold"
            style="height: 100%; align-items: center"
            :style="{ color: selected ? '#03a9f5' : '#385F73' }"
        >
            <DisplayText :text="text" v-if="text" :key="text" />

            <div v-else>...</div>

            <v-dialog
                align="center"
                v-model="dialog"
                max-width="500"
                persistent
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>edit</v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <v-toolbar color="primary" dark>
                        <h3>Option Editor</h3>
                    </v-toolbar>

                    <div class="pa-4 pb-2">
                        <QuizAdminEditor
                            label="Option text"
                            :value="option"
                            @input="updateOption"
                            :rules="[(value) => !!value || 'Required.']"
                            rows="1"
                        />

                        <h2 class="text-h5 mb-2 mt-6">Preview</h2>

                        <DisplayText
                            :text="option"
                            :key="option"
                            v-if="option"
                        />
                    </div>

                    <v-card-actions class="justify-end">
                        <v-btn large text @click="dialog = false">
                            Cancel
                        </v-btn>

                        <v-btn color="primary" large>
                            <v-icon
                                left
                                class="material-icons"
                                @click="$emit('update', option)"
                            >
                                save
                            </v-icon>
                            Submit
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-sheet>
</template>

<script>
import QuizAdminEditor from './QuizAdminEditor'
import DisplayText from '@/components/DisplayText'

export default {
    components: {
        QuizAdminEditor,
        DisplayText,
    },

    props: {
        text: String,
        selected: Boolean,
    },

    data() {
        return {
            dialog: false,

            option: '',
        }
    },

    mounted() {
        this.option = this.text
    },

    watch: {
        text(val) {
            this.option = val
        },
    },

    methods: {
        updateOption(val) {
            if (val !== undefined) this.option = val
        },
    },
}
</script>
