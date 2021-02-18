<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-img height=50px width=50px src="../assets/greenCompas.png"></q-img>
        <q-toolbar-title>
          Pioneer
        </q-toolbar-title>

        <div>API v{{ $q.version }}</div>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

const axios = require('axios')

export default {
  name: 'MainLayout',

  components: {
  },
  data() {
    return {
      isLoggedIn: false,
      layout:JSON.parse(JSON.stringify(testLayout))
    }
  },
  async mounted() {
    try{
      //dashboard
      this.index = this.layout.length;

      console.log("process.env",process.env)
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      console.log("newAccounts: ",newAccounts)

    }catch(e){
      console.error(e)
    }
  },
  methods: {
    onItemClick () {
      console.log('Clicked on an Item')


    },
    onLogin () {
      console.log('onlogin')

    },
    onLogout () {
      console.log('logging out')

    }
  }
}
</script>
