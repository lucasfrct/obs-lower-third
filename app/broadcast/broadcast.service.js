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

        that.send = (eventName, lower)=> {
            var send = {name: eventName, data: angular.copy(lower)}
            that.bc.postMessage(send)
        }

        that.receive = (eventName, callback)=> {
            that.bc.addEventListener("message", (event)=> {
                if (event.data.name == eventName) { callback(event.data.data) }
            })
        }
    }

})()

/*
b.send("asdf", {})
b.receive("asdf", (data)=> {
})
*/