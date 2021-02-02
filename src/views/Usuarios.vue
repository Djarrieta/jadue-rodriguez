<template>
  <v-container>
    <v-row class="fill-height">
      <v-col>
        <v-card>
          <v-card-title class="text-uppercase">
            Usuarios
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          </v-card-title>
          <!-- Tabla -->
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
                      Nuevo Usuario
                    </v-btn>
                  </template>
                  <!-- Modal editar/Nuevo -->
                  <v-card>
                    <!-- Título -->
                    <v-card-title>
                      <span class="headline text-uppercase">{{ formTitle }}</span>
                    </v-card-title>
                    <!-- Formulario -->
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <!-- Nombre -->
                          <v-col cols="12" md="6">
                            <v-text-field 
                              type="text" label="Nombre" v-model="editedItem.name">
                            </v-text-field>
                          </v-col>
                          <!-- Correo -->
                          <v-col cols="12" md="6">
                            <v-text-field 
                              type="text" label="E-mail" v-model="editedItem.email">
                            </v-text-field>
                          </v-col>
                          <!-- Perfil -->
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="selectedProfileUser"
                              :items="selectProfileNewUser"
                              label="Perfil"
                            ></v-select>
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
              <!-- Botones de opción en lista-->
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
import firebase from "firebase"
import {db} from "@/main"
import moment from 'moment'

export default {
  name: 'Usuarios',
  data: () => ({
    dialogDelete: false,
    dialog : false,
    editedIndex: -1,

    name: null,
    email: null,
    profile:0,
    clients: [],
    search: '',
    headers: [
      { text: 'Nombre', align: 'start', value: 'name' },
      { text: 'E-mail', value: 'email' },
      { text: 'Estado', value: 'verified' },
      { text: 'Opciones', value: 'actions', sortable: false },
    ],
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
      email: '',
    },
    selectedProfileUser:"Básico",
    selectProfileNewUser:["Administrador","Profesional","Básico"]
  }),

  computed:{
    submitableBirdthdayDateTime () {
      const date = new Date(moment(this.editedItem.birthdate).format('MM-DD-YYYY'))
      return date
    },

    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
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
        this.editClient(this.clients[this.editedIndex])
      } else {
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
      console.log("está intentando editar")
      try {
        await db.collection('users').doc(data.id).update({
          name: data.name,
          email: data.email,
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
      try {
        await db.collection('users').doc(this.editedItem.id).delete()
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
      if(!item.name){
        this.$store.state.alert={
          text:"Nombre inválido.",
          icon:"error"
        }
        return
      }
      if(!item.email){
        this.$store.state.alert={
          text:"Correo inválido.",
          icon:"error"
        }
        return
      }
      await db.collection('users').doc(item.email).set({
        name: item.name,
        email: item.email,
        verified:false,
        profile:this.selectedProfileUser,
        date:firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(()=>{
        this.getClients()
        this.name = null
        this.email = null
        this.dialog=false
        this.$store.state.alert={
          text:"Se ha creado el usuario con éxito. El usuario deberá ingresar con su email y configurar su contraseña personal.",
          icon:"success"
        }
      })
      .catch(e=>console.error(e))
    },

    async getClients() {
      try {
        const snapshot = await db.collection('users').get();
        const clients = []
        snapshot.forEach(doc => {
          let clientData = doc.data()
          clientData.id = doc.id
          clients.push({
            id: clientData.id,
            name: clientData.name,
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