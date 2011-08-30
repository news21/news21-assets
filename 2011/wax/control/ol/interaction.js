// Wax header
var wax = wax || {};
wax.ol = wax.ol || {};

var addEv = function(element, name, observer) {
    if (element.addEventListener) {
        element.addEventListener(name, observer, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + name, observer);
    }
};

// An interaction toolkit for tiles that implement the
// [MBTiles UTFGrid spec](https://github.com/mapbox/mbtiles-spec)
wax.ol.Interaction =
    OpenLayers.Class(OpenLayers.Control, {
    feature: {},
    handlerOptions: null,
    handlers: null,

    gm: new wax.GridManager(),

    initialize: function(tilejson, options) {
        this.options = options || {};
        this.clickAction = this.options.clickAction || 'full';
        this.gm = new wax.GridManager(tilejson);

        OpenLayers.Control.prototype.initialize.apply(this, [this.options || {}]);

        this.callbacks = this.options.callbacks || new wax.tooltip();
    },

    setMap: function(map) {
        addEv(map.viewPortDiv, 'mousemove', wax.util.bind(this.getInfoForHover, this));
        addEv(map.viewPortDiv, 'mouseout', wax.util.bind(this.resetLayers, this));
        this.clickHandler = new OpenLayers.Handler.Click(
            this, {
                click: this.getInfoForClick
            }
        );

        this.clickHandler.setMap(map);
        this.clickHandler.activate();

        map.events.on({
            addlayer: this.resetLayers,
            changelayer: this.resetLayers,
            removelayer: this.resetLayers,
            changebaselayer: this.resetLayers,
            scope: this
        });

        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

    // Get an Array of the stack of tiles under the mouse.
    // This operates with pixels only, since there's no way
    // to bubble through an element which is sitting on the map
    // (like an SVG overlay).
    //
    // If no tiles are under the mouse, returns an empty array.
    getTileStack: function(layers, pos) {
        // If we don't have both an event and some tiles, it's nothing.
        if (!layers || !pos) return [];
        var tiles = [];
        layerfound: for (var j = 0; j < layers.length; j++) {
            for (var x = 0; x < layers[j].grid.length; x++) {
                for (var y = 0; y < layers[j].grid[x].length; y++) {
                    if (layers[j].grid[x][y].imgDiv) {
                        var divpos = wax.util.offset(layers[j].grid[x][y].imgDiv);
                    } else {
                        var divpos = wax.util.offset(layers[j].grid[x][y].frame);
                    }
                    if (divpos &&
                        ((divpos.top < pos.y) &&
                         ((divpos.top + 256) > pos.y) &&
                         (divpos.left < pos.x) &&
                         ((divpos.left + 256) > pos.x))) {
                        tiles.push(layers[j].grid[x][y]);
                        continue layerfound;
                    }
                }
            }
        }
        return tiles;
    },

    // Get all interactable layers
    viableLayers: function() {
        if (this._viableLayers) return this._viableLayers;
        this._viableLayers = [];
        for (var i in this.map.layers) {
            // TODO: make better indication of whether
            // this is an interactive layer
            if ((this.map.layers[i].visibility === true) &&
                (this.map.layers[i].CLASS_NAME === 'OpenLayers.Layer.TMS')) {
              this._viableLayers.push(this.map.layers[i]);
            }
        }
        return this._viableLayers;
    },

    resetLayers: function(evt) {
        this._viableLayers = null;
        // Fix a condition in which mouseout is called, but the user is really mousing
        // over to a different tile.
        var newTarget = evt.relatedTarget || evt.toElement;
        if (newTarget && newTarget.className !== 'olTileImage') {
            this.callbacks.out(this.map.viewPortDiv);
        }
    },

    // React to a click mouse event
    // This is the `pause` handler attached to the map.
    getInfoForClick: function(evt) {
        // If there's no event, this handler should not continue.
        if (!evt) return;
        var layers = this.viableLayers();
        var pos = wax.util.eventoffset(evt);
        var tiles = this.getTileStack(this.viableLayers(), pos);
        var feature = null,
        g = null;
        var that = this;

        for (var t = 0; t < tiles.length; t++) {
            if (!tiles[t].url) continue;
            this.gm.getGrid(tiles[t].url, function(err, g) {
                if (!g) return;
                var feature = g.tileFeature(pos.x, pos.y, tiles[t].frame, {
                    format: that.clickAction
                });
                if (feature) {
                    switch (that.clickAction) {
                        case 'full':
                            that.callbacks.click(feature, tiles[t].layer.map.viewPortDiv, t);
                        break;
                        case 'location':
                            window.location = feature;
                        break;
                    }
                }
            });
        }
    },

    // React to a hover mouse event, by finding all tiles,
    // finding features, and calling `this.callbacks[]`
    // This is the `click` handler attached to the map.
    getInfoForHover: function(evt) {
        // If there's no event, this handler should not proceed.
        if (!evt) return;
        var options = { format: 'teaser' };
        var layers = this.viableLayers();
        var pos = wax.util.eventoffset(evt);
        var tiles = this.getTileStack(this.viableLayers(), pos);
        var feature = null,
        g = null;
        var that = this;

        for (var t = 0; t < tiles.length; t++) {
            if (!tiles[t].url) continue;
            // This features has already been loaded, or
            // is currently being requested.
            this.gm.getGrid(tiles[t].url, function(err, g) {
                if (g && tiles[t]) {
                    var feature = g.tileFeature(pos.x, pos.y, tiles[t].frame, options);

                    if (feature) {
                        if (!tiles[t]) return;
                        if (feature && that.feature[t] !== feature) {
                            that.feature[t] = feature;
                            that.callbacks.out(tiles[t].layer.map.div);
                            that.callbacks.over(feature, tiles[t].layer.map.div, t, evt);
                        } else if (!feature) {
                            that.feature[t] = null;
                            that.callbacks.out(tiles[t].layer.map.div);
                        } else {
                        }
                    } else {
                        // Request this feature
                        // TODO(tmcw) re-add layer
                        // Only nix this tooltip if the current tooltip is
                        // owned by this layer
                        if (that.feature[t]) {
                            that.callbacks.out(tiles[t].layer.map.div);
                        }
                        that.feature[t] = null;
                    }
                }
            });
        }
    },
    CLASS_NAME: 'wax.ol.Interaction'
});
