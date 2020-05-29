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

            var container = element.parent()

            var orientation = { x: 0, y: 0}

            var start = { ...orientation }

            var position = { limit: 3, ...orientation }
            
            var show = { width: 0, height: 0, borderInit: 0, borderEnd: 0, ...orientation }

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

                Apply(Position(event))

                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

            });
    
            function mousemove(event) { Apply(Position(event)) }
            
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
    
                $scope.updade($scope.lower)
                $scope.$apply()
            }

            function Position(event){
                
                show.x = (event.screenX - start.x);
                show.y = (event.screenY - start.y);

                position.x = Number((100 / show.width) * show.x)
                position.y = Number((100 / show.heigth) * show.y)
                
                // Limitando as bordas
                
                if (position.x <= show.borderInit) { position.x = show.borderInit }
                if (position.y <= show.borderInit) { position.y = show.borderInit }
                if (position.x >= show.borderEnd) { position.x = show.borderEnd }
                if (position.y >= show.borderEnd) { position.y = show.borderEnd }
                
                console.log("position", position)

                return position
            }

            function Apply(position) {
                element.css({ top: String(position.y)+'%', left: String(position.x)+"%" });
            }
        
        }
    }

  })()