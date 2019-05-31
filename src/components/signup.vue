<template>
      <div class='login'>
      <fieldset>
        <legend>Sign Up</legend>
        <form>
          <br><br>
          <label for='username'>Username : </label>
          <input type='text' id='username_' placeholder="Username" v-model="user.username" required> <span id='requir'>*</span><br/><br/><br/>
          <label for='fullname'>Fullname : </label>
          <input type='text' id='fullname' placeholder="Fullname" v-model="user.fullname" required> <span id='requir'>*</span><br/><br/><br/>
          <label for='password'>Password : </label>
          <input type="password" id="password_" placeholder='Password' v-model = "user.password" required> <span id='requir'>*</span><br/><br/><br/>
          <label for='phonenumber'>Phone Number : </label>
          <input type='tel' pattern='[0-9]{10}' id='phoneno' placeholder="Phone Number" v-model="user.phoneno" required> <span id='requir'>*</span><br/><br/><br/>
          <label for='email'>Email ID : </label>
          <input type='email' id='email' placeholder="Email ID" v-model="user.email" required> <span id='requir'>*</span><br/><br/><br/>
          <div class='mybutton'>
          <button type='button' v-on:click='signup()'>SIGN UP</button>
          <button class='reset' type='reset' value='Reset'>RESET</button>
          </div>
        </form>
      </fieldset>
      </div>
</template>

<script>
import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
  data () {
    return {
      user: {
        username: '',
        fullname:'',
        password: '',
        phoneno:'',
        email: ''
      }
    }
  },
  methods: {
    signup() {
      var a=this.user;
      console.log(a);
      api.post('/post',a)
      .then(res =>{
          window.alert('Signup Success')
          document.getElementById('sign').reset();
          api.post('post-user',a);
      })
      .catch(error => {
        window.alert('Signup Failure');
        document.getElementById('sign').reset();
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
  margin-right : 50px;
}
</style>