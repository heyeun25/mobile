<template>
    <div class="qr-scanner">
        <div v-if="loading" id="loadingMessage">{{msg}}</div>
        <canvas id="canvas" ref="canvas" hidden></canvas>
        <div v-if="outputContainer" id="output" hidden>
            <div v-if="showOutputMsg" id="showOutputMsg">{{outputMsg}}</div>
            <div v-if="outputData"><b>Data:</b> <span id="outputData"></span></div>
        </div>
    </div>
</template>
<script>

import jsQR from "jsqr";
var canvas, ctx, video;
export default {
    data() {
        return {
            msg: '🎥 Unable to access video stream (please make sure you have a webcam enabled)',
            loading: true,
            outputContainer: false,
            showOutputMsg: false,
            outputData: false,
            outputMsg: 'No QR code detected.',
        }
    },
    methods: {
        drawLine(begin, end, color) {
            ctx.beginPath();
            ctx.moveTo(begin.x, begin.y);
            ctx.lineTo(end.x, end.y);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    },
    mounted() {
        // const code = jsQR();
        // if (code) {
        //     console.log("Found QR code", code);
        // }
        alert('hello');
        canvas = this.$refs.canvas;
        ctx = canvas.getContext('2d');
        video = document.createElement('video');

        window.navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment"}
        }).then(function(stream) {
            alert('hey');
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(tick);
        });

        var that = this;
        function tick() {
            // console.log('video');
            that.msg = "⌛ Loading video..."
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                that.loading = false;
                canvas.hidden = false;
                that.outputContainer = true;

                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                if (code) {
                    that.drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                    that.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                    that.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                    that.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                    that.showOutputMsg = true;
                    that.outputData = true;
                    that.outputMsg = code.data;
                } else {
                    that.showOutputMsg = false;
                    that.outputData = true;
                }
            }
            requestAnimationFrame(tick);
        }
    },
}
</script>
<style>
.qr-scanner {

}
</style>

