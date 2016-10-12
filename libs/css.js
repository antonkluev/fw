


import {default as fwGeo} from './geometry'
import {default as fwVec} from './vector'
import {default as fwCss} from './css'

export default {

    init (dom) {
        dom.data = {
            origin    : new fwVec(),
            translate : new fwVec(),
            scale     : new fwVec(1, 1),
            rotate    : 0
        }
        dom.set = params => {
            for (var p in params) {
                // transformation
                if (typeof dom.data[p] !== 'undefined') {
            		if (p == 'rotate')
                        dom.data.rotate = params[p]
                    else {
                        if (typeof params[p].x !== 'undefined') dom.data[p].x = params[p].x
                        if (typeof params[p].y !== 'undefined') dom.data[p].y = params[p].y
                    }
                    this.applyTransformation(dom, dom.data, p)
                // movement and sizing
                } else if (p =='move') {
                    dom.style.left = params[p].x
                    dom.style.top  = params[p].y
                } else if (p =='size') {
                    dom.style.width  = params[p].x
                    dom.style.height = params[p].y
                // custom parameters
                } else
                    dom.style[p] = params[p]
            }
        }
        dom.get = prop => {
            if (prop == 'offset') 
                return fwGeo.vpo(dom)
            else if (typeof dom.data[prop] !== 'undefined') 
                return dom.data[prop]
            else
                this.computed(dom, prop)
        }
        return dom
    },
    
    applyTransformation (dom, data, type) {
        if (type == 'origin')
            dom.style[fwCss.vendor.transformOrigin] =
                data.origin.x +' '+ 
                data.origin.y
        else 
            dom.style[fwCss.vendor.transform] = 
                'translate('+ 
                    data.translate.x +'px, '+ 
                    data.translate.y +'px) '+
                'rotate('+ 
                    data.rotate +'deg) '+
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

