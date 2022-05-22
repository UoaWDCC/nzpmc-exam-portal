<template>
    <div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="createQuestion">
                    <v-icon class="material-icons">arrow_upward</v-icon>
                </v-btn>
            </template>

            <span>Move question upward</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="createQuestion">
                    <v-icon class="material-icons">arrow_downward</v-icon>
                </v-btn>
            </template>

            <span>Move question backward</span>
        </v-tooltip>
    </div>
</template>

<script>
export default {}
</script>
