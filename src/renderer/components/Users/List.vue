<template>
    <div class="listCompoment">

        <Header title="Users" icon_sx="fal fa-project-diagram" v-bind:r="{ name: 'userForm', params: { action: 'create' }}" r_icon="mdi-plus" />

        <v-card
                class="pa-4"
                width="100%"
        >

        <v-data-table
                :headers="headers"
                :items="users"
                sort-by="name"
        >

            <template v-slot:item.action="{ item }">
                <router-link class="button" :to="{ name: 'userForm', params: { id: item.id, action: 'edit' } }">
                    <v-btn elevation="0" class="mx-2" fab dark small color="primary">
                        <i class="fal fa-edit" style="font-size: 16px"></i>
                    </v-btn>
                </router-link>
                <a class="button" @click.stop="nameSelected = item.name; idSelected = item.id; dialog = true">
                    <v-btn elevation="0" class="mx-2" fab dark small color="primary">
                        <i class="fal fa-trash-alt" style="font-size: 16px"></i>
                    </v-btn>
                </a>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline">Sei sicuro?</v-card-title>
                <v-card-text class="subtitle-1">
                    L'elemento verrà eliminato e non potrà essere ripristinato
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="idSelected = null; dialog = false">Annulla</v-btn>
                    <v-btn color="primary" @click="deleteUser(idSelected); dialog = false">Ok cancella</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        </v-card>
    </div>

</template>

<script>

    import { mapGetters } from 'vuex'
    import Header from '@/components/Blocks/Header'

    export default {
        data: () => ({
            dialog: false,
            headers: [
                { text: 'Name', align: 'left', value: 'name' },
                { text: 'Surname', value: 'surname' },
                { text: 'Role', value: 'role.role' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'action', sortable: false },
            ],
            desserts: [],
            editedIndex: -1
        }),
        components: {
            Header
        },
        computed: {
            ...mapGetters('usersModule', ['users'])
        },
        methods: {
            list () {
                this.$store.dispatch('usersModule/list', {urlToConnect: 'users'})
            },

            deleteUser(id){
                var parameters = {
                    urlToConnect: 'users/' + id,
                    methodToConnect: 'delete',
                    _method: "delete"
                }
                this.idSelected = null;
                this.nameSelected = null;
                this.$store.dispatch('usersModule/delete', parameters)
            }
        },
        watch: {
            '$route' (to, from) {
                this.list()
            }
        },
        created () {
            this.list()
            this.$store.dispatch('usersModule/reset')
        }
    }
</script>