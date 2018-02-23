var Model = Model || {};
Model.Entity = Model.Entity || {};

Model.Entity.Cube = class {
    constructor(
        cubeId,
        type,
        translateX,
        translateY,
        translateZ,
        rotateX,
        rotateY,
        rotateZ
    ) {
        this.cubeId     = cubeId;
        this.type       = type;
        this.translateX = translateX;
        this.translateY = translateY;
        this.translateZ = translateZ;
        this.rotateX    = rotateX;
        this.rotateY    = rotateY;
        this.rotateZ    = rotateZ;
    }
}
