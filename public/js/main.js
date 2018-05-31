// Singleston services.
var ajaxService          = new Model.Service.Ajax();
var arrayService         = new Model.Service.Array();
var cubeService          = new Model.Service.Cube();
var cubeDrawService      = new Model.Service.Cube.Draw();
var cubesService         = new Model.Service.Cubes();
var groundDrawService    = new Model.Service.Ground.Draw();
var mannequinDrawService = new Model.Service.Mannequin.Draw();
var mannequinMoveService = new Model.Service.Mannequin.Move();
var pointsService        = new Model.Service.Points();

$(document).ready(function() {
  var cubeEntities      = [];
  var distanceTraveled  = 0;
  var mannequinEntities = [];
  var me                = new Model.Entity.Mannequin();
  var pressedKeys       = [];
  var mannequin         = initMannequin();
  var view              = initView();
  var x;
  var y;
  var z;

  x = mannequin.data('css')['transform']['translateX'];
  $('#x').html(Math.round(x * 100) / 100);
  y = mannequin.data('css')['transform']['translateY'];
  $('#y').html(Math.round(y * 100) / 100);

  var perspective = $('hcj3d-perspective');
  perspective.data('css', {});
  setPerspectiveDataAroundMannequin(perspective, mannequin);

  updateMannequinCss();
  updatePerspectiveCss();
  updateView();

  function oneCentisecondLoop() {
    if ($('div.dialog').is(':visible')) {
      return;
    }

    // return key
    if (pressedKeys[13]) {
      $('#return').addClass('bc-g');
      $('div.dialog.text-to-speech').fadeIn('fast');
      $('div.dialog.text-to-speech input[type=text]').select();
    }

    if (pressedKeys[32]) {
      // space bar
      $('#space-bar').addClass('bc-g');
      jump(mannequin);
    }

    if (pressedKeys[38]) {
      // up arrow
      $('#up').addClass('bc-g');
      lookDown();
    }

    if (pressedKeys[40]) {
      // down arrow
      $('#down').addClass('bc-g');
      lookUp();
    }

    if (pressedKeys[37]) {
      // left arrow
      $('#left').addClass('bc-g');
      lookLeft();
    }

    if (pressedKeys[39]) {
      // right arrow
      $('#right').addClass('bc-g');
      lookRight();
    }

    if (pressedKeys[87]) {
      // w key
      $('#w').addClass('bc-g');
      moveForward();
    }

    if (pressedKeys[83]) {
      // s key
      $('#s').addClass('bc-g');
      moveBackward();
    }

    if (pressedKeys[65]) {
      // a key
      $('#a').addClass('bc-g');
      moveLeft();
    }

    if (pressedKeys[68]) {
      // d key
      $('#d').addClass('bc-g');
      moveRight();
    }
  }
  setInterval(oneCentisecondLoop, 10);

  function oneSecondLoop() {
    $.post(
      '/mannequin/updateWhereUserId',
      {
        'translateX': me.translateX,
        'translateY': me.translateY,
        'translateZ': 0,
        'rotateX': me.rotateX,
        'rotateY': me.rotateY,
        'rotateZ': me.rotateZ,
        'transformOriginX': me.transformOriginX,
        'transformOriginY': me.transformOriginY,
        'transformOriginZ': me.transformOriginZ,
      }
    );
  }
  setInterval(oneSecondLoop, 1000);


  document.onkeydown = keyIsPressed;
  document.onkeyup   = keyIsReleased;

  function keyIsPressed(e) {
    if ($('div.dialog').is(':visible')) {
      return;
    }

    e = e || window.event;
    pressedKeys[e.keyCode || e.which] = true;
  }

  function keyIsReleased(e) {
    e = e || window.event;
    pressedKeys[e.keyCode || e.which] = false;

    // return
    if (!pressedKeys[13]) {
      $('#return').removeClass('bc-g');
    }

    if (!pressedKeys[32]) {
      // space bar
      $('#space-bar').removeClass('bc-g');
    }

    if (!pressedKeys[37]) {
      // left arrow
      $('#left').removeClass('bc-g');
    }
    if (!pressedKeys[38]) {
      // up arrow
      $('#up').removeClass('bc-g');
    }
    if (!pressedKeys[39]) {
      // right arrow
      $('#right').removeClass('bc-g');
    }
    if (!pressedKeys[40]) {
      // down arrow
      $('#down').removeClass('bc-g');
    }
    if (!pressedKeys[87]) {
      // w key
      $('#w').removeClass('bc-g');
    }
    if (!pressedKeys[83]) {
      // s key
      $('#s').removeClass('bc-g');
    }
    if (!pressedKeys[65]) {
      // a key
      $('#a').removeClass('bc-g');
    }
    if (!pressedKeys[68]) {
      // d key
      $('#d').removeClass('bc-g');
    }
  }

  function initMannequin() {
    $.get(
      'mannequin/buildFromUserId',
      function (mannequinJson) {
        // Do nothing.
      },
      'json'
    );

    me.rotateX = 0;
    me.rotateY = 0;
    me.rotateZ = Math.floor(Math.random() * 360);
    me.translateX = Math.floor(Math.random() * 6995);
    me.translateY = Math.floor(Math.random() * 6995);
    me.translateZ = 0;
    me.transformOriginX = me.translateX + 10;
    me.transformOriginY = me.translateY + 5;
    me.transformOriginZ = 0;
    me.jQuery = $('hcj3d-mannequin#me');

    var mannequin = $('hcj3d-mannequin');
    mannequin.data('css', {});

    mannequin.data('css')['transform'] = {
      'rotateX': me.rotateX,
      'rotateY': me.rotateY,
      'rotateZ': me.rotateZ,
      'translateX': me.translateX,
      'translateY': me.translateY,
      'translateZ': me.translateZ,
    };

    var transform = mannequin.data('css')['transform'];
    mannequin.data('css')['transform-origin'] = {
      'x': transform['translateX'] + 10,
      'y': transform['translateY'] + 5,
      'z': 0,
    };

    $.get(
      'user/getDisplayName',
      function (displayName) {
        $('hcj3d-mannequin#me hcj3d-mannequin-body-back div.display-name')
          .html(displayName);
      },
    );

    return mannequin;
  }

  function setPerspectiveDataAroundMannequin(perspective, mannequin) {
    var mannequinTransform = mannequin.data('css').transform;

    perspective.data('css')['transform'] = {
      'rotateX': 0, // never changes
      'rotateY': 0, // never changes
      'rotateZ': -mannequinTransform.rotateZ,
      'translateX': -mannequinTransform.translateX + ($(window).width() * 0.5 - 10),

      'translateY': -mannequinTransform.translateY + 3040,
      'translateZ': 88.525 // never changes
    };

    var perspectiveTransform = perspective.data('css')['transform'];
    perspective.data('css')['transform-origin'] = {
      'x': perspectiveTransform.translateX + mannequinTransform.translateX + 10,
      'y': perspectiveTransform.translateY + mannequinTransform.translateY + 5,
      'z': 0,
    };
  }

  function initView() {
    var view = $('hcj3d-view');
    view.data(
      'css',
      {
        'transform': {
          'rotateX': 87,
          'rotateY': 0,
          'rotateZ': 0,
          'translateX': 0,
          'translateY': 0,
          'translateZ': 0,
        },
        'transform-origin': {
          'x': 0,
          'y': 0,
          'z': 0,
        },
      }
    );
    return view;
  }

  function jump (mannequin) {
    var duration  = 500;
    var transform = mannequin.data('css')['transform'];

    if (mannequin.is(':animated')) {
      return;
    }

    mannequin.animate(
      {
        textIndent: 100,
      },
      {
        step: function (now, fx) {
          transform.translateZ = (-Math.pow((now - 50), 2) + 2500) / 100;
          updateMannequinCss();

          z = transform.translateZ;
          $('#z').html(Math.round(z * 100) / 100);
        },
        duration: duration,
        easing: 'linear',
        complete: function () {
          mannequin.css('text-indent', 0);
        },
      },
    );
  }

  function lookDown() {
      var transform = view.data('css').transform;
      transform.rotateX -= 0.01;
      updateView();
  }

  function lookUp() {
      var transform = view.data('css').transform;
      transform.rotateX += 0.01;
      updateView();
  }

  function lookLeft() {
      mannequin.data('css').transform.rotateZ -= 1;
      updateMannequinCss();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
  }

  function lookRight() {
      mannequin.data('css').transform.rotateZ += 1;
      updateMannequinCss();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
  }

  function moveForward() {
    var transform       = mannequin.data('css')['transform'];
    var transformOrigin = mannequin.data('css')['transform-origin'];

    var sin = Math.sin(transform.rotateZ * Math.PI / 180);
    var cos = Math.cos(transform.rotateZ * Math.PI / 180);

    var newX = transform.translateX + 10 * sin;
    var newY = transform.translateY - 10 * cos;

    var isNewXValid = mannequinMoveService.isNewXValid(
      transform.translateX,
      transform.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      transform.translateX,
      transform.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = transform.translateX;
    }
    if (!isNewYValid) {
      newY = transform.translateY;
    }

    distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(transform.translateX, transform.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(distanceTraveled * 100) / 100);
    x = newX;
    $('#x').html(Math.round(x * 100) / 100);
    y = newY;
    $('#y').html(Math.round(y * 100) / 100);

    transform.translateX = newX;
    transform.translateY = newY;
    transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
    transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = transformOrigin['x'];
    me.transformOriginY = transformOrigin['y'];
    updateMannequinCss();

    setPerspectiveDataAroundMannequin(perspective, mannequin);
    updatePerspectiveCss();
  }

  function moveBackward() {
    var transform       = mannequin.data('css')['transform'];
    var transformOrigin = mannequin.data('css')['transform-origin'];

    var sin = Math.sin(transform.rotateZ * Math.PI / 180);
    var cos = Math.cos(transform.rotateZ * Math.PI / 180);

    var newX = transform.translateX - 10 * sin;
    var newY = transform.translateY + 10 * cos;

    var isNewXValid = mannequinMoveService.isNewXValid(
      transform.translateX,
      transform.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      transform.translateX,
      transform.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = transform.translateX;
    }
    if (!isNewYValid) {
      newY = transform.translateY;
    }

    distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(transform.translateX, transform.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(distanceTraveled * 100) / 100);
    x = newX;
    $('#x').html(Math.round(x * 100) / 100);
    y = newY;
    $('#y').html(Math.round(y * 100) / 100);

    transform.translateX = newX;
    transform.translateY = newY;
    transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
    transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = transformOrigin['x'];
    me.transformOriginY = transformOrigin['y'];
    updateMannequinCss();

    setPerspectiveDataAroundMannequin(perspective, mannequin);
    updatePerspectiveCss();
  }

  function moveLeft() {
    var transform       = mannequin.data('css')['transform'];
    var transformOrigin = mannequin.data('css')['transform-origin'];

    var sin = Math.sin(transform.rotateZ * Math.PI / 180);
    var cos = Math.cos(transform.rotateZ * Math.PI / 180);

    var newX = transform.translateX - 5 * cos;
    var newY = transform.translateY - 5 * sin;

    var isNewXValid = mannequinMoveService.isNewXValid(
      transform.translateX,
      transform.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      transform.translateX,
      transform.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = transform.translateX;
    }
    if (!isNewYValid) {
      newY = transform.translateY;
    }

    distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(transform.translateX, transform.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(distanceTraveled * 100) / 100);
    x = newX;
    $('#x').html(Math.round(x * 100) / 100);
    y = newY;
    $('#y').html(Math.round(y * 100) / 100);

    transform.translateX = newX;
    transform.translateY = newY;
    transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
    transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = transformOrigin['x'];
    me.transformOriginY = transformOrigin['y'];
    updateMannequinCss();

    setPerspectiveDataAroundMannequin(perspective, mannequin);
    updatePerspectiveCss();
  }

  function moveRight() {
    var transform       = mannequin.data('css')['transform'];
    var transformOrigin = mannequin.data('css')['transform-origin'];

    var sin = Math.sin(transform.rotateZ * Math.PI / 180);
    var cos = Math.cos(transform.rotateZ * Math.PI / 180);

    var newX = transform.translateX + 5 * cos;
    var newY = transform.translateY + 5 * sin;

    var isNewXValid = mannequinMoveService.isNewXValid(
      transform.translateX,
      transform.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      transform.translateX,
      transform.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = transform.translateX;
    }
    if (!isNewYValid) {
      newY = transform.translateY;
    }

    distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(transform.translateX, transform.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(distanceTraveled * 100) / 100);
    x = newX;
    $('#x').html(Math.round(x * 100) / 100);
    y = newY;
    $('#y').html(Math.round(y * 100) / 100);

    transform['translateX'] = newX;
    transform['translateY'] = newY;
    transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
    transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = transformOrigin['x'];
    me.transformOriginY = transformOrigin['y'];
    updateMannequinCss();

    setPerspectiveDataAroundMannequin(perspective, mannequin);
    updatePerspectiveCss();
  }

  function updateMannequinCss() {
    var transform = mannequin.data('css').transform;
    mannequin.css(
      'transform',
      'rotateX(' + transform.rotateX + 'deg) rotateY(' + transform.rotateY + 'deg) rotateZ(' + transform.rotateZ + 'deg) translateX(' + transform.translateX + 'px) translateY(' + transform.translateY + 'px) translateZ(' + transform.translateZ + 'px)'
    );

    var transformOrigin = mannequin.data('css')['transform-origin'];
    mannequin.css(
      'transform-origin',
      transformOrigin.x + 'px ' + transformOrigin.y + 'px ' + transformOrigin.z + 'px'
    );
  }

  function updatePerspectiveCss() {
    var perspectiveTransform       = perspective.data('css')['transform'];
    var perspectiveTransformOrigin = perspective.data('css')['transform-origin'];

    perspective.css(
      'transform',
      'rotateX(' + perspectiveTransform.rotateX + 'deg) rotateY(' + perspectiveTransform.rotateY + 'deg) rotateZ(' + perspectiveTransform.rotateZ + 'deg) translateX(' + perspectiveTransform.translateX + 'px) translateY(' + perspectiveTransform.translateY + 'px) translateZ(' + perspectiveTransform.translateZ + 'px)'
    );

    perspective.css(
      'transform-origin',
      perspectiveTransformOrigin.x + 'px ' + perspectiveTransformOrigin.y + 'px'
    );
  }

  function updateView() {
      var transform = view.data('css').transform;
      view.css(
        'transform',
        'rotateX(' + transform.rotateX + 'deg) rotateY(' + transform.rotateY + 'deg) rotateZ(' + transform.rotateZ + 'deg) translateX(' + transform.translateX + 'px) translateY(' + transform.translateY + 'px) translateZ(' + transform.translateZ + 'px)'
      );
  }

  $(window).resize(function() {
    setPerspectiveDataAroundMannequin(perspective, mannequin);
    updatePerspectiveCss();
  });

  for (var x = 0; x < 10; x++) {
    var cubeEntity = new Model.Entity.Cube();
    cubeEntity.rotateX = 0;
    cubeEntity.rotateY = 0;
    cubeEntity.rotateZ = 0;
    cubeEntity.translateX = Math.floor(Math.random() * 70) * 100;
    cubeEntity.translateY = Math.floor(Math.random() * 70) * 100;
    cubeEntity.translateZ = 0;
    cubeEntities.push(cubeEntity);
    cubeDrawService.draw(cubeEntity);
  }

  for (var x = 0; x < 20; x++) {
    var mannequinEntity = new Model.Entity.Mannequin();
    mannequinEntity.rotateX = 0;
    mannequinEntity.rotateY = 0;
    mannequinEntity.rotateZ = Math.floor(Math.random() * 360); // 0 to 359
    mannequinEntity.translateX = Math.floor(Math.random() * 6995);
    mannequinEntity.translateY = Math.floor(Math.random() * 6995);
    mannequinEntity.translateZ = 0;
    mannequinEntity.transformOriginX = mannequinEntity.translateX + 10;
    mannequinEntity.transformOriginY = mannequinEntity.translateY + 5;
    mannequinEntity.transformOriginZ = 0;
    mannequinEntities.push(mannequinEntity);
    mannequinDrawService.draw(mannequinEntity);
  }

  $('main').on('click', 'hcj3d-mannequin#me hcj3d-mannequin-body-back', function() {
    var displayName = $('hcj3d-mannequin#me hcj3d-mannequin-body-back div.display-name').html();
    $('div.dialog.body form input[name=display-name]').val(displayName);
    $('div.dialog.body').fadeIn('fast');
    $('div.dialog.body input[type=text]').select();
  });

  $('div.dialog.body form').submit(function(event) {
    event.preventDefault();
    $('div.dialog.body').fadeOut('fast');
    var displayName = $('div.dialog.body form input[name=display-name]').val();
    displayName = displayName.replace(/[^\w ]/g, '');
    $('hcj3d-mannequin#me hcj3d-mannequin-body-back div.display-name').html(displayName);

    $.post(
      '/user/updateDisplayName',
      $('div.dialog.body form').serialize()
    );
  });

  $('div.dialog.text-to-speech form').submit(function(event) {
    event.preventDefault();
    var speech = $('div.dialog.text-to-speech form input[name=speech]').val();

    $('div.dialog.text-to-speech').fadeOut('fast', function() {
      $('div.dialog.text-to-speech form input[name=speech]').val('');
    });

    if (!speech.length) {
      return;
    }

    $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').html(speech);

    $('hcj3d-mannequin#me hcj3d-mannequin-bubble').fadeIn('fast');

    $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').css('left', 0 + 'px');
    var outerWidth = $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').outerWidth();
    var left = (50 - outerWidth) / 2;
    $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').css('left', left + 'px');


    var speechSynthesis = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(speech);
    utterance.onend = function (event) {
      $('hcj3d-mannequin#me hcj3d-mannequin-bubble').fadeOut('fast');
    };
    speechSynthesis.speak(utterance);
  });

  for (var x = 0; x <= 6000; x += 1000) {
    for (var y = 0; y <= 6000; y += 1000) {
      var groundEntity = new Model.Entity.Ground();
      groundEntity.rotateX    = 0;
      groundEntity.rotateY    = 0;
      groundEntity.rotateZ    = 0;
      groundEntity.translateX = x;
      groundEntity.translateY = y;
      groundEntity.translateZ = 0;
      groundEntity.backgroundColor = {
        'rgb': {
          'r': Math.floor(Math.random() * 256),
          'g': Math.floor(Math.random() * 256),
          'b': Math.floor(Math.random() * 256),
        },
      };
      groundDrawService.draw(groundEntity);
    }
  }
});
