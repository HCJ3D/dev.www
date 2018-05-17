var Model = Model || {};
Model.Entity = Model.Entity || {};

Model.Entity.Ground = class {
    constructor(
        groundId,
        type,
        translateX,
        translateY,
        translateZ,
        rotateX,
        rotateY,
        rotateZ
    ) {
        this.groundId     = groundId;
        this.translateX = translateX;
        this.translateY = translateY;
        this.translateZ = translateZ;
        this.rotateX    = rotateX;
        this.rotateY    = rotateY;
        this.rotateZ    = rotateZ;

        this.backgroundColor;
        this.transformOriginX;
        this.transformOriginY;
        this.transformOriginZ;
    }
}
