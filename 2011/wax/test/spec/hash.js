describe('hash', function() {
    var mm = com.modestmaps;
    var map, initial_zoom = 10;

    beforeEach(function() {
        var div = document.createElement('div');

        window.location.hash = '';

        div.style.width = '400px';
        div.style.height = '400px';

        map = new mm.Map(div, new mm.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));

        wax.mm.hash(map, {}, {
          defaultCenter: new mm.Location(39, -98),
          defaultZoom: 4,
          manager: wax.mm.locationHash
        });
    });

    it('should set an initial center and zoom', function() {
        var center = map.getCenter();
        expect(Math.round(center.lat)).toEqual(39);
        expect(Math.round(center.lon)).toEqual(-98);
        expect(map.getZoom()).toEqual(4);
    });

    it('should react to changed zoom and location', function() {
        runs(function() {
          window.location.hash = '#5.00/38.00/-99.00';
        });
        waits(600);
        runs(function() {
          var center = map.getCenter();
          expect(Math.round(center.lat)).toEqual(38);
          expect(Math.round(center.lon)).toEqual(-99);
          expect(map.getZoom()).toEqual(5);
        });
    });

    it('should not mess with map movement', function() {
        runs(function() {
          map.setCenterZoom(new mm.Location(25, 25), 2);
        });
        waits(600);
        runs(function() {
          var center = map.getCenter();
          expect(Math.round(center.lat)).toEqual(25);
          expect(Math.round(center.lon)).toEqual(25);
          expect(map.getZoom()).toEqual(2);
        });
    });

    it('sets the right location hash', function() {
        runs(function() {
          map.setCenterZoom(new mm.Location(25, 25), 2);
        });
        waits(600);
        runs(function() {
          expect(window.location.hash).toEqual('#2.00/25.0/25.0');
        });
    });
});
