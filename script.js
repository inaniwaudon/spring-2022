var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// lookup table
var gamma = 1.2;
var correctGamma = function (x) { return Math.pow((x / 255), (1 * gamma)) * 255; };
var gammaTable = __spreadArray([], Array(255), true).map(function (_, i) { return correctGamma(i); });
window.onload = function () {
    // load an image
    var src = ["cherry1.jpeg"];
    var image = new Image();
    image.src = src[Math.round(Math.random() * (src.length - 1))];
    image.onload = function () {
        var canvas = document.querySelector("#main");
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth * (image.height / image.width);
        var context = canvas.getContext("2d");
        // img canvas
        var imgCanvas = document.createElement("canvas");
        imgCanvas.width = image.width / 2;
        imgCanvas.height = image.height / 2;
        var imgContext = imgCanvas.getContext("2d");
        imgContext.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height);
        var imageData = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
        // bg canvas
        var bgCanvas = document.createElement("canvas");
        bgCanvas.width = imgCanvas.width;
        bgCanvas.height = imgCanvas.height;
        var bgContext = bgCanvas.getContext("2d");
        // initialize
        bgContext.fillStyle = "hsl(204 90% 55%)";
        bgContext.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        var firstBlossoms = [];
        for (var y = 0; y < imgCanvas.height; y++) {
            for (var x = 0; x < imgCanvas.width; x++) {
                var i = (y * imgCanvas.width + x) * 4;
                var r = gammaTable[imageData.data[i]];
                var g = gammaTable[imageData.data[i + 1]];
                var b = gammaTable[imageData.data[i + 2]];
                // cherry blossoms
                if (r + g + b > 255 * 1.7) {
                    if (Math.random() > 0.85) {
                        var alpha = 0.3 + Math.random() * 0.7;
                        firstBlossoms.push({
                            x: x,
                            y: y,
                            scale: Math.random() * 2,
                            scaleDiff: Math.random() > 0.8 ? Math.random() * 0.016 - 0.008 + 1 : 1,
                            r: r,
                            g: g,
                            b: b,
                            alpha: alpha,
                            angle: 180 + 20 + Math.random() * 140,
                            delay: Math.random() * 30 + 4
                        });
                    }
                }
                // others
                else {
                    bgContext.fillStyle = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
                    bgContext.fillRect(x, y, 1, 1);
                }
            }
        }
        // draw
        var scale = canvas.width / imgCanvas.width;
        var moveBlossoms = function (t) {
            return firstBlossoms.map(function (blossom) {
                var radian = (2 * Math.PI * blossom.angle) / 360;
                var distance = Math.max(t - blossom.delay, 0) * 20;
                return __assign(__assign({}, blossom), { x: blossom.x + Math.cos(radian) * distance, y: blossom.y + Math.sin(radian) * distance + Math.pow(distance, 2) * 0.0018, scale: blossom.scale *
                        Math.pow(blossom.scaleDiff, Math.max(t - blossom.delay, 0)) });
            });
        };
        context.font = "10px \"Zen Old Mincho\"";
        var draw = function (blossoms) {
            context.drawImage(bgCanvas, 0, 0, canvas.width, canvas.height);
            // cherry blossoms
            for (var _i = 0, blossoms_1 = blossoms; _i < blossoms_1.length; _i++) {
                var blossom = blossoms_1[_i];
                context.fillStyle = "rgba(".concat(blossom.r, ", ").concat(blossom.g, ", ").concat(blossom.b, ", ").concat(blossom.alpha, ")");
                var randomRange = 20;
                context.save();
                context.scale(blossom.scale, blossom.scale);
                var x = blossom.x * scale + Math.random() * randomRange - randomRange / 2;
                var y = blossom.y * scale + Math.random() * randomRange - randomRange / 2;
                context.fillText("桜", x / blossom.scale, y / blossom.scale);
                context.restore();
            }
        };
        var loop = function (t) {
            var blossoms = moveBlossoms(t);
            draw(blossoms);
            setTimeout(function () {
                loop(t + 1);
            }, 200);
        };
        loop(0);
    };
};
