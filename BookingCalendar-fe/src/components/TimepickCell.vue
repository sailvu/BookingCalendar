<template>
  <div>
    <table class="w-100">
      <thead>
      <tr>
        <th>Alku</th>
        <th>Loppu</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td >
          <select class="w-100" v-model="selectedStart">
            <option v-for="timeSlot in timeOptions"
                    v-bind:value="timeSlot"
                    :disabled="timeSlot.disabled"
                    v-bind:class="{'text-danger': timeSlot.disabled}"
                    v-on:click="test()"
            >{{timeSlot.title}}</option>
          </select>
        </td>
        <td>
          <select class="w-100" v-model="selectedEnd" :disabled="selectedStart.title === defaultOption.title">
            <!--<option disabled value="Alkamisaika">Alkamisaika</option>-->
            <option v-for="timeSlot in endTimeOptions"
                    v-bind:value="timeSlot"
            >{{timeSlot.title}}</option>
          </select>
        </td>
      </tr>
      </tbody>
    </table>
    <button class="btn w-100 mt-4" :class="allowBooking ? 'btn-primary' : 'disabled'" v-on:click="allowBooking ? bookTime() : ''">Varaa valittu aika</button>
  </div>
</template>

<script>

  import {EventBus} from '../shared/event-bus.js';
  let cloneDeep = require('clone-deep');


  export default {
    name: "timepick-cell",
    props: ['repeatBooking', 'timeArray', 'dayNo', 'roomNo','date'],
    created(){
      this.refreshTimeValues();
    },
    data(){
      return{
        defaultOption : {title: "valitse", disabled:true},
        endTimeOptions: [{title: "valitse", disabled:true}],
        selectedStart : null,
        selectedEnd : null,
        timeOptions : [],
        allowBooking: false,
      }
    },
    methods:{
      calculateEndTimes(){
        let newEndTimes = [];
        // newEndTimes.push
        for(let i in this.timeOptions){
          let time = this.timeOptions[i];
          if(time.time > this.selectedStart.time) {
            newEndTimes.push(time);
            if(time.disabled){
              break;
            }
          }
        }
        newEndTimes.unshift(this.defaultOption);
        this.endTimeOptions = newEndTimes;
        this.selectedEnd = this.endTimeOptions[0];
      },
      bookTime(){
          EventBus.$emit("makeBooking",
            this.repeatBooking,
            this.repeatBooking ? this.dayNo + 1 : this.date,
            this.selectedStart.time,
            this.selectedEnd.time,
            this.roomNo + 1
          );
        EventBus.$emit("closeBookingModal");

      },
      refreshTimeValues(){
        this.timeOptions = this.repeatBooking ? cloneDeep(this.timeArray)[this.roomNo][this.dayNo] : this.timeArray;
        this.timeOptions.unshift(this.defaultOption);
        this.selectedStart =this.timeOptions[0];
        this.selectedEnd = this.endTimeOptions[0];

      }
    },
    watch:{
      selectedStart: function(newStart){
          if(this.selectedStart.title !== this.defaultOption.title) this.calculateEndTimes();
      },
      selectedEnd: function(newStart){
        if(this.selectedEnd.title !== this.defaultOption.title) {
          this.allowBooking = true;
        }else{this.allowBooking = false};
      },
      roomNo: function(){
        this.refreshTimeValues();
      },
      dayNo: function(){
        this.refreshTimeValues();
      }
    }
  }
</script>

<style >


</style>
