<template>
    <div>
        <div class="cubepackModal">
            <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
                <v-card>
                    <div class="modal">
                        <Project v-if="opz=='projects'" />
                    </div>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Project from '@/components/Modal/Project'
    export default {
        name: 'Modal',
        components: {
            Project
        },
        computed: {
            ...mapGetters(
              {
                  opz: "opz",
                  dialog: "modal"
              }
            ),
        },
    }
</script>
