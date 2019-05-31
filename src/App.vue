<template>
  <div id="app">
      <div id='Full-display'>
      <login></login>
      <signup></signup>
      </div>
    <div id='Home'>
      <home></home>
    </div>
</div>
</template>

<script>
import home from './components/home.vue'
import login from './components/login.vue'
import signup from './components/signup.vue'
import Vue from 'vue'
import Vuex from 'vuex';
export default {
    components : {
        'login' : login,
        'signup' : signup,
        'home' : home
    },
    methods : {
        
    }
}
</script>

<style>
body{
    font-family: Ubuntu;
    color : white;
}
</style>
