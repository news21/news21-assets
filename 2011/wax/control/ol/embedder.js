// Wax header
var wax = wax || {};
wax.ol = wax.ol || {};

// An interaction toolkit for tiles that implement the
// [MBTiles UTFGrid spec](https://github.com/mapbox/mbtiles-spec)
wax.ol.Embedder =
    OpenLayers.Class(OpenLayers.Control, {
    initialize: function(options) {
      options = options || {};
      OpenLayers.Control.prototype.initialize.apply(this, [options || {}]);
    },

    // Add handlers to the map
    setMap: function(map) {
      if ($('#' + this.el + '-script').length) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        $(map.div).prepend($('<input type="text" class="embed-src" />')
          .css({
              'z-index': '9999999999',
              'position': 'relative'
          })
          .val("<div id='" + this.el + "-script'>" + $('#' + this.el + '-script').html() + '</div>'));
      }
      this.activate();
    },

    CLASS_NAME: 'wax.ol.Embedder'
});
