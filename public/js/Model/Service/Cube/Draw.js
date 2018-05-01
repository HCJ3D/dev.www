Model.Service.Cube.Draw = class {
    draw(
        cubeEntity
    ) {
        var style = 'transform: rotateX(' + cubeEntity.rotateX + 'deg) rotateY(' + cubeEntity.rotateY + 'deg) rotateZ(' + cubeEntity.rotateZ + 'deg) translateX(' + cubeEntity.translateX + 'px) translateY(' + cubeEntity.translateY + 'px) translateZ(' + cubeEntity.translateZ + 'px);';

        var cube = $(document.createElement('hcj3d-cube'));
        cube.append('<hcj3d-cube-side side="bottom"></hcj3d-cube-side>');
        cube.append('<hcj3d-cube-side side="top"></hcj3d-cube-side>');
        cube.append('<hcj3d-cube-side side="left"></hcj3d-cube-side>');
        cube.append('<hcj3d-cube-side side="right"></hcj3d-cube-side>');
        cube.append('<hcj3d-cube-side side="front"></hcj3d-cube-side>');
        cube.append('<hcj3d-cube-side side="back"></hcj3d-cube-side>');
        cube.attr({
            'style': style
        });

        $('hcj3d-perspective').append(cube);

        return cube;
    }
}
