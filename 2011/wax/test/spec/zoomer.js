describe('zoomer', function() {
    var map, initial_zoom = 10;

    beforeEach(function() {
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new com.modestmaps.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new com.modestmaps.Location(37.811530, -122.2666097), 10);
        wax.mm.zoomer(map).appendTo(map.parent);
    });

    it('should be able to zoom in', function() {
        expect(map.getZoom()).toEqual(10);
        $('.zoomin', map.parent).click();
        expect(map.getZoom()).toEqual(11);
    });

    it('should be able to zoom out', function() {
        expect(map.getZoom()).toEqual(10);
        $('.zoomout', map.parent).click();
        expect(map.getZoom()).toEqual(9);
    });

    it('marks as unzoomable when zoom is zero', function() {
        map.setZoom(0);
        expect($('.zoomout', map.parent).hasClass('zoomdisabled')).toEqual(true);
    });

    it('marks as unzoomable when zoom is eighteen', function() {
        map.setZoom(18);
        expect($('.zoomin', map.parent).hasClass('zoomdisabled')).toEqual(true);
    });
});
