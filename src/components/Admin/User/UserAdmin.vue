<template>
    <v-row style="height: 100%">
        <v-col class="col-12">
            <v-card>
                <v-row>
                    <v-col class="col-10 mb-6 mr-6 ml-4">
                        <v-text-field
                            v-model="search"
                            label="Search"
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-2">
                        <UserAdminDetails />
                    </v-col>
                </v-row>
                <v-data-table
                    :headers="headers"
                    :items="userPaginationInfo.users"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    hide-default-footer
                    style="border-bottom: 1px solid #d3d3d3"
                >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-row class="mx-0">
                            <UserAdminDetails :user="item" />
                        </v-row>
                    </template>
                    <template v-slot:[`item.photoURL`]="{ item }">
                        <v-avatar size="36">
                            <img :src="item.photoURL" :alt="item.firstName" />
                        </v-avatar>
                    </template>
                </v-data-table>
                <div class="text-center pt-2">
                    <v-pagination
                        v-model="page"
                        :length="userPaginationInfo.pages"
                        circle
                        :total-visible="7"
                    ></v-pagination>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import UserAdminDetails from './UserAdminDetails.vue'
import { UsersQuery } from '@/gql/queries/user'
export default {
    components: { UserAdminDetails },
    data() {
        return {
            sortBy: 'firstName',
            sortDesc: false,
            search: '',
            page: 1,
            itemsPerPage: 5, // change to 50 once there are more users
            userPaginationInfo: null,
            orderBy: {
                firstName: 'ASC',
            },
            orderByDefaultTemplate: {
                firstName: 'ASC',
            },
            headers: [
                { text: 'Photo', value: 'photoURL', sortable: false },
                {
                    text: 'Display Name',
                    value: 'displayName',
                },
                { text: 'First Name', value: 'firstName' },
                { text: 'Last Name', value: 'lastName' },
                { text: 'Email', value: 'email' },
                { text: 'Year Level', value: 'yearLevel' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
        }
    },
    watch: {
        sortDesc(currentDesc) {
            let finalObject = {}
            if (currentDesc === undefined) {
                if (this.sortBy in this.orderBy) {
                    finalObject = {
                        firstName: 'ASC',
                    }
                }
            } else if (currentDesc === true) {
                finalObject[this.sortBy] = 'DESC'
            } else if (currentDesc === false) {
                finalObject[this.sortBy] = 'ASC'
            } else {
                if (currentDesc[0] === true) {
                    finalObject[this.sortBy] = 'DESC'
                } else if (currentDesc[0] === false) {
                    finalObject[this.sortBy] = 'ASC'
                } else if (currentDesc[0] === undefined) {
                    finalObject = {
                        firstName: 'ASC',
                    }
                }
            }
            if (Object.keys(finalObject).length === 0) {
                finalObject = {
                    firstName: 'ASC',
                }
            }
            this.orderBy = finalObject
            this.page = 1
        },
        sortBy(currentSortBy, previousSortBy) {
            let finalObject = {}
            if (currentSortBy === undefined) {
                finalObject = {
                    firstName: 'ASC',
                }
            } else if (currentSortBy[0] === undefined) {
                finalObject = {
                    firstName: 'ASC',
                }
            } else if (
                previousSortBy !== undefined &&
                currentSortBy !== previousSortBy
            ) {
                finalObject[currentSortBy] = 'ASC'
            } else if (
                previousSortBy[0] !== undefined &&
                currentSortBy[0] !== previousSortBy[0]
            ) {
                finalObject[currentSortBy[0]] = 'ASC'
            }
            if (Object.keys(finalObject).length === 0) {
                finalObject = {
                    firstName: 'ASC',
                }
            }
            this.orderBy = finalObject
            this.page = 1
        },
        search() {
            this.page = 1
        },
    },

    apollo: {
        userPaginationInfo: {
            query: UsersQuery,
            variables() {
                return {
                    page: this.page,
                    limit: this.itemsPerPage,
                    orderBy: this.orderBy,
                    term: this.search,
                }
            },
            update: (data) => {
                return { users: data.users.users, pages: data.users.pages }
            },
        },
    },
}
</script>
