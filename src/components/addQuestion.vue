<template>
<div class='center'>
<button class="open-button" onclick='document.getElementById("myForm").style.display = "block";'>Post a Question</button>
<div class="form-popup" id="myForm">
<form class="form-container">
<h1>Add Question</h1>
Question  : <br/><br/><input type='text' v-model='question.question' required/><span id='requir'>*</span><br/><br/><br/>
Tags  : <br/><p id='hash' v-model='question.hashtags'>{{question.hashtags}}</p><input type='text' id='ne' v-model='temp'/><span id='requir'>*</span><input type='button' v-on:click="add()" value='+add tag'/>
<button type='button' class="btn" v-on:click='addquestion();' value='POST'>Post</button>
<button type="button" class="btn cancel" onclick='document.getElementById("myForm").style.display = "none";'>Close</button>
</form>
</div>
</div>
</template>
<script>
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default{
    data(){
        return {
            question : {
                question : '',
                hashtags : '',
            },
            temp : ''
        }
    },
    methods: {
        addquestion(){
            if(this.question.question == '')
            {
                window.alert('Enter question first');
                return;
            }
            var a={
                ques : this.question.question,
                questioner : this.$store.getters.getuser,
                hashtags : this.question.hashtags
            };
            console.log(a);
            api.post('/addquestion',a)
            .then(res =>{
                window.alert('Question Added');
            })
            .catch(error => {
                window.alert('Error on Post');
            })
        },
        add(){
            this.question.hashtags += this.temp + '\n';
        }
    }
}
</script>
<style>
.center{
  float : left;
  margin-left : 50px;
}
.open-button {
  background-color: #555;
  color: white;
  padding: 15px;
  border: none;
  cursor: pointer;
}
.form-popup {
  display: none;
  width : 500px;
  float : right;
  margin-top : 100px;
}
.form-container {
  padding: 10px;
}
.form-container input[type=text] {
  width: 70%;
  height : 50px;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
}
.form-container .btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  font-size: 15px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  text-align : center;
  margin : 20px;
  margin-left : 50px;
}
.form-container .cancel {
  background-color: red;
}
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}
</style>