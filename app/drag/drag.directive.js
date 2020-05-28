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

            var position = { x: 0, y: 0, limit: 3 }
            
            var start = { x: 0, y: 0 }
            
            var show = { x: 0, y: 0, width: 0, height: 0, borderInit: 0, borderEnd: 0 }
            
            var container = element.parent()

            show.width = container[0].clientWidth

            show.heigth = container[0].clientHeight
            
            show.borderInit = position.limit
            show.borderEnd = (100 - position.limit)

            element.on('mousedown', (event)=> {
    
                // Prevent default dragging of selected content
                event.preventDefault();

                show.x = element[0].offsetLeft
                show.y = element[0].offsetTop

                start.y = (event.screenY - show.y);
                start.x = (event.screenX - show.x);

                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

            });
    
            function mousemove(event) {
                
                //console.log("DRAG MOVE")
                position = Position(event)

                element.css({ top: position.y+'%', left: position.x+"%" });
                
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

            function Position(event){
                
                show.x = (event.screenX - start.x);
                show.y = (event.screenY - start.y);

                position.x = Number((100 / show.width) * show.x)
                position.y = Number((100 / show.heigth) * show.y)

                console.log("position", position)

                // Limitando as bordas

                if (position.x <= show.borderInit) { position.x = show.borderInit }
                if (position.y <= show.borderInit) { position.y = show.borderInit }
                if (position.x >= show.borderEnd) { position.x = show.borderEnd }
                if (position.y >= show.borderEnd) { position.y = show.borderEnd }

                return position
            }
        
        }
    }

  })()