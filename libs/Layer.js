


import {dom, css, val, geo, vec, animation, event, text} from './fw'

export default class Layer {
    
    constructor (options) {
        this._dom    = null
        this._events = {}
        this.data    = null
        this.props   = {
            transformation : {
                origin    : new vec(0,0,0),
                translate : new vec(0,0,0),
                scale     : new vec(1,1,1),
                rotate    : new vec(0,0,0)
            },
            pop : {}
        }
        // if options incoming
        if (val.isDom(options))
            this.dom = options
        else if (val.isObj(options)) {
            // create dom element
            if ('dom' in options) {
                this.dom = options.dom
                delete options.dom
            // if no dom, create just div with .layer
            } else
                this.dom = dom.create('.default')
            // if no parent parameter
            if (!val.exists(options.parent))
                document.body.appendChild(this.dom)
            // set other values
            this.set(options)
        }
    }
    
    // event handlers
    on (topic, fn, options) {
        
        // check for standard dom events
        if (topic in event.types) {
            var type = event.types[topic]
            this.dom.addEventListener(type, fn, options)
            return {
                on  : () => this.dom.addEventListener(type, fn, options),
                off : () => this.dom.removeEventListener(type, fn, options)
            }
        // listen for dom changes
        } else if (`gesture${text.capitalize(topic)}` in event) {
            return event(this, fn)
        } else {
            if (!this._events[topic]) this._events[topic] = []
            this._events[topic].push(fn)
            return {
                on  : () => this._events[topic].push(fn),
                off : () => this._events.splice(this._events.indexOf(fn), 1)
            }
        }
    }
    
    _emit (topic, payload) {
        if (this._events[topic])
            this._events[topic].forEach(fn => fn(payload))
    }
    
    // setter getters
    set (options) {
        for (var key in options) {
            var value = options[key]
            // use methods
            if (key in this)
                if (val.isFn(this[key])) 
                    this[key](value)
                else
                    this[key] = value
            // set standard css parameters
            else
                this._setStyle(key, value)
        }
        return this
    }
    
    _setStyle (options, value) {
        var set = (key, value) => {
            this._emit(key, value)
            this.dom.style[key] = value
        }
        if (val.isStr(options))
            set(options, value)
        else if (val.isObj(options))
            for (var key in options)
                set(key, options[key])
    }
    
    _getStyle (key) {
        return css.computed(this.dom, key)
    }
    
    set dom (value) {
        var old = this.dom && this.dom.parentNode? this.dom: null
        // if dom
        if (val.isDom(value))
            this._dom = value
        // string a string
        else if (val.isStr(value))
            // template
            if (value.match(/<.*>.*<\/.*>/))
                this._dom = dom.fromString(value)
            // create new element
            else
                this._dom = dom.create(value)
        // link dom with layer
        this._dom.layer = this
        this.addClass('layer')
        // replace old dom
        if (old) old.replaceWith(this.dom) 
    }
    
    get dom () {
        return this._dom
    }
    
    /*
        model.forEach(function (item) {
            var layerA = new fw.Layer({
                margin : 10
            }).bind(item, {
                image : {
                    key  : 'title', 
                    read : 'backgroundImage',
                    set (value, layer) {
                        layer.set({content: 'test ' + value})
                    },
                    get (value, layer) {
                        return value
                    }
                }
            })
        })
    */
    
    bind (model, params) {
        for (var key in params) {
            var options   = params[key]
            var modelKey  = options.key || options
            var initValue = model[modelKey]
            var curValue  = null
            this.on(options.read || key, value => curValue = value)
            var set = value => {
                if (options.set)
                    options.set(value, this)
                else {
                    var param  = {}
                    param[key] = value
                    this.set(param)
                }
            }
            var get = () => {
                if (options.get)
                    return options.get(curValue, this)
                else 
                    return curValue
            }
            Object.defineProperty(model, modelKey, {set, get})
            model[modelKey] = initValue
        }
        return this
    }
    
    destroy () {
        this.dom.parentNode.removeChild(this.dom)
        delete this
    }
    
    pop () {
        this._emit('pop', this.props.pop)
        this.props.pop = {
            parent   : this.dom.parentNode,
            pos      : new vec(this.dom.style.left,  this.dom.style.top),
            size     : new vec(this.dom.style.width, this.dom.style.height),
            offset   : geo.vpo(this.dom)
        }
        this.set({
            position  : 'fixed',
            pos       : new vec(),
            size      : new vec(this.dom.offsetWidth +.5, this.dom.offsetHeight +.5).unit('px'),
            translate : this.props.pop.offset.position.unit('px')
        })
        document.body.appendChild(this.dom)
        return this
    }
    
    push () {
        this._emit('push', this.props.pop)
        this.props.pop.parent.appendChild(this.dom)
        this.set({
            position  : null,
            pos       : this.props.pop.pos,
            size      : this.props.pop.size,
            translate : new vec(),
            scale     : new vec(1, 1, 1),
            origin    : {x: 'center', y: 'center'}
        })
        this.props.pop = null
        return this
    }
    
    animate (options, next, end) {
        this._emit('animate', options)
        animation.flow(this,
            options.time  || .5,
            options.ease  || 'ease-in-out',
            options.delay || 0,
            next, end
        )
        return this
    }
    
    clone (options) {
        var clone = this.dom.cloneNode(true)
		this.dom.parentNode.appendChild(clone)
        return new Layer({
            dom : clone
        }).set(options)
    }
    
    collision (layer) {
        var a = geo.vpo(this.dom)
        var b = geo.vpo(layer.dom)
        return geo.boxCollision(
            geo.vecdim(a.position, a.size), 
            geo.vecdim(b.position, b.size)
        )
    }
    
    // dom structure
    child (query) {
        var children = this.dom.querySelectorAll(query)
        var out = []
        for (var i = 0; i < children.length; i ++)
            out.push(children[i].layer || new Layer(children[i]))
        return out 
    }
    
    set parent (value) {
        this._emit('parent', value);
        (value.dom || value).appendChild(this.dom)
    }
    
    get parent () {
        if (this.dom.parentNode)
            if (this.dom.parentNode.layer instanceof Layer)
                return this.dom.parentNode
            else
                return new Layer(this.dom.parentNode)
    }
    
    append (value) {
        this._emit('append', value)
        var append = el => {this.dom.appendChild(el instanceof Layer? el.dom: el)}
        if (val.isArr(value))
            value.forEach(item => append(item))
        else
            append(item)
    }
    
    prepend (value) {
        this._emit('prepend', value)
        dom.prepend(this.dom, value instanceof Layer? value.dom: value)
    }
    
    detach (value) {
        this._emit('detach', value)
        this.dom.removeChild(value instanceof Layer? value.dom: value)
    }
    
    set content (value) {
        this._emit('content', value)
        this.dom.innerHTML = value
    }
    
    get content () {
        return this.dom.innerHTML
    }
    
    // classes
    toggleClass (value) {
        this._emit('toggleClass', value)
        return this.dom.classList.toggle(value)
    }
    
    hasClass (value) {
        return this.dom.classList.contains(value)
    }
    
    addClass (value) {
        this._emit('addClass', value)
        if (val.isArr(value)) 
            value.forEach(item => this.dom.classList.add(item))
        else this.dom.classList.add(value)
    }
    
    deleteClass (value) {
        this._emit('deleteClass', value)
        if (val.isArr(value)) 
            value.forEach(item => this.dom.classList.remove(item))
        else this.dom.classList.remove(value)
    }
    
    // css
    set move (value) {
        if ('x' in value) this._setStyle('left', value.x)
        if ('y' in value) this._setStyle('top', value.y)
    }
    
    get move () {
        return new vec(this.dom.offsetLeft, this.dom.offsetTop)
    }
    
    set size (value) {
        if ('x' in value) this._setStyle('width', value.x)
        if ('y' in value) this._setStyle('height', value.y)
    }
    
    get size () {
        return new vec(this.dom.offsetWidth, this.dom.offsetHeight)
    }
    
    image (value) {
        this.bg({image: value})
    }
    
    set padding (value) {
        if (val.isObj(value)) {
            if ('x' in value && 'y' in value) {
                this._setStyle('padding', `${value.y} ${value.x}`)
            } else {
                var params = {}
                if ('x' in value) params.padding       = `0 ${value.x}`
                if ('y' in value) params.padding       = `${value.y} 0`
                if ('l' in value) params.paddingLeft   = value.l
                if ('t' in value) params.paddingTop    = value.t
                if ('r' in value) params.paddingRight  = value.r
                if ('b' in value) params.paddingBottom = value.b
                this._setStyle(params)
            }
        } else
            this._setStyle('padding', value)
    }
    
    get padding () {
        return {
            l: css.computed(this.dom, 'padding-left'),
            t: css.computed(this.dom, 'padding-top'),
            r: css.computed(this.dom, 'padding-right'),
            b: css.computed(this.dom, 'padding-bottom')
        }
    }
    
    set margin (value) {
        if (val.isObj(value)) {
            if ('x' in value && 'y' in value) {
                this._setStyle('margin', `${value.y} ${value.x}`)
            } else {
                var params = {}
                if ('x' in value) params.margin       = `0 ${value.x}`
                if ('y' in value) params.margin       = `${value.y} 0`
                if ('l' in value) params.marginLeft   = value.l
                if ('t' in value) params.marginTop    = value.t
                if ('r' in value) params.marginRight  = value.r
                if ('b' in value) params.marginBottom = value.b
                this._setStyle(params)
            }
        } else
            this._setStyle('margin', value)
    }
    
    get margin () {
        return {
            l: css.computed(this.dom, 'margin-left'),
            t: css.computed(this.dom, 'margin-top'),
            r: css.computed(this.dom, 'margin-right'),
            b: css.computed(this.dom, 'margin-bottom')
        }
    }
    
    bg (value) {
        if (val.isStr(value))
            this._setStyle('background', value)
        else if (val.isObj(value))
            var params = {}
            if ('image' in value) 
                params.backgroundImage = 
                    `url(${value.image})`
            if ('origin' in value)
                params.backgroundOrigin = val.isObj(value.origin)?
                    `${value.origin.x} ${value.origin.y}`: value.origin
            if ('position' in value)
                params.backgroundPosition = val.isObj(value.position)?
                    `${value.position.x} ${value.position.y}`: value.position
            if ('size' in value)
                params.backgroundSize = val.isObj(value.size)? 
                    `${value.size.x} ${value.size.y}`: value.size
            if ('repeat' in value)
                params.backgroundRepeat =
                    value.repeat == 'x'? 'repeat-x':
                    value.repeat == 'y'? 'repeat-y':
                    value.repeat == 'no'? 'no-repeat':
                    value.repeat == 'yes'? 'repeat': value.repeat
            if ('color' in value)
                params.backgroundColor = value.color
            this._setStyle(params)
    }
    
    text (value) {
        if (val.isStr(value))
            this._setStyle('font', value)
        else if (val.isObj(value)) {
            var props = {
                style      : 'fontStyle', 
                variant    : 'fontVariant', 
                weight     : 'fontWeight', 
                size       : 'fontSize', 
                height     : 'fontHeight', 
                family     : 'fontFamily',
                color      : 'color',
                align      : 'textAlign', 
                lineHeight : 'lineHeight',
                shadow     : 'textShadow'
            }
            for (var key in props) 
                if (key in value) this._setStyle(props[key], value[key])
        }
    }
    
    border (value) {
        if (val.isStr(value))
            this._setStyle('border', value)
        else if (val.isObj(value)) {
            var set = (value, side) => {
                var props = {
                    color  : 'Color',
                    radius : 'Radius',
                    width  : 'Width',
                    style  : 'Style'
                }
                for (var key in props)
                    if (key in value)
                        this._setStyle(`border${side}${props[key]}`, value[key])
            }
            set(value, '')
            var props = {
                l : 'Left', 
                t : 'Top', 
                r : 'Right', 
                b : 'Bottom', 
                tl: 'TopLeft', 
                tr: 'TopRight',
                bl: 'BottomLeft',
                br: 'BottomRight'
            }
            for (var key in props)
                if (key in value) 
                    set(value[key], props[key])
        }
    }
    
    // transformation
    set origin (value) {
        this._emit('origin', value);
        ['x', 'y', 'z'].forEach(axis => {
            if (axis in value) 
                this.props.transformation.origin[axis] = value[axis]
        })
        css.applyTransformation(this.dom, this.props.transformation, 'origin')
    }
    
    get origin () {
        return this.props.transformation.origin
    }
    
    set translate (value) {
        this._emit('translate', value);
        ['x', 'y', 'z'].forEach(axis => {
            if (axis in value) 
                this.props.transformation.translate[axis] = value[axis]
        })
        css.applyTransformation(this.dom, this.props.transformation)
    }
    
    get translate () {
        return this.props.transformation.translate
    }
    
    set scale (value) {
        this._emit('scale', value);
        if (val.isNum(value)) {
            this.props.transformation.scale.x =
            this.props.transformation.scale.y =
            this.props.transformation.scale.z = value
        } else
            ['x', 'y', 'z'].forEach(axis => {
                if (axis in value) 
                    this.props.transformation.scale[axis] = value[axis]
            })
        css.applyTransformation(this.dom, this.props.transformation)
    }
    
    get scale () {
        return this.props.transformation.scale
    }
    
    set rotate (value) {
        this._emit('rotate', value)
        if (val.isNum(value))
            this.props.transformation.rotate.z = value
        else
            ['x', 'y', 'z'].forEach(axis => {
                if (axis in value) 
                    this.props.transformation.rotate[axis] = value[axis]
            })
        css.applyTransformation(this.dom, this.transformation.props)
    }
    
    get rotate () {
        return this.props.transformation.rotate
    }
    
    // center
    set center (value) {
        this.move = value.sub(this.size.scale(.5))
    }
    
    get center () {
        return geo.center(geo.vpo(this.dom)) 
    }
    
    // offset
    get rect () {
        return geo.vpo(this.dom)
    }
    
}

