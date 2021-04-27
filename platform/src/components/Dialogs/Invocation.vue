<template>
  <q-card class="text-center q-pb-lg" style="min-width:450px;">
    <q-card class="my-card">
      <q-card-section>
        {{invocationContext}}
        <div class="text-h6"></div>
        <div class="text-subtitle2"></div>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="Build" name="build" />
        <q-tab label="Sign" name="sign" />
        <q-tab label="Broadcast" name="broadcast" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="build">
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>type: {{invocation.invocation.type}}</q-item-label>
              <q-item-label caption>Coin: {{invocation.invocation.invocation.coin}}</q-item-label>
              <q-item-label caption>amount: {{invocation.invocation.invocation.amount}}</q-item-label>
              <q-item-label caption>address: {{invocation.invocation.invocation.address}}</q-item-label>
            </q-item-section>
          </q-item>
          <small>Review Intent and submit for transaction building</small>
          <div>
            <q-btn
              color="primary"
              @click="build(invocationContext)"
              label="build"
            ></q-btn>
          </div>
        </q-tab-panel>

        <q-tab-panel name="sign">
          This should show the Build transaction

          Review fee's

          Allow Recreate/adjust fee

          Mark RBF if availble

          Mark noBroadcast
          <q-btn
            color="primary"
            @click="sign()"
            label="Sign Transaction"
            size="lg"
            class="font-weight-medium q-pl-md q-pr-md"
            style="font-size:1rem;"
          ></q-btn>
        </q-tab-panel>

        <q-tab-panel name="broadcast">
          This should be the approved* signed* broadcastable* tx

          allow broadcast

          allow recreate tx (replacement)
        </q-tab-panel>
      </q-tab-panels>
      <div>
        <q-btn
          color="red"
          @click="cancel()"
          label="Reject"
          size="lg"
          class="font-weight-medium q-pl-md q-pr-md"
          style="font-size:1rem;"
        ></q-btn>
      </div>
    </q-card>

    <div>
<!--      Invocation: {{invocation}}-->
    </div>
  </q-card>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";

  export default {
    name: "Invocation",
    data() {
      return {
        tab:"build",
        txBuilt: false,
        loading: false,
        error: false,
        items: [],
        invocations: [],
        invocationContext: null,
        invocation: {}
      };
    },
    mounted() {
      try{

      }catch(e){
        console.error(e)
      }
    },
    computed: {
      ...mapGetters(['getInvocations','getInvocationContext'])
    },
    watch: {
      "$store.state.invocationContext": {
        handler: function (value) {
          console.log("value: ", value)
          //get value
          this.invocationContext = this.$store.getters['getInvocationContext'];
          this.invocation = this.invocations.filter(e => e.invocationId === this.invocationContext)[0]
        },
        immediate: true
      },
      "$store.state.invocations": {
        handler: function (value) {
          console.log("value: ", value)
          //get value
          this.invocations = this.$store.getters['getInvocations'];
          console.log("invocations: ", this.invocations)
          if(!this.invocation) this.invocation = this.invocations[0]
        },
        immediate: true
      },
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      refresh (done) {
        setTimeout(() => {
          //this.items.push()
          done()
        }, 1000)
      },
      approve(invocationId) {
        console.log("invocationId: ",invocationId)
        //tryLogin
        this.$q.electron.ipcRenderer.send('approveTransaction', {invocationId});
        remote.getCurrentWindow().close()
      },
      build(invocationId) {
        console.log("invocationId: ",invocationId)
        this.$q.electron.ipcRenderer.send('approveTransaction', {invocationId});
      },
      sign(invocationId) {
        console.log("invocationId: ",invocationId)
        this.$q.electron.ipcRenderer.send('approveTransaction', {invocationId});

      },
      broadcast() {


      },
      cancel() {
        //mark invocation context rejected
        this.close()

      },
      close: function () {
        this.hideModal()
      },
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
