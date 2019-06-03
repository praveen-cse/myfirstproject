import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' });
export const store = new Vuex.Store({
    strict: true,
    state: {
        user:{
            username : '',
            phoneno: '',
            fullname : '',
            email : '',
            favorites : '',
            readlater: '',
            credits: ''
        }
    },
    getters :{
        getdetails : state => state.user,
        getuser : state => state.user.username
    },
    mutations: {
        storedetails : (store,payload) =>{
            api.get('/getuserdetails/'+payload)
            .then(res =>{
                store.user.username=res.data[0].username;
                store.user.fullname=res.data[0].fullname;
                store.user.phoneno=res.data[0].phoneno;
                store.user.email=res.data[0].email;
            })
            api.get('/getusercredentials/'+payload)
            .then (res =>{
                console.log(res);
                store.user.favorites=res.data[0].favorites;
                store.user.readlater=res.data[0].read_later;
                store.user.credits=res.data[0].credits;
            })
        },
        addFav : (store,payload) => {
            api.post('/addFav/'+store.user.username+'/'+payload);
        },
        addRead : (store,payload) => {
            api.post('/addRead/'+store.user.username+'/'+payload);
        }
},
    actions: {
        storedetails: (context,payload) => {
            context.commit('storedetails',payload);
        },
        addFav: (context,payload) => {
            context.commit('addFav',payload);
        },
        addRead: (context,payload) => {
            context.commit('addRead',payload);
        }
    }
});
