<template>
    <v-container>
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
                    <v-toolbar
                    flat
                    >
                    <v-btn
                        class="mr-4"
                        color="primary"
                        outlined
                        @click="dialog = true"
                    >
                        AGENDAR
                    </v-btn>
                    <v-btn
                        outlined
                        class="mr-4"
                        color="grey darken-2"
                        @click="setToday"
                    >
                        Hoy
                    </v-btn>
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
                            <v-list-item-title>Día</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'week'">
                            <v-list-item-title>Semana</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'month'">
                            <v-list-item-title>Mes</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = '4day'">
                            <v-list-item-title>4 días</v-list-item-title>
                        </v-list-item>
                        </v-list>
                    </v-menu>
                    </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                    <v-calendar
                        ref="calendar"
                        v-model="focus"
                        color="primary"
                        :events="events"
                        :short-weekdays="false"
                        :event-color="getEventColor"
                        :type="type"
                        @click:event="showEvent"
                        @click:more="viewDay"
                        @click:date="viewDay"
                        :weekdays="weekday"
                        :first-interval= 7
                        :interval-count= 15
                    ></v-calendar>


                    <!-- Modal agregar evento -->
                    <v-dialog v-model="dialog" max-width="600px" >
                        <v-card class="pa-4">
                            <v-form @submit.prevent="addEvent">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" >
                                            <h2 class="text-uppercase">Agendar</h2>
                                        </v-col>

                                        <v-col cols="12" md="6" >
                                            <v-text-field 
                                                type="text" label="RUN" @change="buscarPacienteConRut" v-model="runBuscar">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" >
                                            <v-text-field 
                                                type="text" label="Nombre" v-model="nombreCompleto">
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" >
                                            <!-- <v-text-field 
                                                type="text" label="Agregar nombre de evento" v-model="name">
                                            </v-text-field> -->
                                            <v-select
                                                :items="tipoEvento"
                                                label="Selecionar evento"
                                                v-model="name"
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="10" >
                                            <v-text-field 
                                                type="text" label="Agregar detalle" v-model="details">
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="2" >
                                            <v-text-field 
                                                type="color" label="Color" v-model="color">
                                            </v-text-field>
                                        </v-col>
                                        
                                        <v-col cols="12" md="6">
                                            <v-text-field 
                                                type="date" label="Fecha inicio" v-model="start">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <!-- Start time -->
                                            <v-menu
                                                ref="dialog"
                                                v-model="menu2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="time"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                            >
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field
                                                        v-model="timeStart"
                                                        label="Hora de inicio"
                                                        prepend-icon="mdi-clock-time-four-outline"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-time-picker
                                                    v-if="menu2"
                                                    v-model="timeStart"
                                                    full-width
                                                    format="24hr"
                                                    @click:minute="$refs.menu.save(time)"
                                                ></v-time-picker>
                                            </v-menu>
                                        </v-col>

                                        <!-- End time -->
                                        <v-col cols="12" md="6">
                                            <v-text-field 
                                                type="date" label="Fecha término" v-model="end">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-menu
                                                ref="menu"
                                                v-model="menu3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="timeEnd"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                            >
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field
                                                        v-model="timeEnd"
                                                        label="Hora de término"
                                                        prepend-icon="mdi-clock-time-four-outline"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-time-picker
                                                    v-if="menu3"
                                                    v-model="timeEnd"
                                                    full-width
                                                    format="24hr"
                                                    @click:minute="$refs.menu.save(timeEnd)"
                                                ></v-time-picker>
                                            </v-menu>
                                        </v-col>
                                        
                                        <v-col cols="12" md="6">
                                            <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog=false">Agregar</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                        </v-card>
                    </v-dialog>


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
                            <v-btn icon @click="deleteEvent(selectedEvent)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-if="currentEditing !== selectedEvent.id" >
                                <p>
                                    <span v-if="selectedEvent.run"><b>RUN:</b> {{ selectedEvent.run }}
                                    <br> </span>
                                    <span v-if="selectedEvent.nameClient">
                                        <b>Nombre:</b> {{selectedEvent.nameClient}}
                                        <br>
                                    </span>
                                    <span v-if="selectedEvent.details"><b>Detalle:</b> {{selectedEvent.details}}</span>
                                </p>
                            </v-form>

                            <v-form v-else>
                                <v-text-field 
                                    type="text" v-model="selectedEvent.name"
                                    label="Edita nombre">
                                </v-text-field>

                                <textarea-autosize
                                    v-model="selectedEvent.details"
                                    type="text"
                                    style="width: 100%"
                                    :min-height="100">
                                </textarea-autosize>

                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                        <v-btn
                            text
                            color="secondary"
                            @click="selectedOpen = false; currentEditing = null;"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn text v-if="currentEditing !== selectedEvent.id" 
                            @click.prevent="editEvent(selectedEvent.id)">
                            Editar
                        </v-btn>

                        <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                            Guardar cambios
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-menu>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {db} from "../main"
    import moment from 'moment'
    export default {
        data: () => ({
            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                '4day': '4 Días',
            },
            runBuscar: null,
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            tipoEvento: ['Cita', 'Control', 'Bloqueo'],
            color: '#1976D2',
            start: new Date(),
            end: new Date(),
            name: '',
            details: '',
            dialog: false,
            currentEditing: null,
            timeStart: '00:00',
            timeEnd: '00:00',
            time: '00:00',
            menu2: false,
            menu3: false,
            modal3: false,
            weekday: [1, 2, 3, 4, 5, 6],
            client: [],
        }),
        computed:{
            submitableStartDateTime () {
                const date = new Date(moment(this.start).format('MM-DD-YYYY'))
                if(typeof this.timeStart === 'string') {
                    const hours = this.timeStart.match(/^(\d+)/)[1]
                    const minutes = this.timeStart.match(/:(\d+)/)[1]
                    date.setHours(hours)
                    date.setMinutes(minutes)
                } else {
                    date.setHours(this.timeStart.getHours())
                    date.setMinutes(this.timeStart.getMinutes())
                }
                console.log(date)
                return date
            },
            submitableEndDateTime () {
                const date = new Date(moment(this.end).format('MM-DD-YYYY'))
                if(typeof this.timeEnd === 'string') {
                    const hours = this.timeEnd.match(/^(\d+)/)[1]
                    const minutes = this.timeEnd.match(/:(\d+)/)[1]
                    date.setHours(hours)
                    date.setMinutes(minutes)
                } else {
                    date.setHours(this.timeEnd.getHours())
                    date.setMinutes(this.timeEnd.getMinutes())
                }
                console.log(date)
                return date
            },
            nombreCompleto () {
                let cliente = this.client
                let nombreCompleto = ''
                cliente.forEach(client => {
                    nombreCompleto = client.name + ' ' + client.lastName
                })
                return nombreCompleto
            },
        },
        mounted () {
            this.$refs.calendar.checkChange()
        },
        created () {
            this.getEvents()
        },
        methods: {
            async buscarPacienteConRut () {
                try {
                    const clientRef = db.collection('clients');
                    const snapshot = await clientRef.where('run', '==', this.runBuscar).get();
                    this.client = []
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    let client = []
                    snapshot.forEach(doc => {
                        let clientData = doc.data()
                        clientData.id = doc.id
                        client.push({
                            name: clientData.name,
                            lastName: clientData.lastName,
                            id: clientData.id,
                        })
                    });
                    this.client = client
                } catch (error) {
                    console.error(error)
                }
                // console.log(this.runBuscar)
            },
            async addEvent() {
                try {
                    if(this.name && this.start && this.end) {
                        await db.collection('events').add({
                            name: this.name,
                            details: this.details,
                            start: this.submitableStartDateTime,
                            end: this.submitableEndDateTime,
                            color: this.color,
                            nameClient: this.nombreCompleto,
                            run: this.runBuscar,
                        })
                        this.getEvents() 
                        this.name = null
                        this.details = null
                        this.start = null
                        this.end = null
                        this.color = '#1976D2'
                        this.nameClient = null
                        this.run = null
                    } else {
                        console.log('Campos obligatorios')
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            async getEvents() {
                try {
                    const snapshot = await db.collection('events').get();
                    const events = []
                    snapshot.forEach(doc => {
                        let eventoData = doc.data()
                        eventoData.id = doc.id
                        const end = new Date(eventoData.end.seconds * 1000)
                        const start = new Date(eventoData.start.seconds * 1000)
                        events.push({
                            color: eventoData.color,
                            details: eventoData.details,
                            end: moment(end).format('YYYY-MM-DD HH:mm'),
                            id: eventoData.id,
                            name: eventoData.name,
                            start: moment(start).format('YYYY-MM-DD HH:mm'),
                            nameClient: eventoData.nameClient,
                            run: eventoData.run,
                        })
                    })
                    this.events = events
                } catch (e) {
                    console.error(e)
                }
            },
            async deleteEvent (ev) {
                try {
                    await db.collection('events').doc(ev.id).delete()
                    this.selectedOpen = false
                    this.getEvents()
                } catch (error) {
                    console.error(error)
                }
            },
            editEvent(id) {
                this.currentEditing = id
            },
            async updateEvent(ev) {
                try {
                    await db.collection('events').doc(ev.id).update({
                        name: ev.name,
                        details: ev.details
                    })
                    this.selectedOpen = false
                    this.currentEditing = null
                } catch (error) {
                    console.error(error)
                }
            },
            updateRange ({start, end}) {
                this.start = start
                this.end = end
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
            
            rnd (a, b) {
                return Math.floor((b - a + 1) * Math.random()) + a
            },
        },
    }
</script>
