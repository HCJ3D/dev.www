var Model = Model || {};
Model.Service = Model.Service || {};

Model.Service.Ajax = class {
    addCube(
        type,
        translateX,
        translateY,
        translateZ,
        rotateX,
        rotateY,
        rotateZ,
        cubeObject
    ) {
        return $.post('/ajax/add-cube', {
            type: type,
            translateX: translateX,
            translateY: translateY,
            translateZ: translateZ,
            rotateX: rotateX,
            rotateY: rotateY,
            rotateZ: rotateZ,
        });
    }

    getEveryoneElse() {
        return $.get('ajax/get-everyone-else');
    }

    getMe() {
        return $.get('ajax/get-me');
    }

    getRelevantCubes() {
        return $.get('ajax/get-relevant-cubes');
    }

    setMe(translateX, translateY, translateZ, rotateX, rotateY, rotateZ) {
        $.post('/ajax/set-me', {
            translateX: translateX,
            translateY: translateY,
            translateZ: translateZ,
            rotateX: rotateX,
            rotateY: rotateY,
            rotateZ: rotateZ,
        });
    }
}
