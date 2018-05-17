Model.Service.Mannequin = Model.Service.Mannequin || {};
Model.Service.Mannequin.Move = class {
  /**
   * @return {bool}
   */
  isNewXValid(
      currentX,
      currentY,
      newX,
      cubeEntities,
      mannequinEntities
  ) {
    // Does new X fall off of the ground?
    if ((newX < -5) || (newX > 4995)) {
      return false;
    }

    // Does new X run into a cube?
    var cubeEntitiesLength = cubeEntities.length;
    for (var i = 0; i < cubeEntitiesLength; i++) {
      var cubeEntity = cubeEntities[i];
      if ((currentY > cubeEntity.translateY - 5) && (currentY < cubeEntity.translateY + 100 - 5)) {
        if ((newX > cubeEntity.translateX - 5) && (newX < cubeEntity.translateX + 100 - 5)) {
          return false;
        }
      }
    }

    // Does new X run into a mannequin?
    var mannequinEntitiesLength = mannequinEntities.length;
    for (var i = 0; i < mannequinEntitiesLength; i++) {
      var mannequinEntity = mannequinEntities[i];
      if ((currentY > mannequinEntity.translateY - 5) && (currentY < mannequinEntity.translateY + 5)) {
        if ((newX > mannequinEntity.translateX - 5) && (newX < mannequinEntity.translateX + 5)) {
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
      cubeEntities,
      mannequinEntities
  ) {
    // Does new Y fall off of the ground?
    if ((newY < -5) || (newY > 4995)) {
      return false;
    }

    // Does new Y run into a cube?
    var cubeEntitiesLength = cubeEntities.length;
    for (var i = 0; i < cubeEntitiesLength; i++) {
      var cubeEntity = cubeEntities[i];
      if ((currentX > cubeEntity.translateX - 5) && (currentX < cubeEntity.translateX + 100 - 5)) {
        if ((newY > cubeEntity.translateY - 5) && (newY < cubeEntity.translateY + 100 - 5)) {
          return false;
        }
      }
    }

    // Does new Y run into a mannequin?
    var mannequinEntitiesLength = mannequinEntities.length;
    for (var i = 0; i < mannequinEntitiesLength; i++) {
      var mannequinEntity = mannequinEntities[i];
      if ((currentX > mannequinEntity.translateX - 5) && (currentX < mannequinEntity.translateX + 5)) {
        if ((newY > mannequinEntity.translateY - 5) && (newY < mannequinEntity.translateY + 5)) {
          return false;
        }
      }
    }

    return true;
  }
}
