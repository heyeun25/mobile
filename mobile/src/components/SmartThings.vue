<template>
    <div class="smart-container">
        <img class="header" src="../assets/main/1_Upper Tab.png" />
        <img class="header2" src="../assets/main/2_Lower Tab.png" />
        <div class="splide">
            <div class="splide__track" v-bind:style="{height: '500px'}">
               <ul class="splide__list">
                    <li class="splide__slide">
                        <Theme v-bind:num="1"></Theme>
                    </li>
                    <li class="splide__slide">
                        <Theme v-bind:num="2"></Theme>
                    </li>
                    <li class="splide__slide">
                        <Theme v-bind:num="3"></Theme>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import Theme from './Theme';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export default {
    components: {
        Theme
    },
    mounted() {
        new Splide( '.splide', {
            // type     : 'loop',
            // autoHeight: true,
            direction: 'ttb',
            // height: '576px',
            // height: '489px'
            heightRatio: 1.63,
        }).mount();
    },
}
</script>
<style>
.smart-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.splide__slide {
}

.header2 {
    width: 107%;
}

</style>

