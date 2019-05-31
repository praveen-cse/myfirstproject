<template>
<div class='tagsearch'>
    <input class='taggg' type='text' placeholder='Enter the tag to search ' v-model='tag' style='border :none'/>
    <button type='button' style='margin-left : 20px;' v-on:click ='fun()'>Search</button>
    <div class='tagfeedd'>
    <strong v-for='entry in arr'>
<p><span style='color:#6495ED;padding: 10px;'>{{entry.question}}</span> From <i>{{entry.author}}</i> @ {{entry.questiontime}}</p>
<p>{{entry.answer}}</p>
</strong>
</div>
    </div>

</template>
<script>
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
    data() {
        return {
            arr : [],
            tag : ''
            }
        },
    methods : {
        fun()
        {   
            var objj=[],i;
            api.get('/getanswerbytag/'+this.tag)
            .then (res =>{
                console.log(res);
                for(i=0;i<res.data.length;i++)
                {
                    let objj={}
                    objj.question=res.data[i].question;
                    objj.questiontime=res.data[i].question_created;
                    objj.author = res.data[i].questioner;
                    objj.hashtags = res.data[i].hashtags;
                    objj.answer=res.data[i].answer;
                    objj.answerer=res.data[i].author_id;
                    objj.answertime=res.data[i].answer_created;
                    //console.log(objj);
                    this.arr.push(objj);
                } 
            })
            .catch(error =>{});
            console.log(this.arr);
        }
    }}
</script>
<style>
.tagsearch{
    font-size : 15px;
}
.taggg{
    width : 500px;
}
.tagfeedd{
    padding : 20px;
}
</style>