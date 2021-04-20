<template>
	<div>
		<v-btn elevation="2" @click="printData" class="my-6">Imprimir</v-btn>
		<div ref="printable" class="printableArea">
			<!-- main info -->
			<div class="section">
				<div class="mainContainer">
					<img src="../assets/logo.png" alt="Logo Jadue Rodriguez" />
					<div class="mainInfo">
						<span>RUT: 76.733.755-8</span>
						<span>Dir: Roca 974, Punta Arenas,Ramirez 370, Puerto Natales</span>
						<span>Tel: 940123737</span>
					</div>
				</div>
				<div class="mainContainer">
					<span>ID: {{ idProcedure }}</span>
					<div class="clientInfo">
						<span>Paciente:</span>
						<div>
							<label>Nombre:</label
							><span
								>{{ data.clientInfo && data.clientInfo.name }}
								{{ data.clientInfo && data.clientInfo.lastName }}</span
							>
						</div>
						<div>
							<label>RUT:</label
							><span>{{ data.clientInfo && data.clientInfo.run }}</span>
						</div>
						<div>
							<label>Fecha:</label><span>{{ dateFormat(data.register) }}</span>
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
							<th>Add</th>
							<th>20/</th>
						</tr>
						<tr>
							<td>OD</td>
							<td>{{ data.OD_esfera }}</td>
							<td>{{ data.OD_cilindro }}</td>
							<td>{{ data.OD_eje }}</td>
							<td>{{ data.OD_add }}</td>
							<td>{{ data.OD_20 }}</td>
						</tr>
						<tr>
							<td>OI</td>
							<td>{{ data.OI_esfera }}</td>
							<td>{{ data.OI_cilindro }}</td>
							<td>{{ data.OI_eje }}</td>
							<td>{{ data.OI_add }}</td>
							<td>{{ data.OI_20 }}</td>
						</tr>
					</table>

					<div>
						<div>
							<label>Estado notor:</label>
							<span>{{ data.estadoMotor }}</span>
						</div>
						<div>
							<label>Segmento anterior:</label>
							<span>{{ data.segmentoAnterior }}</span>
						</div>
						<div>
							<label>Fondo de ojo:</label>
							<span>{{ data.fondoDeOjo }}</span>
						</div>
						<div>
							<label>Uso de anteojos:</label>
							<span>{{ data.usoDeAnteojos }}</span>
						</div>
						<div>
							<label>Tipo de lente sugerido:</label>
							<span>{{ data.tipoDeLenteSugerido }}</span>
						</div>
						<div>
							<label>Distancia Pupilar:</label>
							<span>{{ data.distanciaPupilar }}</span>
						</div>
						<div>
							<label>Observaciones:</label>
							<span>{{ data.observaciones }}</span>
						</div>
						<div>
							<label>Control:</label>
							<span>{{ data.control }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<img src="../assets/signature.png" alt="Firma" />
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
		printData() {
			print(this.$refs.printable);
		},
	},
};
</script>

<style scoped>
.printableArea {
	display: flex;
	flex-direction: column;
	padding: 10px;
	width: 14.5cm;
	height: 20cm;
	color: #444444;
}
.printableArea img {
	object-fit: cover;
	width: 150px;
}
.section {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px;
	border: solid 1px black;
	border-radius: 10px;
	margin: 0 0 10px 0;
}
.mainContainer {
	padding: 15px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.mainInfo {
	font-size: 0.6em;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.clientInfo label {
	font-size: 0.8em;
}

table * {
	background-color: rgb(192, 192, 192);
	padding: 0px 5px;
	width: 70px;
	text-align: center;
}
table th {
	border-radius: 15px 15px 0 0;
	padding: 5px 5px;
}
.prescriptcion_section-lentes {
	padding: 20px 0px;
}
</style>
