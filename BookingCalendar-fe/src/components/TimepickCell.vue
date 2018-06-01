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
      console.log("timePickCell created");
      // console.log(this.timeArray);
      console.log(this.date);
      // if(this.timeOptions[0].title !== this.defaultOption.title ){

      // }

      console.log("repeatBooking: "+this.repeatBooking);
      console.log(this.timeArray);
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
        console.log("calculating end times");
        let newEndTimes = [];
        // newEndTimes.push
        for(let i in this.timeOptions){
          let time = this.timeOptions[i];
          console.log(time);
          if(time.time > this.selectedStart.time) {
            console.log(time.time + " - " + time.disabled);
            newEndTimes.push(time);
            if(time.disabled){
              console.log("first disabled time found, breaking loop");
              break;
            }
          }
        }
        console.log("endtimes:");
        console.log(newEndTimes);
        newEndTimes.unshift(this.defaultOption);
        this.endTimeOptions = newEndTimes;
        this.selectedEnd = this.endTimeOptions[0];
      },
      bookTime(){
        console.log("trying to book a time");
        // console.log("dayNo:");
        // console.log(this.dayNo);
        // console.log("start:");
        // console.log(this.selectedStart);
        // console.log("end");
        // console.log(this.selectedEnd);

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
        console.log("refreshTimeValues");
        this.timeOptions = this.repeatBooking ? cloneDeep(this.timeArray)[this.roomNo][this.dayNo] : this.timeArray;
        // this.calculateEndTimes();
        this.timeOptions.unshift(this.defaultOption);

        this.selectedStart =this.timeOptions[0];

        this.selectedEnd = this.endTimeOptions[0];

      }
    },
    watch:{
      selectedStart: function(newStart){
        console.log("selectedstart changed!");
          if(this.selectedStart.title !== this.defaultOption.title) this.calculateEndTimes();
      },
      selectedEnd: function(newStart){
        console.log("selectedEnd  changed!");
        if(this.selectedEnd.title !== this.defaultOption.title) {
          this.allowBooking = true;
        }else{this.allowBooking = false};
      },
      roomNo: function(){
        console.log("room no changed!");
        this.refreshTimeValues();
      },
      dayNo: function(){
        console.log("day no changed!");
        this.refreshTimeValues();
      }
      // timeOptions: function(newOptions){
      //   console.log("options changed!");
      //   this.timeOptions.unshift(this.defaultOption);
      //   this.selectedStart =this.timeOptions[0];
      //   this.selectedEnd = this.endTimeOptions[0];
      // }

    }
  }
</script>

<style >


</style>
