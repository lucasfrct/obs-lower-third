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
            collection: "",
            scale: { ...element, size: 100 },           // size in 100%
            image: { ...element, size: 10, },           // size in 10%
            text: { ...element, size: 7,  },            // size in 7%
            elements: [...[element]],
        }
        
        $scope.control = {
            go: false,
            add: false,
            edit: false,
            title: "control-lower", // config
            text: { src: "control-lower" },  // config
            effect: { on: 600, type: "slide" },
            select: angular.copy($scope.lower),
            collection: false,
        }

        $scope.effects = [ "slide", "fade" ]

        $scope.lowers = [ ]
        
        console.log("Enable/Disable Local Storage:", storage.check())
        
        //storage.clear()
        $scope.lowers = storage.load()
        $scope.control = (storage.control !== null) ? storage.control : $scope.control;
        $scope.collections = storage.collections
        broadcast.send("control", $scope.control)

        $scope.changeCollection = ()=> {    
            console.log("CHANGE", $scope.control.collection)

            storage.add($scope.control)
            $scope.lowers = storage.load()
            $scope.collections = storage.collections
        }

        $scope.fade = (action)=> {

            if ("+" == action) {
                $scope.control.effect.on = Number($scope.control.effect.on) + 20;
            } else {
                $scope.control.effect.on = Number($scope.control.effect.on) - 20;
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
            $scope.toggleAdd()
        }

        $scope.save = (lower)=> {
            $scope.toggleAdd()
            storage.add(lower)
            $scope.lowers = storage.load()
            $scope.collections = storage.collections
            $scope.control.collection = lower.collection
        }

        $scope.storage = (lower)=> {
            $scope.toggleEdit()
            storage.add(lower)
            $scope.lowers = storage.load()
            $scope.collections = storage.collections
            $scope.control.collection = lower.collection
        }

        $scope.updade = (lower)=> {
            storage.add(lower)
            storage.add($scope.control)
            $scope.lowers = storage.load()
        }

        $scope.edit = (lower)=> {
            $scope.toggleEdit()
            $scope.control.collection = lower.collection
            $scope.lower.collection = lower.collection
        }

        $scope.remove = (lower)=> {
            $scope.toggleEdit()
            storage.remove(lower)
            $scope.lowers = storage.load()
            $scope.collections = storage.collections
        }

        $scope.select = (lower)=> {

            var active = !lower.active
            
            unselect()

            lower.active = active
            $scope.control.select = lower
            
            if(lower.active && $scope.control.go) {
                broadcast.send("lower", lower)
            }

            if(!lower.active && $scope.control.go){
                broadcast.send("lower", null)
                $scope.updade(lower)
            }
            
            console.log("SELECT: ", $scope.control.select)
        }

        $scope.reset = ()=> {
            var reset = confirm("TODAS AS LOWERS SERÃO DELETADAS. \n\nVocê deseja confirmar essa acão?")
            if (reset === true) {
                storage.clear()
            }
        }

        $scope.toggleAdd = ()=> {
            $scope.control.add = !$scope.control.add
        }

        $scope.toggleEdit = ()=> {
            $scope.control.edit = !$scope.control.edit
        }

        $scope.toggleGo = ()=> {
            $scope.control.go = !$scope.control.go
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