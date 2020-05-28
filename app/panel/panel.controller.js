/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=>{
    "use strict";

    angular
        .module("obs.lower.third")
        .controller("panelcontroller",  ["$scope", "storage.service", "broadcast.service", PanelController])

    function PanelController($scope, storage, broadcast) {

        $scope.lower = {            
            active: false,
            title: "",
            effect: { on: 600, type: "slide" },
            scale: { x: 0, y: 0, size: 0 },
            image: { src: "", x: 0, y: 0, size: 10 },
            text: { src: "", x: 0, y: 0, size: 7 }
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

        broadcast.on()

        $scope.fade = (action)=> {

            if ("+" == action) {
                $scope.control.effect.on += 20;
            } else {
                $scope.control.effect.on -= 20;
            }

            storage.add($scope.control)
        }

        $scope.effectsCtrl = (action)=> {

            var index = $scope.effects.indexOf($scope.control.effect.type);
            var i = (index + 1) % $scope.effects.length;

            $scope.control.effect.type = $scope.effects[i]

            storage.add($scope.control)
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
            storage.remove(angular.copy(lower))
            $scope.lowers = storage.load()
            $scope.control.select = {}
        }

        $scope.select = (lower)=> {

            var active = !lower.active
            unselect()
            lower.active = active
            lower.effect = $scope.control.effect
            $scope.control.select = lower
            
            console.log("SELECT: ", $scope.control.select)
            
            if(lower.active) {
                broadcast.send(lower)
            } else {
                broadcast.send(null)
                $scope.updade(lower)
            }

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

    }

})()