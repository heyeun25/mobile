<template>
    <div class="shelf-plate"
        v-bind:style="{width: lineWidth+'px', height: contentHeight+'px'}">
            <slot></slot>
            <div class="line"
                v-bind:style="{width: parseInt(lineWidth) + 60 + 'px',
                backgroundColor: color}"></div>
            <div class="shadow" v-bind:style="{
                                transform: 'skew(20deg)',
                                bottom: -shadowHeight + 'px',
                                height: shadowHeight + 'px',
                                width: parseInt(lineWidth) + 60 + 'px'}"></div>
    </div>
</template>
<script>
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
export default {
    props: {
        lineWidth: {
            type: Number,
            default: 1000
        },
        shadowDeg: {
            type: Number,
            default: 20
        },
        shadowHeight: {
            type: Number,
            default: 100,
        },
        contentHeight: {
            type: Number,
            default: 500
        },
        color: {
            type: String,
            default: 'white'
        }
    },
    data: () => {
        return {
            lineLeft: 0
        }
    },
    created() {
        this.lineLeft = Math.atan(this.shadowDeg) * this.shadowHeight
    },
}
</script>
<style>
.shelf-plate {
    position: absolute;
    display: flex;
}

.shelf-plate > .line {
    position: absolute;
    left: -30px;
    bottom: 0;
    height: 3px;
}

.shelf-plate > .shadow {
    position: absolute;
    background: linear-gradient(#000000, #ffffff00);
    opacity: 0.3;
    left: -30px;
    transform-origin: 50% 0%;
}
</style>

