<template>
  <q-page>
    <div class="page-header">
      <div><h4>Pioneer</h4></div>
    </div>
      <q-card>
        <div v-if="!context">
          <h4>Loading...</h4>
        </div>
        <div v-if="context">
          <div class="">
            Apps: {{apps}}
          </div>
          <div>
            <q-btn
              @click="openPair"
              color="primary"
              label="Pair"
            ></q-btn>
          </div>

          <div>
            <q-btn-dropdown
              color="green"
              push
              glossy
              no-caps
              icon="explore"
              :label="context.slice(0,10)"
            >
              <q-list>
                <div v-for="(wallet, index) in wallets" :key="index" class="q-mb-sm">
                  <q-item clickable v-close-popup @click="onItemClick(wallet)">
                    <q-item-section avatar>
                      <q-avatar icon="account_balance_wallet" color="primary" text-color="white" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{wallet.walletId.slice(0, 10)}}</q-item-label>
                      <q-item-label caption></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="info" color="amber" />
                    </q-item-section>
                  </q-item>
                </div>
              </q-list>
            </q-btn-dropdown>
          </div>

          <div class="q-pa-md" style="max-width: 550px">
<!--            {{coins}}-->
            <div v-for="coin in coins" :key="coin.symbol">
<!--                          {{coin}}-->
<!--                          {{coin.symbol}}-->
<!--                              {{coin.icon}}-->
              <q-expansion-item style="width:550px;">
                <template v-slot:header style="width:550px;">

                  <q-item-section avatar>
                    <q-img :src="coin.icon"></q-img>
                  </q-item-section>

                  <q-item-section>
                    {{coin.symbol}}
                  </q-item-section>

                  <q-item-section side>

                    <animated-number :value="walletContext.valueUsds[coin.symbol]" :formatValue="formatToPriceUSD" :duration="duration"/>
                  </q-item-section>
                </template>

                <q-card>
                  <q-card-section style="word-wrap: break-word;">
                    <small>script type: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0].script_type}}</small>
                                      <q-separator />
                                      Address: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0].master}} <br/>
                                      {{copyText}}
                                      <q-icon @click=copyAddress(coin.symbol) name="content_copy"></q-icon>
                                      <q-separator />
<!--                                      path: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0]}}-->
                                      <q-separator />
                                      <small>xpub: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0].pubkey}}</small>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-separator />

            </div>
          </div>

        </div>
      </q-card>
  </q-page>
</template>

<script>
  import { ipcRenderer } from 'electron'
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

  //let walletInfo = { "isTestnet": true, "public": { "BTC": { "coin": "BTC", "network": "BTC", "script_type": "p2pkh", "path": "m/44'/0'/1'", "long": "Bitcoin", "address": "19X8qFMB1f3MkFMb38y8ANGJN5Di18roMT", "master": "19X8qFMB1f3MkFMb38y8ANGJN5Di18roMT", "type": "xpub", "xpub": "xpub6D1weXBcFAo8HPiRxhc6tBvwu7o35mYfn2BemJhhB93syYFJ1FCE7Rn2dbLNh1EPqKG3BAuB66gLyqgW8ouxyo1hnU1p9xQpFSNQgXDuQL4", "pubkey": "xpub6D1weXBcFAo8HPiRxhc6tBvwu7o35mYfn2BemJhhB93syYFJ1FCE7Rn2dbLNh1EPqKG3BAuB66gLyqgW8ouxyo1hnU1p9xQpFSNQgXDuQL4" }, "ETH": { "coin": "ETH", "network": "ETH", "script_type": "ethereum", "path": "m/44'/60'/0'", "long": "Ethereum", "address": "0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8", "master": "0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8", "type": "address", "xpub": "xpub6D54vV8eUYHMVBZCnz4SLjuiQngXURVCGKKGoJrWUDRegdMByLTJKfRs64q3UKiQCsSHJPtCQehTvERczdghS7gb8oedWSyNDtBU1zYDJtb", "pubkey": "0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8" }, "RUNE": { "coin": "RUNE", "network": "RUNE", "script_type": "thorchain", "path": "m/44'/931'/0'/0/0", "long": "Thorchain", "address": "thor1ls33ayg26kmltw7jjy55p32ghjna09zp74t4az", "master": "thor1ls33ayg26kmltw7jjy55p32ghjna09zp74t4az", "type": "address", "xpub": "xpub6FkHm9bKQbvo1T28h8haU9iXBojqejUsS5JEvdmaDnbyfYN6jLd9M8VrhMS8ibEHcpTefHu9yxC7rfffLeWPS4jDqT1Vq5r2k3D9ySwm4uL", "pubkey": "thor1ls33ayg26kmltw7jjy55p32ghjna09zp74t4az" } }, "totalValueUsd": 747.974853726241, "duration": 1435, "masters": { "BTC": "mkqRFzxmkCGX9jxgpqqFHcxRUmLJcLDBer", "ETH": "0x3f2329c9adfbccd9a84f52c906e936a42da18cb8", "RUNE": "tthor1mu7gez4wpkddlsldfc8trn94zqwqumcgeyy78e" }, "txCount": {}, "balances": { "BTC": 0.01, "RUNE": 0, "ETH": 0.07804892027035262 }, "valueUsds": { "BTC": 582.5339669860442, "RUNE": 0, "ETH": 165.4408867401968 }, "coinInfo": { "RUNE": "", "ETH": "" }, "syncStatus": {}, "stakes": {}, "username": "test-user-2", "apps": [ "https://swaps.pro/" ], "private": {} }

  export default {
    name: 'Pioneer',
    components: {
      AnimatedNumber
    },
    data () {
      return {
        context:null,
        duration: 500,
        queryKey:"",
        coins:[],
        walletInfo: {},
        wallets:[],
        walletContext:{},
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

        setTimeout(this.updateWalletContext,2000)

        //
        ipcRenderer.on('refreshPioneer', (event, data) => {
          console.log("Refresh Pioneer! **** pioneer.vue")
          //
          this.updateWalletContext()
          this.updateContext()
        })

      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.context": {
        handler: function(value) {
          //get value
          this.context = this.$store.getters['getContext'];
          console.log("watch: this.context: ",this.context)
        },
        immediate: true
      },
      "$store.state.wallets": {
        handler: function(value) {
          console.log("value: ",value)
          //get value
          this.updateWalletContext()
          this.updateContext()
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['getApps','layout','getWalletInfo','getContext']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp','showModal','hideModal']),
      onMainClick() {
        console.log("Main Click")
      },
      updateWalletContext() {
        //get value
        this.wallets = this.$store.getters['wallets'];
        console.log("wallets: ",this.wallets)
        console.log("this.context: ",this.context)
        this.updateContext()
        let currentWallet = this.wallets.filter(e => e.walletId === this.context)
        console.log("currentWallet: ",currentWallet)
        this.walletContext = currentWallet[0]
        if(this.walletContext){
          let coins = Object.keys(currentWallet[0].masters)
          let coinList = []
          for(let i = 0; i < coins.length; i++){
            let coin = coins[i]
            coinList.push({
              symbol:coin,
              icon:"https://static.coincap.io/assets/icons/svg/"+coin.toLowerCase()+".svg",
            })
          }
          this.coins = coinList
        } else if(this.wallets.length > 0){
          //set context to current
          this.context = this.wallets[0].walletId
          this.$q.electron.ipcRenderer.send('updateContext', {
            context:this.context,
            reason:"current context not in wallet array!"
          });

        }
      },
      updateContext() {
        this.context = this.$store.getters['getContext'];
        console.log("this.context: ",this.context)
      },
      openPair(item) {
        console.log("item Click: ",item)
        this.showModal('Pair')
      },
      onItemClick(item) {
        console.log("item Click: ",item)
      },
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
  body {background: #333;}
</style>
