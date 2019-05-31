<template>
      <div>
      <userdetails></userdetails>
      <feed></feed>
      </div>
</template>

<script>
import feed from './Feed.vue'
import userdetails from './userdetails.vue'
import noti from './noti.vue'
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
  components:{
    'noti' : noti,
    'userdetails' : userdetails,
    'feed' : feed
  },
  data () {
    return {
      answer:{
          author:'',
          question:'',
          category: '',
          upvotes: ''
      }
      }
    },
  methods: {
  }
}
</script>