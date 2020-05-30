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

        $scope.control = {
            effect: { on: 600, type: "fade", state: ""},
        }

        $scope.lower = {            
            active: false,
            loaded: false,
            title: "",
            effect: { on: 600, type: "slide" },
            scale: { x: 0, y: 0, size: 0 },
            image: { src: "", x: 0, y: 0, size: 10 },
            text: { src: "", x: 0, y: 0, size: 7 }
        }
        
        broadcast.on()

        broadcast.receive("control", (control)=> {
            $scope.control = {...$scope.control, ...control}
            console.log("RECEIVE CONTROL", control)
        })

        broadcast.receive("lower", (lower)=> {
            
            if(null != lower && lower.title.length > 0) { In(lower) }
            
            if (null === lower) { Out($scope.lower) }
            
            $scope.$apply()

            console.log("RECEIVE LOWER", lower)
        })

        function In(lower) {
            
            $scope.control.effect.state = replace($scope.control.effect.type, "-out", "-in")
            
            $scope.$apply()

            $scope.lower = {...lower}
            
            $scope.$apply()
            
            console.log("IN", $scope.lower)

        }

        function Out(lower) {

            $scope.control.effect.state = replace($scope.control.effect.type, "-in", "-out")

            $timeout(()=> {
                lower.active = false

                $scope.$apply()
                
                broadcast.send(lower)
                
                console.log("OUT", lower)

            }, Number($scope.control.effect.on))
        }

        function replace(type, param1, param2) {
            return String(String(type.replace(param1, ""))+param2)
        }
    }

})()