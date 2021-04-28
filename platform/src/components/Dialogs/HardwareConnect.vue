<template>
  <q-card class="text-center q-pb-lg" style="min-width:450px;">
    <q-card-section>
      <h4>Attempting to Connect Keepkey!</h4>
      <small>Status: {{keepKeyStatus}}</small>
      <q-spinner
        color="primary"
        size="5rem"
        v-if="!isLoaded"
        key="spinner"
      />
    </q-card-section>

    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          popup
          expand-icon-toggle
          expand-separator
          icon="computer"
          label="USB drivers Found for OS"
          caption="(KeepKey)"
          v-ripple
          :header-class="driversValid ? 'text-green' : ''"
          :disable="driversValid"
        >
          <q-card>
            <q-card-section>
              The Drivers For the Hardware Wallet were found on this Computer.
            </q-card-section>
          </q-card>
        </q-expansion-item>

      <q-expansion-item
        popup
        expand-icon-toggle
        expand-separator
        icon="devices"
        label="Keepkey Connected to Computer"
        v-ripple
        :header-class="keepKeyConnectedComputer ? 'text-green' : ''"
        :disable="keepKeyConnectedComputer"
      >
        <q-card>
          <q-card-section>
            <div>
              All Keepkeys: {{allKeepKeys}}
            </div>
            <div class="on-left">
              All Devices:
              <ul compact>
              <div
                v-for="device in allUsbDevices"
                :key="device.deviceName"
                style="text-align: left">
                <li>{{device.deviceName}} <div style="text-align: right"><small>usbId: {{device.locationId}}</small></div></li>
                <div v-if="device.deviceName === 'KeepKey'">
                  <q-icon icon=""></q-icon>
                  {{device}}
                </div>
              </div>
              </ul>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        popup
        expand-icon-toggle
        expand-separator
        icon="explore"
        label="Keepkey Connected to Application"
        v-ripple
        :active="keepKeyConnectedApplication"
      >
        <q-card>
          <q-card-section>
            Keepkey Connected to Application

            <div v-if="!keepKeyConnectedApplication">
              <h5>Failed to claim Error!</h5>
              <ol>
                <li>Unplug Keepkey Device!</li>
                <li>Close ALL browser tabs</li>
                <li>Close The KeepKey Updater App (if installed)</li>
                <li>Close Any other applications that may connect to the keepKey</li>
                <li>reconnect KeepKey</li>
              </ol>
            </div>


          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        popup
        expand-icon-toggle
        expand-separator
        icon="lock_open"
        label="Keepkey Unlocked"
        v-ripple
        :active="keepKeyUnlocked"
      >
        <q-card>
          <q-card-section>
            Keepkey Unlocked
            open pin:
          </q-card-section>
        </q-card>
      </q-expansion-item>

      </q-list>
    </div>

    <q-card-actions vertical align="center" class="q-pb-lg">
      <q-form
        class="q-gutter-md"
      >

        <q-btn
          @click="goBack"
          class="full-width"
          align="left"
          size="lg"
          label="Go Back"
        />

      </q-form>

    </q-card-actions>
  </q-card>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
    export default {
      name: "HardwareConnect",
      data() {
        return {
          keepKeyStatus:'',
          keepKeyState:0,
          allUsbDevices:[],
          allKeepKeys:[],
          firmwareVersion:"",
          activeColor:"header-green",
          firmwareUpdateRequired:false,
          isLoaded:false,
          driversValid: true,
          active:true,
          usbDevices:0,
          keepKeyInUsbList:false,
          keepKeyConnectedComputer:false,
          keepKeyConnectedApplication:false,
          keepKeyUnlocked:false
        };
      },
      mounted() {
        try{
          //startHardware
          this.getUsbInfo()
          this.startHardwareConnection()
        }catch(e){
          console.error(e)
        }
      },
      watch: {
        "$store.state.keepKeyState": {
          handler: function() {
            this.keepKeyState = this.$store.getters['getKeepKeyState'];
            console.log("*** keepKeyState: ",this.keepKeyState)
            if(this.keepKeyState === 4){
              this.keepKeyUnlocked = true
              this.keepKeyConnectedComputer = true
              this.keepKeyInUsbList = true
              this.keepKeyConnectedApplication = true
              this.isLoaded = true
              this.keepKeyStatus = 'UnLocked!'
            }
          },
          immediate: true
        },
        "$store.state.allKeepKeys": {
          handler: function() {
            this.allKeepKeys = this.$store.getters['getAllKeepKeys'];
            if(this.allKeepKeys.length > 0){
              console.log("Keepkey found!")
              this.keepKeyStatus = 'Device Found! attempting to connect...'
              this.keepKeyConnectedComputer = true
            }
            console.log("allKeepKeys: ",this.allKeepKeys)
          },
          immediate: true
        },
        "$store.state.allUsbDevices": {
          handler: function() {
            this.allUsbDevices = this.$store.getters['getAllUsbDevices'];
            console.log("allUsbDevices: ",this.allUsbDevices)
          },
          immediate: true
        },
      },
      methods: {
        ...mapMutations(['showModal','hideModal']),
        ...mapGetters(['getAllUsbDevices','getAllKeepKeys','getKeepKeyState']),
        updateDevices: function () {
          this.$q.electron.ipcRenderer.send('checkDevices', {});
        },
        getUsbInfo: function () {
          //
          this.$q.electron.ipcRenderer.send('getUsbDevices', {});
        },
        startHardwareConnection: function () {
          //
          this.$q.electron.ipcRenderer.send('startHardware', {});
        },
        openRestore: function () {
          this.hideModal()
          this.showModal('Restore')
        },
        goBack: function () {
          this.hideModal()
          this.showModal('Setup')
        },
        close: function () {
          this.hideModal()
        }
    }
  }
</script>

<style scoped>

</style>
