wax = wax || {};
wax.leaf = wax.leaf || {};

// A chaining-style control that adds
// interaction to a Leaflet.Map object.
//
// Takes an options object with the following keys:
//
// * `callbacks` (optional): an `out`, `over`, and `click` callback.
//   If not given, the `wax.tooltip` library will be expected.
// * `clickAction` (optional): **full** or **location**: default is
//   **full**.
wax.leaf.interaction = function(map, tilejson, options) {
    tilejson = tilejson || {};
    options = options || {};
    // Our GridManager (from `gridutil.js`). This will keep the
    // cache of grid information and provide friendly utility methods
    // that return `GridTile` objects instead of raw data.
    var interaction = {
        modifyingEvents: ['move'],

        waxGM: new wax.GridManager(tilejson),

        // This requires wax.Tooltip or similar
        callbacks: options.callbacks || new wax.tooltip(),

        clickAction: options.clickAction || 'full',

        // Attach listeners to the map
        add: function() {
            for (var i = 0; i < this.modifyingEvents.length; i++) {
                map.on(
                    this.modifyingEvents[i],
                    wax.util.bind(this.clearTileGrid, this)
                );
            }
            L.DomEvent.addListener(map._container, 'mousemove', this.onMove(), this);
            L.DomEvent.addListener(map._container, 'mousemove', this.mouseDown(), this);
            return this;
        },

        // Search through `._layers` and determine the position,
        // from the top-left of the **document**, and cache that data
        // so that `mousemove` events don't always recalculate.
        getTileGrid: function() {
            // TODO: don't build for tiles outside of viewport
            // var zoom = map.getZoom();
            // Calculate a tile grid and cache it, by using the `.tiles`
            // element on this map.
            //
            // For now assume only one layer
            return this._getTileGrid || (this._getTileGrid =
                (function(layers) {
                    var o = [];
                    for (var layerId in layers) {
                        // This only supports tiled layers
                        if (layers[layerId]._tiles) {
                            for (var tile in layers[layerId]._tiles) {
                                var offset = wax.util.offset(layers[layerId]._tiles[tile]);
                                o.push([offset.top, offset.left, layers[layerId]._tiles[tile]]);
                            }
                        }
                    }
                    return o;
                })(map._layers));
        },

        clearTileGrid: function(map, e) {
            this._getTileGrid = null;
        },

        getTile: function(evt) {
            var tile;
            var grid = this.getTileGrid();
            for (var i = 0; i < grid.length; i++) {
                if ((grid[i][0] < evt.y) &&
                   ((grid[i][0] + 256) > evt.y) &&
                    (grid[i][1] < evt.x) &&
                   ((grid[i][1] + 256) > evt.x)) {
                    tile = grid[i][2];
                    break;
                }
            }
            return tile || false;
        },

        // Clear the double-click timeout to prevent double-clicks from
        // triggering popups.
        clearTimeout: function() {
            if (this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
                return true;
            } else {
                return false;
            }
        },

        onMove: function(evt) {
            if (!this._onMove) this._onMove = wax.util.bind(function(evt) {
                var pos = wax.util.eventoffset(evt);
                var tile = this.getTile(pos);
                if (tile) {
                    this.waxGM.getGrid(tile.src, wax.util.bind(function(err, g) {
                        if (err) return;
                        if (g) {
                            var feature = g.tileFeature(pos.x, pos.y, tile, {
                                format: 'teaser'
                            });
                            // This and other Modest Maps controls only support a single layer.
                            // Thus a layer index of **0** is given to the tooltip library
                            if (feature) {
                                if (feature && this.feature !== feature) {
                                    this.feature = feature;
                                    this.callbacks.out(map._container);
                                    this.callbacks.over(feature, map._container, 0, evt);
                                } else if (!feature) {
                                    this.feature = null;
                                    this.callbacks.out(map._container);
                                }
                            } else {
                                this.feature = null;
                                this.callbacks.out(map._container);
                            }
                        }
                    }, this));
                }
            }, this);
            return this._onMove;
        },

        mouseDown: function(evt) {
            if (!this._mouseDown) this._mouseDown = wax.util.bind(function(evt) {
                // Ignore double-clicks by ignoring clicks within 300ms of
                // each other.
                if (this.clearTimeout()) {
                    return;
                }
                // Store this event so that we can compare it to the
                // up event
                this.downEvent = evt;
                L.DomEvent.addListener(map._container, 'mouseup', this.mouseUp(), this);
            }, this);
            return this._mouseDown;
        },

        mouseUp: function() {
            if (!this._mouseUp) this._mouseUp = wax.util.bind(function(evt) {
                L.DomEvent.removeListener(map._container, 'mouseup', this.mouseUp(), this);
                // Don't register clicks that are likely the boundaries
                // of dragging the map
                var tol = 4; // tolerance
                if (Math.round(evt.pageY / tol) === Math.round(this.downEvent.pageY / tol) &&
                    Math.round(evt.pageX / tol) === Math.round(this.downEvent.pageX / tol)) {
                    // Contain the event data in a closure.
                    this.clickTimeout = window.setTimeout(
                        wax.util.bind(function() { this.click()(evt); }, this), 300);
                }
            }, this);
            return this._mouseUp;
        },

        click: function(evt) {
            if (!this._onClick) this._onClick = wax.util.bind(function(evt) {
                var tile = this.getTile(evt);
                if (tile) {
                    this.waxGM.getGrid(tile.src, wax.util.bind(function(err, g) {
                        if (g) {
                            var feature = g.tileFeature(evt.pageX, evt.pageY, tile, {
                                format: this.clickAction
                            });
                            if (feature) {
                                switch (this.clickAction) {
                                    case 'full':
                                        this.callbacks.click(feature, this.parent, 0, evt);
                                        break;
                                    case 'location':
                                        window.location = feature;
                                        break;
                                }
                            }
                        }
                    }, this));
                }
            }, this);
            return this._onClick;
        }
    };

    // Ensure chainability
    return interaction.add(map);
};
