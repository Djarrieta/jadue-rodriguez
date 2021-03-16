<template>
	<nav>
		<!-- Header -->
		<v-toolbar color="grey--text">
			<!-- Botón Menu -->
			<v-btn @click="principalMenu = !principalMenu" text>
				<v-icon>mdi-menu</v-icon>
			</v-btn>
			<!-- Nombre Empresa -->
			<v-toolbar-title class="mx-2">
				Jadue Rodriguez
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<!-- Perfil -->
			<v-menu offset-y>
				<!-- Botón e ícono -->
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon v-if="$store.state.currentUser" large color="primary">
							mdi-account-circle</v-icon
						>
						<v-icon v-else large> mdi-account-circle-outline</v-icon>
					</v-btn>
				</template>
				<!-- Opciones Usuario -->
				<v-list>
					<v-list-item class="d-flex flex-column">
						<!-- Perfil -->
						<v-list-item-title>
							<v-btn text>
								<router-link to="/perfil">Perfil</router-link>
							</v-btn>
						</v-list-item-title>
						<!-- Salir -->
						<v-list-item-title>
							<v-btn @click="signOut()" text>
								Salir
							</v-btn>
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-toolbar>
		<!-- Menú principal -->
		<v-navigation-drawer
			v-model="principalMenu"
			color="primary"
			absolute
			bottom
			temporary
		>
			<v-list nav>
				<v-list-item
					v-for="(item, n) in principalMenuItems"
					:key="n"
					:to="item.route"
				>
					<v-list-item>
						<v-list-item-icon>
							<v-icon class="white--text"> {{ item.icon }} </v-icon>
						</v-list-item-icon>
						<v-list-item-title class="white--text">
							{{ item.text }}
						</v-list-item-title>
					</v-list-item>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<!-- Alertas -->
		<v-alert
			v-if="$store.state.alert.text"
			:type="$store.state.alert.icon"
			transition="scale-transition"
			absolute
			dense
		>
			{{ $store.state.alert.text }}
		</v-alert>
	</nav>
</template>

<script>
import firebase from "firebase";
export default {
	name: "Header",
	data: () => ({
		principalMenu: false,
		principalMenuItems: [
			{
				icon: "mdi-calendar",
				text: "Agenda",
				route: "/agenda",
			},
			{
				icon: "mdi-account-supervisor-outline",
				text: "Usuarios",
				route: "/usuarios",
			},
			{
				icon: "mdi-medical-bag",
				text: "Pacientes",
				route: "/pacientes",
			},
		],
	}),
	watch: {
		"$store.state.currentUser"(u) {
			/* Este watcher cambia la ruta una vez carga firebase y el estado de vuex, porque ambos se demoran en responder */
			if (u && u.uid && this.$route.path != "/agenda") {
				this.$router.replace("/agenda");
			} else if (this.$route.path != "/") {
				this.$router.replace("/");
			}
		},
		/* Desaparece automáticamente el mensaje de error */
		"$store.state.alert.text"() {
			setTimeout(() => {
				this.$store.state.alert = {
					text: null,
					icon: "success",
				};
			}, 2000);
		},
	},
	methods: {
		signOut() {
			firebase
				.auth()
				.signOut()
				.catch((e) => {
					console.error(e);
				});
		},
	},
};
</script>
