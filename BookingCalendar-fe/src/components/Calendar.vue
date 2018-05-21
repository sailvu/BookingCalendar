/* eslint-disable */
<template>
  <div>
    <div class="m-4">
      <full-calendar :events="bookings" :config="config"></full-calendar>
      <div class="mt-4">
        <button class="btn-default" v-on:click="show()">Lisää varaus</button>
      </div>
    </div>
  </div>
</template>

<script>
  import BookingModal from "./BookingModal.vue";
  import {EventBus} from '../shared/event-bus.js';

  export default {
    components: {BookingModal, EventBus},
    name: 'calendar',
    created() {
    },
    data() {
      return {
        bookings: [
          // sample event
          {
            title: 'event2',
            start: '2018-05-16T15:00',
            end: '2018-05-16T16:00',
            repeat_freq: 1
          }
        ],
        config: {
          defaultView: 'agendaWeek',
          weekends: false,
          editable: false,
          locale: 'fi',
          scrollTime: '10:00:00',
          columnHeaderFormat: 'ddd D.M',
          selectable: false,
          eventRender: function (event, element) {
            console.log(event)
          }
        }
      }
    },
    methods: {
      show() {
        this.$modal.show(BookingModal, {bookings: this.bookings})
      },
      testMe() {
        console.log('haloo')
      },
      test(){
        console.log("test");
      },

    },
    watch: {

    },
    mounted(){
      EventBus.$on("changeText", function (changedText) {
        console.log("change text to: "+changedText);
        this.text = changedText;
      }.bind(this))
    }
  }


</script>

<style>
  @import '~fullcalendar/dist/fullcalendar.css';
</style>

