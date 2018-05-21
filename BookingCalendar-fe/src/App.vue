/* eslint-disable */
<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">TakeYourTime</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" class="justify-content-end">
        <b-navbar-nav>
          <b-nav-item v-if="activeUser" to="/kalenteri">Kalenteri</b-nav-item>
          <b-nav-item v-if="activeUser" to="/varaukseni">Varaukseni</b-nav-item>
          <b-nav-item href="#" @click.prevent="login" v-if="!activeUser">Kirjaudu sisään</b-nav-item>
          <b-nav-item href="#" @click.prevent="logout" v-else>Kirjaudu ulos</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- routes will be rendered here -->
    <router-view />
    <!-- component for dynamic modals -->
    <modals-container/>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        activeUser: null
      }
    },
    async created () {
      await this.refreshActiveUser()
    },
    watch: {
      // everytime a route is changed refresh the activeUser
      '$route': 'refreshActiveUser'
    },
    methods: {
      login () {
        this.$auth.loginRedirect()
      },
      async refreshActiveUser () {
        this.activeUser = await this.$auth.getUser()
        console.log(this.activeUser)
      },
      async logout () {
        await this.$auth.logout()
        await this.refreshActiveUser()
        this.$router.push('/')
      }
    }
  }
</script>
