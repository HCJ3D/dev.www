// Singleston services.
var ajaxService  = new Model.Service.Ajax();
var arrayService = new Model.Service.Array();
var cubeService = new Model.Service.Cube();
var cubesService = new Model.Service.Cubes();
var pointsService = new Model.Service.Points();

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
      if (pressedKeys[32]) {
        // space bar
        $('#space-bar').css('font-weight', 'bold');
        jump();
      }

      if (pressedKeys[38]) {
        // up arrow
        $('#up').css('font-weight', 'bold');
        lookDown();
      }

      if (pressedKeys[40]) {
        // down arrow
        $('#down').css('font-weight', 'bold');
        lookUp();
      }

      if (pressedKeys[37]) {
        // left arrow
        $('#left').css('font-weight', 'bold');
        lookLeft();
      }

      if (pressedKeys[39]) {
        // right arrow
        $('#right').css('font-weight', 'bold');
        lookRight();
      }

      if (pressedKeys[87]) {
        // w key
        $('#w').css('font-weight', 'bold');
        moveForward();
      }

      if (pressedKeys[83]) {
        // s key
        $('#s').css('font-weight', 'bold');
        moveBackward();
      }

      if (pressedKeys[65]) {
        // a key
        $('#a').css('font-weight', 'bold');
        moveLeft();
      }

      if (pressedKeys[68]) {
        // d key
        $('#d').css('font-weight', 'bold');
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
        $('#space-bar').css('font-weight', 'normal');
      }

      if (!pressedKeys[37]) {
        // left arrow
        $('#left').css('font-weight', 'normal');
      }
      if (!pressedKeys[38]) {
        // up arrow
        $('#up').css('font-weight', 'normal');
      }
      if (!pressedKeys[39]) {
        // right arrow
        $('#right').css('font-weight', 'normal');
      }
      if (!pressedKeys[40]) {
        // down arrow
        $('#down').css('font-weight', 'normal');
      }
      if (!pressedKeys[87]) {
        // w key
        $('#w').css('font-weight', 'normal');
      }
      if (!pressedKeys[83]) {
        // s key
        $('#s').css('font-weight', 'normal');
      }
      if (!pressedKeys[65]) {
        // a key
        $('#a').css('font-weight', 'normal');
      }
      if (!pressedKeys[68]) {
        // d key
        $('#d').css('font-weight', 'normal');
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
        'x': transform['translateX'] + 50,
        'y': transform['translateY'] + 50,
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
        'translateX': -mannequinTransform.translateX + ($(window).width() * 0.5 - 50),

        'translateY': -mannequinTransform.translateY + 3040,
        'translateZ': 88.525 // never changes
      };

      var perspectiveTransform = perspective.data('css')['transform'];
      perspective.data('css')['transform-origin'] = {
        'x': perspectiveTransform.translateX + mannequinTransform.translateX + 50,
        'y': perspectiveTransform.translateY + mannequinTransform.translateY + 50,
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

    function jump () {
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
        mannequin.data('css').transform.rotateZ -= 2;
        updateMannequin();

        setPerspectiveDataAroundMannequin(perspective, mannequin);
        updatePerspectiveCss();
    }

    function lookRight() {
        mannequin.data('css').transform.rotateZ += 2;
        updateMannequin();

        setPerspectiveDataAroundMannequin(perspective, mannequin);
        updatePerspectiveCss();
    }

    function moveForward() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);
      transform.translateX += 10 * sin;
      transform.translateY -= 10 * cos;
      transformOrigin['x'] = transform['translateX'] + 50;
      transformOrigin['y'] = transform['translateY'] + 50;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function moveBackward() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);
      transform.translateX -= 10 * sin;
      transform.translateY += 10 * cos;
      transformOrigin['x'] = transform['translateX'] + 50;
      transformOrigin['y'] = transform['translateY'] + 50;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function moveLeft() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);
      transform.translateX -= 10 * cos;
      transform.translateY -= 10 * sin;
      transformOrigin['x'] = transform['translateX'] + 50;
      transformOrigin['y'] = transform['translateY'] + 50;
      updateMannequin();

      setPerspectiveDataAroundMannequin(perspective, mannequin);
      updatePerspectiveCss();
    }

    function moveRight() {
      var transform       = mannequin.data('css')['transform'];
      var transformOrigin = mannequin.data('css')['transform-origin'];

      var sin = Math.sin(transform.rotateZ * Math.PI / 180);
      var cos = Math.cos(transform.rotateZ * Math.PI / 180);
      transform['translateX'] += 10 * cos;
      transform['translateY'] += 10 * sin;
      transformOrigin['x'] = transform['translateX'] + 50;
      transformOrigin['y'] = transform['translateY'] + 50;
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
});

