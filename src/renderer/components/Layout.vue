<template>
    <div id="templateRoot">
        <Header />
        <ProjectsList />

        <div id="app">
            <section>
                <div class="dashboard">
                    <router-view/>
                </div>
            </section>

            <Modal />
        </div>

    </div>
</template>

<script>
    import ProjectsList from '@/components/Projects/List'
    import Header from '@/components/Header'
    import Modal from '@/components/Modal'

    export default {
        name: 'Layout',
        components: {
            Header, ProjectsList, Modal
        }
    }
</script>

