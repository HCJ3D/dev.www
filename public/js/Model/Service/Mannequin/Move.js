Model.Service.Mannequin = Model.Service.Mannequin || {};
Model.Service.Mannequin.Move = class {
  /**
   * @return {bool}
   */
  isNewXValid(
      currentX,
      currentY,
      newX,
      cubeEntities
  ) {
    // Does new X fall off of the ground?
    if ((newX < -5) || (newX > 1995)) {
      return false;
    }

    // Does new X run into a cube?
    var cubeEntitiesLength = cubeEntities.length;
    for (var i = 0; i < cubeEntitiesLength; i++) {
      var cubeEntity = cubeEntities[i];
      if ((currentY > cubeEntity.translateY - 5) && (currentY < cubeEntity.translateY + 95)) {
        if ((newX > cubeEntity.translateX - 5) && (newX < cubeEntity.translateX + 100 - 5)) {
          console.log('uhoh1');
          return false;
        }
      }
    }

    return true;
  }

  /**
   * @return {bool}
   */
  isNewYValid(
      currentX,
      currentY,
      newY,
      cubeEntities
  ) {
    // Does new Y fall off of the ground?
    if ((newY < -5) || (newY > 1995)) {
      return false;
    }

    // Does new Y run into a cube?
    var cubeEntitiesLength = cubeEntities.length;
    for (var i = 0; i < cubeEntitiesLength; i++) {
      var cubeEntity = cubeEntities[i];
      if ((currentX > cubeEntity.translateX - 5) && (currentX < cubeEntity.translateX + 95)) {
        if ((newY > cubeEntity.translateY - 5) && (newY < cubeEntity.translateY + 100 - 5)) {
          console.log('uhoh2');
          return false;
        }
      }
    }

    return true;
  }
}
