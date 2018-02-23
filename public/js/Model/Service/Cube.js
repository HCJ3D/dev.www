var Model = Model || {};
Model.Service = Model.Service || {};

Model.Service.Cube = class {
    drawCube(
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

    eraseCube(cubeId) {
        $('#cube-' + cubeId).remove();
    }
}
