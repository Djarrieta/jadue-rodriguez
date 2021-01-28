<template>
  <v-form 
    class="d-flex justify-center"
    v-model="valid">
      
      <v-card >
        <!-- Correo -->
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
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
      </v-card>
  </v-form>
</template>

<script>
  export default {
    name: 'Ingreso',
    data: () => ({
      valid: false,
      showPass:false,
      email: '',
      password: '',
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
  }
</script>
