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

var speechSynthesis = window.speechSynthesis;
var utterance;

  var myAudio = new Audio('/music/bensound-tenderness.mp3');
  myAudio.volume = 0.5;
  myAudio.loop = true;

$(document).ready(function () {
  var divRight = $('header div.right');
  if (!!window.chrome && !!window.chrome.webstore) {
    divRight.html('Use arrow keys to look and WASD keys to move');
  } else {
    divRight.addClass('c-r');
    divRight.html('Please use Chrome for optimal experience');
  }

  var cubeEntities      = [];
  var mannequinEntities = [];
  var me                = new Model.Entity.Mannequin();
  var perspective       = initPerspective();
  var pressedKeys       = [];
  var mannequin         = initMannequin(
    function (me) {
      $('#x').html(Math.round(me.translateX * 100) / 100);
      $('#y').html(Math.round(me.translateY * 100) / 100);
      $('#distance-traveled').html(Math.round(me.distanceTraveled * 100) / 100);

      setPerspectiveDataAroundMe(perspective, me);
      updateMannequinCss(me);
      updatePerspectiveCss();
    }
  );
  var view              = initView();
  updateView();

  function oneCentisecondLoop() {
		var promise = myAudio.play();

		if (promise !== undefined) {
			promise.then(_ => {
				// Autoplay started!
			}).catch(error => {
				// Autoplay was prevented.
				// Show a "Play" button so that user can start playback.
			});
		}

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
      jump(me);
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
        'distanceTraveled': me.distanceTraveled,
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

  function initMannequin(callbackFunction) {
    $.get(
      'mannequin/buildFromUserId',
      function (mannequinJson) {
        me.rotateX = mannequinJson.rotateX;
        me.rotateY = mannequinJson.rotateY;
        me.rotateZ = mannequinJson.rotateZ;
        me.translateX = mannequinJson.translateX;
        me.translateY = mannequinJson.translateY;
        me.translateZ = mannequinJson.translateZ;
        me.transformOriginX = mannequinJson.transformOriginX;
        me.transformOriginY = mannequinJson.transformOriginY;
        me.transformOriginZ = mannequinJson.transformOriginZ;
        me.distanceTraveled = mannequinJson.distanceTraveled;
        callbackFunction(me)
      },
      'json'
    );

    me.jQuery = $('hcj3d-mannequin#me');

    $.get(
      'user/getDisplayName',
      function (displayName) {
        me.jQuery.find('hcj3d-mannequin-body-back div.display-name').html(displayName);
      },
    );

    return me.jQuery;
  }

  function setPerspectiveDataAroundMe(perspective, me) {
    perspective.data('css')['transform'] = {
      'rotateX': 0, // never changes
      'rotateY': 0, // never changes
      'rotateZ': -me.rotateZ,
      'translateX': -me.translateX + ($(window).width() * 0.5 - 10),

      'translateY': -me.translateY + 3040,
      'translateZ': 88.525 // never changes
    };

    var perspectiveTransform = perspective.data('css')['transform'];
    perspective.data('css')['transform-origin'] = {
      'x': perspectiveTransform.translateX + me.translateX + 10,
      'y': perspectiveTransform.translateY + me.translateY + 5,
      'z': 0,
    };
  }

  function initPerspective () {
    var perspective = $('hcj3d-perspective');
    perspective.data('css', {});
    return perspective;
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

  function jump (mannequinEntity) {
    if (mannequinEntity.jQuery.is(':animated')) {
      return;
    }

    mannequinEntity.jQuery.animate(
      {
        textIndent: 100,
      },
      {
        step: function (now, fx) {
          me.translateZ = (-Math.pow((now - 50), 2) + 2500) / 100;
          updateMannequinCss(me);
          $('#z').html(Math.round(me.translateZ * 100) / 100);
        },
        duration: 500,
        easing: 'linear',
        complete: function () {
          mannequinEntity.jQuery.css('text-indent', 0);
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
    me.rotateZ -= 1;
    updateMannequinCss(me);

    setPerspectiveDataAroundMe(perspective, me);
    updatePerspectiveCss();
  }

  function lookRight() {
    me.rotateZ += 1;
    updateMannequinCss(me);

    setPerspectiveDataAroundMe(perspective, me);
    updatePerspectiveCss();
  }

  function moveForward() {
    var sin = Math.sin(me.rotateZ * Math.PI / 180);
    var cos = Math.cos(me.rotateZ * Math.PI / 180);

    var newX = me.translateX + 10 * sin;
    var newY = me.translateY - 10 * cos;

    var isNewXValid = mannequinMoveService.isNewXValid(
      me.translateX,
      me.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      me.translateX,
      me.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = me.translateX;
    }
    if (!isNewYValid) {
      newY = me.translateY;
    }

    me.distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(me.translateX, me.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(me.distanceTraveled * 100) / 100);
    $('#x').html(Math.round(newX * 100) / 100);
    $('#y').html(Math.round(newY * 100) / 100);

    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = newX + mannequin.width() / 2;
    me.transformOriginY = newY + mannequin.height() / 2;
    updateMannequinCss(me);

    setPerspectiveDataAroundMe(perspective, me);
    updatePerspectiveCss();
  }

  function moveBackward() {
    var sin = Math.sin(me.rotateZ * Math.PI / 180);
    var cos = Math.cos(me.rotateZ * Math.PI / 180);

    var newX = me.translateX - 10 * sin;
    var newY = me.translateY + 10 * cos;

    var isNewXValid = mannequinMoveService.isNewXValid(
      me.translateX,
      me.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      me.translateX,
      me.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = me.translateX;
    }
    if (!isNewYValid) {
      newY = me.translateY;
    }

    me.distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(me.translateX, me.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(me.distanceTraveled * 100) / 100);
    $('#x').html(Math.round(newX * 100) / 100);
    $('#y').html(Math.round(newY * 100) / 100);

    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = newX + mannequin.width() / 2;
    me.transformOriginY = newY + mannequin.height() / 2;
    updateMannequinCss(me);

    setPerspectiveDataAroundMe(perspective, me);
    updatePerspectiveCss();
  }

  function moveLeft() {
    var sin = Math.sin(me.rotateZ * Math.PI / 180);
    var cos = Math.cos(me.rotateZ * Math.PI / 180);

    var newX = me.translateX - 5 * cos;
    var newY = me.translateY - 5 * sin;

    var isNewXValid = mannequinMoveService.isNewXValid(
      me.translateX,
      me.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      me.translateX,
      me.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = me.translateX;
    }
    if (!isNewYValid) {
      newY = me.translateY;
    }

    me.distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(me.translateX, me.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(me.distanceTraveled * 100) / 100);
    $('#x').html(Math.round(newX * 100) / 100);
    $('#y').html(Math.round(newY * 100) / 100);

    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = newX + mannequin.width() / 2;
    me.transformOriginY = newY + mannequin.height() / 2;
    updateMannequinCss(me);

    setPerspectiveDataAroundMe(perspective, me);
    updatePerspectiveCss();
  }

  function moveRight() {
    var sin = Math.sin(me.rotateZ * Math.PI / 180);
    var cos = Math.cos(me.rotateZ * Math.PI / 180);

    var newX = me.translateX + 5 * cos;
    var newY = me.translateY + 5 * sin;

    var isNewXValid = mannequinMoveService.isNewXValid(
      me.translateX,
      me.translateY,
      newX,
      cubeEntities,
      mannequinEntities
    );
    var isNewYValid = mannequinMoveService.isNewYValid(
      me.translateX,
      me.translateY,
      newY,
      cubeEntities,
      mannequinEntities
    );

    if (!isNewXValid) {
      newX = me.translateX;
    }
    if (!isNewYValid) {
      newY = me.translateY;
    }

    me.distanceTraveled += pointsService.getDistanceBetweenTwoPoints(
      new Model.Entity.Point(me.translateX, me.translateY, 0),
      new Model.Entity.Point(newX, newY, 0)
    );
    $('#distance-traveled').html(Math.round(me.distanceTraveled * 100) / 100);
    $('#x').html(Math.round(newX * 100) / 100);
    $('#y').html(Math.round(newY * 100) / 100);

    me.translateX = newX;
    me.translateY = newY;
    me.transformOriginX = newX + mannequin.width() / 2;
    me.transformOriginY = newY + mannequin.height() / 2;
    updateMannequinCss(me);

    setPerspectiveDataAroundMe(perspective, me);
    updatePerspectiveCss();
  }

  function updateMannequinCss(mannequinEntity) {
    mannequinEntity.jQuery.css(
      'transform',
      'rotateX(' + mannequinEntity.rotateX + 'deg) rotateY(' + mannequinEntity.rotateY + 'deg) rotateZ(' + mannequinEntity.rotateZ + 'deg) translateX(' + mannequinEntity.translateX + 'px) translateY(' + mannequinEntity.translateY + 'px) translateZ(' + mannequinEntity.translateZ + 'px)'
    );

    mannequinEntity.jQuery.css(
      'transform-origin',
      mannequinEntity.transformOriginX + 'px ' + mannequinEntity.transformOriginY + 'px ' + mannequinEntity.transformOriginZ + 'px'
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

  $(window).resize(function () {
    setPerspectiveDataAroundMe(perspective, me);
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

    speak('Hello ' + displayName + ', welcome to HCJ3D. I am your avatar.');
  });

  $('div.dialog.text-to-speech form').submit(function(event) {
    event.preventDefault();
    var speech = $('div.dialog.text-to-speech form input[name=speech]').val();

    $('div.dialog.text-to-speech').fadeOut('fast', function() {
      $('div.dialog.text-to-speech form input[name=speech]').val('');
    });

    speak(speech);
  });

  function speak(text) {
    if (!text.length) {
      return;
    }

    $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').html(text);

    $('hcj3d-mannequin#me hcj3d-mannequin-bubble').fadeIn('fast');

    $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').css('left', 0 + 'px');
    var outerWidth = $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').outerWidth();
    var left = (50 - outerWidth) / 2;
    $('hcj3d-mannequin#me hcj3d-mannequin-bubble-text').css('left', left + 'px');

    utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = function (event) {
      $('hcj3d-mannequin#me hcj3d-mannequin-bubble').fadeOut('fast');
    };
    speechSynthesis.speak(utterance);
  }

  $.get(
    'ground/getRelevantGround',
    function (groundsJson) {
      var groundsJsonLength = groundsJson.length;
      for (var i = 0; i < groundsJsonLength; i++) {
        groundJson = groundsJson[i];
        var groundEntity = new Model.Entity.Ground();
        groundEntity.rotateX    = groundJson.rotateX;
        groundEntity.rotateY    = groundJson.rotateY;
        groundEntity.rotateZ    = groundJson.rotateZ;
        groundEntity.translateX = groundJson.translateX;
        groundEntity.translateY = groundJson.translateY;
        groundEntity.translateZ = groundJson.translateZ;
        groundEntity.backgroundColor = {
          'rgb': {
            'r': groundJson.backgroundColorRgbR,
            'g': groundJson.backgroundColorRgbG,
            'b': groundJson.backgroundColorRgbB,
          },
        };
        groundDrawService.draw(groundEntity);
      }
    },
    'json'
  );
});
