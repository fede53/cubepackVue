<template>
        <div>
            <ul class="lista-controls">
                <li @click="changeTab('file')">Files</li>
                <li @click="changeTab('timeline')">Chat</li>
                <li @click="changeTab('console')">Console</li>
            </ul>

            <ProjectFile v-if="tab == 'file'"/>
            <ProjectTimeline v-if="tab == 'timeline'"/>
            <ProjectConsole v-if="tab == 'console'" />

        </div>
</template>

<script>

    import ProjectTimeline from '@/components/Projects/Timeline'
    import ProjectConsole from '@/components/Projects/Console'
    import ProjectFile from '@/components/Projects/File'

    export default {
        name: 'ProjectControl',
        data: () => {
            return {
                tab: 'file'
            }
        },
        components: {
            ProjectTimeline, ProjectConsole, ProjectFile
        },
        methods: {
            changeTab(tab){
                this.tab = tab
            }
        },
        watch: {
            '$route' (to, from) {
                this.tab = 'file'
            }
        },
        created () {
            this.tab = 'file'
        },


    }
</script>