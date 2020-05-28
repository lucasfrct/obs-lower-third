/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=> {
    'use strict';

    angular
        .module("obs.lower.third")
        .directive('draggable', ["$document", DragDirective])
        
    function DragDirective($document) {

        return {
            scope: {
                lower: '=lower',
                updade: '=updade'
            },
            link: link,
        }
        
        function link($scope, element, attr) {

            var startX = 0, startY = 0, x = 0, y = 0;
            
            var position = { x: 0, y: 0 }
            
            var container = element.parent()

            element.on('mousedown', (event)=> {
    
                // Prevent default dragging of selected content
                event.preventDefault();

                startY = event.screenY - y;
                startX = event.screenX - x;
                
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup); 

            });
    
            function mousemove(event) {
                
                //console.log("DRAG MOVE")
                y = (event.screenY - startY);
                x = (event.screenX - startX);

                var width = container[0].clientWidth
                var heigth = container[0].clientHeight

                var perW = Number((100 / width) * x)
                var perH = Number((100 / heigth) * y)

                element.css({ top: perH+'%', left: perW+"%" });
                
                position = { x: perW, y: perH }
                
            }
            
            function mouseup() {

                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);

                if(element[0].nodeName == "SPAN") {
                    $scope.lower.text.x = position.x
                    $scope.lower.text.y = position.y
                } else {
                    $scope.lower.image.x = position.x
                    $scope.lower.image.y = position.y
                }

                $scope.$apply()
                $scope.updade($scope.lower)
            }
        
        }
    }

  })()