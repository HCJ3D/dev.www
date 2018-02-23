var Model = Model || {};
Model.Service = Model.Service || {};

Model.Service.Points = class {
    getDistanceBetweenTwoPoints(
        pointA,
        pointB
    ) {
        return Math.sqrt(
            Math.pow((pointA.x - pointB.x), 2)
            + Math.pow((pointA.y - pointB.y), 2)
            + Math.pow((pointA.z - pointB.z), 2)
        );
    }
}
