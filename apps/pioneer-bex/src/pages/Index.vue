<template>
  <q-page class="row items-center justify-evenly">

    <!-- If new -->
    <div v-if="firstOpen" align="center">
      <h2>Welcome</h2>
      <h4>what would you like to do?</h4>
      <q-btn @click="onPairKeepkey" align="center" label="Pair Keepkey" type="configure" color="primary" />
      <br/>
      <q-btn @click="onCreateNewWallet" align="center" label="Create New Wallet" type="configure" color="secondary"/>
      <br/>
      <q-btn @click="onRestoreWallet" align="center" label="Restore From Seed" type="configure" color="primary"/>

      <br/>
<!--      <div class="q-gutter-sm">-->
<!--        <small>the software is provided 'as is', without warranty of any kind, express or implied. </small>-->
<!--      </div>-->
    </div>

    <!-- If new -->
    <div v-if="enterSeed" align="center">
      <example-component
        title="Enter Seed"
        active
        :mnemonic="seed"
        @exit="enterSeed = false; firstOpen = true"
      ></example-component>
    </div>

    <!-- If pair keepkey -->
    <div v-if="pairKeepkey" align="center">
      <setup-keepkey
        title="Pair Keepkey"
        active
        :mnemonic="seed"
        @exit="pairKeepkey = false; firstOpen = true"
      ></setup-keepkey>
    </div>

  </q-page>
</template>

<script lang="ts">
import ExampleComponent from 'components/OptionsComponent.vue';
import SetupKeepkey from 'components/SetupKeepkeyComponent.vue';
import Vue from 'vue';
import * as ls from "local-storage";
import { Crypto } from "@peculiar/webcrypto";
let Pioneer = require('@pioneer-platform/pioneer')

//TODO
let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
let walletName = "bex_new_2"


export default Vue.extend({
  name: 'PageIndex',
  components: {
    SetupKeepkey,
    ExampleComponent },
  async mounted() {
    try {

      let config = ls.get('config')

      if(!config){
        this.firstOpen = true
      } else {
        console.log("config")
      }


    }catch(e){
      //TODO show error page
      console.error("Failed to run UI! error: ",e)
    }
  },
  methods: {
    onPairKeepkey(){
      //open pin select
      this.firstOpen = false
      this.pairKeepkey = true

    },
    submitPin(pin:any){
      //open pin select

    },
    async onCreateNewWallet(){
      this.firstOpen = false
      //generate mnemonic

      //write encrypted to local storage

      //start pioneer
      let config = {
        mnemonic: process.env['WALLET_TESTNET_DEV'],
        username:walletName,
        pioneerApi:true,
        spec:urlSpec,
        queryKey:walletName, //insecure
        auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
        authProvider:'shapeshift'
      }

      //init wallet offline
      let pioneer = new Pioneer('pioneer',config);
      console.log("pioneer: ",pioneer)

      let info = await pioneer.init()
      console.log("info: ",info)

    },
    async onRestoreWallet(){
      this.firstOpen = false
      console.log("onRestoreWallet")
      //
      this.enterSeed = true

      let seed = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"
      let wallet = {
        username:walletName,
        password:"1234",
        mnemonic:seed
      }

      // @ts-ignore
      globalThis.crypto = new Crypto();
      // @ts-ignore
      const engine = new native.crypto.engines.WebCryptoEngine();
      // @ts-ignore
      const walletCrypto = new native.crypto.EncryptedWallet(engine);
      const result = await walletCrypto.init(wallet.username, wallet.password);
      await walletCrypto.createWallet(wallet.mnemonic);
      let seed_encrypted = result.encryptedWallet
      ls.set("mnemonic",seed_encrypted)

      let config = {
        setup:true
      }
      ls.set('config',config)
    },
    onSubmitSeed(){
      //
      console.log("onSubmitSeed")
    },
  },
  data () {
    return {
      pairKeepkey:false,
      enterSeed:false,
      firstOpen:false,
      error:false,
      pioneerLive:false,
      acceptTerms:false,
      username: "",
      usePrivateNode: false,
      // pioneerUrl:"",
      password:""
    }
  },
});
</script>
