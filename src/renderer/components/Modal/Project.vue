<template>

    <div>

        <h1>{{setTitle}}</h1>

        <form>

            <v-card
                    class="mb-4 mx-auto"
            >
                <v-card-title>Generic project info</v-card-title>
                <v-card-text>

                    <v-text-field
                            v-model="project.name"
                            label="Project Name"
                            :error="$v.project.name.$error ? true : false"
                            :error-messages="$v.project.name.$error ? 'Project Name is required' : ''"
                            @input="$v.project.name.$touch()"
                            @blur="$v.project.name.$touch()"
                    ></v-text-field>

                    <v-text-field
                            v-model="localFolder"
                            label="Local Folder"
                            :error="$v.localFolder.$error ? true : false"
                            :error-messages="$v.localFolder.$error ? 'Local Folder is required' : ''"
                            @input="$v.localFolder.$touch()"
                            @blur="$v.localFolder.$touch()"
                            @click="!selectedItd ? selectFolder('local_folder') : ''"
                            :readonly="selectedItd ? true : false"
                    ></v-text-field>

                    <v-select
                            v-model="project.type"
                            :items="projectType"
                            item-text="value"
                            item-value="id"
                            label="Project Type"
                    ></v-select>

                    <v-textarea
                            v-model="project.description"
                            filled
                            label="Project Description"
                            auto-grow
                    ></v-textarea>

                    <v-checkbox v-if="!selectedItd"
                            v-model="defaultStructure"
                            label="Create default structure"
                    ></v-checkbox>

                </v-card-text>

            </v-card>


            <v-card
                    class="mb-4 mx-auto"
            >
                <v-card-title>Watch file project</v-card-title>
                <v-card-text>

                    <div v-if="selectedItd">
                        <div class="container_lista_elementi_multipli">
                            <h3>Scss Files</h3>
                            <ul class="lista_elementi_multipli">
                                <li v-for="file in projectUserFileCompiled.scss" v-bind:key="file.name">
                                    {{ file.file }} <v-btn small color="error" @click="removeScssFile(file.name)">Remove</v-btn>
                                </li>
                            </ul>

                            <v-btn small color="success" @click="selectScssFiles()">Select File</v-btn>

                        </div>
                        <div>
                            <v-text-field
                                    v-model="cssFolder"
                                    label="CSS Folder"
                                    @click="selectFolder('css_folder')"
                            ></v-text-field>
                        </div>
                        <div class="container_lista_elementi_multipli">
                            <h3>JS Files</h3>
                            <ul class="lista_elementi_multipli">
                                <li v-for="file in projectUserFileCompiled.js" v-bind:key="file.name">
                                    {{ file.file }} <v-btn small color="error" @click="removeJSFile(file.name)">Remove</v-btn>
                                </li>
                            </ul>

                            <v-btn small color="success" @click="selectJSFiles()">Select File</v-btn>
                        </div>
                        <div>
                            <v-text-field
                                    v-model="jsFolder"
                                    label="JS Folder"
                                    @click="selectFolder('js_folder')"
                            ></v-text-field>
                        </div>
                    </div>

                </v-card-text>

            </v-card>



            <v-card
                    class="mb-4 mx-auto"
            >
                <v-card-title>Ftp project info</v-card-title>
                <v-card-text>

                    <v-text-field
                            v-model="project.ftp_folder"
                            label="ftp folder"
                    ></v-text-field>

                    <v-text-field
                            v-model="project.ftp_server"
                            label="ftp server"
                    ></v-text-field>

                    <v-text-field
                            v-model="project.ftp_username"
                            label="ftp username"
                    ></v-text-field>

                    <v-text-field
                            v-model="project.ftp_password"
                            label="ftp password"
                    ></v-text-field>

                </v-card-text>

            </v-card>


            <v-btn color="primary" @click="closeDialog()">Close</v-btn>
            <v-btn color="primary" @click="save()">{{setBtn}}</v-btn>

        </form>


    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {

    data: () => {
        return {
            title: 'Project',
            defaultStructure: false,
            projectType:[
                {
                    id: 'cube',
                    value : 'Cube'
                },
                {
                    id: 'wordpress',
                    value : 'Wordpress'
                }
            ],
        }
    },

    validations() {
        let returnValue  = {
            project: {
                name : { required },
            },
            localFolder : { required },

        }
        return returnValue
    },

    computed: {
        ...mapGetters(
            {
                project: 'projectsModule/project',
                projectUser: 'projectsModule/projectUser',
                projectUserFileCompiled: 'projectsModule/projectUserFileCompiled',
                id: 'projectsModule/id',
                dialog: "modal"
            },
        ),

        selectedItd:{
            get(){
                return this.$store.state.projectsModule.id
            }
        },

        setBtn: function() {
            if(this.$store.state.projectsModule.id == null){
                return "Save"
            } else {
                return "Update"
            }
        },

        setTitle : function() {
            var ret = "";

            if(this.isNewProject){
                ret = "Create " + this.title
            } else {
                ret = "Edit" + this.title
            }
            return ret
        },

        localFolder:{
            get(){
                return this.$store.state.projectsModule.projectUser.local_folder
            }
        },
        cssFolder:{
            get(){
                return this.$store.state.projectsModule.project.css_folder
            }
        },
        jsFolder:{
            get(){
                return this.$store.state.projectsModule.project.js_folder
            }
        },
    },

    methods: {

        save(){
            // TO DO
            if(this.defaultStructure){

            }
            var parameters = {
                urlToConnect: 'projects',
                methodToConnect: 'post',
                name: this.$store.state.projectsModule.project.name,
                type: this.$store.state.projectsModule.project.type,
                description: this.$store.state.projectsModule.project.description,
                local_folder: this.$store.state.projectsModule.projectUser.local_folder,
                css_folder: this.$store.state.projectsModule.project.css_folder,
                js_folder: this.$store.state.projectsModule.project.js_folder,
                ftp_folder: this.$store.state.projectsModule.project.ftp_folder,
                ftp_server: this.$store.state.projectsModule.project.ftp_server,
                ftp_username: this.$store.state.projectsModule.project.ftp_username,
                ftp_password: this.$store.state.projectsModule.project.ftp_password,
                projectUserFileCompiled: this.$store.state.projectsModule.projectUserFileCompiled
            }
            if(this.$store.state.projectsModule.id > 0){
                parameters.id = this.$store.state.projectsModule.id;
                parameters.urlToConnect = 'projects/' + this.$store.state.projectsModule.id;
                parameters._method = "patch";
            }
            parameters.user_id = localStorage.getItem('user_id')

            this.$store.dispatch('projectsModule/save', parameters).then(() => {
                this.closeDialog()
            })
        },

        selectFolder(label) {
            this.$store.dispatch('projectsModule/selectFolder', {local_folder: this.$store.state.projectsModule.projectUser.local_folder, label: label})
        },

        closeDialog(){
            this.$store.dispatch('closeModal')
        },

        selectScssFiles() {
            this.$store.dispatch('projectsModule/selectScss', {local_folder: this.$store.state.projectsModule.projectUser.local_folder})
        },

        removeScssFile(file) {
            this.$store.commit('projectsModule/removeScssFile', {file: file});
        },

        selectJSFiles() {
            this.$store.dispatch('projectsModule/selectJS', {local_folder: this.$store.state.projectsModule.projectUser.local_folder})
        },

        removeJSFile(file) {
            this.$store.commit('projectsModule/removeJSFile', {file: file});
        }

    },

}
</script>

<style>

</style>
