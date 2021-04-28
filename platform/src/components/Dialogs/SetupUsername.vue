<template>
  <q-card class="text-center q-pl-lg q-pr-lg" style="min-width:450px;">
    <small>Setup Username</small>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
    <q-card-section>
      <div v-if="pioneerLive">
        <p>Please create a user</p>
      </div>
      <div v-if="!pioneerLive">
        live: {{pioneerLive}}
        <br/>

        <div v-if="featureSelfHost">
          <q-input
            filled
            v-model="pioneerUrl"
            label="Pioneer URL"
            hint=""
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
        </div>
        <div v-if="!featureSelfHost">
          PioneerUrl: {{pioneerUrl}}
        </div>
        <small>Attempting to connect...</small>
        <q-spinner
          color="primary"
          size="5rem"
          v-if="true"
          key="spinner"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <div v-if="pioneerLive">
        <q-input
          filled
          v-model="username"
          label="Username"
          v-on:input="checkName"
          lazy-rules
          :rules="[ val => val && val.length > 3 || error]"
        />
      </div>
    </q-card-section>
      <q-card-actions align="center" class="q-pb-lg q-pl-md q-pr-md">
        <div v-if="pioneerLive">
          <small>online: {{usersOnlineCount}}</small>
          <small>users: {{usersOnline}}</small>
          <q-btn label="Continue" type="submit" color="primary" />
        </div>
        <div v-if="!pioneerLive">
          <q-btn label="Test" @click="onTest" color="primary" />
          <q-btn label="Reset" type="reset" flat />
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script>
  /*

      Username Dialog

      Verify connected to pioneer:

      Offer changing of url if not live

   */
  let featureSelfHost = process.env['SELF_HOST_FEATURE']

  //TODO offer pre-generated name
  // import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

  import {mapGetters, mapMutations} from 'vuex'
  export default {
    data () {
      return {
        featureSelfHost,
        error:false,
        pioneerLive:false,
        usersOnline:[],
        usersOnlineCount:0,
        username: "",
        pioneerUrl:"",
        password:""
      }
    },
    computed: {
      ...mapGetters(['getPioneerUrl','getPioneerStatus','getUsersOnline']),
    },
    async mounted() {
      try{

        this.$q.electron.ipcRenderer.send('checkPioneerUrl', {});
      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.usersOnline": {
        handler: function() {
          const usersOnline = this.$store.getters['getUsersOnline'];
          console.log("usersOnline: ",usersOnline)
          this.usersOnline = usersOnline
          this.usersOnlineCount = usersOnline.length
        },
        immediate: true
      },
      "$store.state.pioneerUrl": {
        handler: function() {
          const pioneerUrl = this.$store.getters['getPioneerUrl'];
          console.log("pioneerUrl: ",pioneerUrl)
          this.pioneerUrl = pioneerUrl
        },
        immediate: true
      },
      "$store.state.pioneerLive": {
        handler: function() {
          const pioneerLive = this.$store.getters['getPioneerLive'];
          console.log("pioneerLive: ",pioneerLive)
          this.pioneerLive = pioneerLive
        },
        immediate: true
      }
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      onSubmit: async function () {
        console.log("onSubmit")

        //update url


        //if password
        let payload = {
          username:this.username
        }
        if(this.usePassword){
          //check rules
          // > x
          console.log("password")
          payload.password = this.password
        }

        if(this.pioneerUrl){
          payload.urlSpec = this.pioneerUrl
        }

        this.$q.electron.ipcRenderer.send('onAttemptCreateUsername', payload);

        //check username

        //if username available
        //else clear username


        //if so continue
        // if(userInfoPublic.available){
        //   //set username to state
        //   this.$store.commit('setUsername',this.username)
        //
        // } else {
        //   this.onReset()
        //   this.error = "Username already taken!"
        //   this.$q.notify({
        //     color: 'red-5',
        //     textColor: 'white',
        //     icon: 'warning',
        //     message: this.error
        //   })
        // }
      },

      checkName () {
        //update url
        console.log("checkName: ",this.username)

        if(this.username.length > 3){
          //check on remote
          this.$q.electron.ipcRenderer.send('checkUsernameAvailable', {username:this.username});
        } else {
          this.error = "Too Short!"
        }

        //test url
      },
      onTest () {
        //update url
        console.log("pioneerUrl: ",this.pioneerUrl)
        this.$q.electron.ipcRenderer.send('checkPioneerUrl', {urlSpec:this.pioneerUrl});
        this.onSubmit()
        //test url
      },
      onReset () {
        this.username = null
      },
      openSetup: function () {
        this.hideModal()
        //open setup
        this.showModal('Setup')
      }
    }
  }
</script>
