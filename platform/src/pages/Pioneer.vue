<template>

  <q-page>
    <div class="page-header">
      <h4>Pioneer</h4>

    </div>
    <q-page class="q-pt-xs" >

      Wallets: {{wallets}}

      <br />

      apps: {{apps}}

<!--      <q-card class="qr-code q-mb-xl q-mt-md">-->
<!--&lt;!&ndash;        <q-card-section class="items-center text-center q-pt-xl q-pb-xl">&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <qr-code :value="from.address" />&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        </q-card-section>&ndash;&gt;-->
<!--&lt;!&ndash;        <q-separator />&ndash;&gt;-->
<!--        <q-input borderless readonly v-model="from.address" class="q-pb-none borderless&#45;&#45;transparent">-->
<!--          <template v-slot:append>-->
<!--            <q-btn round dense flat icon="file_copy" @click="copyAddress(from.address)">-->
<!--              <q-tooltip content-class="bg-primary" content-style="font-size: 0.75rem" :offset="[10, 10]">-->
<!--                {{copyText}}-->
<!--              </q-tooltip>-->

<!--            </q-btn>-->
<!--          </template>-->
<!--        </q-input>-->
<!--      </q-card>-->
<!--      <accountSelector v-model="from" label="Account" />-->

      <!--      <div id="content" style="width: 100%;">-->
<!--        <grid-layout v-if="show"-->
<!--                     :layout.sync="layout"-->
<!--                     :col-num="12"-->
<!--                     :row-height="30"-->
<!--                     :is-draggable="draggable"-->
<!--                     :is-resizable="resizable"-->
<!--                     :vertical-compact="true"-->
<!--                     :use-css-transforms="true"-->
<!--                     :responsive="responsive"-->
<!--        >-->
<!--          <grid-item v-for="item in layout"-->
<!--                     :key="item.i"-->
<!--                     :x="item.x"-->
<!--                     :y="item.y"-->
<!--                     :w="item.w"-->
<!--                     :h="item.h"-->
<!--                     :i="item.i"-->
<!--          >-->
<!--          <span class="text">-->
<!--            <q-card-section>-->
<!--              <q-card-->
<!--                class="my-card text-white"-->
<!--                style="background:#236303"-->
<!--              >-->
<!--&lt;!&ndash;                <div v-if="item.icon">&ndash;&gt;-->
<!--&lt;!&ndash;                  <q-img height=50px width=50px src="../assets/GreenCompas.jpeg"></q-img>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->

<!--                <h4>{{item.name}}</h4>-->

<!--                <div v-if="devMode">-->
<!--                i:{{item.i}}-->
<!--                x:{{item.x}}-->
<!--                y:{{item.y}}-->
<!--                </div>-->
<!--              </q-card>-->
<!--            </q-card-section>-->
<!--          </span>-->
<!--          </grid-item>-->
<!--        </grid-layout>-->
<!--      </div>-->

    </q-page>


    <!--    <q-scroll-area style="height: calc(100vh - 100px)">-->
    <!--      <div class="flex q-pl-lg q-pr-lg q-pb-lg">-->
    <!--        <div class="flex row items-start q-gutter-md wrap q-pt-lg">-->

    <!--        </div>-->
    <!--      </div>-->
    <!--    </q-scroll-area>-->
  </q-page>
</template>

<script>
  import accountSelector from '../components/AccountSelector'
  import { mapMutations, mapGetters } from 'vuex'
  import VueGridLayout from 'vue-grid-layout';
  import { copyToClipboard } from 'quasar'

  export default {
    name: 'Pioneer',
    data () {
      return {
        queryKey:"",
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
      }
    },
    computed: {
      ...mapGetters(['getApps','getWallets','layout']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp']),
      copyAddress (value) {
        copyToClipboard(value)
          .then(() => {
            this.copied = 'Copied!'
            setTimeout(() => {
              this.copyText = 'Copy Address'
            }, 2000)
          })
          .catch(() => {
            // fail
          })
      }
    },
    components: {
      // GridLayout: VueGridLayout.GridLayout,
      // GridItem: VueGridLayout.GridItem
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
