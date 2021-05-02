<template>
  <v-card>
    <v-card-title>
      HISTORIAS CLÍNICAS
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
      :items="historiasClinicas"
      :search="search"
      :loading="loadingHistoriasClinicas"
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
                            Nueva historia clínica
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
                        
                        <v-card-text>
                            <v-container>
                                
                                <!-- Motivo de consulta | Antecedentes generales | Antecedentes oculares -->
                                <v-row>
                                    <!-- Motivo de consulta -->
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >
                                        <v-textarea
                                            outlined
                                            name="input-7-4"
                                            label="Motivo de consulta"
                                            v-model="editedItem.motivoConsulta"
                                        ></v-textarea>
                                    </v-col>

                                    <!-- Antecedentes generales -->
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >    
                                        <v-textarea
                                            outlined
                                            name="input-7-4"
                                            label="Antecedentes generales"
                                            v-model="editedItem.antecedentesGenerales"
                                        ></v-textarea>
                                    </v-col>

                                    <!-- Antecedentes oculares -->
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >    
                                        <v-textarea
                                            outlined
                                            name="input-7-4"
                                            label="Antecedentes oculares"
                                            v-model="editedItem.antecedentesOculares"
                                        ></v-textarea>
                                    </v-col>
                                </v-row>
                                
                                <v-row>
                                    <v-subheader><h2 class="">Corrección visual lensometría</h2></v-subheader>
                                </v-row>
                                
                                <!-- Esfera OD | Cilindro OD | Eje OD | ADD OD -->
                                <v-row>
                                    <!-- Esfera OD -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.esferaOd"
                                            label="Esfera OD"
                                            required/>
                                    </v-col>
                                    <!-- Cilindro OD -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.cilindroOd"
                                            label="Cilindro OD"
                                            required/>
                                    </v-col>
                                    <!-- Eje OD -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.ejeOd"
                                            label="Eje OD"
                                            required/>
                                    </v-col>
                                    <!-- ADD OD -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.addOd"
                                            label="ADD OD"
                                            required/>
                                    </v-col>
                                </v-row>

                                <!-- Esfera OI | Cilindro OI | Eje OI | ADD OI -->
                                <v-row>
                                    <!-- Esfera OI -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.esferaOi"
                                            label="Esfera OI"
                                            required/>
                                    </v-col>
                                    <!-- Cilindro OI -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.cilindroOi"
                                            label="Cilindro OI"
                                            required/>
                                    </v-col>
                                    <!-- Eje OI -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.ejeOi"
                                            label="Eje OI"
                                            required/>
                                    </v-col>
                                    <!-- ADD OI -->
                                    <v-col cols="3">
                                        <v-text-field
                                            v-model="editedItem.addOi"
                                            label="ADD OI"
                                            required/>
                                    </v-col>
                                </v-row>

                                <!-- Tipo | Tiempo de uso -->
                                <v-row>
                                    <!-- Tipo -->
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model="editedItem.tipo"
                                            label="Tipo"
                                            required/>
                                    </v-col>
                                    <!-- Tiempo de uso -->
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model="editedItem.tiempoUso"
                                            label="Tiempo de uso"
                                            required/>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-subheader><h2 class="">Agudez visual Sin Rx</h2></v-subheader>
                                </v-row>

                                <!-- 01 -->
                                <!-- Lejos OD 20/ | Cerca OD 20/ | PH OD 20/ -->
                                <v-row>
                                    <!-- Lejos OD 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.lejosOD2001"
                                            label="Lejos OD 20/"
                                        />
                                    </v-col>
                                    <!-- Cerca OD 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.cercaOD2001"
                                            label="Cerca 20/"
                                        />
                                    </v-col>
                                    <!-- PH OD 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.phOD2001"
                                            label="PH 20/"
                                        />
                                    </v-col>
                                </v-row>

                                <!-- Lejos OI 20/ | Cerca OI 20/ | PH OI 20/ -->
                                <v-row>
                                    <!-- Lejos OI 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.lejosOI2001"
                                            label="Lejos OI 20/"
                                        />
                                    </v-col>
                                    <!-- Cerca OI 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.cercaOI2001"
                                            label="Cerca 20/"
                                        />
                                    </v-col>
                                    <!-- PH OI 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.phOI2001"
                                            label="PH 20/"
                                        />
                                    </v-col>
                                </v-row>

                                 <v-row>
                                    <v-subheader><h2 class="">Agudez visual Con Rx</h2></v-subheader>
                                </v-row>
                                <!-- 02 -->
                                <!-- Lejos OD 20/ | Cerca OD 20/ | PH OD 20/ -->
                                <v-row>
                                    <!-- Lejos OD 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.lejosOD2002"
                                            label="Lejos OD 20/"
                                        />
                                    </v-col>
                                    <!-- Cerca OD 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.cercaOD2002"
                                            label="Cerca 20/"
                                        />
                                    </v-col>
                                    <!-- PH OD 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.phOD2002"
                                            label="PH 20/"
                                        />
                                    </v-col>
                                </v-row>

                                <!-- Lejos OI 20/ | Cerca OI 20/ | PH OI 20/ -->
                                <v-row>
                                    <!-- Lejos OI 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.lejosOI2002"
                                            label="Lejos OI 20/"
                                        />
                                    </v-col>
                                    <!-- Cerca OI 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.cercaOI2002"
                                            label="Cerca 20/"
                                        />
                                    </v-col>
                                    <!-- PH OI 20/ -->
                                    <v-col cols="4">
                                        <v-text-field
                                            v-model="editedItem.phOI2002"
                                            label="PH 20/"
                                        />
                                    </v-col>
                                </v-row>

                                 <v-row>
                                    <v-subheader><h2 class="">Biomicroscopia</h2></v-subheader>
                                </v-row>
                                <v-row>
                                    <!-- biomicroscopiaOD -->
                                    <v-col cols="6">
                                         <v-textarea
                                            outlined
                                            name="input-7-4"
                                            label="OD"
                                            v-model="editedItem.biomicroscopiaOD"
                                        ></v-textarea>
                                    </v-col>
                                    <!-- biomicroscopiaOI -->
                                    <v-col cols="6">
                                         <v-textarea
                                            outlined
                                            name="input-7-4"
                                            label="OI"
                                            v-model="editedItem.biomicroscopiaOI"
                                        ></v-textarea>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-subheader><h2 class="">Queratometría</h2></v-subheader>
                                </v-row>
                                <!-- Querimetria OD -->
                                <v-row>
                                    <v-col cols="2">
                                        OD
                                    </v-col>
                                    <!-- querimetriaODDecimal1 -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.querimetriaODDecimal1"
                                            label=""
                                        />
                                    </v-col>
                                    <v-col cols="2" class="text-center">
                                        /
                                    </v-col>
                                    <!-- querimetriaODDecimal2 -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.querimetriaODDecimal2"
                                            label=""
                                        />
                                    </v-col>
                                    <v-col cols="2" class="text-center">
                                        X
                                    </v-col>
                                    <!-- querimetriaODNumero -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.querimetriaODNumero"
                                            label=""
                                        />
                                    </v-col>
                                </v-row>
                                <!-- Quieratometria OI -->
                                <v-row>
                                    <v-col cols="2">
                                        OI
                                    </v-col>
                                    <!-- queratometriaOIDecimal1 -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.queratometriaOIDecimal1"
                                            label=""
                                        />
                                    </v-col>
                                    <v-col cols="2" class="text-center">
                                        /
                                    </v-col>
                                    <!-- queratometriaOIDecimal2 -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.queratometriaOIDecimal2"
                                            label=""
                                        />
                                    </v-col>
                                    <v-col cols="2" class="text-center">
                                        X
                                    </v-col>
                                    <!-- queratometriaOINumero -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.queratometriaOINumero"
                                            label=""
                                        />
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-subheader><h2 class="">Retinoscopia</h2></v-subheader>
                                </v-row>
                                <!-- Retinoscopia OD -->
                                <v-row>
                                    <v-col cols="2">
                                        OD
                                    </v-col>
                                    <!-- retinoscopiaODEsfera -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaODEsfera"
                                            label="OD Esfera"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaODCilindro -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaODCilindro"
                                            label="OD Cilindro"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaODEje -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaODEje"
                                            label="OD Eje"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaODAdd -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaODAdd"
                                            label="OD ADD"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaODAv -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaODAv"
                                            label="OD AV"
                                        />
                                    </v-col>
                                </v-row>
                                <!-- Retinoscopia OI -->
                                <v-row>
                                    <v-col cols="2">
                                        OI
                                    </v-col>
                                    <!-- retinoscopiaOIEsfera -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaOIEsfera"
                                            label="OI Esfera"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaOICilindro -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaOICilindro"
                                            label="OI Cilindro"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaOIEje -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaOIEje"
                                            label="OI Eje"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaOIAdd -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaOIAdd"
                                            label="OI ADD"
                                        />
                                    </v-col>
                                    <!-- retinoscopiaOIAv -->
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="editedItem.retinoscopiaOIAv"
                                            label="OI AV"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container> 
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
    name: 'historiasClinicas',
    props:["id"],
    data(){
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                {
                    text: 'Registro',
                    align: 'start',
                    sortable: false,
                    value: 'register',
                },
                {
                    text: 'Motivo de consulta',
                    align: 'start',
                    sortable: false,
                    value: 'motivoConsulta',
                },
                { 
                    text: 'Opciones', 
                    value: 'actions', 
                    sortable: false 
                },
            ],
            editedItem: {
                motivoConsulta: '',
                antecedentesGenerales: '',
                antecedentesOculares: '',
                esferaOd: '',
                cilindroOd: '',
                ejeOd: '',
                addOd: '',
                esferaOi: '',
                cilindroOi: '',
                ejeOi: '',
                addOi: '',
                tipo: '',
                tiempoUso: '',
                lejosOD2001: '',
                cercaOD2001: '',
                phOD2001: '',
                lejosOI2001: '',
                cercaOI2001: '',
                phOI2001: '',
                lejosOD2002: '',
                cercaOD2002: '',
                phOD2002: '',
                lejosOI2002: '',
                cercaOI2002: '',
                phOI2002: '',
                biomicroscopiaOD: '',
                biomicroscopiaOI: '',
                querimetriaODDecimal1: '',
                querimetriaODDecimal2: '',
                querimetriaODNumero: '',
                queratometriaOIDecimal1: '',
                queratometriaOIDecimal2: '',
                queratometriaOINumero: '',
                retinoscopiaODEsfera: '',
                retinoscopiaODCilindro: '',
                retinoscopiaODEje: '',
                retinoscopiaODAdd: '',
                retinoscopiaODAv: '',
                retinoscopiaOIEsfera: '',
                retinoscopiaOICilindro: '',
                retinoscopiaOIEje: '',
                retinoscopiaOIAdd: '',
                retinoscopiaOIAv: '',
            },
            defaultItem: {
                motivoConsulta: '',
                antecedentesGenerales: '',
                antecedentesOculares: '',
                esferaOd: '',
                cilindroOd: '',
                ejeOd: '',
                addOd: '',
                esferaOi: '',
                cilindroOi: '',
                ejeOi: '',
                addOi: '',
                tipo: '',
                tiempoUso: '',
                lejosOD2001: '',
                cercaOD2001: '',
                phOD2001: '',
                lejosOI2001: '',
                cercaOI2001: '',
                phOI2001: '',
                lejosOD2002: '',
                cercaOD2002: '',
                phOD2002: '',
                lejosOI2002: '',
                cercaOI2002: '',
                phOI2002: '',
                biomicroscopiaOD: '',
                biomicroscopiaOI: '',
                querimetriaODDecimal1: '',
                querimetriaODDecimal2: '',
                querimetriaODNumero: '',
                queratometriaOIDecimal1: '',
                queratometriaOIDecimal2: '',
                queratometriaOINumero: '',
                retinoscopiaODEsfera: '',
                retinoscopiaOIEsfera: '',
                retinoscopiaODEje: '',
                retinoscopiaODAdd: '',
                retinoscopiaODAv: '',
                retinoscopiaODCilindro: '',
                retinoscopiaOICilindro: '',
                retinoscopiaOIEje: '',
                retinoscopiaOIAdd: '',
                retinoscopiaOIAv: '',
            },
            historiasClinicas: [],
            loadingClient: true,
            loadingHistoriasClinicas: true,
        }
    },
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'Nueva historia clínica' : 'Editar historia clínica'
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
        this.getHistoriasClinicas()
    },
    methods: {
        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.historiasClinicas[this.editedIndex], this.editedItem)
                this.editHistoriasClinicas(this.historiasClinicas[this.editedIndex])
            } else {
                this.addHistoriasClinicas(this.editedItem)
            }
            this.dialog = false
            this.close()
        },
        editItem (item) {
            this.editedIndex = this.historiasClinicas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        async addHistoriasClinicas(item) {
            try {
                // if(item.motivoConsulta) {
                    await db.collection('historiasClinicas').add({
                        motivoConsulta: item.motivoConsulta,
                        antecedentesGenerales: item.antecedentesGenerales,
                        antecedentesOculares: item.antecedentesOculares,
                        esferaOd: item.esferaOd,
                        cilindroOd: item.cilindroOd,
                        ejeOd: item.ejeOd ,
                        addOd: item.addOd ,
                        esferaOi: item.esferaOi ,
                        cilindroOi: item.cilindroOi ,
                        ejeOi: item.ejeOi ,
                        addOi: item.addOi ,
                        tipo: item.tipo ,
                        tiempoUso: item.tiempoUso ,
                        lejosOD2001: item.lejosOD2001,
                        cercaOD2001: item.cercaOD2001,
                        phOD2001: item.phOD2001,
                        lejosOI2001: item.lejosOI2001,
                        cercaOI2001: item.cercaOI2001,
                        phOI2001: item.phOI2001,
                        lejosOD2002: item.lejosOD2002,
                        cercaOD2002: item.cercaOD2002,
                        phOD2002: item.phOD2002,
                        lejosOI2002: item.lejosOI2002,
                        cercaOI2002: item.cercaOI2002,
                        phOI2002: item.phOI2002,
                        biomicroscopiaOD: item.biomicroscopiaOD,
                        biomicroscopiaOI: item.biomicroscopiaOI,
                        querimetriaODDecimal1: item.querimetriaODDecimal1,
                        querimetriaODDecimal2: item.querimetriaODDecimal2,
                        querimetriaODNumero: item.querimetriaODNumero,
                        queratometriaOIDecimal1: item.queratometriaOIDecimal1,
                        queratometriaOIDecimal2: item.queratometriaOIDecimal2,
                        queratometriaOINumero: item.queratometriaOINumero,
                        retinoscopiaODEsfera: item.retinoscopiaODEsfera,
                        retinoscopiaODCilindro: item.retinoscopiaODCilindro,
                        retinoscopiaODEje: item.retinoscopiaODEje,
                        retinoscopiaODAdd: item.retinoscopiaODAdd,
                        retinoscopiaODAv: item.retinoscopiaODAv,
                        retinoscopiaOIEsfera: item.retinoscopiaOIEsfera,
                        retinoscopiaOICilindro: item.retinoscopiaOICilindro,
                        retinoscopiaOIEje: item.retinoscopiaOIEje,
                        retinoscopiaOIAdd: item.retinoscopiaOIAdd,
                        retinoscopiaOIAv: item.retinoscopiaOIAv,
                        register: this.submitableRegisterDateTime,
                        uid: this.id,
                    })
                    this.getHistoriasClinicas()
                    // this.certificado = null
                // }
            } catch (error) {
                console.error(error)
            }
        },

        async editHistoriasClinicas (data) {
            console.log(data.id)
            try {
                await db.collection('historiasClinicas').doc(data.id).update({
                    motivoConsulta: data.motivoConsulta,
                    antecedentesGenerales: data.antecedentesGenerales,
                    antecedentesOculares: data.antecedentesOculares,
                    esferaOd: data.esferaOd,
                    cilindroOd: data.cilindroOd,
                    ejeOd: data.ejeOd,
                    addOd: data.addOd,
                    esferaOi: data.esferaOi,
                    cilindroOi: data.cilindroOi,
                    ejeOi: data.ejeOi,
                    addOi: data.addOi,
                    tipo: data.tipo,
                    tiempoUso: data.tiempoUso,
                    lejosOD2001: data.lejosOD2001,
                    cercaOD2001: data.cercaOD2001,
                    phOD2001: data.phOD2001,
                    lejosOI2001: data.lejosOI2001,
                    cercaOI2001: data.cercaOI2001,
                    phOI2001: data.phOI2001,
                    lejosOD2002: data.lejosOD2002,
                    cercaOD2002: data.cercaOD2002,
                    phOD2002: data.phOD2002,
                    lejosOI2002: data.lejosOI2002,
                    cercaOI2002: data.cercaOI2002,
                    phOI2002: data.phOI2002,
                    biomicroscopiaOD: data.biomicroscopiaOD,
                    biomicroscopiaOI: data.biomicroscopiaOI,
                    querimetriaODDecimal1: data.querimetriaODDecimal1,
                    querimetriaODDecimal2: data.querimetriaODDecimal2,
                    querimetriaODNumero: data.querimetriaODNumero,
                    queratometriaOIDecimal1: data.queratometriaOIDecimal1,
                    queratometriaOIDecimal2: data.queratometriaOIDecimal2,
                    queratometriaOINumero: data.queratometriaOINumero,
                    retinoscopiaODEsfera: data.retinoscopiaODEsfera,
                    retinoscopiaODCilindro: data.retinoscopiaODCilindro,
                    retinoscopiaODEje: data.retinoscopiaODEje,
                    retinoscopiaODAdd: data.retinoscopiaODAdd,
                    retinoscopiaODAv: data.retinoscopiaODAv,
                    retinoscopiaOIEsfera: data.retinoscopiaOIEsfera,
                    retinoscopiaOICilindro: data.retinoscopiaOICilindro,
                    retinoscopiaOIEje: data.retinoscopiaOIEje,
                    retinoscopiaOIAdd: data.retinoscopiaOIAdd,
                    retinoscopiaOIAv: data.retinoscopiaOIAv,
                    register: this.submitableRegisterDateTime,
                })
                this.getHistoriasClinicas()
            } catch (error) {
                console.log(error)
            }
        },

        deleteItem (item) {
            this.editedIndex = this.historiasClinicas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm () {
            try {
                await db.collection('historiasClinicas').doc(this.editedItem.id).delete()
                this.getHistoriasClinicas()
                this.closeDelete()
            } catch (error) {
                console.log(error)
            }
            this.getHistoriasClinicas()
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

        async getHistoriasClinicas() {
            const snapshot = await db.collection('historiasClinicas').where('uid', '==', this.id).get();
            const historiasClinicas = []
            snapshot.forEach(doc => {
                // console.log(doc.data())
                let historiasClinicasData = doc.data()
                historiasClinicasData.id = doc.id
                const register = new Date(historiasClinicasData.register.seconds * 1000)
                historiasClinicas.push({
                    id: historiasClinicasData.id,
                    motivoConsulta: historiasClinicasData.motivoConsulta,
                    antecedentesGenerales: historiasClinicasData.antecedentesGenerales,
                    antecedentesOculares: historiasClinicasData.antecedentesOculares,
                    esferaOd: historiasClinicasData.esferaOd,
                    cilindroOd: historiasClinicasData.cilindroOd,
                    ejeOd: historiasClinicasData.ejeOd,
                    addOd: historiasClinicasData.addOd,
                    esferaOi: historiasClinicasData.esferaOi,
                    cilindroOi: historiasClinicasData.cilindroOi,
                    ejeOi: historiasClinicasData.ejeOi,
                    addOi: historiasClinicasData.addOi,
                    tipo: historiasClinicasData.tipo,
                    tiempoUso: historiasClinicasData.tiempoUso,
                    lejosOD2001: historiasClinicasData.lejosOD2001,
                    cercaOD2001: historiasClinicasData.cercaOD2001,
                    phOD2001: historiasClinicasData.phOD2001,
                    lejosOI2001: historiasClinicasData.lejosOI2001,
                    cercaOI2001: historiasClinicasData.cercaOI2001,
                    phOI2001: historiasClinicasData.phOI2001,
                    lejosOD2002: historiasClinicasData.lejosOD2002,
                    cercaOD2002: historiasClinicasData.cercaOD2002,
                    phOD2002: historiasClinicasData.phOD2002,
                    lejosOI2002: historiasClinicasData.lejosOI2002,
                    cercaOI2002: historiasClinicasData.cercaOI2002,
                    phOI2002: historiasClinicasData.phOI2002,
                    biomicroscopiaOD: historiasClinicasData.biomicroscopiaOD,
                    biomicroscopiaOI: historiasClinicasData.biomicroscopiaOI,
                    querimetriaODDecimal1: historiasClinicasData.querimetriaODDecimal1,
                    querimetriaODDecimal2: historiasClinicasData.querimetriaODDecimal2,
                    querimetriaODNumero: historiasClinicasData.querimetriaODNumero,
                    queratometriaOIDecimal1: historiasClinicasData.queratometriaOIDecimal1,
                    queratometriaOIDecimal2: historiasClinicasData.queratometriaOIDecimal2,
                    queratometriaOINumero: historiasClinicasData.queratometriaOINumero,
                    retinoscopiaODEsfera: historiasClinicasData.retinoscopiaODEsfera,
                    retinoscopiaODCilindro: historiasClinicasData.retinoscopiaODCilindro,
                    retinoscopiaODEje: historiasClinicasData.retinoscopiaODEje,
                    retinoscopiaODAdd: historiasClinicasData.retinoscopiaODAdd,
                    retinoscopiaODAv: historiasClinicasData.retinoscopiaODAv,
                    retinoscopiaOIEsfera: historiasClinicasData.retinoscopiaOIEsfera,
                    retinoscopiaOICilindro: historiasClinicasData.retinoscopiaOICilindro,
                    retinoscopiaOIEje: historiasClinicasData.retinoscopiaOIEje,
                    retinoscopiaOIAdd: historiasClinicasData.retinoscopiaOIAdd,
                    retinoscopiaOIAv: historiasClinicasData.retinoscopiaOIAv,
                    // certificate: certificateData.certificate,
                    uid: historiasClinicasData.uid,
                    register: moment(register).format('DD-MM-YYYY'),
                })
            })
            this.historiasClinicas = historiasClinicas
            this.loadingHistoriasClinicas = false
        },
    },
    
}
</script>
