<template>
    <div>
        <v-card>
            <v-row>
                <v-col class="col-10 mb-6 mr-6 ml-4">
                    <v-text-field
                        v-model="search"
                        label="Search"
                    ></v-text-field>
                </v-col>
                <v-col class="mt-2">
                    <UserDetailModal />
                </v-col>
            </v-row>
            <v-data-table
                :headers="headers"
                :items="users"
                item-key="name"
                :options.sync="options"
                :server-items-length="totalUsers"
                :loading="loading"
                class="elevation-1"
                :footer-props="{
                    'items-per-page-options': [50],
                }"
            >
                <template v-slot:item.actions="{ item }">
                    <v-row class="mx-0">
                        <UserDetailModal :user="item" />
                        <DeleteUser :user="item" />
                    </v-row>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import UserDetailModal from '../components/UserDetailModal.vue'
import DeleteUser from '../components/DeleteUser.vue'
export default {
    components: { UserDetailModal, DeleteUser },
    data() {
        return {
            search: '',
            totalUsers: 0,
            users: [],
            options: {},
            headers: [
                {
                    text: 'Display Name',
                    align: 'start',
                    value: 'displayName',
                },
                { text: 'First Name', value: 'firstName' },
                { text: 'Last Name', value: 'lastName' },
                { text: 'Email', value: 'email' },
                { text: 'Year Level', value: 'yearLevel' },
                { text: 'Photo URL', value: 'photoUrl' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
        }
    },
    watch: {
        options: {
            handler() {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods: {
        getDataFromApi() {
            this.loading = true
            this.fakeApiCall().then((data) => {
                this.users = data.items
                this.totalUsers = data.total
                this.loading = false
            })
        },
        fakeApiCall() {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options

                let items = this.getUsers()
                const total = items.length

                if (sortBy.length === 1 && sortDesc.length === 1) {
                    items = items.sort((a, b) => {
                        const sortA = a[sortBy[0]]
                        const sortB = b[sortBy[0]]

                        if (sortDesc[0]) {
                            if (sortA < sortB) return 1
                            if (sortA > sortB) return -1
                            return 0
                        } else {
                            if (sortA < sortB) return -1
                            if (sortA > sortB) return 1
                            return 0
                        }
                    })
                }

                if (itemsPerPage > 0) {
                    items = items.slice(
                        (page - 1) * itemsPerPage,
                        page * itemsPerPage,
                    )
                }

                setTimeout(() => {
                    resolve({
                        items,
                        total,
                    })
                }, 1000)
            })
        },
        getUsers() {
            return [
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
                {
                    displayName: 'FrozenYogurt',
                    firstName: 'Bob',
                    lastName: 'Yogurt',
                    email: 'yogurt@mail.com',
                    yearLevel: 5,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Cooluser123',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@mail.com',
                    yearLevel: 1,
                    photoUrl: 'url',
                },
                {
                    displayName: 'randomuser456',
                    firstName: 'Random',
                    lastName: 'User',
                    email: 'random@mail.com',
                    yearLevel: 3,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TestPerson',
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'testperson@mail.com',
                    yearLevel: 10,
                    photoUrl: 'url',
                },
                {
                    displayName: 'qwertyuser',
                    firstName: 'User',
                    lastName: 'Qwerty',
                    email: 'qwerty@mail.com',
                    yearLevel: 20,
                    photoUrl: 'url',
                },
                {
                    displayName: 'TheOther',
                    firstName: 'Person',
                    lastName: 'Other',
                    email: 'other@mail.com',
                    yearLevel: 2,
                    photoUrl: 'url',
                },
                {
                    displayName: 'Freezed',
                    firstName: 'Freeze',
                    lastName: 'Froze',
                    email: 'yogurt@mail.com',
                    yearLevel: 6,
                    photoUrl: 'url',
                },
                {
                    displayName: 'NormalYogurt',
                    firstName: 'Yogurt',
                    lastName: 'Normal',
                    email: 'normal@mail.com',
                    yearLevel: 7,
                    photoUrl: 'url',
                },
            ]
        },
    },
}
</script>
