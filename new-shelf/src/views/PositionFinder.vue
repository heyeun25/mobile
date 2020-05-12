<template>
    <div class="container">
        <div class="imgbox" v-bind:style="imgStyle" v-if="pos.img.show">
            {{pos.img.left}},{{pos.img.top}}<br>
            {{pos.img.width}}x{{pos.img.height}}
        </div>
        <div class="box" v-bind:style="boxStyle" v-if="pos.box.show">
            {{pos.box.left}},{{pos.box.top}}<br>
            {{pos.box.width}}x{{pos.box.height}}
        </div>
        <div class="inputbox">
            <input v-model="pos.img.left" v-bind:class="{bold: control=='img'}">,
            <input v-model="pos.img.top" v-bind:class="{bold: control=='img'}"><br>
            <input v-model="pos.img.width" v-bind:class="{bold: control=='img'}">x
            <input v-model="pos.img.height" v-bind:class="{bold: control=='img'}"><br><br>
            <input v-model="pos.box.left" v-bind:class="{bold: control=='box'}">,
            <input v-model="pos.box.top" v-bind:class="{bold: control=='box'}"><br>
            <input v-model="pos.box.width" v-bind:class="{bold: control=='box'}">x
            <input v-model="pos.box.height" v-bind:class="{bold: control=='box'}">
        </div>
    </div>
</template>

<script>
    export default {
        name: "PositionFinder",
        data() {
            return {
                pos: {
                    img: {
                        show: true,
                        left: 0,
                        top: 0,
                        width: 3840,
                        height: 2160
                    },
                    box: {
                        show: true,
                        left: 200,
                        top: 200,
                        width: 3500,
                        height: 1800
                    }
                },
                control: 'img',
            }
        },
        computed: {
            imgStyle() {
                return 'left:' + this.pos.img.left + 'px;top:'+this.pos.img.top+'px;width:'+this.pos.img.width+'px;height:'+this.pos.img.height+'px;';
            },
            boxStyle() {
                return 'left:' + this.pos.box.left + 'px;top:'+this.pos.box.top+'px;width:'+this.pos.box.width+'px;height:'+this.pos.box.height+'px;';
            }
        },
        mounted() {
            window.addEventListener('keydown', this.onKeyDown);
        },
        destroyed() {
            window.removeEventListener('keydown', this.onKeyDown);
        },
        methods: {
            onKeyDown(e) {
                var pos = this.pos[this.control];
                switch(e.key) {
                    case 'z':
                        this.control = (this.control == 'img') ? 'box' : 'img';
                        break;
                    case 'a':
                        pos.left--;
                        break;
                    case 'd':
                        pos.left++;
                        break;
                    case 'w':
                        pos.top--;
                        break;
                    case 's':
                        pos.top++;
                        break;
                    case 'f':
                        pos.left -= 10;
                        break;
                    case 'h':
                        pos.left += 10;
                        break;
                    case 't':
                        pos.top -= 10;
                        break;
                    case 'g':
                        pos.top += 10;
                        break;
                    case 'u':
                        pos.width += 1;
                        break;
                    case 'j':
                        pos.width -= 1;
                        break;
                    case 'i':
                        pos.width += 10;
                        break;
                    case 'k':
                        pos.width -= 10;
                        break;
                    case 'o':
                        pos.height += 1;
                        break;
                    case 'l':
                        pos.height -= 1;
                        break;
                    case 'p':
                        pos.height += 10;
                        break;
                    case ';':
                        pos.height -= 10;
                        break;
                    case '/':
                        pos.show = !pos.show;
                        break;
                }
            }
        }
    }
</script>

<style scoped>
    .container {
        position: fixed;
        left: 0;
        top: 0;
        background: white;
    }
    .imgbox {
        position: fixed;
        background: url("../assets/shelf_BG_wall.png") no-repeat;
        background-size: 100% 100%;
        color: black;
        text-align: center;
        font-size: 50px;
    }
    .box {
        position: fixed;
        background: rgba(255,0,0,0.5);
        color: black;
        text-align: center;
        font-size: 50px;
    }
    input {
        width: 200px;
        height: 50px;
        font-size: 50px;
    }
    .inputbox {
        position: fixed;
        width: 100%;
        text-align: center;
        bottom: 800px;
        font-size: 50px;
        color: rgba(0,0,0,0.5);
    }
    .bold {
        color: blue;
    }
</style>