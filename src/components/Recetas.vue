<template>
  <v-card>
		<v-card-title>
			RECETAS
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
    :items="recetas"
    :search="search"
    :items-per-page="5">
    <template v-slot:top>
      <v-toolbar flat>
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Nueva receta
            </v-btn>
          </template>

          <v-card >
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
            <v-toolbar-title>Nueva receta</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
              dark
              text
              @click="save()"
              >
              Guardar
              </v-btn>
            </v-toolbar-items>
            </v-toolbar>
            <!-- Formulario Recetas -->
            <v-subheader  class="mt-16 pt-16">
							<v-form class="mt-16  pt-16" v-model="valid">
								<v-container class="mt-16 pt-16">
									<!-- Ojo Derecho -->
									<h2 class=" mt-16 pt-16">OD</h2>
									<v-row>
										<!-- Esfera -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OD_esfera"
												label="Esfera"
												required
											></v-text-field>
										</v-col>
										<!-- cilindro -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OD_cilindro"
												label="Cilindro"
												required
											></v-text-field>
										</v-col>
										<!-- Eje -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OD_eje"
												label="Eje"
												required
											></v-text-field>
										</v-col>
										<!-- Add -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OD_add"
												label="add"
												required
											></v-text-field>
										</v-col>
										<!-- 20/-->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OD_20"
												label="20/"
												required
											></v-text-field>
										</v-col>
									</v-row>

									<!-- Ojo Izquierdo -->
									<h2>OI</h2>
									<v-row>
										<!-- Esfera -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OI_esfera"
												label="Esfera"
												required
											></v-text-field>
										</v-col>
										<!-- cilindro -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OI_cilindro"
												label="Cilindro"
												required
											></v-text-field>
										</v-col>
										<!-- Eje -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OI_eje"
												label="Eje"
												required
											></v-text-field>
										</v-col>
										<!-- Add -->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OI_add"
												label="add"
												required
											></v-text-field>
										</v-col>
										<!-- 20/-->
										<v-col
											cols="2"
										>
											<v-text-field
												v-model="OI_20"
												label="20/"
												required
											></v-text-field>
										</v-col>
									</v-row>

									<!-- Generales Grupo1-->
									<h2>GENERALES</h2>
									<v-row>
										<!-- Estado Motor -->
										<v-col cols="3">
											<v-text-field
												v-model="estadoMotor"
												label="Estado Motor"
												required/>
										</v-col>
										<!-- Segmento Anterior -->
										<v-col cols="3">
											<v-text-field
												v-model="segmentoAnterior"
												label="Segmento Anterior"
												required/>
										</v-col>
										<!-- Fondo de Ojo -->
										<v-col cols="3">
											<v-text-field
												v-model="fondoDeOjo"
												label="Fondo de Ojo"
												required/>
										</v-col>
									</v-row>

									<!-- Generales Grupo2-->
									<v-row>
										<!-- Uso de Anteojos -->
										<v-col cols="3">
											<v-text-field
												v-model="usoDeAnteojos"
												label="Uso de Anteojos"
												required/>
										</v-col>
										<!-- Tipo de Lente Sugerido -->
										<v-col cols="3">
											<v-text-field
												v-model="tipoDeLenteSugerido"
												label="Tipo de Lente Sugerido"
												required/>
										</v-col>
										<!-- Distancia Pupilar -->
										<v-col cols="3">
											<v-text-field
												v-model="distanciaPupilar"
												label="Distancia Pupilar"
												required/>
										</v-col>
									</v-row>
								</v-container>
								<!-- Observaciones -->
								<v-textarea
										outlined
										name="input-7-4"
										label="Observaciones"
										v-model="observaciones"/>
								<!-- Control -->
								<v-textarea
										outlined
										name="input-7-4"
										label="Control"
										v-model="control"/>
							</v-form>
            </v-subheader>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
  </v-card>
</template>

<script>
 import {db} from "../main"
 import firebase from "firebase/app"
// import moment from 'moment'

export default {
  name: 'recetas',
  props:["id"],
  data(){
    return {
      search: '',
      headers: [
      {
        text: 'Item 1',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Item 2', value: 'calories' },
      ],
      recetas: [],
      dialog: false,
			

			valid:true,
			OD_esfera:null,
			OD_cilindro:null,
			OD_eje:null,
			OD_add:null,
			OD_20:null,
 
			OI_esfera:null,
			OI_cilindro:null,
			OI_eje:null,
			OI_add:null,
			OI_20:null,

			estadoMotor:null,
			segmentoAnterior:null,
			fondoDeOjo:null,

			usoDeAnteojos:null,
			tipoDeLenteSugerido:null,
			distanciaPupilar:null,

			observaciones:null,
			control:null,
    }
  },
	methods:{
		save(){
			db.collection("prescriptions").add({
				OD_esfera:this.OD_esfera,
				OD_cilindro:this.OD_cilindro,
				OD_eje:this.OD_eje,
				OD_add:this.OD_add,
				OD_20:this.OD_20,
	
				OI_esfera:this.OI_esfera,
				OI_cilindro:this.OI_cilindro,
				OI_eje:this.OI_eje,
				OI_add:this.OI_add,
				OI_20:this.OI_20,

				estadoMotor:this.estadoMotor,
				segmentoAnterior:this.segmentoAnterior,
				fondoDeOjo:this.fondoDeOjo,

				usoDeAnteojos:this.usoDeAnteojos,
				tipoDeLenteSugerido:this.tipoDeLenteSugerido,
				distanciaPupilar:this.distanciaPupilar,

				observaciones:this.observaciones,
				control:this.control,
				uid:this.$store.state.currentUser.uid,
				register:firebase.firestore.FieldValue.serverTimestamp()
			})
			.then(()=>{
				console.log("guardado")
				this.dialog = false
			})
			
		}
	}
}
</script>