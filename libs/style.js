


import {default as fwGeo}   from './geometry'
import {default as fwStyle} from './style'

export default {

    init (dom) {
        dom.data = {
            origin    : {x: 0, y: 0},
            translate : {x: 0, y: 0},
            scale     : {x: 1, y: 1},
            rotate    : {z: 0}
        }
        dom.set = params => {
            for (var p in params) {
                if (dom.data[p]) {
            		if (p == 'rotate')
                        dom.data.rotate.z = params[p]
                    else {
                        if (params[p].x !== 'undefined') dom.data[p].x = params[p].x
                        if (params[p].y !== 'undefined') dom.data[p].y = params[p].y
                    }
                    this.applyTransformation(dom, dom.data, p)
                } else
                    dom.style[p] = params[p]
            }
        }
        dom.get = prop => {
                 if (prop == 'offset') return fwGeo.vpo(dom)
            else if (dom.data[prop])   return dom.data[prop]
            else this.computed(dom, prop)
        }
        return dom
    },
    
    applyTransformation (dom, data, type) {
        if (type == 'origin')
            dom.style[fwStyle.vendor.transformOrigin] =
                data.origin.x +' '+ 
                data.origin.y
        else 
            dom.style[fwStyle.vendor.transform] = 
                'translate('+ 
                    data.translate.x +'px, '+ 
                    data.translate.y +'px) '+
                'rotate('+ 
                    data.rotate.z +'deg) '+
                'scale('+ 
                    data.scale.x +', '+
                    data.scale.y +')'
    },

    computed (dom, prop) {
	    return parseInt(
	    	document.defaultView
	    	.getComputedStyle(dom, null)
	    	.getPropertyValue(prop)
	    )
	},

    vendor : (props => {
        var out = {}
        if (typeof document === "undefined") return out
        var prefix	= [null, 'ms', 'webkit', 'moz', 'o']
        var div     = document.createElement('div')
        props.forEach(prop => {
            for (var i = 0; i < prefix.length; i ++) {
                var p = prefix[i] + prefix[i]? prop.charAt(0).toUpperCase() + prop.slice(1): prop
                if (typeof div.style[p] !== 'undefined'){out[prop] = p; break}
            }
        })
        return out
    })(['transform', 'transformOrigin', 'columnCount']),
}


