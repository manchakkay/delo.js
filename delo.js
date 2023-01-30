/*
    JS Package with scripts implementing scroll-dependent animations 

    Functions provided:
    вЂў DELO$SCROLL_Rotate вЂ“ Provides Rotate3D animation; 

    https://delo.studio

    USAGE:

    DELO$SCROLL_Rotate({
        "selector": "*[href='#rotate_01'] > img",
        "bias": 0,
        "multiplier": 0.1,
        "accuracy": 0.1,
        "perspective": 600,
        "centerX": 0.5,
        "centerY": 0.5,
        "axisX": 1,
        "axisY": -0.36,
        "axisZ": -0.16,
        "animationFunction": "ease-out",
        "animationTime": "250"
    });
*/

// Scroll-dependept objects
var DELO$$SCROLL_Rotate_Objects = {};
// Scroll-dependept objects keys
var DELO$$SCROLL_Rotate_ObjectsKeys = [];
// Global variables
var DELO$$SCROLL_Rotate_Global = {
    "viewport": {
        "width": 1,
        "height": 1
    }
};
// Scroll-dependent initialisation timer
var DELO$$SCROLL_Rotate_InitTimer;

/**
 * @param {Number} code Error code
 * @param {string} message Error message
 */
function DELO$SCROLL_Error(code, message) {
    console.error("[DELO.JS->SCROLL] ERROR #" + code + ": " + message);
}
/**
 * @param {Number} code Warning code
 * @param {string} message Warning message
 */
function DELO$$SCROLL_Warning(code, message, error) {
    console.warn("[DELO.JS->SCROLL] WARNING #" + code + ": " + message);
    if (error != null && error != undefined) {
        console.debug(code, error);
    }
}

/**
 * @param {object} options Options for scrolling element
 */
function DELO$SCROLL_Rotate(options) {
    var element = {
        "object": {
            "selector": options.selector,
            "element": null
        },
        "center": {
            "x": 0.5,
            "y": 0.5
        },
        "multiplier": 0.1,
        "bias": 0,
        "accuracy": 0.1,
        "axes": {
            "x": 1,
            "y": 0,
            "z": 0
        },
        "perspective": "500px",
        "timing_function": "linear",
        "timing": "0.1ms",
        "throttle": {
            "index": 3,
            "max": 3
        }
    };

    // Scroll bias check
    try {
        if (isNaN(parseFloat(options.bias))) {
            throw "Not a number";
        } else {
            element.bias = parseFloat(options.bias);
        }
    } catch (e) {
        if (typeof options.bias != "undefined") {
            DELO$$SCROLL_Warning(10001, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ СЃРґРІРёРі, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ", e);
        }
    }

    // Scroll multiplier check
    try {
        if (isNaN(parseFloat(options.multiplier))) {
            throw "Not a number";
        } else {
            options.multiplier = parseFloat(options.multiplier);
        }

        if (options.multiplier == 0) {
            throw "Out of range";
        } else {
            element.multiplier = options.multiplier;
        }
    } catch (e) {
        if (typeof options.multiplier != "undefined") {
            DELO$$SCROLL_Warning(10002, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РјРЅРѕР¶РёС‚РµР»СЊ, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ", e);
        }
    }

    // Animation accuracy check
    try {
        if (isNaN(parseFloat(options.accuracy))) {
            throw "Not a number";
        } else {
            options.accuracy = parseFloat(options.accuracy);
        }

        if (options.accuracy < 0 || options.accuracy > 1 || options.accuracy == 0) {
            throw "Out of range";
        } else {
            element.accuracy = options.accuracy;
        }
    } catch (e) {
        if (typeof options.accuracy != "undefined") {
            DELO$$SCROLL_Warning(10003, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ С‚РѕС‡РЅРѕСЃС‚СЊ, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ 0 РґРѕ 1", e);
        }
    }

    // Animation perspective check
    try {

        if (isNaN(parseFloat(options.perspective))) {
            throw "Not a number";
        } else {
            options.perspective = parseFloat(options.perspective);
        }
        if (options.perspective < 0) {
            throw "Out of range";
        } else {
            element.perspective = options.perspective + "px";
        }
    } catch (e) {
        if (typeof options.perspective != "undefined") {
            DELO$$SCROLL_Warning(10004, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РїРµСЂСЃРїРµРєС‚РёРІСѓ, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РїРѕР»РѕР¶РёС‚РµР»СЊРЅРѕРµ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ", e);
        }
    }

    // Center of axis X check
    try {
        if (isNaN(parseFloat(options.centerX))) {
            throw "Not a number";
        } else {
            options.centerX = parseFloat(options.centerX);
        }

        if (options.centerX < 0 || options.centerX > 1) {
            throw "Out of range";
        } else {
            element.center.x = options.centerX;
        }
    } catch (e) {
        if (typeof options.centerX != "undefined") {
            DELO$$SCROLL_Warning(10005, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ С†РµРЅС‚СЂ РїРѕ РѕСЃРё X, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ 0 РґРѕ 1", e);
        }
    }

    // Center of axis Y check
    try {
        if (isNaN(parseFloat(options.centerY))) {
            throw "Not a number";
        } else {
            options.centerY = parseFloat(options.centerY);
        }

        if (options.centerY < 0 || options.centerY > 1) {
            throw "Out of range";
        } else {
            element.center.y = options.centerY;
        }
    } catch (e) {
        if (typeof options.centerY != "undefined") {
            DELO$$SCROLL_Warning(10006, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ С†РµРЅС‚СЂ РїРѕ РѕСЃРё Y, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ 0 РґРѕ 1", e);
        }
    }

    // Coefficient of axis X check
    try {
        if (isNaN(parseFloat(options.axisX))) {
            throw "Not a number";
        } else {
            options.axisX = parseFloat(options.axisX);
        }

        if (options.axisX < -1 || options.axisX > 1) {
            throw "Out of range";
        } else {
            element.axes.x = options.axisX;
        }
    } catch (e) {
        if (typeof options.axisX != "undefined") {
            DELO$$SCROLL_Warning(10007, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РєРѕСЌС„С„РёС†РёРµРЅС‚ РѕСЃРё X, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ -1 РґРѕ 1", e);
        }
    }

    // Coefficient of axis Y check
    try {

        if (isNaN(parseFloat(options.axisY))) {
            throw "Not a number";
        } else {
            options.axisY = parseFloat(options.axisY);
        }

        if (options.axisY < -1 || options.axisY > 1) {
            throw "Out of range";
        } else {
            element.axes.y = options.axisY;
        }
    } catch (e) {
        if (typeof options.axisY != "undefined") {
            DELO$$SCROLL_Warning(10008, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РєРѕСЌС„С„РёС†РёРµРЅС‚ РѕСЃРё Y, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ -1 РґРѕ 1", e);
        }
    }

    // Coefficient of axis Z check
    try {
        if (isNaN(parseFloat(options.axisZ))) {
            throw "Not a number";
        } else {
            options.axisZ = parseFloat(options.axisZ);
        }

        if (options.axisZ < -1 || options.axisZ > 1) {
            throw "Out of range";
        } else {
            element.axes.z = options.axisZ;
        }
    } catch (e) {
        if (typeof options.axisZ != "undefined") {
            DELO$$SCROLL_Warning(10009, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РєРѕСЌС„С„РёС†РёРµРЅС‚ РѕСЃРё Z, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ -1 РґРѕ 1", e);
        }
    }

    // Timing function check
    try {
        if (typeof options.animationFunction != "string" && typeof options.animationFunction != "undefined") {
            throw "Wrong type";
        } else {
            element.timing_function = options.animationFunction;
        }
    } catch (e) {
        DELO$$SCROLL_Warning(10010, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РІРёРґ Р°РЅРёРјР°С†РёРё, РѕР¶РёРґР°РµС‚СЃСЏ СЃС‚СЂРѕРєР° СЃ С„СѓРЅРєС†РёРµР№, РїРѕРґСЂРѕР±РЅРµРµ СЃРјРѕС‚СЂРёС‚Рµ: https://developer.mozilla.org/ru/docs/Web/CSS/animation-timing-function", e);
    }

    // Animation timing check
    try {
        if (isNaN(parseFloat(options.animationTime))) {
            throw "Not a number";
        } else {
            options.animationTime = parseFloat(options.animationTime);
        }

        if (options.animationTime < 0) {
            throw "Out of range";
        } else {
            element.timing = options.animationTime + "ms";
        }
    } catch (e) {
        if (typeof options.animationTime != "undefined") {
            DELO$$SCROLL_Warning(10011, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РєРѕСЌС„С„РёС†РёРµРЅС‚ РѕСЃРё Z, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ РґСЂРѕР±РЅРѕРµ РёР»Рё С†РµР»РѕРµ С‡РёСЃР»Рѕ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ -1 РґРѕ 1", e);
        }
    }

    // Throttle max check
    try {
        if (isNaN(parseInt(options.throttleMax))) {
            throw "Not a number";
        } else {
            options.throttleMax = parseInt(options.throttleMax);
        }

        if (options.throttleMax < 0) {
            throw "Out of range";
        } else {
            element.throttle.max = options.throttleMax - 1;
            element.throttle.index = element.throttle.max;
        }
    } catch (e) {
        if (typeof options.throttleMax != "undefined") {
            DELO$$SCROLL_Warning(10012, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РєРѕСЌС„С„РёС†РёРµРЅС‚ РґСЂРѕСЃСЃРµР»РёСЂРѕРІР°РЅРёСЏ, РїСЂРѕРІРµСЂСЊС‚Рµ С„РѕСЂРјР°С‚, РѕР¶РёРґР°РµС‚СЃСЏ С†РµР»РѕРµ С‡РёСЃР»Рѕ", e);
        }
    }

    // Object search
    try {
        if (document.querySelector(element.object.selector) !== null) {
            element.object.element = document.querySelector(element.object.selector);
        } else {
            element.object.element = null;
        }
    } catch (e) {
        DELO$$SCROLL_Warning(10013, "РќРµ СѓРґР°Р»РѕСЃСЊ СѓСЃС‚Р°РЅРѕРІРёС‚СЊ СЃРµР»РµРєС‚РѕСЂ, РїСЂРѕРІРµСЂСЊС‚Рµ РІРІРѕРґ", e);
    }

    var first = DELO$$SCROLL_Rotate_ObjectsKeys.length == 0;

    DELO$$SCROLL_Rotate_Objects[element.object.selector] = element;
    DELO$$SCROLL_Rotate_ObjectsKeys = Object.keys(DELO$$SCROLL_Rotate_Objects);
    if (DELO$$SCROLL_Rotate_InitTimer == null) {
        DELO$$SCROLL_Rotate_InitTimer = setInterval(DELO$$SCROLL_Rotate_Init, 500);
    }

    if (first) {

        // Rotating on page scrolled
        window.addEventListener("scroll", DELO$$SCROLL_Rotate_Handle);

        // Recalculating viewport size on window resize
        window.addEventListener("resize", DELO$$SCROLL_Global_Resize);

        // Rotating on page loaded
        window.addEventListener("DOMContentLoaded", DELO$$SCROLL_Rotate_Handle);
        window.addEventListener("load", DELO$$SCROLL_Rotate_Handle);

        // Initial calcualtions
        DELO$$SCROLL_Global_Resize();
        DELO$$SCROLL_Rotate_Init();
    }
}

function DELO$$SCROLL_Global_Resize() {
    var width, height;

    if (typeof window.innerWidth == "number") {
        //Non-IE
        width = window.innerWidth;
        height = window.innerHeight;
    } else if (
        document.documentElement &&
        (document.documentElement.clientWidth ||
            document.documentElement.clientHeight)
    ) {
        //IE 6+ in 'standards compliant mode'
        width = document.documentElement.clientWidth;
        height = document.documentElement.clientHeight;
    } else if (
        document.body &&
        (document.body.clientWidth || document.body.clientHeight)
    ) {
        //IE 4 compatible
        width = document.body.clientWidth;
        height = document.body.clientHeight;
    }

    DELO$$SCROLL_Rotate_Global.viewport.width = width;
    DELO$$SCROLL_Rotate_Global.viewport.height = height;
}

function DELO$$SCROLL_Rotate_Init() {
    var selector_test = 0;
    for (var i = 0; i < DELO$$SCROLL_Rotate_ObjectsKeys.length; i++) {
        var try_object = document.querySelector(DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].object.selector);
        if ((DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].object.element == null || DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].object.element == undefined) && (try_object != null && try_object != undefined)) {
            DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].object.element = try_object;
        } else {
            selector_test++;
        }
    }

    if (selector_test == DELO$$SCROLL_Rotate_ObjectsKeys.length) {
        clearInterval(DELO$$SCROLL_Rotate_InitTimer);
        DELO$$SCROLL_Rotate_InitTimer = null;
    }
}

function DELO$$SCROLL_Rotate_Handle(force) {
    for (var i = 0; i < DELO$$SCROLL_Rotate_ObjectsKeys.length; i++) {
        if (force || DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].throttle.index++ >= DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].throttle.max) {
            DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]].throttle.index = 0;
            var data_looped = DELO$$SCROLL_Rotate_Objects[DELO$$SCROLL_Rotate_ObjectsKeys[i]];

            if (data_looped.object.element != null && data_looped.object.element != undefined) {
                DELO$$SCROLL_Rotate_HandleTransform(data_looped);
            } else {
                DELO$$SCROLL_Rotate_Init();
            }


        }
    }
}

function getBoundingClientRectZoom(obj) {
    let zoom = +window.getComputedStyle(obj.closest(".t396__elem")).zoom;
    if (!zoom) { zoom = 1; }
    var data = obj.getBoundingClientRect();

    if (zoom !== 1) {
        data.x = data.x * zoom;
        data.y = data.y * zoom;
        data.top = data.top * zoom;
        data.left = data.left * zoom;
        data.right = data.right * zoom;
        data.bottom = data.bottom * zoom;
        data.width = data.width * zoom;
        data.height = data.height * zoom;
    }

    return data;
}


function DELO$$SCROLL_Rotate_HandleTransform(data) {
    var rect = getBoundingClientRectZoom(data.object.element);
    rect.height = rect.bottom - rect.top;
    if (
        (rect.top <= DELO$$SCROLL_Rotate_Global.viewport.height + data.bias && rect.top >= 0 - data.bias) ||
        (rect.bottom <= DELO$$SCROLL_Rotate_Global.viewport.height + data.bias && rect.bottom >= 0 - data.bias)
    ) {
        var angle = Math.floor((DELO$$SCROLL_Rotate_Global.viewport.height / 2 - (rect.top + rect.height * data.center.y)) / data.accuracy * data.multiplier) * (data.accuracy);
        var transform = "perspective(" + data.perspective + ") rotate3d(" + data.axes.x + ", " + data.axes.y + ", " + data.axes.z + ", " + angle + "deg)";
        var style = "transform-origin: " + data.center.x * 100 + "% " + data.center.y * 100 + "%; " +
            "transform: " + transform + "; " +
            "transition: transform " + data.timing + " " + data.timing_function + "; ";
        data.object.element.setAttribute("style", style);
    }
}
