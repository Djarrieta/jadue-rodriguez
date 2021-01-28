<template>
    <v-container>
        <v-row class="fill-height">
            <v-col>
                <v-card>
                    <v-card-title class="text-uppercase">
                        Pacientes
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                    ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="clients"
                        :search="search"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-dialog
                                    v-model="dialog"
                                    max-width="500px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                        color="primary"
                                        dark
                                        outlined
                                        class="mb-2"
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                            Nuevo paciente
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline text-uppercase">{{ formTitle }}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="Nombre" v-model="editedItem.name">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="Apellido" v-model="editedItem.lastName">
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="RUN" v-model="editedItem.run">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="date" label="Fecha de nacimiento" v-model="editedItem.birthdate">
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12">
                                                        <v-text-field 
                                                            type="text" label="Dirección" v-model="editedItem.address">
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="Ciudad" v-model="editedItem.city">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="Ocupación" v-model="editedItem.profession">
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="Teléfono" v-model="editedItem.phone">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field 
                                                            type="text" label="E-mail" v-model="editedItem.email">
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="blue darken-1"
                                                text
                                                @click="close"
                                            >
                                                Cancelar
                                            </v-btn>
                                            <v-btn
                                                color="blue darken-1"
                                                text
                                                @click="save"
                                            >
                                                Guardar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                            </v-toolbar>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                class="mr-2"
                                @click="editItem(item)"
                            >
                            mdi-pencil
                            </v-icon>
                            <v-icon
                                small
                                @click="deleteItem(item)"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        
        
        <!-- Modal  -->
        <!-- <v-dialog v-model="dialog" max-width="600px" >
            <v-card class="pa-4">
                <v-form @submit.prevent="addClient">
                    <v-container>
                        <v-row>
                            <v-col cols="12" >
                                <h2 class="text-uppercase">Nuevo paciente</h2>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="Nombre" v-model="name">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="Apellido" v-model="lastName">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="RUN" v-model="run">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="date" label="Fecha de nacimiento" v-model="birthdate">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field 
                                    type="text" label="Dirección" v-model="address">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="Ciudad" v-model="city">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="Ocupación" v-model="profession">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="Teléfono" v-model="phone">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field 
                                    type="text" label="E-mail" v-model="email">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog=false">Agregar</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog> -->
        
    </v-container>



</template>

<script>
import {db} from "../main"
import moment from 'moment'

export default {
    name: 'Pacientes',
    data: () => ({
        dialogDelete: false,
        dialog : false,
        editedIndex: -1,
        name: null,
        lastName: null,
        run: null,
        birthdate: new Date(),
        address: null,
        city: null,
        profession: null,
        phone: null,
        email: null,
        clients: [],
        search: '',
        headers: [
          { text: 'Nombre', align: 'start', value: 'name' },
          { text: 'Apellido', value: 'lastName' },
          { text: 'RUN', value: 'run' },
          { text: 'Teléfono', value: 'phone' },
          { text: 'E-mail', value: 'email' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        editedItem: {
            name: '',
            lastName: '',
            run: '',
            phone: '',
            email: '',
            address: '',
            birthdate: '',
            city: '',
            profession: '',

        },
        defaultItem: {
            name: '',
            lastName: '',
            run: '',
            phone: '',
            email: '',
            address: '',
            birthdate: '',
            city: '',
            profession: '',
        },
    }),

    computed:{
        submitableBirdthdayDateTime () {
            const date = new Date(moment(this.birthdate).format('MM-DD-YYYY'))
            return date
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Paciente' : 'Editar paciente'
        },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.getClients()
    },

    methods: {
        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.clients[this.editedIndex], this.editedItem)
            } else {
                this.clients.push(this.editedItem)
            }
            this.close()
        },
            
        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        editItem (item) {
            this.editedIndex = this.clients.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            this.editedIndex = this.clients.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            this.clients.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async addClient() {
            try {
                if(this.name && this.lastName && this.run) {
                    await db.collection('clients').add({
                        name: this.name,
                        lastName: this.lastName,
                        run: this.run,
                        birthdate: this.submitableBirdthdayDateTime,
                        address: this.address,
                        city: this.city,
                        profession: this.profession,
                        phone: this.phone,
                        email: this.email,
                    })

                    this.getClients()

                    this.name = null
                    this.lastName = null
                    this.run = null
                    this.birthdate = null
                    this.address = null
                    this.city = null
                    this.profession = null
                    this.phone = null
                    this.email = null

                    this.dialog = false

                }
            } catch (error) {
                console.error(error)
            }
        },

        async getClients() {
            try {
                const snapshot = await db.collection('clients').get();
                const clients = []
                snapshot.forEach(doc => {
                    let clientData = doc.data()
                    clientData.id = doc.id
                    const birthdate = new Date(clientData.birthdate.seconds * 1000)
                    clients.push({
                        name: clientData.name,
                        lastName: clientData.lastName,
                        run: clientData.run,
                        birthdate: moment(birthdate).format('yyyy-MM-DD'),
                        address: clientData.address,
                        city: clientData.city,
                        profession: clientData.profession,
                        phone: clientData.phone,
                        email: clientData.email,
                    })
                    this.clients = clients
                })
            } catch (error) {
                console.error(error)
            }
        }

    }


}
</script>

<style>

</style>