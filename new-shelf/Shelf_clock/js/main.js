

  const deg = 6;
  const hr = document.querySelector("#hr");
  const mn = document.querySelector("#mn");
  const sc = document.querySelector("#sc");
  const dname = document.querySelector("#dname");
  const dnum = document.querySelector("#dnum");
  /*const temperature-value = document.querySelector("#temperature-value p");
  const temperature-description = document.querySelector("#temperature-description");
  const weather-ico = document.querySelector("#weather-ico");

displayweather(){
  descElement.innerHTML = weather.description;
}
*/


  let now = new Date();

  setInterval(() => {
    now = new Date();
    let hh = now.getHours() * 30;
    let mm = now.getMinutes() *deg;
    let ss = now.getSeconds() *deg;
    hr.style.transform = `rotateZ(${hh+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;
  });


  let dayname = now.getDay(),
      daynum = now.getDate(),
      month = now.getMonth();

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Oct", "Nov", "Dec"];
    let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dname.innerHTML = week[dayname];
    dnum.innerHTML = daynum;
    mo.innerHTML = months[month];

  /*
  Number.prototype.pad = function(digits){
  for(var n = this.toString(); n.length < digits; n = 0 + n);
  return n;

  function getTodayLabel(){
    var day = new Date();
    var dname = day. getDay(),
        dnum = day.getDate(),
        mo = day.getMonth();
        }

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Oct", "Nov", "Dec"];
        var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var ids = ["dayname", "daynum", "Month"];
        var values = [week[dname], dnum.pad(2), month[mo];
        for(var i = 0; i < ids.length: i++)
        document.getElementById(ids[i]).firstChild.nodValue = values[i];
  }
  */
  /*
  function initClock(){
    updateClock();
    window.setInterval("updateClock()",1);
  }
  */
