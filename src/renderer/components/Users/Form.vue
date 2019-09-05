<template>

    <div class="listCompoment">

        <div class="intro">
            <i class="fal fa-project-diagram"></i>
            <div class="inner">
                <h1 @click="pProject()">Projects list</h1>
            </div>
        </div>

        <div class="box">
            <div class="table__form">
                <div class="form_inline">
                    <label>Name</label>
                    <input type="text" v-model="user.name">
                </div>
                <div class="form_inline">
                    <label>Surname</label>
                    <input type="text" v-model="user.surname">
                </div>
                <div class="form_inline">
                    <label>Role</label>
                    <select v-model="user.role_id">
                        <option v-for="role in userRoles" v-bind:value="role.id">{{ role.role }}</option>
                    </select>
                </div>
                <div class="form_inline" v-if="user.role_id > 2">
                    <label>Projects</label>
                    <select v-model="userProjects" multiple>
                        <option v-for="project in projects" v-bind:value="project.id">{{ project.project }}</option>
                    </select>
                </div>
                <div class="form_inline">
                    <label>Email</label>
                    <input type="text" v-model="user.email">
                </div>
                <div class="form_inline">
                    <label>Password</label>
                    <input type="password" v-model="user.password">
                </div>
                <div>
                    <input type="button" :value="btn" v-on:click="saveUser()">
                </div>
            </div>

        </div>
    </div>

</template>
<script>

    import { mapGetters } from 'vuex'

    export default {
        data: () => ({
            title: 'User',
        }),
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
            loadUser () {
                this.$store.dispatch('usersModule/detail', {urlToConnect: 'users/'+this.$route.params.id+'/edit', id: this.$route.params.id})
            },

            createUser () {
                this.$store.dispatch('usersModule/create', {urlToConnect: 'users/create'})
                this.$store.state.usersModule.user.role_id = 1;
            },

            saveUser(){
                
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
                    this.loadUser()
                } else if(this.$route.params.action == 'create') {
                    this.createUser();
                }
            }
        },
        created () {
            if(this.$route.params.action == 'edit') {
                this.loadUser()
            } else if(this.$route.params.action == 'create') {
                this.createUser()
            }
        }




    }
</script>