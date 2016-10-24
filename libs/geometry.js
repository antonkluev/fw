


import {default as fwCss} from './css'
import {default as fwVec} 	from './vector'

export default {
	
	// viewport offset
	vpo (dom) {
		var rect = dom.getBoundingClientRect()
    	return {
			position : new fwVec(rect.left,  rect.top),
			opposite : new fwVec(rect.right, rect.bottom),
			size     : new fwVec(rect.width, rect.height)
		}
	},

	vp () {
		return new fwVec(
			document.documentElement.clientWidth,
			document.documentElement.clientHeight
		)
	},

	viewPortOffset (dom) {
		var params = dom.getBoundingClientRect()
    	return new fwVec(params.left, params.top)
	},
	
	offset (_dom, parent) {
		var dom    = _dom
		var offset = new fwVec()
        var parent = parent || document.body
		while (dom && dom.parentNode && dom != parent) {
            var position = new fwVec(dom.offsetLeft, dom.offsetTop)
			var scroll   = new fwVec(dom.parentNode.scrollLeft, dom.parentNode.scrollTop)
            var margin   = new fwVec(fwCss.computed(dom, 'margin-left'), fwCss.computed(dom, 'margin-top'))
            var padding  = new fwVec(fwCss.computed(dom, 'padding-left'), fwCss.computed(dom, 'padding-top'))
			offset       = offset.add(position).sub(scroll).sub(margin).sub(padding)
			dom          = dom.parentNode
		}
		return offset
	},

	dimvec (dims) {
		return {
			position : new fwVec(dims.l, dims.t),
			size     : new fwVec(dims.w, dims.h)
		}
	},

	vecdim (position, size) {
		return {
			l: position.x, w: size.x, r: (() => {return this.l + this.w})(),
			t: position.y, h: size.y, b: (() => {return this.t + this.h})()
		}
	},

	dim (dom) {
		return {
			l: dom.offsetLeft, w: dom.offsetWidth,  r: (() => {return this.l + this.w})(),
			t: dom.offsetTop,  h: dom.offsetHeight, b: (() => {return this.t + this.h})()
		}
	},
    
	domCollision (a, b) {
		return this.boxCollision(
			this.getDimensions(a),
			this.getDimensions(b)
		)
	},

	boxCollision (a, b) {
		return (
			a.l < b.l + b.w && a.t < b.t + b.h
		&&  b.l < a.l + a.w && b.t < a.t + a.h
		)
	},
	
	hitTest (a, pointer) {
		return (
			a.l < pointer.x && pointer.x < a.l + a.w
		&&  a.t < pointer.y && pointer.y < a.t + a.h
		)
	},

    viewPortSize (w, h, winW, winH, margin, minWidthVal) {
		var output	 	= new Object()
		var aspect		= w / h
		var winHeight 	= winH - 2 * margin
		var calcHeight 	= winW / aspect
		var maxHeight  	= 
			winHeight 	* aspect < minWidthVal?
			minWidthVal / aspect:
			winHeight
		if (winW < w && calcHeight < maxHeight ) {
			output.w 	= winW
			output.h 	= calcHeight
			output.m 	= 0
		} else {
			var origCalcWidth 	= maxHeight * aspect
			var normCalcWidth 	= origCalcWidth < w? origCalcWidth: w
			var calcSide  		= (winW - normCalcWidth) / 2
			output.w 	= normCalcWidth
			output.h 	= maxHeight < h? maxHeight: h
			output.m 	= calcSide  < margin? calcSide: margin
		}
		return output
	},
}


