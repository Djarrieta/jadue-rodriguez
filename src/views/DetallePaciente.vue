<template>
    <v-container>
        
        <v-row class="fill-height mt-3">
            <v-col>
                <h1 class="text-uppercase">Detalle de paciente</h1>
            </v-col>
        </v-row>

        <!-- Datos del paciente -->
        <template>
            <DatosPaciente :id="idClient"></DatosPaciente>
        </template>

        <!-- Botones -->
        <!-- <template>
            <v-row
                align="center"
                justify="space-around"
                class="mt-10"
            >
                <v-btn class="primary">Agenda</v-btn>
                <v-btn class="primary">Recetas</v-btn>
                <v-btn class="primary">Certificados</v-btn>
            </v-row>
        </template> -->

        <!-- Historias clínicas -->
        <template>
            <HistoriasClinicas class="mt-10" :id="idClient"></HistoriasClinicas>
        </template>

        <!-- Recetas -->
        <template>
            <Recetas class="mt-10" :id="idClient"></Recetas>
        </template>

        <!-- Certificados -->
        <template>
            <Certificados class="mt-10 mb-10" :id="idClient"></Certificados>
        </template>

    </v-container>
</template>

<script>
    import HistoriasClinicas from "@/components/HistoriasClinicas"
    import Recetas from "@/components/Recetas"
    import DatosPaciente from "@/components/DatosPaciente"
    import Certificados from "@/components/Certificados"

    export default {
        name: 'DetallePaciente',
        components: { HistoriasClinicas, Recetas, DatosPaciente, Certificados },

        data: () => ({
            idClient: '',
        }),
        
        created () {
            this.idClient = this.$route.params.id;
        },

        computed: {
            
        },

        methods: {
            
        }
    }
</script>