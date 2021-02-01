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
                            Nueva receta
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
                        <v-toolbar-title>Nueva receta</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn
                            dark
                            text
                            @click="dialog = false"
                            >
                            Guardar
                            </v-btn>
                        </v-toolbar-items>
                        </v-toolbar>
                        
                        <v-subheader>Hola mundo!</v-subheader>
                    </v-card>


                </v-dialog>
            </v-toolbar>
        </template>
    </v-data-table>
  </v-card>
</template>

<script>
// import {db} from "../main"
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
        }
    },
}
</script>