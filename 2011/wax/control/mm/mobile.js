wax = wax || {};
wax.mm = wax.mm || {};

// Mobile
// ------
// For making maps on normal websites nicely mobile-ized
wax.mm.mobile = function(map, tilejson, opts) {
    opts = opts || {};
    // Inspired by Leaflet
    var mm = com.modestmaps,
        ua = navigator.userAgent.toLowerCase(),
        isWebkit = ua.indexOf("webkit") != -1,
        isMobile = ua.indexOf("mobile") != -1,
        mobileWebkit = isMobile && isWebkit;

    var defaultOverlayDraw = function(div) {
        var canvas = document.createElement('canvas');
        var width = parseInt(div.style.width, 10),
            height = parseInt(div.style.height, 10),
            w2 = width / 2,
            h2 = height / 2,
            // Make the size of the arrow nicely proportional to the map
            size = Math.min(width, height) / 4;

        var ctx = canvas.getContext('2d');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        ctx.globalAlpha = 0.5;
        // Draw a nice gradient to signal that the map is inaccessible
        var inactive = ctx.createLinearGradient(0, 0, 300, 225);
        inactive.addColorStop(0, "black");
        inactive.addColorStop(1, "rgb(200, 200, 200)");
        ctx.fillStyle = inactive;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.moveTo(w2 - size * 0.6, h2 - size); // give the (x,y) coordinates
        ctx.lineTo(w2 - size * 0.6, h2 + size);
        ctx.lineTo(w2 + size * 0.6, h2);
        ctx.fill();

        // Done! Now fill the shape, and draw the stroke.
        // Note: your shape will not be visible until you call any of the two methods.
        div.appendChild(canvas);
    };

    var defaultBackDraw = function(div) {
        div.style.position = 'absolute';
        div.style.height = '50px';
        div.style.left =
            div.style.right = '0';

        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', div.offsetWidth);
        canvas.setAttribute('height', div.offsetHeight);

        var ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(0, 0, div.offsetWidth, div.offsetHeight);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("back", 20, 30);
        div.appendChild(canvas);
    };

    var maximizeElement = function(elem) {
        elem.style.position = 'absolute';
        elem.style.width =
            elem.style.height = 'auto';
        elem.style.top = (window.pageYOffset) + 'px';
        elem.style.left =
            elem.style.right = '0px';
    };

    var minimizeElement = function(elem) {
        elem.style.position = 'relative';
        elem.style.width =
            elem.style.height =
            elem.style.top =
            elem.style.left =
            elem.style.right = 'auto';
    };

    var overlayDiv,
        oldBody,
        standIn,
        meta,
        overlayDraw = opts.overlayDraw || defaultOverlayDraw,
        backDraw = opts.backDraw || defaultBackDraw;
        bodyDraw = opts.bodyDraw || function() {};

    var mobile = {
        add: function(map) {
            // Code in this block is only run on Mobile Safari;
            // therefore HTML5 Canvas is fine.
            if (mobileWebkit) {
                meta = document.createElement('meta');
                meta.id = 'wax-touch';
                meta.setAttribute('name', 'viewport');
                overlayDiv = document.createElement('div');
                overlayDiv.id = map.parent.id + '-mobileoverlay';
                overlayDiv.className = 'wax-mobileoverlay';
                overlayDiv.style.position = 'absolute';
                overlayDiv.style.width = map.dimensions.x + 'px';
                overlayDiv.style.height = map.dimensions.y + 'px';
                map.parent.appendChild(overlayDiv);
                overlayDraw(overlayDiv);

                standIn = document.createElement('div');
                backDiv = document.createElement('div');
                // Store the old body - we'll need it.
                oldBody = document.body;

                newBody = document.createElement('body');
                newBody.className = 'wax-mobile-body';
                newBody.appendChild(backDiv);

                mm.addEvent(overlayDiv, 'touchstart', this.toTouch);
                mm.addEvent(backDiv, 'touchstart', this.toPage);
            }
            return this;
        },
        // Enter "touch mode"
        toTouch: function() {
            // Enter a new body
            map.parent.parentNode.replaceChild(standIn, map.parent);
            newBody.insertBefore(map.parent, backDiv);
            document.body = newBody;

            bodyDraw(newBody);
            backDraw(backDiv);
            meta.setAttribute('content',
                'initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
            document.head.appendChild(meta);
            map._smallSize = [map.parent.clientWidth, map.parent.clientHeight];
            maximizeElement(map.parent);
            map.setSize(
                map.parent.offsetWidth,
                window.innerHeight);
            backDiv.style.display = 'block';
            overlayDiv.style.display = 'none';
        },
        // Return from touch mode
        toPage: function() {
            // Currently this code doesn't, and can't, reset the
            // scale of the page. Anything to not use the meta-element
            // would be a bit of a hack.
            document.body = oldBody;
            standIn.parentNode.replaceChild(map.parent, standIn);
            minimizeElement(map.parent);
            map.setSize(map._smallSize[0], map._smallSize[1]);
            backDiv.style.display = 'none';
            overlayDiv.style.display = 'block';
        }
    };
    return mobile.add(map);
};
