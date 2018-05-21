/* eslint-disable */
<template>
  <div class="hero">
    <div>
      <h1 class="display-3">< TakeYourTime ></h1>
      <p class="lead">
        <a href="#" @click.prevent="login" > Kirjaudu sisään </a> aloittaaksesi
      </p>
      <button class="btn-default" v-on:click="testMe()">testi</button>
    </div>
  </div>
</template>

<style>
  .hero {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .hero .lead {
    font-weight: 200;
    font-size: 1.5rem;
  }
</style>

<script>
  export default {
    name: 'front-page',
    data () {
      return {
        activeUser: null,
        test: true
      }
    },
    async created () {
      await this.refreshActiveUser()
    },
    methods: {
      login () {
        this.$auth.loginRedirect()
      },
      async refreshActiveUser () {
        this.activeUser = await this.$auth.getUser()
        console.log(this.activeUser)
        console.log('acriveuser: \'' + this.activeUser === undefined)
        if (this.activeUser) this.$router.push('/kalenteri')
      },
      testMe () {
        console.log('halloo?')
      }
    }
  }
</script>
