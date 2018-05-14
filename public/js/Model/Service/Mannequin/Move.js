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
    if ((newX < -10) || (newX > 1990)) {
      console.log(newX);
      return false;
    }

    // Does new X run into a cube?
    var cubeEntitiesLength = cubeEntities.length;
    for (var i = 0; i < cubeEntitiesLength; i++) {
      var cubeEntity = cubeEntities[i];
      if ((currentY > cubeEntity.translateY - 10) && (currentY < cubeEntity.translateY + 100 - 10)) {
        if ((newX > cubeEntity.translateX - 10) && (newX < cubeEntity.translateX + 100 - 10)) {
          return false;
        }
      }
    }

    // Does new X run into a mannequin?
    var mannequinEntitiesLength = mannequinEntities.length;
    for (var i = 0; i < mannequinEntitiesLength; i++) {
      var mannequinEntity = mannequinEntities[i];
      if ((currentY > mannequinEntity.translateY - 10) && (currentY < mannequinEntity.translateY + 10)) {
        if ((newX > mannequinEntity.translateX - 10) && (newX < mannequinEntity.translateX + 10)) {
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
    if ((newY < -10) || (newY > 1990)) {
      return false;
    }

    // Does new Y run into a cube?
    var cubeEntitiesLength = cubeEntities.length;
    for (var i = 0; i < cubeEntitiesLength; i++) {
      var cubeEntity = cubeEntities[i];
      if ((currentX > cubeEntity.translateX - 10) && (currentX < cubeEntity.translateX + 100 - 10)) {
        if ((newY > cubeEntity.translateY - 10) && (newY < cubeEntity.translateY + 100 - 10)) {
          return false;
        }
      }
    }

    // Does new Y run into a mannequin?
    var mannequinEntitiesLength = mannequinEntities.length;
    for (var i = 0; i < mannequinEntitiesLength; i++) {
      var mannequinEntity = mannequinEntities[i];
      if ((currentX > mannequinEntity.translateX - 10) && (currentX < mannequinEntity.translateX + 10)) {
        if ((newY > mannequinEntity.translateY - 10) && (newY < mannequinEntity.translateY + 10)) {
          return false;
        }
      }
    }

    return true;
  }
}
