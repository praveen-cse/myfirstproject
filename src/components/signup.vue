<template>
      <div class='signupp'>
      <fieldset class='field'>
        <legend>Sign Up</legend>
        <form class="frm" id='sign'>
          <br><br>
          <label class="fas fa-user" for='username'> </label>
          <input  type='text' id='username_' placeholder="Username" v-model="user.username" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-users" for='fullname'></label>
          <input type='text' id='fullname' placeholder="Fullname" v-model="user.fullname" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-lock fa-4"> </label>
          <input  type="password" id="password_" placeholder='Password' v-model = "user.password" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-phone" for='phonenumber'></label>
          <input type='tel' pattern='[0-9]{10}' id='phoneno' placeholder="Phone Number" v-model="user.phoneno" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-at" for='email'></label>
          <input  type='email' id='email' placeholder="Email ID" v-model="user.email" required> <span id='requir'>*</span><br/><br/><br/>
          <div class='mybutton'>
          <button class="fab fa-telegram" style='font-size:30px;' type='button' v-on:click='signup()'></button><br/><br/>
          <button class="fas fa-trash-restore" style='font-size:30px;' type='reset' value='Reset'></button>
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
        email: '',
        favorites:' ',
        read_later: ' '
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
          api.post('/post-user',a);
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
fieldset{
  margin-left : 15%;
  text-align: center;
  margin-top:100px;
  font-size: 30px;
}
/* .frm{
  display: flex;
  align-items: center; 
  flex-direction: column;
  justify-content: center;
} */
label{
  margin-left: 0px;
    margin-right: 1em;
    text-align: center;
    font-weight: bold;

}
button{
  margin-right : 30px;
}
.mybutton{
  text-align: center;
  margin-right : 50px;
}
</style>