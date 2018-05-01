Model.Service.Mannequin = Model.Service.Mannequin || {};
Model.Service.Mannequin.Draw = class {
    draw(
        mannequinEntity
    ) {
        var style = 'transform: '
                  + 'rotateX(' + mannequinEntity.rotateX + 'deg) '
                  + 'rotateY(' + mannequinEntity.rotateY + 'deg) '
                  + 'rotateZ(' + mannequinEntity.rotateZ + 'deg) '
                  + 'translateX(' + mannequinEntity.translateX + 'px) '
                  + 'translateY(' + mannequinEntity.translateY + 'px) '
                  + 'translateZ(' + mannequinEntity.translateZ + 'px); '
                  + 'transform-origin: '
                  + mannequinEntity.transformOriginX + 'px '
                  + mannequinEntity.transformOriginY + 'px '
                  + mannequinEntity.transformOriginZ + 'px'
                  + ';';

        var mannequin = $(document.createElement('hcj3d-mannequin'));

        mannequin.append('<hcj3d-mannequin-leg class="left"></hcj3d-mannequin-leg>');
        mannequin.children('hcj3d-mannequin-leg.left')
          .append('<hcj3d-mannequin-leg-top></hcj3d-mannequin-leg-top>')
          .append('<hcj3d-mannequin-leg-bottom></hcj3d-mannequin-leg-bottom>')
          .append('<hcj3d-mannequin-leg-left></hcj3d-mannequin-leg-left>')
          .append('<hcj3d-mannequin-leg-right></hcj3d-mannequin-leg-right>')
          .append('<hcj3d-mannequin-leg-front></hcj3d-mannequin-leg-front>')
          .append('<hcj3d-mannequin-leg-back></hcj3d-mannequin-leg-back>');

        mannequin.append('<hcj3d-mannequin-leg class="right"></hcj3d-mannequin-leg>');
        mannequin.children('hcj3d-mannequin-leg.right')
          .append('<hcj3d-mannequin-leg-top></hcj3d-mannequin-leg-top>')
          .append('<hcj3d-mannequin-leg-bottom></hcj3d-mannequin-leg-bottom>')
          .append('<hcj3d-mannequin-leg-left></hcj3d-mannequin-leg-left>')
          .append('<hcj3d-mannequin-leg-right></hcj3d-mannequin-leg-right>')
          .append('<hcj3d-mannequin-leg-front></hcj3d-mannequin-leg-front>')
          .append('<hcj3d-mannequin-leg-back></hcj3d-mannequin-leg-back>');

        mannequin.append('<hcj3d-mannequin-body></hcj3d-mannequin-body>');
        mannequin.children('hcj3d-mannequin-body')
          .append('<hcj3d-mannequin-body-top></hcj3d-mannequin-body-top>')
          .append('<hcj3d-mannequin-body-bottom></hcj3d-mannequin-body-bottom>')
          .append('<hcj3d-mannequin-body-left></hcj3d-mannequin-body-left>')
          .append('<hcj3d-mannequin-body-right></hcj3d-mannequin-body-right>')
          .append('<hcj3d-mannequin-body-front></hcj3d-mannequin-body-front>')
          .append('<hcj3d-mannequin-body-back></hcj3d-mannequin-body-back>');

        mannequin.append('<hcj3d-mannequin-head></hcj3d-mannequin-head>');
        mannequin.children('hcj3d-mannequin-head')
          .append('<hcj3d-mannequin-head-top></hcj3d-mannequin-head-top>')
          .append('<hcj3d-mannequin-head-bottom></hcj3d-mannequin-head-bottom>')
          .append('<hcj3d-mannequin-head-left></hcj3d-mannequin-head-left>')
          .append('<hcj3d-mannequin-head-right></hcj3d-mannequin-head-right>')
          .append('<hcj3d-mannequin-head-front></hcj3d-mannequin-head-front>')
          .append('<hcj3d-mannequin-head-back></hcj3d-mannequin-head-back>');

        mannequin.attr({
            'style': style
        });

        $('hcj3d-perspective').append(mannequin);

        return mannequin;
    }
}
