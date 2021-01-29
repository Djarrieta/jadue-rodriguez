<template>
  <v-main>
    <v-card width="500" class="mx-auto mt-9 d-flex flex-column">
      <v-card-title>INGRESO</v-card-title>
      <v-card-text >
        <!-- Correo -->
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          append-icon="mdi-email"
        ></v-text-field>
         <!-- Contraseña -->
          <v-text-field
            v-model="password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[passRules.required, passRules.min]"
            :type="!passRules ? 'text' : 'password'"
            name="input-10-1"
            label="Contraseña"
            hint="At least 8 characters"
            counter
            @click="showPass = !showPass"
          ></v-text-field>
      </v-card-text>
        <v-btn 
          @click="login()"
          class="pa-1 mx-4 mb-1 primary">
          Ingresar
        </v-btn>
        <v-btn
          small
          text
          tile
          class="mb-6"
        >Olvidé mi contraseña</v-btn>
    </v-card>
  </v-main>
</template>

<script>
import firebase from "firebase"
  export default {
    name: 'Ingreso',
    data: () => ({
      valid: false,
      showPass:true,
      email: '',
      password: '',
      problems:null,

      emailRules: [
        v => !!v || 'Se necesita un correo.',
        v => /.+@.+/.test(v) || 'El formato del correo no está bien.',
      ],
      passRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => (`The email and password you entered don't match`),
      },
    }),
    methods:{
    login(){
      this.problems=null;
      if(!this.password){this.problems="La contraseña no puede estar vacía."}
      if(this.problems){return}
      firebase.auth()
      .signInWithEmailAndPassword(this.email,this.password)
      .then(()=>{
        this.problems = null
      })
      .catch(e=>{
        console.error(e)
        if(e.code==="auth/argument-error"){this.problems="Datos inválidos."}
        if(e.code==="auth/invalid-email"){this.problems="Correo electrónico inválido."}
        if(e.code==="auth/user-not-found"){this.problems="El correo ingresado no existe."}
        if(e.code==="auth/wrong-password"){this.problems="Contraseña incorrecta."}
      })
    },
    },
  }
</script>
