


import {val} from './fw'

export default class Vec {

    constructor (x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    copy () {
        return new Vec(this.x, this.y)
    }

    add (vec, set) {
	    if (set) {
	        this.x += (vec.x || 0)
	        this.y += (vec.y || 0)
	        this.z += (vec.z || 0)
	        return this
        } else return new Vec(
            this.x + (vec.x || 0),
            this.y + (vec.y || 0),
            this.z + (vec.z || 0)
        )
    }

    sub (vec, set) {
		if (set) {   
	        this.x -= (vec.x || 0)
	        this.y -= (vec.y || 0)
	        this.z -= (vec.z || 0)
	        return this
		} else return new Vec(
            this.x - (vec.x || 0),
            this.y - (vec.y || 0),
            this.z - (vec.z || 0)
        )
    }
    
    div (vec, apply) {
	    if (apply) {
	        this.x /= (vec.x || 1)
	        this.y /= (vec.y || 1)
	        this.z /= (vec.z || 1)
	        return this
        } else return new Vec(
            this.x / (vec.x || 1),
            this.y / (vec.y || 1),
            this.z / (vec.z || 1)
        )
    }

    len () {
        return Math.sqrt(
            Math.pow(this.x || 0, 2) +
            Math.pow(this.y || 0, 2) +
            Math.pow(this.z || 0, 2)
        )
    }

    scale (len, set) {
	    if (set) {	
			this.x *= len
			this.y *= len
			this.z *= len
			return this
		} else return new Vec(
            this.x * len,
            this.y * len,
            this.z * len
        )
    }

    norm (set) {
	    if (set) {
		    var len = 1 / this.len()
	        this.x *= len
	        this.y *= len
	        this.z *= len
	        return this
	    } else {
		    var len = 1 / this.len()
	        return new Vec(
	            this.x * len,
	            this.y * len,
	            this.z * len
	        )
        }
    }
 
    resize (len) {
        var norm = this.getNorm()
        return new Vec(
            norm.x * len,
            norm.y * len,
            norm.z * len
        )
    }

    to (vec, i) {
    	return new Vec(
	    	i * ((vec.x || 0) - this.x) + this.x,
	    	i * ((vec.y || 0) - this.y) + this.y,
	    	i * ((vec.z || 0) - this.z) + this.z
    	)
    }
    
    rotate (angle, set) {
        var rad = Math.PI / 180 * angle
        var cos = Math.cos(rad)
        var sin = Math.sin(rad)
        var x   = (cos * this.x) + (sin * this.y)
        var y   = (cos * this.y) - (sin * this.x)
	    if (set) {
	        this.x = x
	        this.y = y
	        return this
	    } else {
	        return new Vec(x, y)
        }
    }

    angle2d () {
	    return Math.atan2(this.x, this.y) * 180 / Math.PI
    }

    unit (unit) {
        var data = {}
        if (val.exists(this.x)) data.x = this.x + unit
        if (val.exists(this.y)) data.y = this.y + unit
        if (val.exists(this.z)) data.z = this.z + unit
    	return data
    }
    
    ununit() {
        if (val.exists(this.x)) this.x = parseFloat(this.x)
        if (val.exists(this.y)) this.y = parseFloat(this.y)
        if (val.exists(this.z)) this.z = parseFloat(this.z)
    	return this
    }
    
    reset () {
        if (val.exists(this.x)) this.x = 0
        if (val.exists(this.y)) this.y = 0
        if (val.exists(this.z)) this.z = 0
    	return this
    }

    log (name) {
        var data = {x: this.x}
        if (val.exists(this.y)) data.y = this.y
        if (val.exists(this.z)) data.z = this.z
        if (typeof name === 'undefined') 
            console.log(data)
        else
            console.log(name, data)
    }
    
    set (params) {
        for (var i in params)
            this[i](params[i])
    }
    
    apply (fn) {
        return new Vec(
            fn({dimension: 'x', value: this.x}),
            fn({dimension: 'y', value: this.y}),
            fn({dimension: 'z', value: this.z})
        )
    }
    
    fill (value) {
        this.x = value
        this.y = value
        this.z = value
        return this
    }
    
    mix (array) {
        var sum = new Vec()
        for (var i = 0; i < array.length; i ++) sum.add(array[i], true)
        return sum.div(new Vec().fill(array.length))
    }
}


