<template>

  <q-page>
    <div class="page-header">
      <h4>Pioneer</h4>

    </div>
    <q-page class="q-pt-xs" >

      Wallets: {{wallets}}

      <q-separator />

      <div class="q-pa-md" style="max-width: 550px">
        <q-list bordered class="rounded-borders" style="width:550px;">
          <div v-for="coin in coins" :key="coin.symbol">
<!--            {{coin}}-->
<!--            {{coin.symbol}}-->
            <q-expansion-item style="width:550px;">
              <template v-slot:header style="width:550px;">
                <q-item-section avatar>
                  <q-img :src="coin.icon"></q-img>
                </q-item-section>

                <q-item-section>
                  {{coin.symbol}}
                </q-item-section>

                <q-item-section side>
                  <animated-number :value="walletInfo?.valueUsds[coin.symbol]" :formatValue="formatToPriceUSD" :duration="duration"/>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section style="word-wrap: break-word;">
                  {{coin.symbol}}
                  <q-separator />
                  Address: {{walletInfo?.masters[coin.symbol]}} <br/>
                  {{copyText}}
                  <q-icon @click=copyAddress(walletInfo?.masters[coin.symbol]) name="content_copy"></q-icon>
                  <q-separator />
                  info: {{walletInfo?.coinInfo[coin.symbol]}}

                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />

          </div>

        </q-list>
      </div>

    </q-page>

  </q-page>
</template>

<script>
  import accountSelector from '../components/AccountSelector'
  import { mapMutations, mapGetters } from 'vuex'
  import VueGridLayout from 'vue-grid-layout';
  import { copyToClipboard } from 'quasar'
  import AnimatedNumber from "animated-number-vue";
  import AppSwitcher from "components/AppSwitcher";
  import AppModal from "components/Dialog";
  /*
   sample data
   */

  let coins = [
    {
      symbol:"ETH",
      icon:"https://static.coincap.io/assets/icons/svg/eth.svg"
    },
    {
      symbol:"BTC",
      icon:"https://static.coincap.io/assets/icons/svg/btc.svg"
    }
  ]
  export default {
    name: 'Pioneer',
    components: {
      AnimatedNumber
    },
    data () {
      return {
        duration: 500,
        queryKey:"",
        coins,
        walletInfo:{},
        wallets:[],
        apps:[],
        devMode:false,
        installing: [],
        status:"online",
        draggable: true,
        resizable: true,
        responsive: true,
        index: 0,
        show: false,
        from: {address:'testingaddy'} || null,
        copyText: 'Copy Address'
      }
    },
    mounted() {
      try{
        this.$nextTick(function () {
          this.show = true;
        })
      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.wallets": {
        handler: function(value) {
          console.log("value: ",value)
          //get value
          this.wallets = this.$store.getters['wallets'];
          console.log("wallets: ",this.wallets)
        },
        immediate: true
      },
      "$store.state.walletInfo": {
        handler: function(value) {
          console.log("value: ",value)
          this.walletInfo = this.$store.getters['walletInfo'];
          console.log("walletInfo: ",this.walletInfo)
        },
        immediate: true
      },
      "$store.state.coins": {
        handler: function(value) {
          this.coins = this.$store.getters['coins'];
          console.log("coins: ",this.coins)
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['walletInfo','getApps','getWallets','layout']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp']),
      formatToPriceUSD(value) {
        return `$ ${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      },
      copyAddress (value) {
        copyToClipboard(value)
          .then(() => {
            this.copyText = 'Coppied!'
            setTimeout(() => {
              this.copyText = 'Copy Address'
            }, 2000)
          })
          .catch(() => {
            // fail
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-header {
    height:70px;
    border-bottom:1px solid var(--border-color);
    padding:0 1.5rem;
    display:flex;
    align-items: center;
    h4 {
      margin-top:0;
      margin-bottom:0;
    }
  }
  .my-card {
    height: 100%;
  }
</style>
