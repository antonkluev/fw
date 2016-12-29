


import {
    animation, vec, event, math, 
    Screen, matrix, Layer, val,
    geo
} from './fw'

export default {
    
    wheel (layer, transport = {}) {
        return layer.on('mousewheel', e => {
            var vector = 0
            var w = e.wheelDelta
            var d = e.detail
            if (d) {
                // Opera
                if (w) vector = w / d / 40 * d > 0? 1: -1
                // Firefox
                else vector = -d / 3
            // IE / Safari / Chrome
            } else vector = w / 120
            transport({e, vector})
        })
    },
    
    resize (layer, transport = {}) {
        var border = 20
        var side = {x: null, y: null}
        var cursorHover = event.listener(layer.dom, 'mousemove', e => {
            var rect    = layer.rect
            var pointer = new vec(e.clientX, e.clientY)
            side = geo.getSide(pointer.sub(rect.position), rect.size, border)
            layer.dom.style.cursor = geo.getCursor(side)
        })
        var drag = this._dragMouse(layer, {
            down (t) {
                cursorHover.off()
            },
            move (t) {

            },
            up (t) {
                
            },
            cancel (t) {
                cursorHover.on()
            }
        })
        return {
            get active () {
                return cursorHover.status
            },
            on () {
                drag.on()
                cursorHover.on()
                return this
            },
            off () {
                drag.off()
                cursorHover.off()
                return this
            },
            cancel () {
                
            },
        }
    },
    
    drag (layer, transport = {}) {
        if (!transport.move) transport.move = t => {
            animation.draw(`${layer.identifier}: translate.move`, () => {
                layer.matrix = new matrix().translate(t.translate)
            })
        }
        if (!transport.cancel) transport.cancel = t => {
            animation.draw(`${layer.identifier}: translate.cancel`, () => {
                layer.animate({
                    time : .3, 
                    ease : 'cubic-bezier(.1, .5, .1, 1.5)'
                },{
                    matrix : new matrix()
                })
            })
        }
        return this[event.types.isTouch? '_initMultitouchGesture': '_dragMouse']
            (layer, transport, 'translate')
    },
    
    pinchToRotate (layer, transport = {}) {
        if (!transport.move) transport.move = t => {
            animation.draw(`${layer.identifier}: rotate.move`, () => {
                layer.rotate = t.rotate
            })
        }
        if (!transport.cancel) transport.cancel = t => {
            animation.draw(`${layer.identifier}: rotate.cancel`, () => {
                layer.animate({
                    time : .3, 
                    ease : 'cubic-bezier(.1, .5, .1, 1.5)'
                },{
                    rotate : 0
                })
            })
        }
        return this._initMultitouchGesture(layer, transport, 'rotate')
    },
    
    pinchToZoom (layer, transport = {}) {
        if (!transport.move) transport.move = t => {
            animation.draw(`${layer.identifier}: scale.move`, () => {
                layer.scale = t.scale
            })
        }
        if (!transport.cancel) transport.cancel = t => {
            animation.draw(`${layer.identifier}: scale.cancel`, () => {
                layer.animate({
                    time : .3, 
                    ease : 'cubic-bezier(.1, .5, .1, 1.5)'
                },{
                    scale : 1
                })
            })
        }
        return this._initMultitouchGesture(layer, transport, 'scale')
    },
    
    /*
        this is the second layer of interaction
        for mouse are separate functions for dragging
        for touch is one single that splits translation, rotation and scale
    */
    
    _dragMouse (layer, transport) {
        var down     = new vec()
        var velocity = new vec()
        var out = Object.assign({}, transport)
        out.down = t => {
            velocity
            down = velocity = t.pointer
            transport.down && transport.down({
                event : t.event, 
                down
            })
        }
        out.move = t => {
            var translate = t.pointer.sub(down)
            transport.move && transport.move({
                event     : t.event, 
                translate,
                velocity  : translate.sub(velocity)
            })
            velocity = translate
        }
        out.cancel = t => {
            transport.cancel(t)
            down.reset()
            velocity.reset()
        }
        return this._dragMouseEventPattern(layer, out)
    },
    
    /*
        layer     : a regular layer object
        transport : the transport of the type
        type      : 'translate' | 'rotate' | 'scale'
    */
    
    _initMultitouchGesture (layer, transport, type) {
        var address = 'transformationTouchEventLink'
        if (!layer._props[address]) {
            var listener   = new event.Machine('transformationTouchEventLink')
            var transport_ = {}
            ;['init', 'down', 'move', 'up', 'cancel'].forEach(
                key => transport_[key] = t => listener.emit(key, t))
            var toggle = this._multitouch(layer, transport_)
            layer._props[address] = {
                listener,
                transport : transport_,
                cancel    : toggle.cancel,
                checkToggle () {
                    var flag = 'off'
                    var interest = ['translate', 'rotate', 'scale']
                    for (var i = 0; i < interest.length; i ++)
                        if (transport_[interest[i]]) {flag = 'on'; break}
                    toggle[flag]()
                }
            }
        }
        var link = layer._props[address]
        for (var key in transport)
            link.listener.on(key, ((method, key) => t => {
                if (key == 'move') {
                    if (type == 'translate') t.translate = t.transformation.getTranslation()
                    if (type == 'rotate') t.rotate = t.transformation.getRotation().z
                    if (type == 'scale') t.scale = t.transformation.getScale().z
                }
                method[key](t)
            })(transport, key))
        return {
            get active () {
                return link.transport[type]
            },
            on () {
                link.transport[type] = true
                link.checkToggle()
                return this
            },
            off () {
                link.transport[type] = false
                link.checkToggle()
                return this
            },
            cancel : link.cancel,
        }
    },
    
    _multitouch (layer, transport) {
        // some shared values
        var touches      = {}
        var scale_rotate = new matrix()
        var lastState    = new matrix()
        var origin       = new vec()
        var center       = new vec()
        var translation  = new vec()
        // export control interface for gesture events
        return this._dragTouchEventPattern(layer, {
            init (t) {
                // get at start of a session 
                // a center of a layer
                center = layer.center
            },
            down (t) {
                // fire interface function
                transport.down && transport.down(t)
                // calculate average vector aka origin and
                // bring this origin on rotated and scaled object back
                origin = vec.prototype.mix(t.pointers)
                    .sub(center)
                    .sub(translation)
            },
            move (t) {
                // calculate drag difference
                var velocity = new vec()
                for (var id in t.pointers) {
                    // if a touch is not initialized, 
                    // save its vector to the list
                    if (!touches[id]) touches[id] = t.pointers[id]
                    // calculate difference between frames
                    velocity
                        .add(t.pointers[id], true)
                        .sub(touches[id], true)
                    // save value for the next time
                    touches[id] = t.pointers[id]
                }
                // calculate average difference between every dragged touch
                velocity.div(new vec().fill(t.event.targetTouches.length), true)
                // apply difference to persistent translation vector
                translation.add(velocity, true)
                // modify scale and rotation matrix
                var drag  = new matrix()
                var pinch = new matrix().translate(origin.scale(-1))
                if (transport.translate) drag.translate(translation, true)
                if (transport.rotate) pinch.rotate(t.event.rotation, true)
                if (transport.scale) pinch.scale(t.event.scale, true)
                scale_rotate = lastState.multiply(pinch.translate(origin))
                // get final transformation
                var transformation = scale_rotate.multiply(drag)
                // export values
                transport.move && transport.move({
                    event : t.event,
                    transformation,
                    velocity
                })
            },
            up (t) {
                // apply matrix for the next drag action
                if (t.event.targetTouches.length > 0) lastState = scale_rotate
                transport.up && transport.up(t)
            },
            cancel (t) {
                // export up event
                transport.cancel && transport.cancel(t)
                center.reset()
                lastState.reset()
                translation.reset()
                touches = {}
            },
        })
    },
    
    /*
        this is the lowest level of mouse and touch interaction principles
        support of four main methods: down, move, up and cancel
    */
    
    _dragMouseEventPattern (layer, transport) {
        var down = event.listener(layer.dom, 'mousedown', e => {
            if (!move.active) {
                move.on()
                up.on()
            }
            transport.down && transport.down({
                event   : e, 
                pointer : new vec(e.clientX, e.clientY)
            })
            e.preventDefault()
        })
        var move = event.listener(document, 'mousemove', e => {
            transport.move && transport.move({
                event   : e,
                pointer : new vec(e.clientX, e.clientY)
            })
            e.preventDefault()
        })
        var up = event.listener(document, 'mouseup', e => {
            var t = {
                event   : e,
                pointer : new vec(e.clientX, e.clientY)
            }
            transport.up && transport.up(t)
            cancel(t)
            e.preventDefault()
        })
        var cancel = (t = {}) => {
            move.off()
            up.off()
            transport.cancel && transport.cancel(t)
        }
        return {
            get active () {
                return down.active
            },
            on () {
                down.on()
                return this
            },
            off () {
                cancel()
                down.off()
                return this
            },
            cancel,
        }
    },
    
    _dragTouchEventPattern (layer, transport) {
        var convertTouches = fingers => {
            var out = {}
            for (var i = 0; i < fingers.length; i ++) 
                out[fingers[i].identifier] = new vec(
                    fingers[i].clientX,
                    fingers[i].clientY
                )
            return out
        }
        var down = event.listener(layer.dom, 'touchstart', e => {
            if (!move.active) {
                move.on()
                up.on()
                transport.init({event: e})
            }
            transport.down && transport.down({
                event    : e,
                pointers : convertTouches(e.targetTouches)
            })
            e.preventDefault()
        })
        var move = event.listener(layer.dom, 'touchmove', e => {
            transport.move && transport.move({
                event    : e,
                pointers : convertTouches(e.targetTouches)
            })
            e.preventDefault()
        })
        var up = event.listener(layer.dom, 'touchend', e => {
            var t = {event: e}
            transport.up && transport.up(t)
            if (e.targetTouches.length == 0) cancel(t)
            e.preventDefault()
        })
        var cancel = (t = {}) => {
            move.off()
            up.off()
            transport.cancel && transport.cancel(t)
        }
        return {
            get active () {
                return down.active
            },
            on () {
                down.on()
                return this
            },
            off () {
                cancel()
                down.off()
                return this
            },
            cancel,
        }
    },
}


