<template>
  <v-app>
    <v-container class="start-box">
      <v-btn color="primary" v-if="registered == false" @click="dialogLogin = true" dark> Dla administratora </v-btn>
      <v-btn color="primary" v-if="registered == true" @click="logout" dark>Wyloguj</v-btn>
    </v-container>
     <Calendar :registered = "registered"/>  
    <v-dialog v-model="dialogLogin" max-width="500">
      <v-card>
        <v-container>
          <v-form @submit.prevent="login">
            <v-text-field id="email" type="email" label="E-mail" v-model="email"></v-text-field>
            <v-text-field id="password" type="password" label="Hasło" v-model="password"></v-text-field>
            <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialogLogin = false">Login</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import store from './store/index.js';
import Calendar from './components/Calendar';
export default  {
  name: 'App',

  components: {
    Calendar
  },
  methods: {
    async login(event) {
      event.preventDefault();
      await this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
        registered: this.registered.registered,
        returnSecureToken: true
      });
      this.registered = store.state.registered;
    },
    logout() {
      this.$store.dispatch('logout');
      this.registered = false;
      window.location.href = "/";
    },
  },
  data: () => ({
    email: "",
    password: "",
    registered: false,
    dialogLogin: false
  }),
};
</script>

<style lang="less">
.start-box {
  margin: 0;
  padding-left: 16px;
}

</style>