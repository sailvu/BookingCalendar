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
      console.log("BookingModal opened:");
      console.log(this.bookingData);
      // this.initializeBookingTable();
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
      changeText() {
        console.log("emitting 'changeText");
        console.log(this.changedText);
        EventBus.$emit("changeText", this.changedText);
        this.$emit("close");
      },
      initializeBookingTable() {
        console.log("initializing booking table");
        this.weekdays = ["Ma", "Ti", "Ke", "To", "Pe"];
        this.classrooms = ["Luokka 1", "Luokka 2", "Luokka 3"];
      },
      bookTime() {
        console.log("trying to book a time");
      },
      refreshTimesForSelectedDate(){
        console.log("refreshTimesForSelectedDate");
        this.timesForSelectedDate = this.getAvailableTimesForDates(this.pickedDate, 1, this.origRoomIndex);
        console.log(this.timesForSelectedDate);

      },
      /*Dynamic range of days, for possible future use */
      getAvailableTimesForDates(firstDate, numberOfDates, roomIndex ){
        // console.log(date);
        console.log("roomIndex: "+roomIndex);
        console.log(this.bookingData.classrooms[roomIndex].name);
        let selectedRoom = this.bookingData.classrooms[roomIndex];
        let dateStart = cloneDeep(firstDate); //.setHours(0,0,0,0);
        dateStart.setHours(0,0,0,0);
        let dateEnd = cloneDeep(dateStart);
        dateEnd.setDate(dateEnd.getDate() +numberOfDates);
        // console.log(dateStart);
        // console.log(dateEnd);
        let foundBookings = [];
        for(let i in this.bookingData.bookings){
          let booking = this.bookingData.bookings[i];
          if(booking.start >= dateStart && booking.start <dateEnd && selectedRoom.id === booking.classroomNo){
            // console.log(new Date(booking.start));
            foundBookings.push(booking);
          }
          if(booking.start > dateEnd){
            // console.log("booking.start > dateEnd");
            // console.log(new Date(booking.start));
            // console.log(dateEnd);
            break;
          }
        }
        // console.log("found bookings");
        // console.log(foundBookings);
        let availableTimes = cloneDeep(this.bookingData.timeSlots);

        return this.disableBookedTimes(foundBookings, availableTimes);
      },
      disableBookedTimes(bookings, availableTimes){
        // console.log("disabling booked times for single date");
        // console.log("foundbookings: ");
        // console.log(bookings);
        // console.log("availableTimes");
        // console.log(availableTimes);

        availableTimes.forEach(function(timeSlot){
          // console.log("timeslot: " + timeSlot.time);

          bookings.forEach(function (booking) {
            let bookingStart = new Date(booking.start);
            let bookingStartTime = bookingStart.getHours() + bookingStart.getMinutes()/60;
            let bookingEnd = new Date(booking.end);
            let bookingEndTime = bookingEnd.getHours() + bookingEnd.getMinutes()/60;
            // console.log("booking: " + booking.title);
            // console.log("booking start: " + bookingStartTime);
            // console.log("booking end: " + bookingEndTime);
            if (bookingStartTime <= timeSlot.time && timeSlot.time < bookingEndTime) {
              // console.log("match!, setting diabled");
              timeSlot.disabled = true;
              // console.log(timeSlot);
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
        // console.log(this.origRoomIndex);
      },
      selectedWeekday: function (day) {
        if (this.selectedWeekday.name !== this.defaultOption.name) {
          this.origDayIndex = this.bookingData.weekdays.indexOf(day);
        }
        // console.log(this.origDayIndex);
      },
      pickedDate: function () {

        if(this.pickedDate !== undefined) {

          console.log("picked date chabged");
          console.log(this.pickedDate.getDay());
          console.log((this.pickedDate.getDay() === 6 || this.pickedDate.getDay() === 0));

          this.pickedDate.setHours(0, 0, 0, 0);
          let today = new Date();
          today.setHours(0, 0, 0, 0);

          if (this.pickedDate > today) {
            if (!(this.pickedDate.getDay() === 6 || this.pickedDate.getDay() === 0)) {
              this.selectedDateError = false;
              this.selectedWeekendError = false;

              if (this.origRoomIndex !== undefined) {
                // console.log(this.origRoomIndex);
                this.refreshTimesForSelectedDate();
              }
            } else {
              console.log("showing weekend error");
              this.selectedWeekendError = true;
              this.selectedDateError = false;
              this.pickedDate = undefined;
            }

          } else {
            console.log("showing old date error");
            this.selectedDateError = true
            this.selectedWeekendError = false;
            this.pickedDate = undefined;
          }
        }
      }
    },
    mounted(){
      EventBus.$on("closeBookingModal", function(){
        console.log("closing booking modal");
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
