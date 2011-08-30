wax = wax || {};
wax.mm = wax.mm || {};

// Bandwidth Detection
// ------------------
wax.mm.bwdetect = function(map, options) {
    options = options || {};
    var lowpng = options.png || '.png128',
        lowjpg = options.jpg || '.jpg70',
        mm = com.modestmaps,
        bw = 1;

    function setProvider(x) {
        // More or less detect the Wax version
        if (!(x.options && x.options.scheme)) mm.Map.prototype.setProvider.call(map, x);
        var swap = [['.png', '.jpg'], [lowpng, lowjpg]];
        if (bw) swap.reverse();
        for (var i = 0; i < x.options.tiles.length; i++) {
            x.options.tiles[i] = x.options.tiles[i]
                .replace(swap[0][0], swap[1][0])
                .replace(swap[0][1], swap[1][1]);
        }
        mm.Map.prototype.setProvider.call(map, x);
    }

    map.setProvider = setProvider;

    return wax.bwdetect(options, function(x) {
      bw = x;
      setProvider(map.provider);
    });
};
