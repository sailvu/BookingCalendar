<template>
  <div class="container m-4">
    <div>
      <p>Valitse aika: <input /></p>
      <p>Toistuvuus viikoittain: <input /></p>
    </div>
  </div>
</template>

<script>
  import {EventBus} from '../shared/event-bus.js';
  export default {
    name: "booking-modal",
    props: ['bookings'],
    created(){
      console.log(this.bookings);
    },
    data (){
      return {
      }
    },
    watch: {

    },
    methods: {
      changeText(){
        console.log("emitting 'changeText");
        console.log(this.changedText);
        EventBus.$emit("changeText", this.changedText);
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
