!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.fw=e():t.fw=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,e,n){Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=10)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(4),o=r(i),a=n(1),u=r(a),f=n(0),l=r(f),s=n(2),c=r(s);e["default"]={init:function(t){var e=this;return c["default"].flow(t),t.pop=function(){t.data.pop={parent:t.parentNode,move:new u["default"](t.style.left,t.style.top),size:new u["default"](t.style.width,t.style.height),offset:o["default"].vpo(t)};var e=new u["default"](t.offsetWidth,t.offsetHeight);t.set({position:"fixed",move:new u["default"],size:e.unit("px"),translate:t.data.pop.offset.position}),document.body.appendChild(t)},t.push=function(){t.data.pop.parent.appendChild(t),t.set({position:null,move:t.data.pop.move,size:t.data.pop.size,translate:new u["default"],scale:new u["default"](1,1),origin:{x:"center",y:"center"}}),delete t.data.pop},t.data={origin:new u["default"],translate:new u["default"],scale:new u["default"](1,1),rotate:0},t.set=function(n){for(var r in n)"undefined"!=typeof t.data[r]?("rotate"==r?t.data.rotate=n[r]:("undefined"!=typeof n[r].x&&(t.data[r].x=n[r].x),"undefined"!=typeof n[r].y&&(t.data[r].y=n[r].y)),e.applyTransformation(t,t.data,r)):"move"==r?(t.style.left=n[r].x,t.style.top=n[r].y):"size"==r?(t.style.width=n[r].x,t.style.height=n[r].y):t.style[r]=n[r];return t},t.get=function(n){return"offset"==n?o["default"].vpo(t):"undefined"!=typeof t.data[n]?t.data[n]:void e.computed(t,n)},t},applyTransformation:function(t,e,n){"origin"==n?t.style[l["default"].vendor.transformOrigin]=e.origin.x+" "+e.origin.y:t.style[l["default"].vendor.transform]="translate("+e.translate.x+"px, "+e.translate.y+"px) rotate("+e.rotate+"deg) scale("+e.scale.x+", "+e.scale.y+")"},computed:function(t,e){return parseInt(document.defaultView.getComputedStyle(t,null).getPropertyValue(e))},vendor:function(t){var e={};if("undefined"==typeof document)return e;var n=[null,"ms","webkit","moz","o"],r=document.createElement("div");return t.forEach(function(t){for(var i=0;i<n.length;i++){var o=n[i]+n[i]?t.charAt(0).toUpperCase()+t.slice(1):t;if("undefined"!=typeof r.style[o]){e[t]=o;break}}}),e}(["transform","transformOrigin","columnCount","transition"])}},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1];n(this,t),this.x=e,this.y=r}return r(t,[{key:"copy",value:function(){return new t(this.x,this.y)}},{key:"add",value:function(e,n){return n?(this.x+=e.x||0,this.y+=e.y||0,this):new t(this.x+(e.x||0),this.y+(e.y||0))}},{key:"sub",value:function(e,n){return n?(this.x-=e.x||0,this.y-=e.y||0,this):new t(this.x-(e.x||0),this.y-(e.y||0))}},{key:"div",value:function(e,n){return n?(this.x/=e.x||1,this.y/=e.y||1,this):new t(this.x/(e.x||1),this.y/(e.y||1))}},{key:"len",value:function(){return Math.sqrt(Math.pow(this.x||0,2)+Math.pow(this.y||0,2))}},{key:"scale",value:function(e,n){return n?(this.x*=e,this.y*=e,this):new t(this.x*e,this.y*e)}},{key:"norm",value:function(e){if(e){var n=1/this.len();return this.x*=n,this.y*=n,this}var n=1/this.len();return new t(this.x*n,this.y*n)}},{key:"resize",value:function(e){var n=this.getNorm();return new t(n.x*e,n.y*e)}},{key:"to",value:function(e,n){return new t(n*((e.x||0)-this.x)+this.x,n*((e.y||0)-this.y)+this.y)}},{key:"getAngle2D",value:function(){return 180*Math.atan2(this.x,this.y)/Math.PI}},{key:"unit",value:function(t){return{x:this.x+t,y:this.y+t}}},{key:"log",value:function(t){var e={x:this.x,y:this.y};"undefined"==typeof t?console.log(e):console.log(t,e)}},{key:"set",value:function(t){for(var e in t)this[e](t[e])}},{key:"apply",value:function(e){return new t(e(this.x),e(this.y))}}]),t}();e["default"]=i},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),a=r(o);e["default"]={easing:{linear:function(t){return t},easeOutExpo:function(t){return 1-Math.pow(2,-10*t)},easeInQuad:function(t){return Math.sin(t*(Math.PI/2))},easeOutQuad:function(t){return t*(2-t)},easeInOutQuint:function(t){return t<.5?16*Math.pow(t,5):16*--t*Math.pow(t,4)+1},easeOutElastic:function(t){var e=.8;return Math.pow(2,-10*t)*Math.sin((t-e/4)*(2*Math.PI)/e)+1},easeOutBounce:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*t*(t-=1.5/2.75)+.75:t<2.5/2.75?7.5625*t*(t-=2.25/2.75)+.9375:7.5625*t*(t-=2.625/2.75)+.984375}},jobs:[],active:!1,Job:function u(t,e,n,r){i(this,u),this.end=r||function(){};var o=new Date;n(0),this.run=function(){var r=(new Date-o)/1e3/t;return n(r<1?e(r):1),r<1?r:1}},loop:function(){var t=[];this.jobs.forEach(function(e){1==e.run()?e.end():t.push(e)}),this.jobs=t,this.jobs.length>0?window.requestAnimationFrame(this.loop.bind(this)):this.active=null},play:function(t,e,n,r){this.jobs.push(new this.Job(t,this.easing[e],n,r)),this.active||(this.active=!0,window.requestAnimationFrame(this.loop.bind(this)))},getSinus:function(t,e,n){var r=.001*(new Date).getTime(),i=Math.sin(r*(n||1));return this.root.math.map(i,-1,1,t,e)},flow:function(t){return t.flow=function(e,n,r,i){var o=function u(){t.removeEventListener("transitionend",u),t.style[a["default"].vendor.transition]=null,i&&("function"==typeof i?i():t.set&&t.set(i),i=null)};setTimeout(function(){t.addEventListener("transitionend",o),t.style[a["default"].vendor.transition]=e+"s "+n,"function"==typeof r?r():t.set(r)},0)},t}}},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();e["default"]={splitQuery:function(t){var e=t.split(".");return{level:e,last:e.length-1}},level:function(t,e,n){for(var r=t,i=0;i<e.last;i++)r=r[e.level[i]];return n?void(r[e.level[e.last]]=n):r[e.level[e.last]]},map:function(t,e){var n=this,r=this.splitQuery(e);return t.map(function(t){return n.level(t,r)}.bind(this))},find:function(t,e){var n=t.slice();for(var r in e){for(var i=[],o=this.map(n,r),a=0;a<o.length;a++)o[a]==e[r]&&i.push(n[a]);n=i.slice()}return n},del:function(t,e){var n=this.find(t,e);return n.forEach(function(e){return t.splice(t.indexOf(e),1)}),n},updateColumn:function(t,e){var n=this;for(var r in e)if(t.length==e[r].length){var i=this.splitQuery(r);t.forEach(function(t,o){return n.level(t,i,e[r][o])}.bind(this))}else console.log("different lenghtes")},filterMap:function(t,e){var n=[];return t.forEach(function(t){var r={};for(var i in e)r[e[i]]=t[i];n.push(r)}),n},buffer:function(){function t(e){n(this,t),this.array=new Array,this.size=e}return r(t,[{key:"get",value:function(t){var e=0,n=this.array.length;n>this.size&&this.array.shift(),this.array.push(t);for(var r=0;r<n;r++)isFinite(this.array[r])&&(e+=parseFloat(this.array[r]));return e/n}}]),t}()}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),o=r(i),a=n(1),u=r(a);e["default"]={vpo:function(t){var e=t.getBoundingClientRect();return{position:new u["default"](e.left,e.top),opposite:new u["default"](e.right,e.bottom),size:new u["default"](e.width,e.height)}},vp:function(){return new u["default"](document.documentElement.clientWidth,document.documentElement.clientHeight)},viewPortOffset:function(t){var e=t.getBoundingClientRect();return new u["default"](e.left,e.top)},offset:function f(t,e){for(var n=t,f=new u["default"],e=e||document.body;n&&n.parentNode&&n!=e;){var r=new u["default"](n.offsetLeft,n.offsetTop),i=new u["default"](n.parentNode.scrollLeft,n.parentNode.scrollTop),a=new u["default"](o["default"].computed(n,"margin-left"),o["default"].computed(n,"margin-top")),l=new u["default"](o["default"].computed(n,"padding-left"),o["default"].computed(n,"padding-top"));f=f.add(r).sub(i).sub(a).sub(l),n=n.parentNode}return f},dimToVec:function(t){return{position:new u["default"](t.l,t.t),size:new u["default"](t.w,t.h)}},vecToDim:function(t,e){var n=this;return{l:t.x,w:e.x,r:function(){n.l+n.w}(),t:t.y,h:e.y,b:function(){n.t+n.h}()}},dim:function(t){var e=this;return{l:t.offsetLeft,w:t.offsetWidth,r:function(){e.l+e.w}(),t:t.offsetTop,h:t.offsetHeight,b:function(){e.t+e.h}()}},domCollision:function(t,e){return this.boxCollision(this.getDimensions(t),this.getDimensions(e))},boxCollision:function(t,e){return t.l<e.l+e.w&&t.t<e.t+e.h&&e.l<t.l+t.w&&e.t<t.t+t.h},hitTest:function(t,e){return t.l<e.x&&e.x<t.l+t.w&&t.t<e.y&&e.y<t.t+t.h},viewPortSize:function(t,e,n,r,i,o){var a=new Object,u=t/e,f=r-2*i,l=n/u,s=f*u<o?o/u:f;if(n<t&&l<s)a.w=n,a.h=l,a.m=0;else{var c=s*u,d=c<t?c:t,h=(n-d)/2;a.w=d,a.h=s<e?s:e,a.m=h<i?h:i}return a}}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]={to:function(t,e,n){return this.map(t,0,1,e,n,!0)},map:function(t,e,n,r,i,o){var a=1==o?t<e?e:t>n?n:t:t;return(a-e)/(n-e)*(i-r)+r},binarySearch:function(t,e){for(var n=Math.floor(.5*t),r=n;r>1;)r=Math.round(.5*r),n+=(e(n)?1:-1)*r;return e(n,!0),n},linearInterpolation:function(t,e){for(var n=[],r=0,i=0;i<e.length-1&&t>=e[i][0];i++)r=i;for(var o=e[r],a=e[r+1],i=1;i<o.length;i++)n.push(this.map(t,o[0],a[0],o[i],a[i]));return n},getValueBySize:function(t,e){for(var n,r=0;r<e.length;r++)t>=e[r][0]&&(n=e[r][1]);return n},rubberEffect:function(t,e,n,r,i){var o=1.3,a="undefined"!=typeof n,u="undefined"!=typeof e;if(a||u)var f=t<n,r=(f?1:-1)*r,l=f?n:e,s=(l-t)/r,c=l-r*(1-Math.pow(1+s,-o));var d=a&&t<n,h=u&&t>e;return i&&i(d?"max":h?"min":null),d||h?c:t}}},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();e["default"]={hsva:function(){function t(e,r,i,o){n(this,t),this.hue=e,this.saturation=r,this.value=i,this.alpha=o}return r(t,[{key:"get",value:function(){var t=100-50*this.saturation;return"hsla("+360*this.hue+", "+100*this.saturation+"%, "+t*this.value+"%, "+this.alpha+")"}}]),t}(),rand:function(t){var e=function(){return parseInt(200*Math.random()+55)};return"rgba("+e()+", "+e()+", "+e()+", "+(t?t:.3)+")"}}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),o=r(i);e["default"]={child:function(t){var e=this,n=arguments.length<=1||void 0===arguments[1]?document:arguments[1],r="#"==t[0]?n.getElementById(t.slice(1)):"."==t[0]?n.getElementsByClassName(t.slice(1)):n.getElementsByTagName(t);return r.child=function(t){return e.child(t,r)},r},fromString:function(t){var e=document.createElement("div");return e.innerHTML=t,o["default"].init(e.firstChild)},prepend:function(t,e){t.firstChild?t.insertBefore(e,t.firstChild):t.appendChild(e)},selection:function(t){document.ondragstart=document.onselectstart=t?null:function(){return!1}},clone:function a(t){var e=this,a=t.cloneNode(!0);return a.remove=function(){return e.parentNode.removeChild(e)},t.parentNode.appendChild(a),a},div:function u(t,e){var u=document.createElement("div");return t.split(", ").forEach(function(t){u.classList.add(t)}),e&&(u.innerHTML=e),u}}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]={arg:function(t){return"undefined"!=typeof t},cloneObject:function(t){return JSON.parse(JSON.stringify(t))},readFile:function(t,e){var n=this;if(/\.(jpe?g|png|gif)$/i.test(t.name)){var r=new FileReader;r.onload=function(){e({name:t.name,data:n.result})},r.readAsDataURL(t)}},dropFile:function(t,e){var n=this;t.ondragover=function(){return t.classList.add("drop"),!1},t.ondragleave=function(){t.classList.remove("drop")},t.ondrop=function(){t.classList.remove("drop");for(var r=window.event,i=r.dataTransfer.files,o=[],a=0;a<i.length;a++)n.readFile(i[a],function(t){o.push(t),o.length==i.length&&e(o)});r.preventDefault()}.bind(this)},uploadFile:function(t,e){var n=this;t.onchange=function(){for(var t=window.event,r=t.target.files,i=[],o=0;o<r.length;o++)n.readFile(r[o],function(t){i.push(t),i.length==r.length&&e(i)})}.bind(this)},compressImage:function(t,e,n,r){var i=this,o=[];t.forEach(function(a){var u=document.createElement("img");u.onload=function(){var a=document.createElement("canvas"),u=a.getContext("2d"),f=i.width*e,l=i.height*e;a.width=f,a.height=l,u.drawImage(i,0,0,f,l),o.push(a.toDataURL("image/jpeg",n)),o.length==t.length&&r(o)},u.src=a})},cookie:{get:function(t){var e={};if(t){var n=t.split("; ");n.forEach(function(t){var n=t.split("=");e[n[0]]=n[1]})}return e},set:function(t){var e="";for(var n in t)e+=n+"="+t[n]+"; ";return e},del:function(t,e){t[e]="; expires=Thu, 01 Jan 1970 00:00:01 GMT"}},search:{get:function(t){var e={},n=t.split("?")[1];if(n&&n.length>0){var r=n.split("&");r.forEach(function(t){var n=t.split("=");e[n[0]]=n[1]})}return e},set:function(t){var e="";for(var n in t)e+=n+"="+t[n]+(Object.keys(t).length>1?"&":"");return e}},timeout:function(t,e,n,r,i){var o=t/e,a=setInterval(function(){n(function(t){t&&(r(),clearInterval(a))}),0==o&&(i&&i(),clearInterval(a)),o--},1e3*e)}}},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=(n(3),n(10)),a={};e["default"]={on:function(t,e,n){a[t]||(a[t]=[]),a[t].push(e)},emit:function(t,e){o.debug&&console.log("[event] fired:",t),a[t]&&a[t].forEach(function(t){return t(e)})},watcher:function(){function t(e,n,i,o){r(this,t),this.object=e,this.ev=n,this.callback=i,this.flag=o}return i(t,[{key:"on",value:function(t){this.object.addEventListener(this.ev,this.callback,this.flag),t&&this.callback()}},{key:"off",value:function(){this.object.removeEventListener(this.ev,this.callback,this.flag)}},{key:"destroy",value:function(){this.off(),delete this}}]),t}(),type:function(){if("undefined"!=typeof window){var t="ontouchstart"in window;return{touch:t,down:t?"ontouchstart":"onmousedown",move:t?"ontouchmove":"onmousemove",up:t?"ontouchend":"onmouseup",out:"onmouseleave"}}}(),resize:function(){function t(e,n,i){r(this,t),this.timeout=null,this.onDragStartFlag=null,this.onDragStart=e,this.onDragUpdate=n,this.onDragRelease=i}return i(t,[{key:"call",value:function(){this.checkStart(),this.onDragUpdate&&this.onDragUpdate(),clearTimeout(this.timeout),this.timeout=setTimeout(this.onEnd.bind(this),200)}},{key:"checkStart",value:function(){this.onDragStartFlag||(this.onDragStartFlag=!0,this.onDragStart&&this.onDragStart())}},{key:"onEnd",value:function(){this.onDragStartFlag&&(this.onDragStartFlag=!1,this.onDragRelease&&this.onDragRelease())}}]),t}()}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(2);Object.defineProperty(e,"animation",{enumerable:!0,get:function(){return r(i)["default"]}});var o=n(4);Object.defineProperty(e,"geo",{enumerable:!0,get:function(){return r(o)["default"]}});var a=n(3);Object.defineProperty(e,"arr",{enumerable:!0,get:function(){return r(a)["default"]}});var u=n(1);Object.defineProperty(e,"vec",{enumerable:!0,get:function(){return r(u)["default"]}});var f=n(5);Object.defineProperty(e,"math",{enumerable:!0,get:function(){return r(f)["default"]}});var l=n(6);Object.defineProperty(e,"color",{enumerable:!0,get:function(){return r(l)["default"]}});var s=n(7);Object.defineProperty(e,"dom",{enumerable:!0,get:function(){return r(s)["default"]}});var c=n(9);Object.defineProperty(e,"eva",{enumerable:!0,get:function(){return r(c)["default"]}});var d=n(8);Object.defineProperty(e,"etc",{enumerable:!0,get:function(){return r(d)["default"]}});var h=n(0);Object.defineProperty(e,"css",{enumerable:!0,get:function(){return r(h)["default"]}});var p=n(11);Object.defineProperty(e,"text",{enumerable:!0,get:function(){return r(p)["default"]}});e.debug={enable:!1}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),a=r(o),u=n(5),f=r(u);e["default"]={ellipsis:function(t,e,n){t.style.height=this.getLineHeight(t)*e+"px";var r=t.getBoundingClientRect(),i=a["default"].computed(t,"column-count")>1;if(i&&t.scrollWidth>r.width+1||t.scrollHeight>r.height+1){var o=t.firstChild,u=t.innerHTML.length,l=document.createRange();l.setEnd(o,u),f["default"].binarySearch(u,function(t,e){l.setStart(o,e?t-3:t);var n=l.getBoundingClientRect();return i?n.left<r.right:n.top<r.bottom-1}),l.deleteContents(),t.innerHTML+=n||"&hellip;"}t.style.height=null},lineCount:function(t){return Math.floor(t.offsetHeight/this.getLineHeight(t))},getLineHeight:function(t){var e=t.firstChild,n=document.createRange();return n.setStart(e,0),n.setEnd(e,1),n.getBoundingClientRect().height},capitalize:function(t){return t.charAt(0).toUpperCase()+t.slice(1)},hash:function l(t){var l=0;for(i=0;i<t.length;i++)l+=t.charCodeAt(i);return l},numberPadding:function(t,e,n){for(var t=t+"";t.length<n;)t=e+t;return t}}}])});