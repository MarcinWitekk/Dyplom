<template>
  <v-app>
    <v-container>
      <router-link to="/start">Rozpocznij</router-link>
        <v-btn color="primary" class="ml-4" @click="dialogLogin = true" dark> Admin </v-btn>
      <router-view/>
    </v-container>
    <v-dialog v-model="dialogLogin" max-width="500">
      <v-card>
        <v-container>
          <v-form @submit.prevent="login">
            <v-text-field id="email" type="email" label="Email" v-model="email"></v-text-field>
            <v-text-field id="password" type="password" label="Password" v-model="password"></v-text-field>
            <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialogLogin = false">Login</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
// import authAxios from "./auth-axios";
export default {
  name: 'App',

  components: {
  },
  methods: {
    async login(event) {
      event.preventDefault();
      await this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
        returnSecureToken: true
      });
    },
  },
  data: () => ({
    email: "",
    password: "",    
    dialogLogin: false
  }),
};
</script>
