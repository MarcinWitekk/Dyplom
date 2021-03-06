<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn color="primary" class="mr-4" v-if="registered == true" @click="dialog = true" dark> Dodaj termin </v-btn>      

          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday"> Dzisiaj </v-btn>

          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2" 
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
              
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Tydzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Miesiąc</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 dni</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <!-- Add Event -->
      <v-dialog  v-model="dialog" max-width="700">
        <v-card class="dodaj-termin">
          <v-container>
            <v-form @submit.prevent="addEvent">
              <!-- <v-text-field v-model="name" type="text" label="Godzina"></v-text-field> -->

              <v-time-picker
                format="24hr"
                v-model="name"
              ></v-time-picker>

              <!-- <v-text-field v-model="start" type="date" label="Data"></v-text-field> -->

                  <v-date-picker
                    v-model="start"
                    width="290"
                    class="mt-4"
                  ></v-date-picker>

              <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">
                Stwórz termin
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <!-- Book Event -->
      <v-dialog v-model="bookDialog" max-width="500">
        <v-card>
          <v-container>
            <v-form >
              <v-text-field v-model="bookName" type="text" label="Imię"></v-text-field>
              <v-text-field v-model="bookSurname" type="text" label="Nazwisko"></v-text-field>
              <v-text-field v-model="bookContact" type="text" label="Numer telefonu"></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4"  @click.prevent="bookEvent(selectedEvent.id)">
                Zarezerwuj!
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn v-if="registered == true" @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing != selectedEvent.id">
                {{selectedEvent.details}}
                <div v-if="registered && this.selectedEvent.details == 'Zarezerwowane'">
                  <div >Imię: {{selectedEvent.bookName}} </div>
                  <div >Nazwisko: {{selectedEvent.bookSurname}} </div>
                  <div>Telefon: {{selectedEvent.bookContact}} </div>
                </div>
                
              </form>
              <form v-else>
                <textarea v-model="selectedEvent.details" type="text" style="width: 100%" :min-height:="100" placeholder="add note">
                  
                </textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions v-if="registered == true">
              <v-btn text color="secondary" @click="selectedOpen = false"> Zamknij kartę </v-btn>
            </v-card-actions>
            <v-card-actions v-if="registered == false">
              <v-btn text color="secondary" @click="selectedOpen = false"> Zamknij kartę </v-btn>
              <v-btn @click="bookDialog = true" v-if="this.selectedEvent.details != 'Zarezerwowane'" text> Umów się </v-btn> 
              
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '@/main';
import authAxios from "../auth-axios";

export default {
  props: ['registered'],
  data: () => ({
    today: new Date().toISOString().substr(0),
    focus: new Date().toISOString().substr(0),
    type: "month",
    typeToLabel: {
      month: "Miesiąc",
      week: "Tydzień",
      day: "Dzień",
      "4Day": "4 Days"
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#1976D2",
    bookName: null,
    bookSurname: null,
    bookContact: null,
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    bookDialog: false,
  }),
  mounted() {
    this.getEvents();
  },
  methods: {

    async getEvents() {
      let snapshot = await db.collection('Events').get();
      let events = [];
      snapshot.forEach( doc => {
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      });
      this.events = events;
    },
    async updateEvent(ev) {
      await db
      .collection('Events')
      .doc(this.currentlyEditing)
      .update({
        details: ev.details
      });
      this.selectedOpen = false;
      this.currentlyEditing = null;
    },
    async deleteEvent(ev) {
      await db
      .collection('Events')
      .doc(ev)
      .delete();
      this.selectedOpen = false;
      this.getEvents();
    },
    async addEvent() {
      if ( this.name && this.start ) {
        await db.collection('Events').add({
          name: this.name,
          details: "Wolny termin",
          start: this.start + " " + this.name,
          end: this.end,
          color: this.color
        });
        this.getEvents();
        this.name = "";
        this.details = "";
        this.start = "";
        this.end = "";
        this.color = "#1976D2";

      } else {
        alert("Uzupełnij poprawnie dane");
      }
    },
    async bookEvent(ev) {

      console.log(ev);
      if ( this.bookName && this.bookSurname && this.bookContact) {
        await db.collection('Events').doc(ev).update({
          bookName: this.bookName,
          bookSurname: this.bookSurname,
          bookContact: this.bookContact,
          details: "Zarezerwowane",
          color: "#b3b4b5"
        });       

        this.bookDialog = false;
        this.getEvents();

      } else {
        alert("Uzupełnij poprawnie dane");
      }
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }
      
      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  },
};
</script>

<style  lang="less">
 .pl-1 {
   
   strong {
    display: block;
   }

 }
.dodaj-termin {
  .container {
    .v-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
    .v-card.v-picker--date {
      margin-top: 0 !important;
    }
  }
}
</style>