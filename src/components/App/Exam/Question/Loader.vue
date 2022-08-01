<template>
    <div
        style="overflow-y: hidden"
        class="app-exam-question-loader flex-grow-1"
    >
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="6" class="mb-n3">
                    <div class="align-center d-flex mb-3">
                        <div class="flex-grow-1">
                            <v-skeleton-loader
                                type="text"
                                width="160"
                                style="margin-top: 6px"
                            />
                        </div>

                        <v-skeleton-loader
                            type="button"
                            width="36"
                            style="border-radius: 50%"
                        />
                    </div>

                    <v-skeleton-loader
                        type="paragraph"
                        style="margin-top: 18px; margin-bottom: -6px"
                    />
                </v-col>

                <v-col cols="12" md="6">
                    <v-skeleton-loader
                        type="text"
                        width="160"
                        class="align-center d-flex"
                        style="margin-top: 12px; margin-bottom: 18px"
                    />

                    <v-skeleton-loader
                        v-for="i in 3"
                        :key="i"
                        type="list-item"
                        height="56"
                        class="mb-3 option-skeleton"
                    />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { TOOLBAR_HEIGHT } from '@/helpers'

export default {
    name: 'AppExamQuestionLoader',

    data() {
        return {
            TOOLBAR_HEIGHT,
        }
    },
}
</script>

<style>
.option-skeleton > * {
    height: 100%;
}
</style>
