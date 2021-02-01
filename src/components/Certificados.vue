<template>
  <v-card>
    <v-card-title>
      CERTIFICADOS
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
        :items="certificates"
        :search="search"
        :loading="loadingCertificate"
        loading-text="Cargando... Por favor espere"
        :items-per-page="5"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-dialog
                    v-model="dialog"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                        >
                            Nuevo certificado
                        </v-btn>
                    </template>

                    <v-card>
                        <v-toolbar
                        dark
                        color="primary"
                        >
                        <v-btn
                            icon
                            dark
                            @click="dialog = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn
                                dark
                                text
                                @click="save"
                            >
                            {{ formButton }}
                            </v-btn>
                        </v-toolbar-items>
                        </v-toolbar>
                        
                        <!-- <v-subheader>Hola mundo!</v-subheader> -->

                        <v-card-text class="mt-10">
                            <v-textarea
                                outlined
                                name="input-7-4"
                                label="Certificado visual"
                                v-model="editedItem.certificate"
                            ></v-textarea>
                        </v-card-text>
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
</template>

<script>
import {db} from "../main"
import moment from 'moment'

export default {
    name: 'certificados',
    props:["id"],
    data(){
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                {
                    text: 'Certificado',
                    align: 'start',
                    sortable: false,
                    value: 'certificate',
                },
                // { text: 'ID Usuario', value: 'uid'},
                { text: 'Registro', value: 'register'},
                { text: 'Opciones', value: 'actions', sortable: false },
                
            ],
            editedItem: {
                certificate: '',
            },
            defaultItem: {
                certificate: '',
            },
            certificates: [],
            loadingClient: true,
            loadingCertificate: true,
        }
    },
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo certificado' : 'Editar certificado'
        },
        formButton () {
            return this.editedIndex === -1 ? 'Guardar' : 'Actualizar'
        },
        submitableRegisterDateTime () {
            const date = new Date(moment(this.editedItem.birthdate).format('MM-DD-YYYY'))
            return date
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
        this.getCertificates()
    },

    methods: {
        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.certificates[this.editedIndex], this.editedItem)
                this.editCertificate(this.certificates[this.editedIndex])
            } else {
                this.addCertificate(this.editedItem)
            }
            this.dialog = false
            this.close()
        },

        editItem (item) {
            this.editedIndex = this.certificates.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        async addCertificate(item) {
            try {
                if(item.certificate) {
                    await db.collection('certificates').add({
                        certificate: item.certificate,
                        uid: this.id,
                        register: this.submitableRegisterDateTime,
                    })
                    this.getCertificates()
                    this.certificado = null
                }
            } catch (error) {
                console.error(error)
            }
        },

        async editCertificate (data) {
            try {
                await db.collection('certificates').doc(data.id).update({
                    certificate: data.certificate,
                    register: this.submitableRegisterDateTime,
                })
                this.getCertificates()
            } catch (error) {
                console.log(error)
            }
        },

        deleteItem (item) {
            this.editedIndex = this.certificates.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm () {
            try {
                await db.collection('certificates').doc(this.editedItem.id).delete()
                this.getCertificates()
                this.closeDelete()
            } catch (error) {
                console.log(error)
            }
            this.getCertificates()
        },
            
        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async getCertificates() {
            const snapshot = await db.collection('certificates').where('uid', '==', this.id).get();
            const certificates = []
            snapshot.forEach(doc => {
                let certificateData = doc.data()
                certificateData.id = doc.id
                const register = new Date(certificateData.register.seconds * 1000)
                certificates.push({
                    id: certificateData.id,
                    certificate: certificateData.certificate,
                    uid: certificateData.uid,
                    register: moment(register).format('DD-MM-YYYY'),
                })
            })
            this.certificates = certificates
            this.loadingCertificate = false
        },
    },
}
</script>