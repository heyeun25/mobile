<template>
    <div class="info">
        <div class="clock">
            <img v-bind:src="clockImgs[clockIdx]"/>
            <div class="hour">
                <div ref="hr" class="hr" id="hr">
                    <img v-bind:src="hourImgs[clockIdx]" />
                </div>
            </div>
            <div class="min">
                <div ref="mn" class="mn" id="mn">
                    <img v-bind:src="minImgs[clockIdx]" />
                </div>
            </div>
            <div class="sec">
                <div ref="sc" class="sc" id="sc">
                    <img v-bind:src="secImgs[clockIdx]" />
                </div>
            </div>
            <div class="date">
                <div class="dt">
                    <span id="dname">{{day}},</span>
                    <span id="dnum">{{date}},</span>
                    <span id="mo">{{month}}</span>
                </div>
            </div>
        </div>
        <div class="air">
            <img v-bind:src="tempImgs[clockIdx]"/>
            <div class="particle"></div>
                <div class="letter">
                    <span id="anum">89</span>
                    <span id="mum">AQ</span>
                    <span id="sign">STAY<br>HOME</span>
                </div>
            </div>
            <div class="weather">
            <img v-bind:src="weatherImgs[clockIdx]"/>
            <div class="letter">
                <span id="temp-value">27</span>
                <span id="c">℃</span>
                <span id="temp-description">PARTLY<br>CLOUDY</span>
            </div>
            <div class="cloud1"><img src="../assets/cloud.png"></div>
            <div class="cloud2"><img src="../assets/cloud.png"></div>
        </div>
    </div>
</template>
<script>
// import { clearTimeout } from 'timers';
let timer = null;
export default {
    name: 'Info',
    props: {
        clockIdx: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            day: 'Mon',
            date: '00',
            month: '0',
            clockImgs: [
                require('../assets/clock/orange.png'),
                require('../assets/clock/green.png'),
            ],
            hourImgs: [
                require('../assets/clock/hour.png'),
                require('../assets/clock/hour_2.png'),
            ],
            minImgs: [
                require('../assets/clock/min.png'),
                require('../assets/clock/min_2.png'),
            ],
            secImgs: [
                require('../assets/clock/sec.png'),
                require('../assets/clock/sec_2.png'),
            ],
            tempImgs: [
            ],
            weatherImgs: [
            ],
        }
    },
    mounted() {
        console.log('info vue');
        const deg = 6;
        let now = new Date();
        let that = this;
        timer = setInterval(() => {
            now = new Date();
            let hh = now.getHours() * 30;
            let mm = now.getMinutes() *deg;
            let ss = now.getSeconds() *deg;

            that.$refs.hr.style.transform = `rotateZ(${hh+(mm/12)}deg)`;
            that.$refs.mn.style.transform = `rotateZ(${mm}deg)`;
            that.$refs.sc.style.transform = `rotateZ(${ss}deg)`;
        });

        let dayname = now.getDay(),
            daynum = now.getDate(),
            month = now.getMonth();

        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Oct", "Nov", "Dec"];
        let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        this.day = week[dayname];
        this.date = daynum;
        this.month = months[month];
    },
    beforeDestroy() {
        clearTimeout(timer);
    },
}
</script>
<style>
.info {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
.clock
{
  bottom: 0;
  margin: 0 20px 0 0;
  width: 495px;
  height: 475px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: rgb(234,230,215); */
  filter: drop-shadow(0px 8px 8px rgba(0,0,0,.3));
}
.date{
  color: black;
  position: absolute;
  padding-left: 250px;
}
.dt >span
{
  font-family: "SOU-400";
  font-size: 25px;
}
.hour,
.min,
.sec
{
  position: absolute;
}
.hour, .hr
{
  width: 320px;
  height: 320px;
  z-index: 3;
}
.min, .mn
{
  width: 400px;
  height: 400px;
  z-index: 2;
}
.sec, .sc
{
  width: 420px;
  height: 420px;
  z-index: 1;
}
.hr,.mn,.sc
{
  display: flex;
  justify-content: center;
  position: absolute;
  border-radius: 50%;
}
.hr > img
{
  content: '';
  position: absolute;
  width: 8px;
  height: 190px;
  /* background: black; */
}
.mn > img
{
  content: '';
  position: absolute;
  width: 3px;
  height: 225px;
  /* background: black; */
}
.sc > img
{
  content: '';
  position: absolute;
  /* width: 1px; */
  /* height: 210px; */
  /* background: red; */
}
.air
{
  margin: 0 20px;
  width: 331px;
  height: 428px;
  left: 766px;
  display: flex;
  background: rgb(252,132,79);
  filter: drop-shadow(0px 8px 8px rgba(0,0,0,.3))
}
.air >.letter
{
  position: absolute;
  width: 150px;
  bottom: 30px;
  left: 30px;
}
.letter >span
{
  font-family: "SSS-Regular";
  font-size: 50px;
  color: white;
}
#mum,#c
{
  font-size: 25px;
}
#anum, #temp-value{
  font-size: 70px;
}

.weather
{
  margin: 0 0 0 20px;
  width: 413px;
  height: 294px;
  left: 1141px;
  display: flex;
  overflow: hidden;
  background: rgb(136,206,239);
  filter: drop-shadow(0px 8px 8px rgba(0,0,0,.3))
}
.weather >.letter
{
  position: absolute;
  width: 180px;
  bottom: 30px;
  left: 30px;
}
.cloud1{
  position: absolute;
  bottom: -20px;
  animation: slide_cloud 30s linear infinite;
}
.cloud2{
  position: absolute;
  top: -30px;
  animation: slide_cloud2 30s linear infinite;
}
.cloud2 > img{
  width: 275px;
  height: 216px;
}
@keyframes slide_cloud {
  0% {
      transform: translateX(-320px);
      opacity: 0.6;
    }
    50% {
      transform: translateX(300px);
    }
    95% {
      transform: translateX(-300px);
    }
    100% {
      transform: translateX(-320px);
      opacity: 0.6;
    }
}
@keyframes slide_cloud2 {
  0% {
      transform: translateX(500px);
      opacity: 0.6;
    }
    45% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(-10px);
    }
    95% {
      transform: translateX(450px);
    }
    100% {
      transform: translateX(500px);
      opacity: 0.6;
    }
}
</style>
