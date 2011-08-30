wax = wax || {};
wax.mm = wax.mm || {};

// Fullscreen
// ----------
// A simple fullscreen control for Modest Maps

// Add zoom links, which can be styled as buttons, to a `modestmaps.Map`
// control. This function can be used chaining-style with other
// chaining-style controls.
wax.mm.fullscreen = function(map) {
    var state = 1,
        fullscreen = {},
        a,
        smallSize;

    function click(e) {
        if (e) com.modestmaps.cancelEvent(e);
        if (state = !state) {
            fullscreen.original();
        } else {
            fullscreen.full();
        }
    }

    // Modest Maps demands an absolute height & width, and doesn't auto-correct
    // for changes, so here we save the original size of the element and
    // restore to that size on exit from fullscreen.
    fullscreen.add = function(map) {
        a = document.createElement('a');
        a.className = 'wax-fullscreen';
        a.href = '#fullscreen';
        a.innerHTML = 'fullscreen';
        com.modestmaps.addEvent(a, 'click', click);
        return this;
    };
    fullscreen.full = function() {
        smallSize = [map.parent.offsetWidth, map.parent.offsetHeight];
        map.parent.className += ' wax-fullscreen-map';
        map.setSize(
            map.parent.offsetWidth,
            map.parent.offsetHeight);
    };
    fullscreen.original = function() {
        map.parent.className = map.parent.className.replace('wax-fullscreen-map', '');
        map.setSize(
            smallSize[0],
            smallSize[1]);
    };
    fullscreen.appendTo = function(elem) {
        wax.util.$(elem).appendChild(a);
        return this;
    };

    return fullscreen.add(map);
};
