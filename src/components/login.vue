<template>
      <div class='login' id='new'>
      <fieldset>
        <legend>Sign in</legend>
        <marquee id='mar1'>If you want to collaborate people , Yeah this is the place...So <strong>Log in</strong></marquee>
        <form id='log'>
          <br><br>
          <label for='username'>Username : </label>
          <input type='text' id='username' placeholder="Username" v-model="user.username" required> <span id='requir'>*</span><br/><br/><br/>
          <label for='password'>Password : </label>
          <input type="password" id="password" placeholder='Password' v-model = "user.password" required> <span id='requir'>*</span><br/><br/><br/>
          <button type='button' v-on:click='signin'>SIGN IN</button>
          <button class='reset' type='reset' value='Reset'>RESET</button>
        </form>
      </fieldset>
      </div>
     </div>
</template>

<script>
import axios from 'axios';
import {mapActions} from 'vuex'; 
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    signin() {
      var a=this.user.username;
      var b=this.user.password;
      console.log(a);
      api.get('/'+a+'/'+b)
      .then(res => {
        if(res.data[0] == undefined){
        window.alert('Username or password incorrect');
        document.getElementById('log').reset();
        }
        else{
        window.alert('Signin Success');
        document.getElementById('log').reset();
        this.storeuser(this.user);
        }
      })
      .catch(error =>{
        console.log(error);
      })
    }
  }
}
</script>