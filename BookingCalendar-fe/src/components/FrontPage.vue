/* eslint-disable */
<template>
  <div class="hero">
    <div>
      <h1 class="display-3">< TakeYourTime ></h1>
      <p class="lead">
        <a href="#" @click.prevent="login" > Kirjaudu sisään </a> aloittaaksesi
      </p>
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
    methods: {
      login () {
        this.$auth.loginRedirect()
      },
    }
  }
</script>
