describe('pointselector', function() {
    var map, callbackResult, pointselector;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new com.modestmaps.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new com.modestmaps.Location(37.811530, -122.2666097), 10);
        pointselector = wax.mm.pointselector(map, {}, {
            callback: function() {
                callbackResult = arguments;
            }
        });
    });

    it('can add locations', function() {
        runs(function() {
            pointselector.addLocation(
                new com.modestmaps.Location(37.811530, -122.2666097));
        });
        waits(100);
        runs(function() {
            expect(callbackResult.length).toEqual(1);
            expect(callbackResult[0][0].lat).toEqual(37.811530);
            expect(callbackResult[0][0].lon).toEqual(-122.2666097);
        });
    });
});
