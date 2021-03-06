<template>
  <q-layout view="lHh Lpr lFf" style="min-width:333px">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Pioneer BEX
        </q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  components: {  },
  data () {
    return {
    }
  }
}
</script>
