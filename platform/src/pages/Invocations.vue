<template>
  <div class="q-pa-md fixed-center" style="max-width:750px">
    <h5>Transaction Status page</h5>
    Invocation: {{ $route.params.id }}
    <q-stepper
      v-model="step"
      ref="stepper"
      alternative-labels
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Reviewed and Signed"
        icon="settings"
        :done="step > 1"
      >
        Review Transaction

        sign:
      </q-step>

      <q-step
        :name="2"
        title="Pending Transactions"
        caption="(broadcast)"
        icon="create_new_folder"
        :done="step > 2"
      >
        Fee levels:
        <br/>
        Time till next block:
        <br/>
        estimated time till confirmation:
        <br/>
        Rebuild/replace transaction:
      </q-step>

      <template v-slot:navigation>
        <q-btn
          @click="approve"
          label="Approve"
          size="small"
          class="font-weight-medium q-pl-md q-pr-md"
          style="font-size:1rem;"
        ></q-btn>
<!--        <q-stepper-navigation>-->
<!--          <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />-->
<!--          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />-->
<!--        </q-stepper-navigation>-->
      </template>
    </q-stepper>
  </div>
</template>

<script>
    import {mapMutations} from "vuex";
    const remote = require('electron').remote
    export default {
        name: "Approvals",
        data() {
          return {
            loading: false,
            error: false,
          };
        },
        mounted() {
          try{

          }catch(e){
            console.error(e)
          }
        },
        methods: {
          ...mapMutations(['showModal','hideModal']),
          approve() {
            let invocationId = this.$route.params.id
            console.log("Invocation: ",this.$route.params.id)
            //tryLogin
            this.$q.electron.ipcRenderer.send('approveTransaction', {invocationId});

            remote.getCurrentWindow().close()
          },
          // close: function () {
          //   this.hideModal()
          // },
          // openStartup: function () {
          //   this.hideModal()
          //   //open setup
          //   this.showModal('Startup')
          // }
        }
    }
</script>

<style scoped>

</style>
