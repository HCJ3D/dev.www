// Singleston services.
var ajaxService          = new Model.Service.Ajax();
var arrayService         = new Model.Service.Array();
var cubeService          = new Model.Service.Cube();
var cubeDrawService      = new Model.Service.Cube.Draw();
var cubesService         = new Model.Service.Cubes();
var mannequinDrawService = new Model.Service.Mannequin.Draw();
var pointsService        = new Model.Service.Points();

$(document).ready(function() {
    var pressedKeys = [];
    var mannequin   = initMannequin();
    var view        = initView();

    var perspective = $('hcj3d-perspective');
    perspective.data('css', {});
    setPerspectiveDataAroundMannequin(perspective, mannequin);

    updateMannequin();
    updatePerspectiveCss();
    updateView();

    function oneCentisecondLoop() {
      if ($('div.dialog').is(':visible')) {
        return;
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

    document.onkeydown = keyIsPressed;
    document.onkeyup   = keyIsReleased;

    function keyIsPressed(e) {
      e = e || window.event;
      pressedKeys[e.keyCode || e.which] = true;
    }

    function keyIsReleased(e) {
      e = e || window.event;
      pressedKeys[e.keyCode || e.which] = false;

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
      var mannequin = $('hcj3d-mannequin');
      mannequin.data('css', {});

      mannequin.data('css')['transform'] = {
        'rotateX': 0,
        'rotateY': 0,
        'rotateZ': Math.floor(Math.random() * 361),
        'translateX': Math.floor(Math.random() * 1951),
        'translateY': Math.floor(Math.random() * 1951),
        'translateZ': 0,
      };

      var transform = mannequin.data('css')['transform'];
      mannequin.data('css')['transform-origin'] = {
        'x': transform['translateX'] + 15,
        'y': transform['translateY'] + 5,
        'z': 50,
      };

      return mannequin;
    }

    function setPerspectiveDataAroundMannequin(perspective, mannequin) {
      var mannequinTransform = mannequin.data('css').transform;

      perspective.data('css')['transform'] = {
        'rotateX': 0, // never changes
        'rotateY': 0, // never changes
        'rotateZ': -mannequinTransform.rotateZ,
        'translateX': -mannequinTransform.translateX + ($(window).width() * 0.5 - 15),

        'translateY': -mannequinTransform.translateY + 3040,
        'translateZ': 88.525 // never changes
      };

      var perspectiveTransform = perspective.data('css')['transform'];
      perspective.data('css')['transform-origin'] = {
        'x': perspectiveTransform.translateX + mannequinTransform.translateX + 15,
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
            updateMannequin();
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
        updateMannequin();

        setPerspectiveDataAroundMannequin(perspective, mannequin);
        updatePerspectiveCss();
    }

    function lookRight() {
        mannequin.data('css').transform.rotateZ += 1;
        updateMannequin();

        setPerspectiveDataAroundMannequin(perspective, mannequin);
        updatePerspectiveCss();
    }

    /*
     * min x    0 - 15 = -15
     * max x 2000 - 15 = 1985
     *
     * min y     0 - 5 = -5
     * max y  2000 - 5 = 1995
     */

    function moveForward() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);

      var newX = transform.translateX + 10 * sin;
      if ((newX < -15) || (newX > 1985)) {
        return;
      }
      var newY = transform.translateY - 10 * cos;
      if ((newY < -5) || (newY > 1995)) {
        return;
      }

      transform.translateX = newX;
      transform.translateY = newY;
      transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
      transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function moveBackward() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);

      var newX = transform.translateX - 10 * sin;
      if ((newX < -15) || (newX > 1985)) {
        return;
      }
      var newY = transform.translateY + 10 * cos;
      if ((newY < -5) || (newY > 1995)) {
        return;
      }

      transform.translateX = newX;
      transform.translateY = newY;
      transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
      transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function moveLeft() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);

      var newX = transform.translateX - 10 * cos;
      if ((newX < -15) || (newX > 1985)) {
        return;
      }
      var newY = transform.translateY - 10 * sin;
      if ((newY < -5) || (newY > 1995)) {
        return;
      }

      transform.translateX = newX;
      transform.translateY = newY;
      transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
      transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function moveRight() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);

      var newX = transform.translateX + 10 * cos;
      if ((newX < -15) || (newX > 1985)) {
        return;
      }
      var newY = transform.translateY + 10 * sin;
      if ((newY < -5) || (newY > 1995)) {
        return;
      }

      transform['translateX'] = newX;
      transform['translateY'] = newY;
      transformOrigin['x'] = transform['translateX'] + mannequin.width() / 2;
      transformOrigin['y'] = transform['translateY'] + mannequin.height() / 2;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function updateMannequin() {
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

    for (var x = 0; x < 5; x++) {
      var cubeEntity = new Model.Entity.Cube();
      cubeEntity.rotateX = 0;
      cubeEntity.rotateY = 0;
      cubeEntity.rotateZ = 0;
      cubeEntity.translateX = Math.floor(Math.random() * 20) * 100;
      cubeEntity.translateY = Math.floor(Math.random() * 20) * 100;
      cubeEntity.translateZ = 0;
      cubeDrawService.draw(cubeEntity);
    }

    for (var x = 0; x < 5; x++) {
      var mannequinEntity = new Model.Entity.Mannequin();
      mannequinEntity.rotateX = 0;
      mannequinEntity.rotateY = 0;
      mannequinEntity.rotateZ = Math.floor(Math.random() * 360); // 0 to 359
      mannequinEntity.translateX = Math.floor(Math.random() * 1951);
      mannequinEntity.translateY = Math.floor(Math.random() * 1951);
      mannequinEntity.translateZ = 0;
      mannequinEntity.transformOriginX = mannequinEntity.translateX + 50;
      mannequinEntity.transformOriginY = mannequinEntity.translateY + 50;
      mannequinEntity.transformOriginZ = 50;
      mannequinDrawService.draw(mannequinEntity);
    }

    /*
    $('main').on('click', 'hcj3d-mannequin#me hcj3d-mannequin-body-back', function() {
      $('div#body').fadeIn('fast');
      $('div#body input[type=text]').focus();
    });

    $('div#body form').submit(function(event) {
      event.preventDefault();
      $('div#body').fadeOut('fast');
    });
    */
});
