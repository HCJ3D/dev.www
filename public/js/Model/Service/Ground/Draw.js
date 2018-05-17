var Model = Model || {};
Model.Service = Model.Service || {};
Model.Service.Ground = Model.Service.Ground || {};

Model.Service.Ground.Draw = class {
    draw(
        groundEntity
    ) {
        var style = 'transform: rotateX(' + groundEntity.rotateX + 'deg) rotateY(' + groundEntity.rotateY + 'deg) rotateZ(' + groundEntity.rotateZ + 'deg) translateX(' + groundEntity.translateX + 'px) translateY(' + groundEntity.translateY + 'px) translateZ(' + groundEntity.translateZ + 'px);';

        var ground = $(document.createElement('hcj3d-ground'));
        ground.attr({
            'style': style
        });

        $('hcj3d-perspective').append(ground);
    }
}
