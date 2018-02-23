var Model = Model || {};
Model.Service = Model.Service || {};

Model.Service.Cubes = class {
    getVisibleCubes(me, relevantCubes) {
        var vision = 3000;
        var visibleCubes = [];

        var pointA = new Model.Entity.Point(
            me.css.transform.translateX,
            me.css.transform.translateY,
            me.css.transform.translateZ
        );

        for (var cubeId in relevantCubes) {
            var cubeObject = relevantCubes[cubeId];
            var pointB = new Model.Entity.Point(
                Number(cubeObject.translate_x),
                Number(cubeObject.translate_y),
                Number(cubeObject.translate_z)
            );
            if (pointsService.getDistanceBetweenTwoPoints(pointA, pointB) <= vision) {
                visibleCubes[cubeId] = cubeObject;
            }
        }

        return visibleCubes;
    }

    shouldRelevantCubesBeUpdated(me, positionWhenRelevantCubesWereDrawn) {
        if (typeof me === 'undefined') {
            return false;
        }

        if (typeof positionWhenRelevantCubesWereDrawn === 'undefined') {
            return true;
        }

        var delta = 3000;
        if (
            (Math.abs(positionWhenRelevantCubesWereDrawn.translateX - me.css.transform.translateX) > delta) ||
            (Math.abs(positionWhenRelevantCubesWereDrawn.translateY - me.css.transform.translateY) > delta) ||
            (Math.abs(positionWhenRelevantCubesWereDrawn.translateZ - me.css.transform.translateZ) > delta)
        ) {
            return true;
        }

        return false;
    }

    shouldVisibleCubesBeUpdated(me, relevantCubes, positionWhenVisibleCubesWereDrawn) {
        if ((typeof me === 'undefined')
            || (typeof relevantCubes === 'undefined')
        ) {
            return false;
        }

        if (typeof positionWhenVisibleCubesWereDrawn === 'undefined') {
            return true;
        }

        var vision = 100;
        if (
            (Math.abs(positionWhenVisibleCubesWereDrawn.translateX - me.css.transform.translateX) > vision) ||
            (Math.abs(positionWhenVisibleCubesWereDrawn.translateY - me.css.transform.translateY) > vision) ||
            (Math.abs(positionWhenVisibleCubesWereDrawn.translateZ - me.css.transform.translateZ) > vision)
        ) {
            return true;
        }

        return false;
    }

    updateVisibleCubes(
        previouslyVisibleCubes,
        newlyVisibleCubes
    ) {
        var newKeys = Object.keys(newlyVisibleCubes);

        if (typeof previouslyVisibleCubes !== 'undefined') {
            var oldKeys = Object.keys(previouslyVisibleCubes);
            var cubeIdsToErase = arrayService.getOldKeys(oldKeys, newKeys);

            for (var i = 0, length = cubeIdsToErase.length; i < length; i++) {
                cubeService.eraseCube(cubeIdsToErase[i]);
            }
        }

        var cubeIdsToDraw;
        if (typeof previouslyVisibleCubes !== 'undefined') {
            cubeIdsToDraw = arrayService.getNewKeys(oldKeys, newKeys);
        } else {
            cubeIdsToDraw = newKeys;
        }

        for (var i = 0; i < cubeIdsToDraw.length; i++) {
            var cube = newlyVisibleCubes[cubeIdsToDraw[i]];
            cubeService.drawCube(
                cube.type,
                cube.translate_x,
                cube.translate_y,
                cube.translate_z,
                cube.rotate_x,
                cube.rotate_y,
                cube.rotate_z,
                cube.cube_id
            );
        }
    }
}
