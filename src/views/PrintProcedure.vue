<template>
	<div>
		<v-btn elevation="2" @click="printData" class="my-6">Imprimir</v-btn>
		<div ref="printable" class="printableArea">
			<!-- main info -->
			<div class="section">
				<div class="headerContainer">
					<img src="../assets/logo.png" alt="Logo Jadue Rodriguez" />
					<div class="mainInfo">
						<span>RUT: 76.733.755-8</span>
						<span>Dir: Roca 974, Punta Arenas</span>
						<span>Ramirez 370, Puerto Natales</span>
						<span>Tel: 940123737</span>
					</div>
				</div>
				<div class="mainContainer">
					<!-- <span>ID: {{ idProcedure }}</span> -->
					<div class="clientInfo">
						<div>
							<label>Nombre: </label>
							<span>
								{{ data.clientInfo && data.clientInfo.name }}
								{{ data.clientInfo && data.clientInfo.lastName }}
							</span>
						</div>
						<div>
							<label>RUT: </label>
							<span>{{ data.clientInfo && data.clientInfo.run }}</span>
						</div>
						<div>
							<label>Fecha: </label>
							<span>{{ dateFormat(data.register) }}</span>
						</div>
					</div>
					<div class="clientInfo">
						<div>
							<label for="">Edad: </label>
							<span>{{ ageClient(data.clientInfo.birthdate) }}</span>
						</div>
					</div>
				</div>
			</div>
			<!-- prescriptions -->
			<div v-if="data.typePrescription === 'Lentes'" class="section">
				<div class="prescriptcion_section-lentes">
					<span>RP</span>
					<table>
						<tr>
							<th></th>
							<th>Esfera</th>
							<th>Cilindro</th>
							<th>Eje</th>
							<!-- <th>Add</th>
							<th>20/</th> -->
						</tr>
						<tr>
							<td>OD</td>
							<td>{{ data.OD_esfera }}</td>
							<td>{{ data.OD_cilindro }}</td>
							<td>{{ data.OD_eje }}</td>
							<!-- <td>{{ data.OD_add }}</td>
							<td>{{ data.OD_20 }}</td> -->
						</tr>
						<tr>
							<td>OI</td>
							<td>{{ data.OI_esfera }}</td>
							<td>{{ data.OI_cilindro }}</td>
							<td>{{ data.OI_eje }}</td>
							<!-- <td>{{ data.OI_add }}</td>
							<td>{{ data.OI_20 }}</td> -->
						</tr>
					</table>

					<div>
						<div>
							<label>Estado notor: </label>
							<span>{{ data.estadoMotor }}</span>
						</div>
						<div>
							<label>Segmento anterior: </label>
							<span>{{ data.segmentoAnterior }}</span>
						</div>
						<div>
							<label>Fondo de ojo: </label>
							<span>{{ data.fondoDeOjo }}</span>
						</div>
						<div>
							<label>Uso de anteojos: </label>
							<span>{{ data.usoDeAnteojos }}</span>
						</div>
						<div>
							<label>Tipo de lente sugerido: </label>
							<span>{{ data.tipoDeLenteSugerido }}</span>
						</div>
						<div>
							<label>Distancia Pupilar: </label>
							<span>{{ data.distanciaPupilar }}</span>
						</div>
						<div>
							<label>Observaciones: </label>
							<span>{{ data.observaciones }}</span>
						</div>
						<div>
							<label>Control: </label>
							<span>{{ data.control }}</span>
						</div>
					</div>
				</div>
			</div>

			<div v-if="data.typePrescription === 'Gotas'" class="section">
				<div class="prescriptcion_section-gotas">
					<div class="infoContainer">
						<p v-if="data.diagnosticoGotas">
							<label>Diagnóstico: </label>
							<span>{{ data.diagnosticoGotas }}</span>
						</p>
						<p v-if="data.tratamientoGotas">
							<label>Tratamiento: </label>
							<span>{{ data.tratamientoGotas }}</span>
						</p>
						<p v-if="data.medicamentosGotas">
							<label>Medicamentos: </label>
							<span>{{ data.medicamentosGotas }}</span>
						</p>
						<p v-if="data.recomendacionesGotas">
							<label>Recomendaciones: </label>
							<span>{{ data.recomendacionesGotas }}</span>
						</p>
						<p v-if="data.controlGotas">
							<label>Control: </label>
							<span>{{ data.controlGotas }}</span>
						</p>
					</div>
				</div>
			</div>

			<div class="firma">
				<label for="">Firma</label>
			</div>
		</div>
	</div>
</template>

<script>
import { db } from "../main";
import print from "ink-html";
export default {
	data() {
		return {
			idProcedure: null,
			data: {},
		};
	},
	created() {
		this.idProcedure = this.$route.params.idProcedure;
		db.collection("prescriptions")
			.doc(this.idProcedure)
			.get()
			.then((result) => {
				this.data = result.data();
				db.collection("clients")
					.doc(this.data.idClient)
					.get()
					.then((clientInfo) => {
						this.data = { ...this.data, clientInfo: clientInfo.data() };
					})
					.catch((e) => console.error(e));
			})
			.catch((e) => console.error(e));
	},
	methods: {
		dateFormat(firebaseTimestamp) {
			const date = new Date(firebaseTimestamp.seconds * 1000);
			const day = date.getDate();
			const month = date.getMonth();
			const year = date.getFullYear();

			return `${day}/${month}/${year}`;
		},

		ageClient(birthdate) {
			var today = new Date();
			var birthDateInfo = new Date(birthdate.seconds * 1000);
			var age = today.getFullYear() - birthDateInfo.getFullYear();
			var m = today.getMonth() - birthDateInfo.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDateInfo.getDate())) 
			{
				age--;
			}
			return age
		},

		printData() {
			print(this.$refs.printable);
		},
	},

};
</script>

<style scoped>
.printableArea {
	-webkit-print-color-adjust: exact !important;
	display: flex;
	flex-direction: column;
	padding: 10px;
	width: 14.5cm;
	height: 20cm;
	color: #444444;
	font-size: 16px;
}
.printableArea img {
	object-fit: cover;
	width: 150px;
}
.section {
	align-items: center;
	padding: 10px;
	border: solid 1px black;
	border-radius: 10px;
	margin: 0 0 10px 0;
}
.mainContainer {
	padding: 15px;
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
}

.infoContainer {
	padding: 15px;
	width: 100%;
}

.infoContainer label {
	font-size: 1em;
}

.infoContainer p {
	margin-bottom: 0.5em;
}

.headerContainer {
	padding: 15px;
	display: flex;
	justify-content: space-between;
}

.mainInfo {
	font-size: 1em;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.clientInfo {
	margin-bottom: 0.4em;
}

.clientInfo label {
	font-size: 1em;
}

table {
	padding: 0px 5px;
	width: 70px;
	text-align: center;
	margin-bottom: 0.3em;
}
table th {
	background-color: #3737bd;
	color: white;
	padding: 0.5em 1.5em;
	border-radius: 10px 10px 0 0;
}

table th:nth-child(1) {
	background-color: white;
	border-radius: 0;
}


table tr td:nth-child(1) {
	background-color: #3737bd;
	color: white;
	/* border: 12px solid white; */
	border-right: #3737bd;
	padding: 0 1em;
	border-radius: 20px 0 0 20px;
}

table tr td:not(:first-of-type) {
	background-color:rgb(230, 224, 224);
	color: #3737bd;
	/* border-radius: 20px; */
	padding: 0.5em 0;
	margin: 0 1em;
	border: 2px solid white;
}

label {
	font-weight: bold;
}


.prescriptcion_section-lentes {
	padding: 5px 0px;
}

.firma {
	text-align: center;
	padding-top: 3rem;
}

</style>
