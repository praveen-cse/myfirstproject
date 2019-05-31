<template>
<div class='feed'>
    <div class='userfeed'>
<strong v-for='entry in field'>
<p><span style='color:#6495ED;padding: 10px;'>{{entry.question}}</span> From <i>{{entry.author}}</i> @ {{entry.questiontime}}</p>
<p>{{entry.answer}}</p>
</strong>
</div>
<button v-on:click='fillFeed()' type='button'>Load More</button>
</div>
</template>
<script>
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
    data() {
        return {
            field : []
            }
        },
    methods : {
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
                    objj.question=res.data[i].question;
                    objj.questiontime=res.data[i].question_created;
                    objj.author = res.data[i].questioner;
                    objj.hashtags = res.data[i].hashtags;
                    objj.answer=res.data[i].answer;
                    objj.answerer=res.data[i].author_id;
                    objj.answertime=res.data[i].answer_created;
                    this.field.push(objj);
                } 
            })
            .catch(error =>{});
            console.log(this.field);
        }
    },
    beforeMount(){
            this.fillFeed();
        }
}
</script>
<style>
.feed{
    margin :30px;
}
</style>