<template>
    <div align="center">
        <v-container style="background-color: #ecf0f1; max-width: 400px">
            <v-container style="background-color: #c1c1c1; max-width: 400px">
                <h3><b>Are you sure you want to submit?</b></h3>
            </v-container>
            <p style="padding: 15px 0px">
                You will not be able to redo any questions after you submit.
            </p>
            <v-btn
                style="
                    margin-right: 10px;
                    color: white;
                    background-color: #09b683;
                "
                x-large
            >
                Yes
            </v-btn>
            <v-btn
                style="
                    margin-left: 10px;
                    color: white;
                    background-color: #ff7069;
                "
                x-large
            >
                No
            </v-btn>
        </v-container>
    </div>
</template>
