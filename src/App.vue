<template>
  <v-app>
      <v-container>
        <router-link to="/start">Rozpocznij</router-link>
        <router-view/>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
