<template>
    <div class="account" v-bind:style="{'backgroundColor' : bgColor}">
        <img ref="myImage" 
        v-bind:class="imgClass"
        v-bind:src="require('../assets/account/' + imgs[id])"/>
    </div>
</template>
<script>
var getMobile;
var timer;
export default {
    name: 'Account',
    props: {
        id: {
            type: Number,
            default: 0,
        },
        bgColor: {
            type: String,
            default: "navy"
        }
    },
    data() {
        return {
            imgs: [
                "walker.png",
                "dunphy's.png",
                "diana.png"
            ],
            imgClass: 'accountImg',
            movePage: [
                'health',
                'memo',
                'magnet'
            ]
        }
    },
    methods: {
        getMobile: function(data) {
            if (data.value == "change") {
                this.imgClass= "accountImg out";
                var myRouter = this.$router;
                var movePage = this.movePage[this.id];
                (timer ? clearTimeout(timer) : null);
                timer = setTimeout(() => {
                    if (myRouter.currentRoute.name !== movePage) {
                        myRouter.push({name: movePage})
                    }
                }, 3000)
            }
        }
    },
    mounted() {
        console.log('id ', this.id);
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
        var that = this;
        this.$refs.myImage.onload = function() {
            that.imgClass = "accountImg in";
        }
    },
    destroyed() {
        clearTimeout(timer);
    },
}
</script>

<style>
.account {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.accountImg {
    position: absolute;
    width: 65%;
    top: 50%;
    left: -50%;
    transform: translate(-50%, -50%);
    
}

.in {
    animation: 3s slidein forwards;
}

.out {
    animation: 3s slideOut forwards;
}

@keyframes slidein {
    from {
        left: -50%;
    }
    to {
        left: 50%;
    }
}

@keyframes slideOut {
    from {
        left: 50%;
    }
    to {
        left: 150%;
    }
}
</style>
