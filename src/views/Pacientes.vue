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
                                    max-width="650px"
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
                                        <v-card-title class="headline">¿Estás seguro que quieres eliminarlo?</v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                                        <v-btn color="red darken-2" text @click="deleteItemConfirm">Borrar</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                color="green"
                                class="mr-2"
                                @click="editItem(item)"
                            >
                            mdi-pencil
                            </v-icon>
                            <v-icon
                                small
                                color="red"
                                @click="deleteItem(item)"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
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
          { text: 'Dirección', value: 'address' },
          { text: 'Ciudad', value: 'city' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        editedItem: {
            name: '',
            lastName: '',
            run: '',
            phone: '',
            email: '',
            address: '',
            birthdate: new Date(),
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
            birthdate: new Date(),
            city: '',
            profession: '',
        },
    }),

    computed:{
        submitableBirdthdayDateTime () {
            const date = new Date(moment(this.editedItem.birthdate).format('MM-DD-YYYY'))
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
                // console.log(this.clients[this.editedIndex]) // este edita
                this.editClient(this.clients[this.editedIndex])
            } else {
                //this.clients.push(this.editedItem)
                this.addClient(this.editedItem)
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

        async editClient (data) {
            try {
                await db.collection('clients').doc(data.id).update({
                    name: data.name,
                    lastName: data.lastName,
                    run: data.run,
                    address: data.address,
                    city: data.city,
                    profession: data.profession,
                    phone: data.phone,
                    email: data.email,
                    birthdate: this.submitableBirdthdayDateTime,
                })
                this.getClients()
            } catch (error) {
                console.error(error)
            }
        },

        deleteItem (item) {
            this.editedIndex = this.clients.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm () {
            // this.clients.splice(this.editedIndex, 1)
            // console.log(this.editedItem.id)
            try {
                await db.collection('clients').doc(this.editedItem.id).delete()
                this.getClients()
                this.closeDelete()
            } catch (error) {
                console.error(error)
            }
            
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async addClient(item) {
            console.log(item)
            try {
                if(item.name && item.lastName && item.run) {
                    await db.collection('clients').add({
                        name: item.name,
                        lastName: item.lastName,
                        run: item.run,
                        birthdate: this.submitableBirdthdayDateTime,
                        address: item.address,
                        city: item.city,
                        profession: item.profession,
                        phone: item.phone,
                        email: item.email,
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
                        id: clientData.id,
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