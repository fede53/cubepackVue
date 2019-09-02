<template>

    <div>

        <h1>{{setTitle}}</h1>
        <div class="contenuti">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>

        <div class="form-element">
            <label>Project Name:</label><input type="text" v-model="project.name">
        </div>
        <div class="form-element">
            <label>Local Folder:</label><input type="text" id="projectFolder" @click="selectFolder()" v-model="local_folder">
        </div>
        <div class="form-element">
            <label>Project Type:</label>
            <select id="projectType" v-model="project.type">
                <option value="cube">Cube</option>
                <option value="wordpress">Wordpress</option>
            </select>
        </div>
        <div class="form-element">
            <label>Project Description:</label><textarea v-model="project.description"></textarea>
        </div>
        <div class="form-element">
            <label>Create default structure:</label><input type="checkbox" v-model="defaultStructure">
        </div>


        <div class="form-button">
            <input type="button" value="Close" @click="closeDialog()" class="btn-form"> &nbsp;
            <input type="button" :value="setBtn" @click="save();" class="btn-form">
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

    data: () => {
        return {
            setProjectFolder: '',
            title: 'Project',
            defaultStructure: false,
        }
    },

    computed: {
        ...mapGetters(
            {
                project: 'projectsModule/project',
                projectUser: 'projectsModule/projectUser',
                id: 'projectsModule/id',
                dialog: "modal"
            }
        ),

        setBtn: function() {
            if(this.$store.state.projectsModule.id == 0){
                return "Save"
            } else {
                return "Update"
            }
        },

        setTitle : function() {
            var ret = "";

            if(this.$store.state.projectsModule.id == 0){
                ret = "Create " + this.title
            } else {
                ret = "Edit" + this.title
            }
            return ret
        },
        local_folder: function() {
            return this.$store.state.projectsModule.projectUser.local_folder
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
                local_folder: this.$store.state.projectsModule.projectUser.local_folder
            }
            if(this.$store.state.projectsModule.id > 0){
                parameters.urlToConnect = 'projects/' + this.$store.state.projectsModule.id;
                parameters._method = "patch";
            }
            parameters.user_id = localStorage.getItem('user_id')

            this.$store.dispatch('projectsModule/save', parameters).then(() => {
                this.closeDialog()
                this.$store.dispatch('projectsModule/list', {urlToConnect: 'projects', user_id: localStorage.getItem('user_id')})
            })

        },

        selectFolder() {
            require('electron').remote.dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory']
            }, (files) => {
                if (files !== undefined && files.length > 0) {
                    this.$store.dispatch('projectsModule/setLocalFolder', files[0]);
                    /*this.$store.state.projectsModule.projectUser.local_folder = files[0]
                    this.setProjectFolder = files[0]*/
                }
            });
        },

        closeDialog(){
            this.$store.dispatch('closeModal')
        }




    },

}
</script>

<style>

</style>
