/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=>{
    "use strict";

    angular
        .module("obs.lower.third")
        .service("storage.service", [PanelService])

    function PanelService() {
        var that = this

        this.control = null

        that.check = ()=> {
            var check = false 

            if (typeof(Storage) !== "undefined") {
                check = true
            } else {
                check = false
                alert("No suport Storage")
            }

            return check;
        }

        that.add = (lower)=> {
            if (lower.title && lower.text.src.length > 0) {
                window.localStorage.setItem(lower.title, JSON.stringify(angular.copy(lower)));
                console.log("ADD", lower)
            }
        }

        that.remove = (lower)=> {
            console.log("REMOVE", lower)
            window.localStorage.removeItem(lower.title);
        }

        that.load = ()=> {
            var load = []
            var obj = Object.keys(localStorage).reduce((obj, title) => {
                
                var lower = JSON.parse(localStorage.getItem(title))
                
                if(lower.title == "control-lower" && lower.text.src == "control-lower") {
                    console.log("LOAD Controls", lower)
                    that.control = lower
                } else {
                    load.push(lower)
                }

                return lower

            }, []);

            return load
        }

        that.clear = ()=> {
            console.log("ERASE")
            window.localStorage.clear()
            alert("Erase!")
        }
    }

})()