/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=>{
    "use strict";

    angular
        .module("obs.lower.third")
        .controller('displaycontroller', ["$scope", "$timeout", "broadcast.service", DisplayController])

    function DisplayController($scope, $timeout, broadcast) {

        $scope.lower = {            
            active: false,
            title: "",
            effect: { on: 600, type: "slide" },
            scale: { x: 0, y: 0, size: 0 },
            image: { src: "", x: 0, y: 0, size: 10 },
            text: { src: "", x: 0, y: 0, size: 7 }
        }
        
        broadcast.on()

        broadcast.receive((lower)=> {

            if(null === lower) {
                Out($scope.lower)
            } else {
                In(lower)
            }

            $scope.$apply()
        })

        function In(lower) {
            console.log("IN", lower)
            lower.effect.type = lower.effect.type+"-in"
            $scope.lower = lower
        }

        function Out(lower) {
            console.log("OUT")
            lower.effect.type = lower.effect.type.replace("-in", "")+"-out"

            $timeout(()=> {
                lower.active = false
            }, (lower.effect.on + 100))
        }
    }

})()