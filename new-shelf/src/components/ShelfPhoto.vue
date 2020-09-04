<template>
<div class="shelf-photo-container">
    <img v-bind:src="src"/>
</div>
</template>
<script>
export default {
    props: ['src'],
}
</script>
<style>
.shelf-photo-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
}

.shelf-photo-container > img {
    width: 100%;
    height: 100%;
}

</style>
