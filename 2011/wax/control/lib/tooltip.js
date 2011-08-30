var wax = wax || {};
wax.tooltip = {};

wax.tooltip = function(options) {
    this._currentTooltip = undefined;
    options = options || {};
    if (options.animationOut) this.animationOut = options.animationOut;
    if (options.animationIn) this.animationIn = options.animationIn;
};

// Helper function to determine whether a given element is a wax popup.
wax.tooltip.prototype.isPopup = function(el) {
    return el && el.className.indexOf('wax-popup') !== -1;
};

// Get the active tooltip for a layer or create a new one if no tooltip exists.
// Hide any tooltips on layers underneath this one.
wax.tooltip.prototype.getTooltip = function(feature, context, index, evt) {
    tooltip = document.createElement('div');
    tooltip.className = 'wax-tooltip wax-tooltip-' + index;
    tooltip.innerHTML = feature;
    context.appendChild(tooltip);
    return tooltip;
};

// Hide a given tooltip.
wax.tooltip.prototype.hideTooltip = function(el) {
    if (!el) return;
    var event;
    var remove = function() {
        if (this.parentNode) this.parentNode.removeChild(this);
    };
    if (el.style['-webkit-transition'] !== undefined && this.animationOut) {
        event = 'webkitTransitionEnd';
    } else if (el.style.MozTransition !== undefined && this.animationOut) {
        event = 'transitionend';
    }
    if (event) {
        el.addEventListener(event, remove, false);
        el.addEventListener('transitionend', remove, false);
        el.className += ' ' + this.animationOut;
    } else {
        if (el.parentNode) el.parentNode.removeChild(el);
    }
};

// Expand a tooltip to be a "popup". Suspends all other tooltips from being
// shown until this popup is closed or another popup is opened.
wax.tooltip.prototype.click = function(feature, context, index) {
    // Hide any current tooltips.
    this.unselect(context);

    var tooltip = this.getTooltip(feature, context, index);
    var close = document.createElement('a');
    close.href = '#close';
    close.className = 'close';
    close.innerHTML = 'Close';

    var closeClick = wax.util.bind(function(ev) {
        this.hideTooltip(tooltip);
        this._currentTooltip = undefined;
        ev.returnValue = false; // Prevents hash change.
        if (ev.stopPropagation) ev.stopPropagation();
        if (ev.preventDefault) ev.preventDefault();
        return false;
    }, this);
    // IE compatibility.
    if (close.addEventListener) {
        close.addEventListener('click', closeClick, false);
    } else if (close.attachEvent) {
        close.attachEvent('onclick', closeClick);
    }

    tooltip.className += ' wax-popup';
    tooltip.innerHTML = feature;
    tooltip.appendChild(close);
    this._currentTooltip = tooltip;
};

// Show a tooltip.
wax.tooltip.prototype.select = function(feature, context, layer_id, evt) {
    if (!feature) return;
    if (this.isPopup(this._currentTooltip)) return;

    this._currentTooltip = this.getTooltip(feature, context, layer_id, evt);
    context.style.cursor = 'pointer';
};


// Hide all tooltips on this layer and show the first hidden tooltip on the
// highest layer underneath if found.
wax.tooltip.prototype.unselect = function(context) {
    if (this.isPopup(this._currentTooltip)) return;

    context.style.cursor = 'default';
    if (this._currentTooltip) {
        this.hideTooltip(this._currentTooltip);
        this._currentTooltip = undefined;
    }
};

wax.tooltip.prototype.out = wax.tooltip.prototype.unselect;
wax.tooltip.prototype.over = wax.tooltip.prototype.select;
wax.tooltip.prototype.click = wax.tooltip.prototype.click;
