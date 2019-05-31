<template>
      <div class='login' id='new'>
      <fieldset>
        <legend>Sign in</legend>
        <form id='log'>
          <br><br>
          <label for='username'>Username : </label>
          <input type='text' id='username' placeholder="Username" v-model="user.username" required> <span id='requir'>*</span><br/><br/><br/>
          <label for='password'>Password : </label>
          <input type="password" id="password" placeholder='Password' v-model = "user.password" required> <span id='requir'>*</span><br/><br/><br/>
          <div class='mybutton'>
          <button type='button' v-on:click='signin'>SIGN IN</button>
          <button type='reset' value='Reset'>RESET</button>
          </div>
        </form>
      </fieldset>
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
      },
    }
  },
  methods: {
    signin() {
      var a=this.user.username;
      var b=this.user.password;
      if(a=="" || b=="")
      {
        window.alert('Please enter the credentionals properly');
        return;
      }
      console.log(a);
      api.get('/'+a+'/'+b)
      .then(res => {
        if(res.data[0] == undefined){
        window.alert('Username or password incorrect');
        //document.getElementById('log').reset();
        }
        else{
        window.alert('Signin Success');
        document.getElementById('Full-display').style.display='none';
        document.getElementById('Home').style.display='inherit';
        this.$store.dispatch('storedetails',this.user.username);
        document.getElementById('log').reset();
        }
      })
      .catch(error =>{
        console.log(error);
      })
    }
  }
}
</script>
<style>
button{
  margin-right : 30px;
}
.mybutton{
  text-align: center;
  margin-left :40px;
}
</style>