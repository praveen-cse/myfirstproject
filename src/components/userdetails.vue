<template>
<div class='user-display'>
<span style="font-size:40px;"> WELCOME </span>
<div class='username'>
Username : {{getdetails.username}}</div>
<div class='username'>
Fullname : {{getdetails.fullname}}</div>
<div class='username'>
PhoneNo : {{getdetails.phoneno}}</div>
<div class='username'>
Email : {{getdetails.email}}</div>
<div class='username'>
Favourites : {{getdetails.favourites}}</div>
<div class='username'>
Read_later : {{getdetails.read_later}}</div>
<div class='username'>
Credits : {{getdetails.credits}}</div>
<button class='sum' onclick='document.getElementById("mForm").style.display = "block";'>Update Details</button>
<div id="mForm">
<form >
<h1>Fill the details</h1>
Password  : <input type='password' v-model='user.password' required/><br/><br/><br/>
Fullname  : <input type='text' v-model='user.fullname' required/><br/><br/><br/>
Phone Number  : <input type='tel' pattern="[0-9]{10}" v-model='user.phoneno' required/><br/><br/><br/>
Email  : <input type='email' v-model='user.email' required/><br/><br/><br/>
<button type='button' v-on:click='updatedetails()' >Update</button>
<button type="button" onclick='document.getElementById("mForm").style.display = "none";'>Close</button>
</form>
</div>
</div>
</template>
<script>
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default{
    data(){
        return{
            user: {
                password : '',
                fullname: '',
                phoneno : '',
                email : ''
            },
            username:''
        }
    },
    methods : 
    {
        updatedetails()
        {
            console.log(this.user.username);
            api.post('/updateuser/'+this.username,this.user)
            .then(res =>{
                console.log(res);
            })
            .catch(error =>{
                console.log('failure');
            } )
        }
    },
    computed : {
        getdetails(){
            var a= JSON.parse(JSON.stringify(this.$store.getters.getdetails));
            this.username=a.username;
            return a;
        }
    }
}
</script>
<style>
#mForm{
    font-size : 20px;
    margin-left : 10px;
}
.sum{
    padding:5px;
    margin : 20px;
    margin-left : 50px;
    font-size: 20px;
}
#mForm{
    display :none;
}
button{
    margin-left:10px;
}
</style>