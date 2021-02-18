<template>
  <q-page>
    <div class="page-header">
      <q-img src="~assets/box-logo.png"></q-img><h4>KeepKey</h4>
    </div>
    <q-scroll-area style="height: calc(100vh - 100px)">
      <div class="flex q-pl-lg q-pr-lg q-pb-lg">
        <div class="flex row items-start q-gutter-md wrap q-pt-lg">

        </div>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'


  export default {
    name: 'Keepkey',
    data () {
      return {
        queryKey:"",
        apps:[],
        installing: [],
      }
    },
    mounted() {
      try{
      }catch(e){
        console.error(e)
      }
    },
    computed: {
      ...mapGetters(['getApps']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp']),
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
