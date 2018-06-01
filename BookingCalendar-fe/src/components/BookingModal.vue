<template>
  <div class="container mt-4" >
    <div class="d-flex">
      <h3 class="w-100 mb-4" style="text-align:center">{{repeatable ? 'Varaa toistuva aika' : 'Varaa yksittäinen aika'}}</h3>
    </div>
    <div class="d-flex">
      <div class="w-50">
        <table>
          <tbody>
          <tr>
            <td>
              <b>Valitse luokka</b>
            </td>
          <tr>
            <td>
              <select v-model="selectedClassroom">
                <option v-for="(room, roomIndex) in classroomOptions"
                        v-bind:value="room"

                        :disabled="room.disabled">
                  {{room.name}}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="pt-4">
              <b>{{repeatable ? 'Valitse viikonpäivä' : 'Valitse päivämäärä'}}</b>
            </td>
          </tr>
          <tr v-if="repeatable">
            <td>
              <select v-model="selectedWeekday">
                <option v-for="day in weekdayOptions"
                        v-bind:value="day"
                        :disabled="day.disabled">
                  {{day.name || day}}
                </option>
              </select>
            </td>
          </tr>
          <tr v-else>
            <td class="pb-4">
              <datepicker :inline="true" :monday-first="true" v-model="pickedDate"></datepicker>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="w-50">
        <div v-if="origRoomIndex !== undefined && (origDayIndex !== undefined || pickedDate !== undefined)" rowspan="2">
          <timepick-cell
            :repeat-booking="repeatable"
            :time-array="repeatable ? bookingData.availableTimes : timesForSelectedDate"
            :day-no="origDayIndex"
            :room-no="origRoomIndex"
            :date="pickedDate"></timepick-cell>
        </div >
        <div v-else>
          <p>Valitse luokka ja päivä</p>
          <p class="date-error" v-if="selectedDateError">Et voi valita jo mennyttä päivää!</p>
          <p class="date-error" v-if="selectedWeekendError">Et voi valita viikonloppua!</p>
        </div>
      </div>
    </div>
    <button class="btn btn-default mt-4"@click="$emit('close')">Sulje</button>

  </div>
</template>

<script>
  import {EventBus} from '../shared/event-bus.js';
  import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
  import TimepickCell from "./TimepickCell";

  var cloneDeep = require('clone-deep');

  export default {
    name: "booking-modal",
    props: ['bookingData', 'repeatableBooking'],
    components: {
      TimepickCell,
      Datepicker
    },
    created(){
      this.classroomOptions = [this.defaultOption].concat(cloneDeep(this.bookingData.classrooms));
      this.selectedClassroom = this.classroomOptions[0];
      this.weekdayOptions = [this.defaultOption].concat(cloneDeep(this.bookingData.weekdays));
      this.selectedWeekday = this.weekdayOptions[0];

      //for timepickcell
      this.origRoomIndex = undefined;
      this.origDayIndex = undefined;

      this.repeatable = this.repeatableBooking;
      this.selectedDateError = false;
      this.selectedWeekendError = false;

    },
    data (){
      return {
        defaultOption : {name: "valitse", disabled:true},
        classroomOptions : null,
        selectedClassroom : null,
        weekdayOptions : null,
        selectedWeekday : null,
        repeatable : false,
        pickedDate : undefined,
      }
    },
    methods: {
      refreshTimesForSelectedDate(){
        this.timesForSelectedDate = this.getAvailableTimesForDates(this.pickedDate, 1, this.origRoomIndex);

      },
      /*Dynamic range of days, for possible future use */
      getAvailableTimesForDates(firstDate, numberOfDates, roomIndex ){
        let selectedRoom = this.bookingData.classrooms[roomIndex];
        let dateStart = cloneDeep(firstDate); //.setHours(0,0,0,0);
        dateStart.setHours(0,0,0,0);
        let dateEnd = cloneDeep(dateStart);
        dateEnd.setDate(dateEnd.getDate() +numberOfDates);
        let foundBookings = [];

        for(let i in this.bookingData.bookings){
          let booking = this.bookingData.bookings[i];
          if(booking.start >= dateStart && booking.start <dateEnd && selectedRoom.id === booking.classroomNo){
            foundBookings.push(booking);
          }
          if(booking.start > dateEnd){
            break;
          }
        }
        let availableTimes = cloneDeep(this.bookingData.timeSlots);
        return this.disableBookedTimes(foundBookings, availableTimes);
      },
      disableBookedTimes(bookings, availableTimes){

        availableTimes.forEach(function(timeSlot){

          bookings.forEach(function (booking) {
            let bookingStart = new Date(booking.start);
            let bookingStartTime = bookingStart.getHours() + bookingStart.getMinutes()/60;
            let bookingEnd = new Date(booking.end);
            let bookingEndTime = bookingEnd.getHours() + bookingEnd.getMinutes()/60;
            if (bookingStartTime <= timeSlot.time && timeSlot.time < bookingEndTime) {
              timeSlot.disabled = true;
            }
          });
        });
        return availableTimes;
      },
      closeModal(){
        EventBus.$emit('close-booking-modal');
      }
    },

    watch: {
      selectedClassroom: function (room) {
        if (this.selectedClassroom.name !== this.defaultOption.name) {
          this.origRoomIndex = this.bookingData.classrooms.map(function(r) { return r.id; }).indexOf(room.id);
          if(!this.repeatable && this.pickedDate !== undefined){
            this.refreshTimesForSelectedDate();
          }
        }
      },
      selectedWeekday: function (day) {
        if (this.selectedWeekday.name !== this.defaultOption.name) {
          this.origDayIndex = this.bookingData.weekdays.indexOf(day);
        }
      },
      pickedDate: function () {

        if(this.pickedDate !== undefined) {
          this.pickedDate.setHours(0, 0, 0, 0);
          let today = new Date();
          today.setHours(0, 0, 0, 0);

          if (this.pickedDate > today) {
            if (!(this.pickedDate.getDay() === 6 || this.pickedDate.getDay() === 0)) {
              this.selectedDateError = false;
              this.selectedWeekendError = false;

              if (this.origRoomIndex !== undefined) {
                this.refreshTimesForSelectedDate();
              }
            } else {
              this.selectedWeekendError = true;
              this.selectedDateError = false;
              this.pickedDate = undefined;
            }

          } else {
            this.selectedDateError = true
            this.selectedWeekendError = false;
            this.pickedDate = undefined;
          }
        }
      }
    },
    mounted(){
      EventBus.$on("closeBookingModal", function(){
        this.$emit('close');
      }.bind(this))
    }
  }
</script>

<style scoped>
  td, th{
    text-align:left;
    padding-right:0.5rem;
    margin: 0.5rem;
  }
  select{
    width: 100% !important;
  }
  .container{
    max-width: 90% !important;
  }

  .date-error{
    color:red;
  }
</style>
