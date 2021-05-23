<template>
    <v-container>
        <v-card
            dark
            style="max-width: 350px"
            @click="selectanswer"
            :color="selectedID === optionID ? '#03a9f5' : '#385F73'"
        >
            <v-row>
                <v-col sm="8">
                    <h4 style="margin: 1rem">{{ ans }}</h4>
                </v-col>
                <v-col align="center" sm="4" v-if="selectedID === optionID">
                    <v-icon dense style="margin: 1rem" class="justify-center">
                        mdi-check-circle
                    </v-icon>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: {
        ans: String,
        selectedID: Number,
        optionID: Number,
    },
    methods: {
        selectanswer() {
            this.$emit('selectanswer', this.optionID)
        },
    },
}
</script>
