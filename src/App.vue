
<template>
  <div id="app">
      <login></login>
      <signup></signup>
  </div>
</template>

<script>
import login from './components/login.vue'
import signup from './components/signup.vue'
import Vue from 'vue'
export default {
    components : {
        'login' : login,
        'signup' : signup
    }
}
</script>

<style>
body{
    font-family: Ubuntu;
    color: #555;
}
</style>
