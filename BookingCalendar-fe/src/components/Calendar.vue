/* eslint-disable */
<template>
  <div class="ml-4 mr-4">
    <div class="m-4" v-if="bookingData !== undefined">
      <div class="mb-4">
        <span class="mr-4">Luokka 1 : <font-awesome-icon :icon="icon" v-bind:style="{'color': eventColours.clasroom1}"/></span>
        <span class="mr-4">Luokka 2 : <font-awesome-icon :icon="icon" v-bind:style="{'color': eventColours.clasroom2}"/></span>
        <span class="mr-4">Luokka 3 : <font-awesome-icon :icon="icon" v-bind:style="{'color': eventColours.clasroom3}"/></span>
        <span class="mr-4">Pyhäpäivä : <font-awesome-icon :icon="icon" v-bind:style="{'color': eventColours.exceptionColor}"/></span>
        <span class="mr-4">Lukukausi : {{formattedTermStart}} - {{formattedTermend}}</span>
      </div>
      <full-calendar :events="bookingData.bookings" :config="config"></full-calendar>
      <div class="mt-4 w-100 d-flex">
        <div class="d-flex justify-content-start w-50"><button class="btn-primary p-2" v-on:click="openRepeatableBookingModal()">Lisää toistuva varaus</button></div>
        <div class="d-flex justify-content-end w-50"><button class="btn-primary p-2" v-on:click="openSingleBookingModal()">Lisää yksittäinen varaus</button></div>
      </div>
    </div>

    <modal name="exception-modal" height="auto">
      <div class="container pt-4">
        <h5>{{exceptionsToShow.length > 0 ? 'Varaus onnistui seuraavia päiviä lukuunottamatta:' : "Varaus onnistui!"}}</h5>
        <table class="w-100">
          <tbody>
          <tr v-for="exception in exceptionsToShow">
            <td>{{exception.date }}</td>
            <td>{{exception.reason}}</td>
          </tr>
          </tbody>
        </table>
        <button class="btn btn-primary mt-4 mb-4" @click="$modal.hide('exception-modal')">Sulje</button>
      </div>
    </modal>
  </div>
</template>

<script>
  import BookingModal from "./BookingModal.vue";
  import {EventBus} from '../shared/event-bus.js';
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import { faStop  } from '@fortawesome/fontawesome-free-solid'


  var cloneDeep = require('clone-deep');
  export default {
    components: {BookingModal, EventBus, FontAwesomeIcon},
    name: 'calendar',
    computed: {
      icon () {
        return faStop
      }
    },
    created() {
      this.activeUser = JSON.parse(this.$cookie.get("activeUser"));
      console.log(this.activeUser);
      this.initializeDemoBookings();
      
      let termStartDate = this.bookingsFromDatabase.schoolTerm.startDate;
      let termEndDate = this.bookingsFromDatabase.schoolTerm.endDate;
      this.formattedTermStart =  termStartDate.getDate()+"."+(termStartDate.getMonth()+1)+"."+termStartDate.getFullYear();
      this.formattedTermend = termEndDate.getDate()+"."+(termEndDate.getMonth()+1)+"."+termEndDate.getFullYear();
    },
    data() {
      return {
        eventColours: {
          exceptionColor: "#fcc95a",
          clasroom1: "#d37676",
          clasroom2: "#5b5fd3",
          clasroom3: "#00d31c",
          defaultColor: "#d31636"
        },
        config: {
          defaultView: 'agendaWeek',
          weekends: false,
          editable: false,
          locale: 'fi',
          scrollTime: '10:00:00',
          columnHeaderFormat: 'ddd D.M',
          selectable: false,
          timezone:"local",
          height: window.innerHeight*2/3,
          eventRender: function (event, element) {
            // console.log(event)
          },
        },
        bookingData: undefined,
        activeUser: undefined,
        exceptionsToShow: [],
        showExceptions: false,

        /*for demonstrattion purposes*/
        bookingsFromDatabase: {
          bookings: [
            {
              id: 1,
              repeatable: true,
              weekdays: [1, 3],
              startTime: 12,
              endTime: 16,
              exceptions: [
                {date: new Date("2018-05-28").setHours(0,0,0,0), reason:"demo"},
                {date: new Date("2018-05-07").setHours(0,0,0,0), reason:"demo"}
              ],
              title: "Sampsa",
              classroomNo: 1,
              teacherId: 2
            },
            {
              id: 1,
              repeatable: true,
              weekdays: [2, 3],
              startTime: 11,
              endTime: 17,
              exceptions: [

                {date: new Date("2018-05-07").setHours(0,0,0,0), reason:"demo"}
              ],
              title: "Hessu",
              classroomNo: 2,
              teacherId: 2
            },
            {
              id: 1,
              repeatable: true,
              weekdays: [3, 5],
              startTime:11.25,
              endTime: 17,
              exceptions: [
                {date: new Date("2018-05-30").setHours(0,0,0,0), reason:"demo"}
              ],
              title: "Mikki",
              classroomNo: 3,
              teacherId: 2
            },
            {
              repeatable: true,
              weekdays: [1,3],
              startTime: 8,
              endTime: 10.25,
              exceptions: [
              ],
              title: "SampsaVuorela",
              classroomNo: 1,
              teacherId: null
            },
            {
              id: 1,
              repeatable: false,
              date: new Date("2018-06-07").setHours(0, 0, 0, 0),
              startTime: 11,
              endTime: 17,
              exceptions: [],
              title: "Roope Setä",
              classroomNo: 1,
              teacherId: 2
            },
            {
              id: 1,
              repeatable: false,
              date: new Date("2018-06-07").setHours(0, 0, 0, 0),
              startTime: 11.5,
              endTime: 17.75,
              exceptions: [],
              title: "Aku",
              classroomNo: 2,
              teacherId: 2
            },
            {
              id: 1,
              repeatable: false,
              date: new Date("2018-06-12").setHours(0, 0, 0, 0),
              startTime: 8.5,
              endTime: 17.25,
              exceptions: [],
              title: "Hessu",
              classroomNo: 2,
              teacherId: 2
            },
            {
              id: 1,
              repeatable: false,
              date: new Date("2018-06-21").setHours(0, 0, 0, 0),
              startTime: 8,
              endTime: 21,
              exceptions: [],
              title: "Hannu hanhen juhannus",
              classroomNo: 3,
              teacherId: 2
            }

          ],
          schoolTerm: {
            id:1,
            startDate: new Date("2018-05-28"),
            endDate: new Date("2018-07-31"),
            exceptions: [
              // {date: new Date("2018-03-30"), reason: "Pitkäperjantai"},
              // {date: new Date("2018-04-02"), reason: "2. Pääsiäispäivä"},
              // {date: new Date("2018-04-30"), reason: "Vapunaatto"},
              // {date: new Date("2018-05-01"), reason: "Vappu"},
              // {date: new Date("2018-05-10"), reason: "Helatorstai"},
              {date: new Date("2018-06-22"), reason: "Juhannusaatto"},
            ]
          }
        }
      }
    },
    methods: {
      openRepeatableBookingModal() {
        this.$modal.show(BookingModal,{
          bookingData: this.bookingData,
          repeatableBooking: true
        },{
          adaptive:true,
          width:"50%"
        })
      },
      openSingleBookingModal(){
        this.$modal.show(BookingModal,{
          bookingData: this.bookingData,
          repeatableBooking: false,
        },{
          adaptive:true,
          width:"75%",
          height: "auto",
        })
      },
      generateBookings(bookings){
        var generatedBookings = [];
        let schoolTerm = cloneDeep(this.bookingsFromDatabase.schoolTerm);

        //iterating termDates
        termDateLoop:
          for(let termDate = cloneDeep(schoolTerm.startDate); termDate <= schoolTerm.endDate; termDate.setDate(termDate.getDate()+1)){
            termDate.setHours(0,0,0,0);

            //if date is an exeption
            for(let i in schoolTerm.exceptions) {
              let exception = schoolTerm.exceptions[i];
              let exceptionDate = exception.date;
              exceptionDate.setHours(0, 0, 0, 0);
              if (exceptionDate.getTime() === termDate.getTime()) {

                //pushing exception day as a whole day event
                generatedBookings.push({
                  title: exception.reason,
                  start: exceptionDate,
                  allDay: true,
                  color: this.eventColours.exceptionColor
                })
                continue termDateLoop;
              }
            }

            //iterating bookings
            bookingLoop:
              for(let b in bookings){
                let booking = bookings[b];
                let color = this.getClassRoomColor(booking.classroomNo);

                let bookingStartHH = Math.floor(booking.startTime);
                let bookingSrartMM = booking.startTime % bookingStartHH * 60;
                let bookingEndHH = Math.floor(booking.endTime);
                let bookingEndMM = booking.endTime % bookingEndHH * 60;

                //if booking is repeatable, create events if termDate's weekday matches bookings weekday
                if(booking.repeatable){
                  let termDay = termDate.getDay();

                  for(let e in booking.exceptions){
                    let exceptionDate = new Date(booking.exceptions[e].date);
                    if(exceptionDate.getTime() === termDate.getTime()){
                      continue bookingLoop;
                    }
                  }

                  booking.weekdays.forEach(function(weekday){
                    if(weekday === termDay) {
                      generatedBookings.push({
                        title:booking.title,
                        start: cloneDeep(termDate).setHours(bookingStartHH,bookingSrartMM,0,0),
                        end: cloneDeep(termDate).setHours(bookingEndHH,bookingEndMM,0,0),
                        color: color,
                        classroomNo: booking.classroomNo
                      })
                    }
                  })
                }
                if(!booking.repeatable){
                  termDate.setHours(0,0,0,0);
                  if(termDate.getTime() === booking.date){
                    generatedBookings.push({
                      title: booking.title,
                      start: cloneDeep(termDate).setHours(bookingStartHH,bookingSrartMM,0,0),
                      end:  cloneDeep(termDate).setHours(bookingEndHH,bookingEndMM,0,0),
                      color: color,
                      classroomNo: booking.classroomNo
                    })
                  }
                }
              }
          }
        return generatedBookings;

      },
      refreshAvailableWeeklyTimes(){
        var availableTimes = [];
        var bookingsFromDataBase = this.bookingsFromDatabase.bookings;
        var bookingData = this.bookingData;

        //initializing timeSlots
        for(let room = 0; room < bookingData.classrooms.length; room++){
          for(let day =0 ; day < bookingData.weekdays.length; day++){
            if(availableTimes[room] === undefined)availableTimes[room] = [];
            if(availableTimes[room][day] === undefined)availableTimes[room][day] = [];
            availableTimes[room][day]=cloneDeep(bookingData.timeSlots);
          }
        }

        //disabling timeslots if old bookings are found
        for(let b in bookingsFromDataBase) {
          let booking = bookingsFromDataBase[b];

          if (booking.repeatable) {
            this.disableBookedTimes(
              booking.classroomNo,
              booking.repeatable ? booking.weekdays : [booking.date],
              booking.startTime,
              booking.endTime,
              availableTimes)
          }
        }
        this.bookingData.availableTimes =  availableTimes;
      },
      disableBookedTimes(roomNo, weekdays, start, end, availableTimes){
        for(let i = 0; i < weekdays.length;i++) {
          let day = weekdays[i];
          let timeSlots = availableTimes[roomNo-1][day-1];

          timeSlots.forEach(function(timeSlot){
            if(start <= timeSlot.time && timeSlot.time < end) {
              timeSlot.disabled = true;
            }
          })
        }
      },
      getClassRoomColor(classroomNo){
        var color;
        switch(classroomNo){
          case 1:
            color = this.eventColours.clasroom1;
            break;
          case 2:
            color = this.eventColours.clasroom2;
            break;
          case 3:
            color = this.eventColours.clasroom3;
            break;
          default:
            color = this.eventColours.defaultColor;
            break;
        }
        return color;
      },

      initializeDemoBookings(){
        var classrooms = [];
        for(var i=1; i<4;i++){
          classrooms.push({id:i, name: "Luokka "+i});
        }

        var teachers = [];
        for(var i=1; i<6; i++){
          teachers.push({id:i, name: "Opettaja"+i});
        }

        var bookingTimes = [];
        var timesPerDay = this.calculateTimeSlots(8,21,15);

        this.bookingData = {
          bookings:[],
          availableTimes:[],
          classrooms:classrooms,
          teachers: teachers,
          weekdays: ["ma", "ti", "ke", "to", "pe"],
          timeSlots: timesPerDay
        };

        this.refreshBookings();
      },

      calculateTimeSlots(start, end, interval){
        start = start*60;
        end = end*60+interval;
        var times = []; // time array
        //loop to increment the time and push results in array
        for (var i=0;start<end; i++) {
          var hh = Math.floor(start/60); // getting hours of day in 0-24 format
          var mm = (start%60); // getting minutes of the hour in 0-55 format
          let title = ("0" + hh).slice(-2)+":"+ ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 format]
          let time = hh+(mm/60);
          times[i] = {title:title, time:time, disabled:false};
          start = start + interval;
        }
        return times;
      },
      refreshBookings(){
        this.bookingData.bookings = this.generateBookings(this.bookingsFromDatabase.bookings);
        this.refreshAvailableWeeklyTimes();
      },
      getExceptions(booking){
        let foundExceptions = [];
        let dataBaseBookings = this.bookingsFromDatabase;
        dataBaseBookings.schoolTerm.exceptions.forEach(function(exception){
          if(booking.weekdays.indexOf(exception.date.getDay()) !== -1){
            foundExceptions.push(exception);
          }
        });
        dataBaseBookings.bookings.forEach(function(oldBooking) {
          if(!oldBooking.repeatable
            && booking.weekdays.indexOf(new Date(oldBooking.date).getDay()) !== -1
            && (oldBooking.endTime > booking.startTime || oldBooking.startTime < booking.endTime)){
            foundExceptions.push({date: new Date(oldBooking.date), reason: "Varaus: "+oldBooking.title});
          }
        });
        return foundExceptions;
      }
    },
    watch: {

    },
    mounted(){
      EventBus.$on("makeBooking", function (repeatable, day, startTime, endTime, roomNo) {
        // console.log("Calendar.vue: makeRepBookings from eventbus");
        // console.log("repatable: "+repeatable);
        // console.log("day: "+day);
        // console.log("startTime:");
        // console.log(startTime);
        // console.log("endTime:");
        // console.log(endTime);
        // console.log("user: "+this.activeUser.name);
        // console.log("userID: "+this.activeUser.id); //TODO: implement when doing backend
        // console.log(this.activeUser);
        // console.log("roomNo: "+roomNo);

        var booking= {
          repeatable: repeatable,
          startTime: startTime,
          endTime: endTime,
          exceptions: [
          ],
          title: this.activeUser.name,
          classroomNo: roomNo,
          teacherId: null
        };
        if(repeatable){
          booking.weekdays = [day];
          booking.exceptions = this.getExceptions(booking);
        }else{
          booking.date = day.getTime();
        }

        this.bookingsFromDatabase.bookings.push(booking);
        this.refreshBookings();

        let exceptions = [];
        if(booking.exceptions.length > 0){
          booking.exceptions.forEach(function(exception){
            let e = cloneDeep(exception);
            e.date = e.date.getDate()+"."+(e.date.getMonth()+1)+"."+e.date.getFullYear();
            exceptions.push(e);
          });
        }
        this.exceptionsToShow = exceptions;
        this.$modal.show('exception-modal');
      }.bind(this))
    }
  }
</script>

<style>
  @import '~fullcalendar/dist/fullcalendar.css';

  .btn-primary{
    background-color: #343A40;
    border-color: #343A40;
  }
</style>

