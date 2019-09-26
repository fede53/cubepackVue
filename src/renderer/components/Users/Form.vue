<template>

    <div class="listCompoment">

        <Header title="Users" icon_sx="fal fa-project-diagram" v-bind:r="{ name: 'userList'}" r_icon="mdi-view-list" />

        <v-card
                class="pa-4"
                width="100%"
        >

            <form>
                <v-text-field
                        v-model="user.name"
                        label="Name"
                        :error="$v.user.name.$error ? true : false"
                        :error-messages="$v.user.name.$error ? 'Name is required' : ''"
                        @input="$v.user.name.$touch()"
                        @blur="$v.user.name.$touch()"
                ></v-text-field>

                <v-text-field
                        v-model="user.surname"
                        label="Surname"
                        :error="$v.user.surname.$error ? true : false"
                        :error-messages="$v.user.surname.$error ? 'Surname is required' : ''"
                        @input="$v.user.surname.$touch()"
                        @blur="$v.user.surname.$touch()"
                ></v-text-field>

                <v-select
                        v-model="user.role_id"
                        :items="userRoles"
                        item-text="role"
                        item-value="id"
                        label="Role"
                ></v-select>

                <v-text-field
                        v-model="user.email"
                        label="Email"
                        :error="$v.user.email.$error ? true : false"
                        :error-messages="$v.user.email.$error ? 'Valid email is required' : ''"
                        @input="$v.user.email.$touch()"
                        @blur="$v.user.email.$touch()"
                ></v-text-field>

                <v-text-field
                        v-model="user.password"
                        label="Password"
                        :type="'password'"
                        :error="$v.user.password.$error ? true : false"
                        :error-messages="$v.user.password.$error ? 'Password 6/12 characters is required' : ''"
                        @input="$v.user.password.$touch()"
                        @blur="$v.user.password.$touch()"
                ></v-text-field>


                <v-btn color="primary" @click="save">{{btn}}</v-btn>
            </form>

        </v-card>


    </div>

</template>
<script>
    import { validationMixin } from 'vuelidate'
    import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
    import { mapGetters } from 'vuex'
    import Header from '@/components/Blocks/Header'

    export default {
        mixins: [validationMixin],
        validations() {
            let returnValue  = {
                user: {
                    name: {required},
                    surname: {required},
                    password: {  },
                    email: {required, email}
                }
            }
            if(this.$route.params.action == 'create') {
                returnValue.user.password['required'] = true
            }
            if( this.user.password != '' ) {
                returnValue.user.password['minLength'] = minLength(6)
                returnValue.user.password['maxLength'] = maxLength(12)
            }
            return returnValue
        },
        data: () => ({
            title: 'User',
        }),
        components: {
            Header
        },
        computed: {

            ...mapGetters(
                {
                    user: 'usersModule/user',
                    userRoles: 'usersModule/userRoles',
                }
            ),

            setTitle : function() {

                var ret = {};
                if(this.$route.params.action == 'create'){
                    ret.title = "Create"
                } else {
                    ret.title = "Edit"
                }
                return ret

            },

            btn: function(){
                if(this.$route.params.action == 'create'){
                    return "Save"
                } else {
                    return "Update"
                }
            },

            userProjects: {
                set(val){
                    this.$store.state.usersModule.userProjects = val
                },
                get(){
                    return this.$store.state.usersModule.userProjects
                }
            }
        },

        methods: {

            load () {
                this.$store.dispatch('usersModule/detail', {urlToConnect: 'users/'+this.$route.params.id+'/edit', id: this.$route.params.id})
            },

            create () {
                this.$store.dispatch('usersModule/create', {urlToConnect: 'users/create'})
                this.$store.state.usersModule.user.role_id = 1;
            },

            save(){

                this.$v.user.$touch();
                if(this.$v.user.$error) return

                var parameters = {
                    urlToConnect: 'users',
                    methodToConnect: 'post',
                    name: this.$store.state.usersModule.user.name,
                    surname: this.$store.state.usersModule.user.surname,
                    role_id: this.$store.state.usersModule.user.role_id,
                    userProjects: this.$store.state.usersModule.userProjects,
                    password: this.$store.state.usersModule.user.password,
                    email: this.$store.state.usersModule.user.email,
                }

                if(this.$route.params.action == 'edit'){
                    parameters.urlToConnect = 'users/' + this.$route.params.id;
                    parameters._method = "patch";
                }


                this.$store.dispatch('usersModule/save', parameters).then(() => {
                   //this.$router.replace("/users")
                })

            }
        },
        watch: {
            '$route' (to, from) {
                if(this.$route.params.action == 'edit') {
                    this.load()
                } else if(this.$route.params.action == 'create') {
                    this.create();
                }
            }
        },
        created () {
            if(this.$route.params.action == 'edit') {
                this.load()
            } else if(this.$route.params.action == 'create') {
                this.create()
            }
        }




    }
</script>