<template>
  <v-main>
    <v-card width="500" class="mx-auto mt-9 d-flex flex-column">
      <v-card-title>
        <v-icon 
          v-if="step>0"
          @click="step=0" 
          class="mr-2">mdi-arrow-left-bold</v-icon>
         {{ step>1 ? "CONFIGURACIÓN DE CONTRASEÑA" : "INGRESO" }} </v-card-title>
      <v-card-text >
        <!-- Correo -->
        <v-text-field
          v-if="step===0"
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          append-icon="mdi-email">
        </v-text-field>
        <!-- Contraseña -->
        <v-text-field
          v-if="step>0"
          v-model="password"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passRules.required, passRules.min]"
          :type="!passRules ? 'text' : 'password'"
          name="input-10-1"
          label="Contraseña"
          hint="At least 8 characters"
          counter
          @click="showPass = !showPass">
        </v-text-field>
        <!-- Confirmación -->
        <v-text-field
          v-if="step>1"
          v-model="confirmation"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passRules.required, passRules.min]"
          :type="!passRules ? 'text' : 'password'"
          name="input-10-1"
          label="Confirmación"
          hint="At least 8 characters"
          counter>
        </v-text-field>
      </v-card-text>
      <v-btn 
        @click="login()"
        class="pa-1 mx-4 mb-6 mb-1 primary">
        Ingresar
      </v-btn>
      <v-btn
        v-if="step===1"
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
import {db} from "@/main.js"
  export default {
    name: 'Ingreso',
    data: () => ({
      valid: false,
      showPass:true,
      email: '',
      password: '',
      confirmation:'',
      step:0,

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
      if(!this.email){
        this.$store.state.alert={
          text:"El correo electrónico no puede estar vacío.",
          icon:"error"
        }
        return
      }
      if(this.step===0){
        /* Primera verificación en firestore, rechaza si no está agregado en lista de usuarios*/
        let usersList=[]
        db.collection("users").get()
        .then((users)=>{users.forEach(user => {
          usersList.push(user.data())
        })})
        .then(()=>{
          const resultedUsers=
            usersList.filter(u=>{
              if(u.email===this.email){return true}})

          if(resultedUsers.length===0){
            /* Rechazo */
            this.$store.state.alert={
              text:"Tu cuenta no está registrada. Pídele a un miembro administrador del equipo que te agregue.",
              icon:"error"
            }

          }else{
            if(resultedUsers[0].verified){
              /* Ingreso */
              this.step=1
            }else{
              /* Registro */
              this.step=2
            }
          }
        })
      }else if(this.step===1){
        /* Verificación de contraseña en  auth: permite el ingreso*/
        if(!this.password){
            this.$store.state.alert={
              text:"La contraseña no puede estar vacía.",
              icon:"error"
            }
            return
        }
        firebase.auth()
        .signInWithEmailAndPassword(this.email,this.password)

        .catch(e=>{
          console.error(e)
          if(e.code==="auth/argument-error"){
            this.$store.state.alert={
              text:"Datos inválidos.",
              icon:"error"
            }
          }
          if(e.code==="auth/invalid-email"){
            this.$store.state.alert={
              text:"Correo electrónico inválido.",
              icon:"error"
            }
          }
          if(e.code==="auth/user-not-found"){
            this.$store.state.alert={
              text:"El correo electrónico ingresado no existe.",
              icon:"error"
            }
          }
          if(e.code==="auth/wrong-password"){
            this.$store.state.alert={
              text:"Contraseña incorrecta.",
              icon:"error"
            }
          }
        })        
      }else if(this.step===2){
        /* creación de cuenta en auth: registro */
        if(!this.password){
            this.$store.state.alert={
              text:"La contraseña no puede estar vacía.",
              icon:"error"
            }
          return
        }
        if(this.password!=this.confirmation){
            this.$store.state.alert={
              text:"Las contraseñas no coinciden.",
              icon:"error"
            }
          return
        }
         firebase.auth()
        .createUserWithEmailAndPassword(
          this.email,
          this.password)
        .then((currentUser)=>{
          const uid=currentUser.user.uid
          db.collection("users").doc(this.email).update({
            uid,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            verified:true,
          })
        })
        .catch(e=>{
          console.error(e)
          if(e.code==="auth/invalid-email"){
            this.$store.state.alert={
              text:"Correo inválido.",
              icon:"error"
            }
          }
          if(e.code==="auth/email-already-in-use"){
            this.$store.state.alert={
              text:"Ya hay una cuenta vinculada a ese correo.",
              icon:"error"
            }
          }
          if(e.code==="auth/weak-password"){
            this.$store.state.alert={
              text:"Coloca una contraseña más dificil de adivinar.",
              icon:"error"
            }
          }
        }) 
      }
    },
    },
  }
</script>
