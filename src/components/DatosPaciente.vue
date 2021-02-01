<template>
    <v-row class="fill-height secondary px-3 py-3">
        <v-col cols="12">
            <h2>Datos del paciente</h2>
        </v-col>
        <v-col v-if="dataClient === true">
            <v-progress-circular
                :size="50"
                color="red"
                indeterminate
            ></v-progress-circular>
        </v-col>
        
        <template v-else>
            <v-col>
                <b>Nombre:</b> <br> {{ fullName }} 
            </v-col>
            <v-col>
                <b>RUN:</b> <br> {{ client.run }} 
            </v-col>
            <v-col>
                <b>E-mail:</b> <br> {{ client.email }} 
            </v-col>
            <v-col>
                <b>Teléfono:</b> <br> {{ client.phone }} 
            </v-col>
            <v-col>
                <b>Profesión:</b> <br> {{ client.profession }} 
            </v-col>
            <v-col>
                <b>Ciudad:</b> <br> {{ client.city }} 
            </v-col>
            <v-col>
                <b>Dirección:</b> <br> {{ client.address }} 
            </v-col>
            <v-col>
                <b>Edad:</b> <br> {{ edad }} 
            </v-col>
        </template>
    </v-row>
</template>

<script>
import {db} from "../main"
import moment from 'moment'

export default {
    name: 'Datos',
    props:["id"],
    data: () => ({
        idClient: '',
        client: [],
        dataClient: true,
    }),
    created () {
        this.idClient = this.$route.params.id;

        this.getClient()
    },

    computed: {
        fullName () {
            return this.client.name + ' ' + this.client.lastName
        },

        edad () {
            return moment().diff(this.client.birthdate, 'years')
        },

    },

    methods: {
        async getClient() {
            try {
                const doc = await db.collection('clients').doc(this.idClient).get();
                let clientData = doc.data()
                clientData.id = doc.id
                this.client = {...clientData, birthdate:  moment(new Date(clientData.birthdate.seconds * 1000)).format('yyyy-MM-DD') }

                this.dataClient = false
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>