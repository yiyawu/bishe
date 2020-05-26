<template>
  <div id="app">
    <router-view v-on:footer="footer"></router-view>
    <app-footer v-if="footer_show"></app-footer>
  </div>
</template>

<script>
import Footer from './components/Footer'
export default {
  name: 'App',
  data(){
    return {
      footer_show: true,
    }
  },
  components: {
    'app-footer':Footer,
  },
  methods:{
    footer:function(bool) {
      this.footer_show = bool;
    }
  }
}
</script>

<style>
#app, body, html {
  height: 100%;
  width: 100%;
  margin:  0;
  padding: 0;
  min-width:  1024px;
}
</style>
