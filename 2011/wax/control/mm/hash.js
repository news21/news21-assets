wax = wax || {};
wax.mm = wax.mm || {};

// A basic manager dealing only in hashchange and `location.hash`.
// This **will interfere** with anchors, so a HTML5 pushState
// implementation will be preferred.
wax.mm.locationHash = {
  stateChange: function(callback) {
    com.modestmaps.addEvent(window, 'hashchange', function() {
      callback(location.hash.substring(1));
    }, false);
  },
  getState: function() {
    return location.hash.substring(1);
  },
  pushState: function(state) {
    location.hash = '#' + state;
  }
};

// a HTML5 pushstate-based hash changer.
//
// This **does not degrade** with non-supporting browsers - it simply
// does nothing.
wax.mm.pushState = {
    stateChange: function(callback) {
        com.modestmaps.addEvent(window, 'popstate', function(e) {
            if (e.state && e.state.map_location) {
                callback(e.state.map_location);
            }
        }, false);
    },
    getState: function() {
       if (!(window.history && window.history.state)) return;
       return history.state && history.state.map_location;
    },
    // Push states - so each substantial movement of the map
    // is a history object.
    pushState: function(state) {
        if (!(window.history && window.history.pushState)) return;
        window.history.pushState({ map_location: state }, document.title, window.location.href);
    }
};

// Hash
// ----
wax.mm.hash = function(map, tilejson, options) {
    options = options || {};

    var s0,
        hash = {},
        // allowable latitude range
        lat = 90 - 1e-8;

    options.manager = options.manager || wax.mm.pushState;

    // Ripped from underscore.js
    // Internal function used to implement `_.throttle` and `_.debounce`.
    function limit(func, wait, debounce) {
        var timeout;
          return function() {
              var context = this, args = arguments;
              var throttler = function() {
                  timeout = null;
                  func.apply(context, args);
              };
              if (debounce) clearTimeout(timeout);
              if (debounce || !timeout) timeout = setTimeout(throttler, wait);
          };
    }

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    function throttle(func, wait) {
        return limit(func, wait, false);
    }

    var parser = function(s) {
        var args = s.split('/');
        for (var i = 0; i < args.length; i++) {
            args[i] = Number(args[i]);
            if (isNaN(args[i])) return true;
        }
        if (args.length < 3) {
            // replace bogus hash
            return true;
        } else if (args.length == 3) {
            map.setCenterZoom(new com.modestmaps.Location(args[1], args[2]), args[0]);
        }
    };

    var formatter = function() {
        var center = map.getCenter(),
            zoom = map.getZoom(),
            precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));
        return [zoom.toFixed(2),
          center.lat.toFixed(precision),
          center.lon.toFixed(precision)].join('/');
    };

    function move() {
        var s1 = formatter();
        if (s0 !== s1) {
            s0 = s1;
            // don't recenter the map!
            options.manager.pushState(s0);
        }
    }

    function stateChange(state) {
        // ignore spurious hashchange events
        if (state === s0) return;
        if (parser(s0 = state)) {
            // replace bogus hash
            move();
        }
    }

    var initialize = function() {
        if (options.defaultCenter) map.setCenter(options.defaultCenter);
        if (options.defaultZoom) map.setZoom(options.defaultZoom);
    };

    hash.add = function(map) {
        if (options.manager.getState()) {
            stateChange(options.manager.getState());
        } else {
            initialize();
            move();
        }
        map.addCallback('drawn', throttle(move, 500));
        options.manager.stateChange(stateChange);
        return this;
    };

    return hash.add(map);
};
