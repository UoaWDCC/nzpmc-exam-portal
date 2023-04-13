<template>
    <div>
        <h2 class="text-h5 mb-4">Images</h2>

        <div class="d-flex flex-wrap align-stretch" style="gap: 16px">
            <v-sheet rounded outlined style="max-width: 150px">
                <img
                    src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                    style="width: 150px; height: 150px; object-fit: cover"
                />

                <div class="pa-2">
                    <h3 class="text-h6 mb-2">Image 1</h3>

                    <p>dnwjsfeefneo</p>
                </div>
            </v-sheet>

            <v-dialog
                align="center"
                v-model="dialog"
                max-width="500"
                persistent
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        outlined
                        style="width: 150px; height: 150px"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon left class="material-icons"> add </v-icon>
                        Add
                    </v-btn>
                </template>

                <v-card>
                    <v-form :disabled="loading" @submit.prevent="upload">
                        <v-toolbar color="primary" dark>
                            <h3>Upload File</h3>
                        </v-toolbar>

                        <div class="pa-4">
                            <v-file-input
                                accept="image/*"
                                label="File input"
                                v-model="file"
                            ></v-file-input>
                        </div>

                        <v-alert
                            type="success"
                            v-if="showSuccess"
                            class="my-3"
                            @click="showSuccess = false"
                            style="cursor: pointer"
                        >
                            {{ success }}
                        </v-alert>

                        <v-alert
                            type="error"
                            v-if="showError"
                            class="my-3"
                            @click="showError = false"
                            style="cursor: pointer"
                        >
                            {{ error }}
                        </v-alert>

                        <v-card-actions class="justify-end">
                            <v-btn large text @click="dialog = false">
                                Cancel
                            </v-btn>

                            <v-btn
                                type="submit"
                                color="primary"
                                large
                                :loading="loading"
                                :disabled="file === null || loading"
                            >
                                <v-icon left class="material-icons">
                                    upload
                                </v-icon>
                                Upload
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            loading: false,
            file: null,

            success: null,
            showSuccess: false,
            error: null,
            showError: false,
        }
    },

    watch: {
        success(val) {
            this.showSuccess = !!val
        },

        error(val) {
            this.showError = !!val
        },
    },

    methods: {
        // Upload the file
        upload() {
            this.loading = true
        },
    },
}
</script>
