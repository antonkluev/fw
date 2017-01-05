


import {css, val} from './fw'

export default {
    
    // create ('div#id .class .class')
    create (query = '') {
        var classes  = query.replace(/ /g, '').split('.')
        var tagAndId = []
        if (classes[0].length == 0) tagAndId = classes[0].split('#')
        classes.shift()
        var element = document.createElement(tagAndId[0] || 'div')
        if (tagAndId.length > 1) element.id = tagAndId[1]
        classes.forEach(style => element.classList.add(style))
        return element
    },
    
    template (model, tmp, callback) {
        var init   = true
        var active = true
        var render = function () {
            var result = tmp.replace(/{([A-z 0-9]+)}/g, ($1, $2) => {
                if (init) {
                    var val = model[$2]
                    Object.defineProperty(model, $2, {
                        set (value) {
                            val = value
                            if (active) render()
                        },
                        get : () => val
                    })
                }
                return model[$2]
            })
            callback(result)
            init = false
        }
        render()
        return {
            on () {
                active = true
                return this
            },
            off () {
                active = false
                return this
            },
            get active () {return active}
        }
    },
    
    fromString (html) {
		var parent = document.createElement('div')
	    parent.innerHTML = html
	    return parent.firstChild
	},
    
	prepend (parent, child) {
    	if (parent.firstChild) 
    		parent.insertBefore(child, parent.firstChild) 
    	else 
    		parent.appendChild(child)
	},
    
	clone (dom) {
		var clone = dom.cloneNode(true);
		clone.remove = () => this.parentNode.removeChild(this)
		dom.parentNode.appendChild(clone)
		return clone
	},
    
	selection (mode) {
		document.ondragstart   =
		document.onselectstart = mode ? null : () => false
	},
}


