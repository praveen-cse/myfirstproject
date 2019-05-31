<template>
<div id='feed'>
<addQuestion></addQuestion>
<tagSearch></tagSearch>
<portal></portal>
</div>
</template>
<script>
import tagSearch from './tagSearch.vue'
import portal from './portal.vue'
import addQuestion from './addQuestion.vue'
//import addTest from './addTest.vue'
export default {
    components : {
        'addQuestion' : addQuestion,
        //'addTest' : startTest,
        'portal' : portal,
        'tagSearch' : tagSearch
        //'startSurvey' : startSurvey
    },
    methods : {
        
    }
}
</script>