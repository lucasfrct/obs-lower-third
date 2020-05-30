/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=>{
    "use strict";

    angular
        .module("obs.lower.third")
        .controller("panelcontroller",  [
            "$scope", 
            "storage.service", 
            "broadcast.service", 
            PanelController
        ])

    function PanelController($scope, storage, broadcast) {

        broadcast.on()
        
        var orientation = { x: 0, y: 0 }
        var element = { ...orientation, size: 0, src: "", type: "", color: "", focused: false, }
        
        $scope.lower = {            
            active: false,
            title: "",
            scale: { ...element, size: 100 },           // size in 100%
            image: { ...element, size: 10, },           // size in 10%
            text: { ...element, size: 7,  },            // size in 7%
            elements: [...[element]],
        }
        
        $scope.control = {
            title: "control-lower", // config
            text: { src: "control-lower" },  // congig
            modal: false,
            remove: false,
            effect: { on: 600, type: "slide" },
            select: angular.copy($scope.lower)
        }

        $scope.effects = [ "slide", "fade" ]

        $scope.lowers = [ ]
        
        console.log("Enable Local Storage", storage.check())
        
        //storage.clear()
        $scope.lowers = storage.load()
        $scope.control = (storage.control !== null) ? storage.control : $scope.control;
        broadcast.send("control", $scope.control)


        broadcast.receive((lower)=> {
            console.log("RECEIVE", lower)
        })

        $scope.fade = (action)=> {

            if ("+" == action) {
                $scope.control.effect.on += 20;
            } else {
                $scope.control.effect.on -= 20;
            }

            storage.add($scope.control)
            broadcast.send("control", $scope.control)
        }

        $scope.effectsCtrl = (action)=> {

            var index = $scope.effects.indexOf($scope.control.effect.type);
            var i = (index + 1) % $scope.effects.length;

            $scope.control.effect.type = $scope.effects[i]

            storage.add($scope.control)
            broadcast.send("control", $scope.control)
        }

        $scope.add = (lower)=> {
            $scope.toggleModal()
        }

        $scope.save = (lower)=> {
            $scope.toggleModal()
            storage.add(angular.copy(lower))
            $scope.lowers = storage.load()
        }

        $scope.updade = (lower)=> {
            storage.add(lower)
            storage.add($scope.control)
            $scope.lowers = storage.load()
        }

        $scope.delete = (lower)=> {
            $scope.toggleRemove()
            $scope.control.select = lower
        }

        $scope.remove = (lower)=> {
            $scope.toggleRemove()
            storage.remove(lower)
            $scope.lowers = storage.load()
        }

        $scope.select = (lower)=> {

            var active = !lower.active
            
            unselect()

            lower.active = active
            $scope.control.select = lower
            
            if(lower.active) {
                broadcast.send("lower", lower)
            } else {
                broadcast.send("lower", null)
                $scope.updade(lower)
            }
            

            console.log("SELECT: ", $scope.control.select)
        }

        $scope.toggleModal = ()=> {
            $scope.control.modal = !$scope.control.modal
        }

        $scope.toggleRemove = ()=> {
            $scope.control.remove = !$scope.control.remove
        }

        $scope.upImage = (lower)=> {
            lower.image.size += 1
            $scope.updade(lower)
        }

        $scope.downImage = (lower)=> {
            lower.image.size -= 1
            $scope.updade(lower)
        }

        $scope.upText = (lower)=> {
            lower.text.size += 0.5
            $scope.updade(lower)
        }

        $scope.downText = (lower)=> {
            lower.text.size -= 0.5
            $scope.updade(lower)
        }

        function  unselect() {
            $scope.lowers = $scope.lowers.map((lower)=> {
                lower.active = false;
                $scope.updade(lower)
                return lower
            })
        }

        function  unfocused() {
            $scope.control.select.elements = $scope.control.select.elements.map((element)=> {
                element.focused = false;
                $scope.updade($scope.control.select)
                return element
            })
        }

    }

})()