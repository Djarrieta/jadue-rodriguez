<template>
    <v-container>
        <v-row class="fill-height">
            <v-col>
            <v-sheet height="64">
                <v-toolbar
                flat
                >
                <v-btn
                    outlined
                    class="mr-4"
                    color="primary darken-2"
                    @click="dialog = true"
                >
                    AGREGAR
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
                ></v-calendar>


                <!-- Modal agregar evento -->
                <v-dialog v-model="dialog">
                    <v-card>
                        <v-container>
                            <v-form @submit.prevent="addEvent">
                                <h2 class="text-uppercase">Agendar</h2>
                                <v-text-field 
                                    type="text" label="Agregar nombre de evento" v-model="name">
                                </v-text-field>
                                <v-text-field 
                                    type="text" label="Agregar detalle" v-model="details">
                                </v-text-field>
                                <v-text-field 
                                    type="date" label="Fecha inicio" v-model="start">
                                </v-text-field>
                                <v-text-field 
                                    type="date" label="Fecha término" v-model="end">
                                </v-text-field>
                                <v-text-field 
                                    type="color" label="Color" v-model="color">
                                </v-text-field>
                                <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog=false">Agregar</v-btn>
                            </v-form>
                        </v-container>
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
                        {{selectedEvent.name}} - {{selectedEvent.details}}
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
    export default {
        name:"Agenda",
        data: () => ({
            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                '4day': '4 Días',
            },
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            color: '#1976D2',
            start: null,
            end: null,
            name: '',
            details: '',
            dialog: false,
            currentEditing: null,
        }),
        mounted () {
            this.$refs.calendar.checkChange()
        },
        created () {
            this.getEvents()
        },
        methods: {
            async addEvent() {
                try {
                    if(this.name && this.start && this.end) {
                        await db.collection('events').add({
                            name: this.name,
                            details: this.details,
                            start: this.start,
                            end: this.end,
                            color: this.color
                        })

                        this.getEvents()

                        this.name = null
                        this.details = null
                        this.start = null
                        this.end = null
                        this.color = '#1976D2'

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
                        events.push(eventoData)
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