<template>
        <div>
            <v-tabs
                    v-model="tab"
                    dark
                    grow
            >
                <v-tab
                        href="#tab-1"
                        class="tab1">
                    Files
                </v-tab>
                <v-tab
                        href="#tab-2">
                    Chat
                </v-tab>
                <v-tab
                        href="#tab-3">
                    Console
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item
                        value="tab-1"
                >
                    <ProjectFile />
                </v-tab-item>
                <v-tab-item
                        value="tab-2"
                >
                    <ProjectTimeline />
                </v-tab-item>
                <v-tab-item
                        value="tab-3"
                >
                    <ProjectConsole />
                </v-tab-item>

            </v-tabs-items>

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
                tab: 'tab-1',
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
                this.tab = 'tab-1'
            }
        },
        created () {
            this.tab = 'tab-1'
        },


    }
</script>