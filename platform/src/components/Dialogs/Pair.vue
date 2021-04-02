<template>
  <q-card class="text-center q-pb-lg" style="min-width:450px;">
    <q-form @submit="attemptPair">
      <q-card-section class="q-pb-sm">
        <h4>Enter Pairing code from Pioneer SDK Application</h4>

        <p></p>
      </q-card-section>
      <q-card-section align="center" class="q-pt-sm">
        <q-input
          borderless
          v-model="pairingCode"
          size="lg"
          label="pairing code"
          style="max-width: 400px;"
          lazy-rules
          :rules="[ val => val && val.length > 0 || $t('msg.emptyPassword') ]">
        </q-input>
      </q-card-section>
      <q-card-actions align="center" class="column q-pb-lg">
        <q-btn @click="attemptPair" type="submit" color="primary" class="q-pl-md q-pr-md" style="font-size:1rem;" label="Pair App" :loading="loading" />
        <q-btn class="q-mt-md" flat @click="hideModal">Cancel</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script>

  //crypto
  import { mapMutations } from 'vuex'

  export default {
    name: 'Pair',
    data () {
      return {
        pairingCode:""
      }
    },
    mounted() {
      try{
        //
      }catch(e){
        console.error(e)
      }
    },
    methods: {
      ...mapMutations(['hideModal']),
      attemptPair: function () {
        let code = this.pairingCode
        console.log('attemptPair: ',code)
        this.$q.electron.ipcRenderer.send('attemptPair', code);
      }
    }
  }
</script>
