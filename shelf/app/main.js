var socket = io(location.origin);
socket.on('connect', function (soc) {
    console.log("APP Connected!");
});

var EVTDATA = {
    target: 'mirror',
    evtName: null,
    color: 'rgb(0,0,0)'
}
var colorTarget = 'shelf55';
$(function() {
    function emitAppMsg () {
        var data = {
            target: EVTDATA.target,
            evtName: EVTDATA.evtName,
            color: EVTDATA.color
        }
        socket.emit('appMsg', data);
        console.log("appMsg(" + JSON.stringify(data) + ")")
    };

    $('.btn').click(function() {
        EVTDATA.target = $(this).attr('data-target');
        EVTDATA.evtName = $(this).attr('data-name');
        emitAppMsg();
    });

    $('.color_target').click(function() {
        colorTarget = $(this).attr('data-target');
    });
        // Basic instantiation:
        $('#cp2').colorpicker({
            // inline: true,
            container: true,
            format: null,
            customClass: 'colorpicker-2x',
            sliders: {
                saturation: {
                    maxLeft: 600,
                    maxTop: 600
                },
                hue: {
                    maxTop: 600
                },
                alpha: {
                    maxTop: 600
                }
            }
        });

        // // Example using an event, to change the color of the .jumbotron background:
        $('#cp2').on('colorpickerChange', function(event) {
            $('.jumbotron').css('background-color', event.color.toString());
            console.log("color(" + event.color.toString() + ")")
            EVTDATA.target = colorTarget;
            EVTDATA.evtName = 'color';
            EVTDATA.color = event.color.toString();
            emitAppMsg();
        });

});
