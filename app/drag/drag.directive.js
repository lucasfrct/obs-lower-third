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

            var orientation = { x: 0, y: 0}

            var start = { ...orientation }

            var position = { limit: 3, ...orientation }
            
            var container = { ...Parent(), borderInit: 0, borderEnd: 0, ...orientation }
            
            container.borderInit = position.limit
            container.borderEnd = (100 - position.limit)

            element.on('mousedown', (event)=> {
    
                // Prevent default dragging of selected content
                event.preventDefault();

                container = {...Parent(), ...container}

                container.x = element[0].offsetLeft
                container.y = element[0].offsetTop

                start.y = (event.screenY - container.y);
                start.x = (event.screenX - container.x);

                Apply(Position(event))
                //selected(true)

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
                
                container.x = (event.screenX - start.x)
                container.y = (event.screenY - start.y)

                position.x = Number(((100 / container.width) * container.x) + 0.01)
                position.y = Number(((100 / container.heigth) * container.y ) + 0.01)
                
                // Limitando as bordas
                if (position.x <= container.borderInit) { position.x = container.borderInit }
                if (position.y <= container.borderInit) { position.y = container.borderInit }
                if (position.x >= container.borderEnd) { position.x = container.borderEnd }
                if (position.y >= container.borderEnd) { position.y = container.borderEnd }

                return position
            }

            function Apply(position) {
                element.css({ top: String(position.y)+'%', left: String(position.x)+"%" });
            }

            function selected(state = false) {

                var setBorder = ""

                if (state) {
                    setBorder = "#F00"
                } else {
                    setBorder = "transparent";
                }

                element.css({ borderColor: setBorder })
            }

            function Parent() {
                var parent = element.parent()
                return { width: parent[0].clientWidth, heigth: parent[0].clientHeight }
            }
        
        }
    }

  })()