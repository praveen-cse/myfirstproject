<template>
<div id="mini-toastr" class="mini-toastr">
 
   
    <div class="mini-toastr__notification -error">
        <div class="mini-toastr-notification__title">{{this.notif.id}}</div>
        <div class="mini-toastr-notification__message">{{this.notif.desc}}</div>
    </div>
 
    <div class="mini-toastr__notification -success">
        <div class="mini-toastr-notification__title">Notif 2</div>
        <div class="mini-toastr-notification__message">Desc 2</div>
    </div>
</div>
</template>

<script>
import miniToastr from 'mini-toastr'
miniToastr.init()

export default {
    data(){
        return{
            notif:{
                id:"Event",
                desc:"Get Together planned on 30th May"
            }
        }
    },
    methods: {
         notif() {
            miniToastr.success(message, title,timeout, cb, config)
        },
         getFeed () {
            api.get('/feed')
            .then(res => {
                this.data = res.data
                console.log(res)
                return this.data
            })
            .catch(error => {
                console.log(error);
            })
        }
    },
    beforeMount(){
        this.notif();
    }
}
</script>