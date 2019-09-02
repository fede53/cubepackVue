<template>
    <div id="app">
        <section>
            <div class="col_sx">
                <ProjectsList />
            </div>
            <div class="dashboard">
                <router-view />
            </div>
            <div class="lista_utenti">
                <UserOnline />
            </div>
        </section>

        <Modal />
    </div>

</template>

<script>
  import ProjectsList from '@/components/Projects/List'
  import UserOnline from '@/components/Widget/UserOnline'
  import Modal from '@/components/Modal'
  export default {
    name: 'Dashboard',
    components: {
        Modal, ProjectsList, UserOnline
    }
  }

</script>
