<template>

  <q-page>
    <div class="page-header">
      <h4>Pioneer</h4>
    </div>
    <q-page class="q-pt-xs" >

      <div id="content" style="width: 100%;">
        <grid-layout v-if="show"
                     :layout.sync="layout"
                     :col-num="12"
                     :row-height="30"
                     :is-draggable="draggable"
                     :is-resizable="resizable"
                     :vertical-compact="true"
                     :use-css-transforms="true"
                     :responsive="responsive"
        >
          <grid-item v-for="item in layout"
                     :key="item.i"
                     :x="item.x"
                     :y="item.y"
                     :w="item.w"
                     :h="item.h"
                     :i="item.i"
          >
          <span class="text">
            <q-card-section>
              <q-card
                class="my-card text-white"
                style="background:#236303"
              >
<!--                <div v-if="item.icon">-->
<!--                  <q-img height=50px width=50px src="../assets/GreenCompas.jpeg"></q-img>-->
<!--                </div>-->

                <h4>{{item.name}}</h4>

                <div v-if="devMode">
                i:{{item.i}}
                x:{{item.x}}
                y:{{item.y}}
                </div>
              </q-card>
            </q-card-section>
          </span>
          </grid-item>
        </grid-layout>
      </div>

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
  import { mapMutations, mapGetters } from 'vuex'
  import VueGridLayout from 'vue-grid-layout';

  export default {
    name: 'Pioneer',
    data () {
      return {
        queryKey:"",
        apps:[],
        devMode:false,
        installing: [],
        status:"online",
        draggable: true,
        resizable: true,
        responsive: true,
        index: 0,
        show: false,
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
    computed: {
      ...mapGetters(['getApps','layout']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp']),
    },
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem
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
