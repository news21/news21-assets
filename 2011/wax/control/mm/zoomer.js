wax = wax || {};
wax.mm = wax.mm || {};

// Zoomer
// ------
// Add zoom links, which can be styled as buttons, to a `modestmaps.Map`
// control. This function can be used chaining-style with other
// chaining-style controls.
wax.mm.zoomer = function(map) {
    var mm = com.modestmaps;

    var zoomin = document.createElement('a');
    zoomin.innerHTML = '+';
    zoomin.href = '#';
    zoomin.className = 'zoomer zoomin';
    mm.addEvent(zoomin, 'mousedown', function(e) {
        mm.cancelEvent(e);
    });
    mm.addEvent(zoomin, 'dblclick', function(e) {
        mm.cancelEvent(e);
    });
    mm.addEvent(zoomin, 'click', function(e) {
        mm.cancelEvent(e);
        map.zoomIn();
    }, false);

    var zoomout = document.createElement('a');
    zoomout.innerHTML = '-';
    zoomout.href = '#';
    zoomout.className = 'zoomer zoomout';
    mm.addEvent(zoomout, 'mousedown', function(e) {
        mm.cancelEvent(e);
    });
    mm.addEvent(zoomout, 'dblclick', function(e) {
        mm.cancelEvent(e);
    });
    mm.addEvent(zoomout, 'click', function(e) {
        mm.cancelEvent(e);
        map.zoomOut();
    }, false);

    var zoomer = {
        add: function(map) {
            map.addCallback('drawn', function(map, e) {
                if (map.coordinate.zoom === map.provider.outerLimits()[0].zoom) {
                    zoomout.className = 'zoomer zoomout zoomdisabled';
                } else if (map.coordinate.zoom === map.provider.outerLimits()[1].zoom) {
                    zoomin.className = 'zoomer zoomin zoomdisabled';
                } else {
                    zoomin.className = 'zoomer zoomin';
                    zoomout.className = 'zoomer zoomout';
                }
            });
            return this;
        },
        appendTo: function(elem) {
            wax.util.$(elem).appendChild(zoomin);
            wax.util.$(elem).appendChild(zoomout);
            return this;
        }
    };
    return zoomer.add(map);
};
