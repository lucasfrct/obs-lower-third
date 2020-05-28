/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=> {
    "use strict"

    angular
        .module("obs.lower.third")
        .service("broadcast.service", [BroadcastService])

    function BroadcastService() {
        var that = this
        that.bc 

        that.on = ()=> {
            that.bc = new BroadcastChannel('obs-lower-channel')
        }

        that.send = (lower)=> {
            that.bc.postMessage(JSON.stringify(angular.copy(lower)))
        }

        that.receive = (callback)=> {
            that.bc.onmessage = function (ev) {
                callback(JSON.parse(ev.data))
            }
        }
    }

})()