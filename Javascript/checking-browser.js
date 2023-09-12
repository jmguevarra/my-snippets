// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isChrome = window.chrome != null && window.navigator.vendor === "Google Inc."

// Edge (based on chromium) detection
var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;


var output = 'Detecting browsers by ducktyping:<hr>';
output += 'isFirefox: ' + isFirefox + '<br>';
output += 'isChrome: ' + isChrome + '<br>';
output += 'isSafari: ' + isSafari + '<br>';
output += 'isOpera: ' + isOpera + '<br>';
output += 'isIE: ' + isIE + '<br>';
output += 'isEdge: ' + isEdge + '<br>';
output += 'isEdgeChromium: ' + isEdgeChromium + '<br>';
output += 'isBlink: ' + isBlink + '<br>';
document.body.innerHTML = output;


/* Device Checking and Browser fixes */
    let platform = window.navigator?.userAgentData?.platform.toLowerCase() || window.navigator.platform.toLowerCase();
    const macosPlatforms = ["macintosh", "macintel", "macppc", "mac68k", "macos", "mac"];

    let isFirefox = typeof InstallTrigger !== 'undefined';
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if(macosPlatforms.indexOf(platform) !== -1 && (isFirefox || isChrome)){
    	document.querySelector("#lp-pom-root").classList.add("sglp-mac-DIN-Font"); 
    }
    /* End Device Checking and Browser fixes */
