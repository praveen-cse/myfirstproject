<template>
<div id='feed'>
<div class='center'>
    <button class="open-button" onclick='document.getElementById("myForm").style.display = "block";document.getElementById("feeedd").style.display="none";document.getElementById("ff").style.display="none";'>Post a Question</button>
    <div class="form-popup" id="myForm">
    <form class="form-container" id='forr'>
        <h1>Add Question</h1>
        Question  : <br/><br/><input type='text' v-model='question.question' required/><span id='requir'>*</span><br/><br/><br/>
        Tags  : <br/><p id='hash' v-model='question.hashtags'>{{question.hashtags}}</p><input type='text' id='ne' v-model='temp'/><span id='requir'>*</span><input type='button' onclick="document.getElementById('ne').value='';" v-on:click="add();" value='+add tag'/>
        <button type='button' class="btn" v-on:click='addquestion();' value='POST'>Post</button>
        <button type='reset' class='btn'>Reset</button>
        <button type="button" class="btn cancel" onclick='document.getElementById("myForm").style.display = "none";document.getElementById("feeedd").style.display="block";'>Close</button>
    </form>
    </div>
</div>

<div class='tagsearch' autocomplete='off' >
    <input class='taggg' type='text' placeholder='Enter the tag to search' v-on:keyup="changeInput()" v-model='tag' style='border :none'/>
    <button class="fas fa-search" type='button'  style='margin-left : 20px;' v-on:click ='fun()'></button>
    <div id="result"></div>
    <div class='tagfeedd' id='ff'>
        <strong v-for='entry in arr'>
            <div class='ques'>
           <p><i>{{entry.author}}</i> {{entry.question}} at {{entry.questiontime}}</p>
            <p><i>{{entry.answerer}}</i>  {{entry.answer}}</p>
            </div>
            <button type='button' v-on:click='addFav(entry.question_id)'>Add to Favorites</button>
            <button type='button' v-on:click='addRead(entry.question_id)'>Read Later</button>
            <input type='text' v-if="checkuser(entry.author)" v-model="answer" placeholder="Enter Your Answer Here...">
            <button type='button' v-on:click='addAnswer(entry.question_id)'>Answer</button>
        </strong><br/><br/>
        <div class='closebutt'>
        <button type='button' v-on:click='close();'>Close</button>
        </div>
    </div> 
</div>

<div class='feed' id='feeedd'>
    <div class='userfeed'>
        <strong v-for='entry in field'>
            <div class='ques'>
            <p><i>{{entry.author}}</i> {{entry.question}} at {{entry.questiontime}}</p>
            <p><i>{{entry.answerer}}</i> {{entry.answer}}</p>
            </div>
            <button type='button' v-on:click='addFav(entry.question_id)'>Add to Favorites</button>
            <button type='button' v-on:click='addRead(entry.question_id)'>Read Later</button>
             <input type='text' v-if="checkuser(entry.author)" v-model="answer" placeholder="Enter Your Answer Here...">
            <button type='button' v-on:click='addAnswer(entry.question_id)'>Answer</button>
        </strong>
    </div>
    <div class='closebutt'>
    <button class='butt' v-on:click='fillFeed()' type='button'>Load More</button>
    </div>
</div>

</div>
</template>
<script>
var people = [];
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
    data(){
        return {
            question : {
                question : '',
                hashtags : '',
            },
            temp : '',
            arr : [],
            tag : '',
            field : [],
            answer : ''
        }
    },
    methods : {
        checkuser(name){
            console.log(name);
            if(name == this.$store.getters.getuser)
                return false;
            return true;
        },

        matchPeople(input) {
            var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
            return people.filter(function(person) {
            if (person.match(reg)) {
            return person;
            }
        });
        },

        changeInput() {
            console.log(this.tag);
            var autoCompleteResult = this.matchPeople(this.tag);
            document.getElementById("result").innerHTML = autoCompleteResult;
        },
        addAnswer(id){
            if(this.answer=='')
            {
                window.alert('Enter Answer First or No Authorization...');
                return;
            }
            console.log(id);
            var ans={
                answer : this.answer,
                question_id : id,
                author : this.$store.getters.getuser
            }
            console.log(ans);
            api.post('/addAnswer',ans)
            .then(res =>{
                console.log(res);
                window.alert('Answer Added');
            })
            .catch(err => {
                console.log(err);
            })
            var credit=20;
            api.post('/addcredit/'+ans.author+'/'+credit);
        },
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
            var credit=5;
            api.post('/addcredit/'+ans.author+'/'+credit);
        },
        addFav(id)
        {
            console.log(id);
            this.$store.dispatch('addFav',id);
        },
        addRead(id)
        {
            this.$store.dispatch('addRead',id);
        },
        add(){
            this.question.hashtags += this.temp + ',';
        },
        fun()
        {   
            document.getElementById('feeedd').style.display='none';
            document.getElementById('ff').style.display='block';
            var objj=[],i,k;
            if(this.tag==''){
                window.alert('Enter the tag first');
                return;
            }
            people.push(this.tag);
            api.get('/getanswerbytag/'+this.tag)
            .then (res =>{
                console.log(res);
                for(i=0;i<res.data.length;i++)
                {
                    let objj={}
                    objj.question_id=res.data[i].question_id;
                    objj.question=res.data[i].question;
                    objj.questiontime=res.data[i].question_created;
                    objj.author = res.data[i].questioner;
                    objj.hashtags = res.data[i].hashtags;
                    objj.answer=res.data[i].answer;
                    objj.answerer=res.data[i].author;
                    objj.answertime=res.data[i].answer_created;
                    console.log(objj);
                    this.arr.push(objj);
                } 
            })
            .catch(error =>{});
            console.log(this.arr);
        },
        close(){
             document.getElementById('ff').style.display='none';
            document.getElementById('feeedd').style.display='block';
        },
        fillFeed()
        {
            var a=this.$store.getters.getuser;
            var objj=[],i;
            api.get('/getanswer/'+a)
            .then (res =>{
                console.log(res);
                for(i=0;i<res.data.length;i++)
                {
                    let objj={}
                    objj.question_id=res.data[i].question_id;
                    objj.question=res.data[i].question;
                    objj.questiontime=res.data[i].question_created;
                    objj.author = res.data[i].questioner;
                    objj.hashtags = res.data[i].hashtags;
                    objj.answer=res.data[i].answer;
                    objj.answerer=res.data[i].author;
                    objj.answertime=res.data[i].answer_created;
                    this.field.push(objj);
                } 
            })
            .catch(error =>{});
            console.log(this.field);
        }

    }
}
</script>
<style>
i{
    font-size: 20px;
}
.taggg {
    width: 400px;
    margin-top: 100px;
    height : 40px;
    margin-right :50px;
}
.center{
  float : left;
  margin-top : 100px;
}
.butt{
    margin-top: 50px;
    margin-right: 50px;
}
.ques {
    margin-left : 50px;
    margin-bottom : 30px;
    margin-top : 30px;
    padding : 15px;
    text-align : left;
    display: flex;
    width : 700px;
    align-items: stretch;
    flex-direction: column;
    /* background-color: DodgerBlue; */
    /* border-style: dotted; */
    border: 1px solid #e67e22;
}
.closebutt{
    text-align:center;
    margin-right: 300px;
}
.buttonn{
    margin-left : 150px;
}
.open-button {
  color: white;
  padding: 15px;
  border: none;
  cursor: pointer;
}
.userfeed{
    text-align: center;
    margin-left : 500px;
}
#result{
    text-align: center;
    margin-right : 200px;
    margin-top : 30px;
}
#ff{
    display: none;
}
.form-popup {
  display: none;
  width : 400px;
  float : right;
  margin-top : 200px;
}
.feed{
    text-align : center;
    margin-top:10%; 
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
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}
.tagsearch{
    font-size : 15px;
    margin-top :100px;
}
.taggg{
    width : 500px;
}
.tagfeedd{
        margin-left : 500px;
    padding : 20px;
    margin-top: 100px;
}
</style>