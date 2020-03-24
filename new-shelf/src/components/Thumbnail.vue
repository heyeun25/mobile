<template>
    <div class="thumbnail">
        <div class="category">
            <span>Interactive</span>
            <span>Ambient</span>
        </div>
        <div v-for="(item, index) in items"
            v-bind:class="itemClass(index)"
            v-bind:key="index">
            <img v-bind:key="'img' + index"
                v-bind:src="imageSrc(item)"/>
        </div>
    </div>
</template>
<script>

export default {
    name: 'Thumbnail',
    props: {
        'changeTheme' : Function,
        'items' : Array,
    },
    data() {
        return {
            select: 0
        }
    },
    mounted() {
    },
    methods: {
        handleKey: function(dir) {
            console.log(dir);
            switch (dir) {
                case 'left':
                    this.select--;
                    this.select < 0 ? this.select = 0 : null;
                    break;
                case 'right':
                    this.select++;
                    this.select >= this.items.length ? this.select = this.items.length-1 : null
                    break;
                case 'enter':
                    this.changeTheme(this.select);
                    break;
                default:
                    break;
            }
            console.log(this.select);
        },
        itemClass: function (idx) {
            return (idx == this.select) ? 'item select' : 'item'
        },
        imageSrc: function(item) {
            return require(`../assets/thumbnail/${item}`);
        }
    },
    destroyed() {
        
    },
}
</script>
<style>
.thumbnail {
    position: absolute;
    top: 1600px;
    width: 100%;
    height: 527px;
    background-color: black;
    display: flex;
    align-items: center;
}

.item {
    /* position: absolute; */
    top: 30px;
    width: 688px;
    height: 388px;
    /* height: 100%; */
    /* background-color: green; */
    outline: 1px solid black;
    transition: all ease .2s;
}

.item > img {
    /* position: absolute; */
    /* top: 5px; */
    width: 100%;
    height: 100%;
    margin-top: 5px;
    /* width: 280px; */
    height: 95%;

}

.select {
    /* box-shadow: 0 0 0 5px aqua inset; */
    /* outline: 5px solid red; */
    transform: scale(1.2)
}

.category {
    margin-left: 10px;
    width: 300px;
    height: 388px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
}

.category > span {
    color: white;
    font-size: 48px;
    font-family: 'SamsungSharpSans';
}
</style>
