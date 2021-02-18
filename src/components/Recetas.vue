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
			<!-- opciones -->
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
								@click="closeDialog()"
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
								<v-form class="mt-16  " v-model="info.valid">
									<v-container class="">
										<!-- Ojo Derecho -->
										<h2 class=" ">OD</h2>
										<v-row>
											<!-- Esfera -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OD_esfera"
													label="Esfera"
													required
												></v-text-field>
											</v-col>
											<!-- cilindro -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OD_cilindro"
													label="Cilindro"
													required
												></v-text-field>
											</v-col>
											<!-- Eje -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OD_eje"
													label="Eje"
													required
												></v-text-field>
											</v-col>
											<!-- Add -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OD_add"
													label="add"
													required
												></v-text-field>
											</v-col>
											<!-- 20/-->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OD_20"
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
													v-model="info.OI_esfera"
													label="Esfera"
													required
												></v-text-field>
											</v-col>
											<!-- cilindro -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OI_cilindro"
													label="Cilindro"
													required
												></v-text-field>
											</v-col>
											<!-- Eje -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OI_eje"
													label="Eje"
													required
												></v-text-field>
											</v-col>
											<!-- Add -->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OI_add"
													label="add"
													required
												></v-text-field>
											</v-col>
											<!-- 20/-->
											<v-col
												cols="2"
											>
												<v-text-field
													v-model="info.OI_20"
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
													v-model="info.estadoMotor"
													label="Estado Motor"
													required/>
											</v-col>
											<!-- Segmento Anterior -->
											<v-col cols="3">
												<v-text-field
													v-model="info.segmentoAnterior"
													label="Segmento Anterior"
													required/>
											</v-col>
											<!-- Fondo de Ojo -->
											<v-col cols="3">
												<v-text-field
													v-model="info.fondoDeOjo"
													label="Fondo de Ojo"
													required/>
											</v-col>
										</v-row>

										<!-- Generales Grupo2-->
										<v-row>
											<!-- Uso de Anteojos -->
											<v-col cols="3">
												<v-text-field
													v-model="info.usoDeAnteojos"
													label="Uso de Anteojos"
													required/>
											</v-col>
											<!-- Tipo de Lente Sugerido -->
											<v-col cols="3">
												<v-text-field
													v-model="info.tipoDeLenteSugerido"
													label="Tipo de Lente Sugerido"
													required/>
											</v-col>
											<!-- Distancia Pupilar -->
											<v-col cols="3">
												<v-text-field
													v-model="info.distanciaPupilar"
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
											v-model="info.observaciones"/>
									<!-- Control -->
									<v-textarea
											outlined
											name="input-7-4"
											label="Control"
											v-model="info.control"/>
								</v-form>
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
		<v-dialog v-model="dialogDelete" max-width="500px">
				<v-card>
						<v-card-title class="headline">¿Estás seguro que quieres eliminarlo?</v-card-title>
						<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="dialogDelete=false">Cancelar</v-btn>
						<v-btn color="red darken-2" text @click="deleteItemConfirm">Borrar</v-btn>
						<v-spacer></v-spacer>
						</v-card-actions>
				</v-card>
		</v-dialog>
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
      headers: 
			[
				{ text: 'Registro', value: 'register'},
				{ text: 'ID', value: 'id'},
				{ text: 'Opciones', value: 'actions',sortable: false}
      ],
      recetas: [],
      dialog: false,
			dialogDelete:false,
			selectedId:null,
			valid:true,

			info:{},
			defaultInfo:{
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
			},			
    }
  },
	created(){
		this.clearInfo()
		this.getPrescriptions()
	},
	methods:{
		save(){
			if(!this.selectedId){
				//crea uno nuevo
				db.collection("prescriptions").add(
					{
						...this.info,
						uid:this.$store.state.currentUser.uid,
						register:firebase.firestore.FieldValue.serverTimestamp()
					})
				.then(()=>{
					this.getPrescriptions()
					this.clearInfo()
					this.dialog = false
				})
			}else{
				//edita
				db.collection("prescriptions").doc(this.selectedId).update({
					...this.info,
					uid:this.$store.state.currentUser.uid,
					register:firebase.firestore.FieldValue.serverTimestamp()
				})
				.then(()=>{
					this.getPrescriptions()
					this.clearInfo()
					this.dialog = false
				})
			}
		},
		getPrescriptions(){
			this.recetas=[]
			db.collection("prescriptions")
			.orderBy("register","desc")
			.get()
			.then(data=>{
				data.forEach(item=>{
					this.recetas.push({
						id:item.id,
						register:this.formatedDate(item.data().register) 
					})
				})
			})
		},
		deleteItem(item){
			this.selectedId=item.id
			this.dialogDelete=true
		},
		deleteItemConfirm(){
			db.collection("prescriptions")
			.doc(this.selectedId).delete()
			.then(()=>{
				this.dialogDelete=false
				this.clearInfo()
				this.getPrescriptions()
			})
			.catch(e=>console.error(e))
		},	
		editItem(item){
			db.collection("prescriptions").doc(item.id).get()
			.then(data=>{
				this.selectedId=item.id
				this.info={...data.data()}
				this.dialog=true
			})
			.catch(e=>console.error(e))
		},
		clearInfo(){
			this.info={...this.defaultInfo}
			this.selectedId=null
		},
		closeDialog(){
			this.dialog = false 
			this.clearInfo()
		},
		formatedDate(firebaseTimeStamp){
			const date= new Date(firebaseTimeStamp.seconds*1000)
			const year=date.getFullYear()
			const month=("00" + date.getMonth()).slice(-2)
			const day=("00" + date.getDate()).slice(-2)
			const hours=("00" + date.getHours()).slice(-2)
			const minutes=("00" + date.getMinutes()).slice(-2)
			const seconds=("00" + date.getSeconds()).slice(-2)

			return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}` 
		}
	}
}
</script>