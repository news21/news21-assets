var wax = wax || {};
wax.mm = wax.mm || {};

// A layer connector for Modest Maps conformant to TileJSON
// https://github.com/mapbox/tilejson
wax.mm.connector = function(options) {
    this.options = {
        tiles: options.tiles,
        scheme: options.scheme || 'xyz',
        minzoom: options.minzoom || 0,
        maxzoom: options.maxzoom || 22
    };
};

wax.mm.connector.prototype = {
    outerLimits: function() {
        return [
            new com.modestmaps.Coordinate(0,0,0).zoomTo(this.options.minzoom),
            new com.modestmaps.Coordinate(1,1,0).zoomTo(this.options.maxzoom)
        ];
    },
    getTileUrl: function(c) {
        if (!(coord = this.sourceCoordinate(c))) return null;

        coord.row = (this.options.scheme === 'tms') ?
            Math.pow(2, coord.zoom) - coord.row - 1 :
            coord.row;

        return this.options.tiles[parseInt(Math.pow(2, coord.zoom) * coord.row + coord.column, 10) %
            this.options.tiles.length]
            .replace('{z}', coord.zoom.toFixed(0))
            .replace('{x}', coord.column.toFixed(0))
            .replace('{y}', coord.row.toFixed(0));
    }
};

// Wax shouldn't throw any exceptions if the external it relies on isn't
// present, so check for modestmaps.
if (com && com.modestmaps) {
    com.modestmaps.extend(wax.mm.connector, com.modestmaps.MapProvider);
}
