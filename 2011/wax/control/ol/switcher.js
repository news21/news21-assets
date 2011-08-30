// Wax: Legend Control
// -------------------
// This is a simple layer switcher for OpenLayers, based loosely
// off of the strategy of the openlayers_plus blockswitcher.
// See the last lines for the `layeradded` event, which is the
// way to style layer switcher elements.

// Wax header
var wax = wax || {};
wax.ol = wax.ol || {};

wax.ol.Switcher = OpenLayers.Class(OpenLayers.Control, {
    CLASS_NAME: 'wax.ol.Switcher',

    // Called on `new`. In the tradition of BackBone.js, this control takes
    // an option `e` in its settings object which is a reference to a DOM
    // element it will own.
    initialize: function(options) {
        this.$element = $(options.e);
        this.options = options || {};
        OpenLayers.Control.prototype.initialize.apply(this, [options || {}]);
    },

    // Called from OpenLayers. Attach event handlers to call `this.redraw`
    // when the map state has changed.
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.on({
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
        });
        this.redraw();
    },

    // The callback of a click on a layer switcher layer element (usually a
    // link element).
    layerClick: function(evt) {
      var element = evt.currentTarget;
      var layer = $(element).data('layer');
      $('a.active', this.$element).removeClass('active');
      $.each(this.map.getLayersBy('isBaseLayer', false),
        function() {
          // Only make visible, non-RootContainer layers invisible.
          // RootContainer layers are behind-the-scenes OpenLayers-created
          // layers that help manage interaction with multiple Vector layers.
          if (this.CLASS_NAME !== 'OpenLayers.Layer.Vector.RootContainer' &&
             this.displayInLayerSwitcher) {
            this.setVisibility(false);
          }
        }
      );
      layer.setVisibility(true);
      $(element).addClass('active');
    },

    // Evaluate whether the map state has changed enough to justify a
    // redraw of this element
    needsRedraw: function() {
        if (!this.layerStates || this.layerStates.length ||
           (this.map.layers.length != this.layerStates.length)) {
            return true;
        }
        for (var i = 0, len = this.layerStates.length; i < len; i++) {
            var layerState = this.layerStates[i];
            var layer = this.map.layers[i];
            if ((layerState.name != layer.name) ||
                (layerState.inRange != layer.inRange) ||
                (layerState.id != layer.id) ||
                (layerState.visibility != layer.visibility)) {
              return true;
            }
        }
        return false;
    },

    // Rebuild this layer switcher by clearing out its `$element` (aka `e`)
    // and rebuilding its DOM structure.
    redraw: function() {
      if (this.needsRedraw()) {
        // Clear out previous layers
        this.$element.html('');

        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        var len = this.map.layers.length;
        this.layerStates = [];
        for (var i = 0; i < len; i++) {
          var layerState = this.map.layers[i];
          this.layerStates[i] = {
              name: layerState.name,
              visibility: layerState.visibility,
              inRange: layerState.inRange,
              id: layerState.id
          };
        }

        var layers = this.map.layers.slice();
        for (i = 0, len = layers.length; i < len; i++) {
          var layer = layers[i];
          if (layer.displayInLayerSwitcher) {
            // Only check a baselayer if it is *the* baselayer, check data layers if they are visible
            var checked = layer.isBaseLayer ? (layer === this.map.baseLayer) : layer.getVisibility();
            var clickLayer = $.proxy(function(e) { this.layerClick(e); return false; }, this);
            var $layer_element = $('<a></a>');
            // Add states and click handler
            $layer_element
                .click(clickLayer)
                .attr('href', '#')
                .text(layer.name)
                .addClass('layer-toggle')
                .data('layer', layer)
                .attr('disabled', !layer.inRange);
                if (checked) {
                  $layer_element.addClass('active');
                }
            }
            this.$element.append($layer_element);
            // Trigger a `layeradded` event on the element we own. This is
            // the way to style layer switcher elements: attach a listener
            // to this event, and then modify on addition.
            this.$element.trigger('layeradded', $layer_element);
          }
        }
    }
});
