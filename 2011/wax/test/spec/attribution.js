describe('attribution', function() {
    var map, attribution;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new com.modestmaps.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new com.modestmaps.Location(37.811530, -122.2666097), 10);
        attribution = wax.mm.attribution(map, {
            attribution: '42'
        }).appendTo(map.parent);
    });

    it('can have its content set', function() {
        expect($('.wax-attribution', map.parent).text()).toEqual('42');
    });
});
