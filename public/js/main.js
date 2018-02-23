// Singleston services.
var ajaxService  = new Model.Service.Ajax();
var arrayService = new Model.Service.Array();
var cubeService = new Model.Service.Cube();
var cubesService = new Model.Service.Cubes();
var pointsService = new Model.Service.Points();

$(document).ready(function() {
    var visibleCubes;
    var positionWhenRelevantCubesWereDrawn;
    var positionWhenVisibleCubesWereDrawn;
    var pressedKeys = [];
    var selectedTool = 'hex-ff0000';
    var perspective;

    var me;

    var relevantCubes;

    /**
    ajaxService.getMe().done(function (data) {
        me = data;
        updateMe();
        initPerspective();
    });
    */

    function oneCentisecondLoop() {
        if (pressedKeys[38]) {
            // up arrow
            lookDown();
        }

        if (pressedKeys[40]) {
            // down arrow
            lookUp();
        }

        if (pressedKeys[37]) {
            // left arrow
            $('#keys li[name=L]').css('font-weight', 'bold');
            lookLeft();
        }

        if (pressedKeys[39]) {
            // right arrow
            $('#keys li[name=R]').css('font-weight', 'bold');
            lookRight();
        }

        if (pressedKeys[87]) {
            // w key
            $('#keys li[name=W]').css('font-weight', 'bold');
            moveForward();
        }

        if (pressedKeys[83]) {
            // s key
            $('#keys li[name=S]').css('font-weight', 'bold');
            moveBackward();
        }

        if (pressedKeys[65]) {
            // a key
            $('#keys li[name=A]').css('font-weight', 'bold');
            moveLeft();
        }

        if (pressedKeys[68]) {
            // d key
            $('#keys li[name=D]').css('font-weight', 'bold');
            moveRight();
        }

        if (cubesService.shouldRelevantCubesBeUpdated(me, positionWhenRelevantCubesWereDrawn)) {
            positionWhenRelevantCubesWereDrawn = {
                translateX: me.css.transform.translateX,
                translateY: me.css.transform.translateY,
                translateZ: me.css.transform.translateZ,
            };

            ajaxService.getRelevantCubes().done(function (data) {
                relevantCubes = data;
            });
        }

        if (cubesService.shouldVisibleCubesBeUpdated(
            me,
            relevantCubes,
            positionWhenVisibleCubesWereDrawn
        )) {
            positionWhenVisibleCubesWereDrawn = {
                translateX: me.css.transform.translateX,
                translateY: me.css.transform.translateY,
                translateZ: me.css.transform.translateZ,
            };
            var previouslyVisibleCubes = visibleCubes;
            var newlyVisibleCubes     = cubesService.getVisibleCubes(
                me,
                relevantCubes
            );
            visibleCubes = newlyVisibleCubes;

            cubesService.updateVisibleCubes(
                previouslyVisibleCubes,
                newlyVisibleCubes
            );
        }
    }
    setInterval(oneCentisecondLoop, 10);


    //getEveryoneElse();
    function oneSecondLoop() {
        //getEveryoneElse();
    }
    setInterval(oneSecondLoop, 1000);

    document.onkeydown = keyIsPressed;
    document.onkeyup   = keyIsReleased;

    function keyIsPressed(e) {
        e = e || window.event;
        pressedKeys[e.keyCode || e.which] = true;
    }

    function keyIsReleased(e) {
        e = e || window.event;
        pressedKeys[e.keyCode || e.which] = false;

        $('#keys li').css('font-weight', 'normal');

        var transform = me.css.transform;
        ajaxService.setMe(
            transform.translateX,
            transform.translateY,
            transform.translateZ,
            transform.rotateX,
            transform.rotateY,
            transform.rotateZ
        );
    }

    function getEveryoneElse() {
        ajaxService.getEveryoneElse().done(function(everyoneElse) {
            for (var key in everyoneElse) {
                var user = everyoneElse[key];
                $('#user-' + user.user_id).css('transform', 'translateX(' + user.translate_x + 'px) translateY(' + user.translate_y + 'px) translateZ(' + user.translate_z + 'px) rotateX(' + user.rotate_x + 'deg) rotateY(' + user.rotate_y + 'deg) rotateZ(' + user.rotate_z + 'deg)');
            }
        });
    }

    function getTransformOrigin() {
        var transformOrigin = {
            'x': me.css.transform.translateX + 50,
            'y': me.css.transform.translateY + 50,
            'z': me.css.transform.translateZ,
        };
        return transformOrigin;
    }

    function initPerspective() {
        perspective = {
            'css': {
                'transform': {
                    'translateX': -me.css.transform.translateX + 210,
                    'translateY': 310,
                    'translateZ': -me.css.transform.translateZ + 380,
                    'rotateX': -10,
                    'rotateY': -me.css.transform.rotateY,
                    'rotateZ': 0,
                },
                'transform-origin': {
                    'x': 0,
                    'y': 0,
                    'z': 0,
                },
            },
        };
        updatePerspective();
    }

    function lookDown() {
        var transform = perspective.css.transform;
        if (transform.rotateX <= -45) {
            return;
        }

        transform.rotateX -= 1;
        updatePerspective();
    }

    function lookUp() {
        var transform = perspective.css.transform;
        if (transform.rotateX >= 0) {
            return;
        }

        transform.rotateX += 1;
        updatePerspective();
    }

    function lookLeft() {
        var transform = me.css.transform;
        transform.rotateY += 2;
        updateMe();

        var transform = perspective.css.transform;
        transform.rotateY -= 2;
        updatePerspective();
    }

    function lookRight() {
        var transform = me.css.transform;
        transform.rotateY -= 2;
        updateMe();

        var transform = perspective.css.transform;
        transform.rotateY += 2;
        updatePerspective();
    }

    function moveForward() {
        var transform = me.css.transform;
        var sin = Math.sin(transform.rotateY * Math.PI / 180);
        var cos = Math.cos(transform.rotateY * Math.PI / 180);
        var translateX = 10 * sin;
        var translateZ = 10 * cos;

        transform.translateX -= translateX;
        transform.translateZ -= translateZ;
        updateMe();

        var transform = perspective.css.transform;
        transform.translateX += translateX;
        transform.translateZ += translateZ;
        updatePerspective();
    }

    function moveBackward() {
        var transform = me.css.transform;
        var sin = Math.sin(transform.rotateY * Math.PI / 180);
        var cos = Math.cos(transform.rotateY * Math.PI / 180);
        var translateX = 10 * sin;
        var translateZ = 10 * cos;

        transform.translateX += translateX;
        transform.translateZ += translateZ;
        updateMe();

        var transform = perspective.css.transform;
        transform.translateX -= translateX;
        transform.translateZ -= translateZ;
        updatePerspective();
    }

    function moveLeft() {
        var transform = me.css.transform;
        var sin = Math.sin(transform.rotateY * Math.PI / 180);
        var cos = Math.cos(transform.rotateY * Math.PI / 180);
        var translateX = 10 * cos;
        var translateZ = 10 * sin;

        transform.translateX -= translateX;
        transform.translateZ += translateZ;
        updateMe();

        var transform = perspective.css.transform;
        transform.translateX += translateX;
        transform.translateZ -= translateZ;
        updatePerspective();
    }

    function moveRight() {
        var transform = me.css.transform;
        var sin = Math.sin(transform.rotateY * Math.PI / 180);
        var cos = Math.cos(transform.rotateY * Math.PI / 180);
        var translateX = 10 * cos;
        var translateZ = 10 * sin;

        transform.translateX += translateX;
        transform.translateZ -= translateZ;
        updateMe();

        var transform = perspective.css.transform;
        transform.translateX -= translateX;
        transform.translateZ += translateZ;
        updatePerspective();
    }

    function updateMe() {
        var transform = me.css.transform;
        $('#me').css('transform', 'translateX(' + transform.translateX + 'px) translateY(' + transform.translateY + 'px) translateZ(' + transform.translateZ + 'px) rotateX(' + transform.rotateX + 'deg) rotateY(' + transform.rotateY + 'deg) rotateZ(' + transform.rotateZ + 'deg)');
    }

    function updatePerspective() {
        var transformOrigin = getTransformOrigin();
        $('#perspective').css('transform-origin', transformOrigin.x + 'px ' + transformOrigin.y + 'px ' + transformOrigin.z + 'px');

        var transform = perspective.css.transform;
        $('#perspective').css('transform', 'translateX(' + transform.translateX + 'px) translateY(' + transform.translateY + 'px) translateZ(' + transform.translateZ + 'px) rotateX(' + transform.rotateX + 'deg) rotateY(' + transform.rotateY + 'deg) rotateZ(' + transform.rotateZ + 'deg)');
    }

    $('#universe').on({
        click: function() {
            var translateX = Number($(this).parent().attr('data-css-transform-translate-x'));
            var translateY = Number($(this).parent().attr('data-css-transform-translate-y'));
            var translateZ = Number($(this).parent().attr('data-css-transform-translate-z'));

            if ($(this).is('.front.side')) {
                translateZ += 100;
            } else if ($(this).is('.back.side')) {
                translateZ -= 100;
            } else if ($(this).is('.left.side')) {
                translateX -= 100;
            } else if ($(this).is('.right.side')) {
                translateX += 100;
            } else {
                return;
            }

            addCube(
                'grass',
                translateX,
                translateY,
                translateZ,
                0,
                0,
                0
            );
        },
        mouseenter: function() {
            $(this).css('-webkit-filter', 'brightness(150%)');
            $(this).css('cursor', 'pointer');
        },
        mouseleave: function() {
            $(this).css('-webkit-filter', 'brightness(100%)');
            $(this).css('cursor', 'default');
        },
    }, 'div.cube.grass div.left.side, div.cube.grass div.right.side, div.cube.grass div.front.side, div.cube.grass div.back.side');

    $('#universe').on({
        click: function() {
            var type = selectedTool;
            if (type == 'trash') {
                return;
            }

            var translateX = $(this).parent().attr('data-css-transform-translate-x');
            var translateY = $(this).parent().attr('data-css-transform-translate-y') - 100;
            var translateZ = $(this).parent().attr('data-css-transform-translate-z');
            addCube(
                type,
                translateX,
                translateY,
                translateZ,
                0,
                0,
                0
            );
        },
        mouseenter: function() {
            var type = selectedTool;
            if (type == 'trash') {
                return;
            }

            $(this).css('-webkit-filter', 'brightness(150%)');
            $(this).css('cursor', 'pointer');
        },
        mouseleave: function() {
            var type = selectedTool;
            if (type == 'trash') {
                return;
            }

            $(this).css('-webkit-filter', 'brightness(100%)');
            $(this).css('cursor', 'default');
        },
    }, 'div.cube div.top.side');

    $('#universe').on({
        click: function() {
            var type = selectedTool;
            if (type != 'trash') {
                return;
            }
            if ($(this).hasClass('grass')) {
                return;
            }

            deleteCube($(this).attr('data-cube-id'));
        },
        mouseenter: function() {
            var type = selectedTool;
            if (type != 'trash') {
                return;
            }
            if ($(this).hasClass('grass')) {
                return;
            }

            $(this).find('div.side').css('-webkit-filter', 'brightness(150%)');
            $(this).css('cursor', 'pointer');
        },
        mouseleave: function() {
            var type = selectedTool;
            if (type != 'trash') {
                return;
            }
            if ($(this).hasClass('grass')) {
                return;
            }

            $(this).find('div.side').css('-webkit-filter', 'brightness(100%)');
            $(this).css('cursor', 'default');
        },
    }, 'div.cube');

    function addCube(
        type,
        translateX,
        translateY,
        translateZ,
        rotateX,
        rotateY,
        rotateZ
    ) {
        var cube = drawCube(
            type,
            translateX,
            translateY,
            translateZ,
            rotateX,
            rotateY,
            rotateZ,
            null
        );

        ajaxService.addCube(
            type,
            translateX,
            translateY,
            translateZ,
            rotateX,
            rotateY,
            rotateZ
        ).done(function(data) {
            var cubeId = data.cubeId;
            cube.attr({
                'id': 'cube-' + cubeId,
                'data-cube-id': cubeId,
            });

            relevantCubes[cubeId] = {
                cube_id: cubeId,
                type: type,
                translate_x: translateX,
                translate_y: translateY,
                translate_z: translateZ,
                rotate_x: rotateX,
                rotate_y: rotateY,
                rotate_z: rotateZ,
            };

            visibleCubes[cubeId] = {
                cube_id: cubeId,
                type: type,
                translate_x: translateX,
                translate_y: translateY,
                translate_z: translateZ,
                rotate_x: rotateX,
                rotate_y: rotateY,
                rotate_z: rotateZ,
            };
        });
    }

    function drawCube(
        type,
        translateX,
        translateY,
        translateZ,
        rotateX,
        rotateY,
        rotateZ,
        cubeId
    ) {
        var style = 'transform: translateX(' + translateX + 'px) translateY(' + translateY + 'px) translateZ(' + translateZ + 'px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) rotateZ(' + rotateZ + 'deg);';

        var cube = $(document.createElement('div'));
        cube.append('<div class="front side"></div>');
        cube.append('<div class="back side"></div>');
        cube.append('<div class="left side"></div>');
        cube.append('<div class="right side"></div>');
        cube.append('<div class="top side"></div>');
        cube.append('<div class="bottom side"></div>');
        cube.attr({
            'class': 'cube ' + type,
            'data-css-transform-translate-x': translateX,
            'data-css-transform-translate-y': translateY,
            'data-css-transform-translate-z': translateZ,
            'style': style
        });
        if (cubeId) {
            cube.attr({
                'id': 'cube-' + cubeId,
                'data-cube-id': cubeId,
            });
        }
        $('#universe').append(cube);

        return cube;
    }

    function deleteCube(cubeId) {
        cubeService.eraseCube(cubeId);

        delete relevantCubes[cubeId];
        delete visibleCubes[cubeId];

        $.post('/ajax/delete-cube', {
            cubeId: cubeId,
        });
    }

    $('ul.tools li[data-type=hex-ff0000]').css('border', '2px solid #f00');
    $('ul.tools li').hover(function() {
        $(this).css('cursor', 'pointer');
    });
    $('ul.tools li').click(function () {
        $('ul.tools li').css('border', '2px solid transparent');
        $(this).css('border', '2px solid #f00');
        selectedTool = $(this).attr('data-type');
    });
});
