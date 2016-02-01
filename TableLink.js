(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TableLink = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":2}],2:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],3:[function(require,module,exports){
var closest = require('closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector, true);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"closest":1}],4:[function(require,module,exports){
var delegate = require('delegate');
var closest = require('closest');
window.closest = closest;

var beforeFn = function() {
    return true;
};

var afterFn = function() {};

var TableLink = {
    /**
     * Starts the 'table-link' plugin by adding the delegate
     * event on the rows that maches the selector param.
     *
     * @param {String} [selector="[data-href]"] - The selector that find the rows with links
     */
    init: function(selector) {
        selector = selector || '[data-href]';
        return addTableLinks.call(this, selector);
    },
    /**
     * Sets the function to be executed before the  window/link
     * opens. Prevent the opening by returning an false value.
     * If it returns nothing (undefine) the link will be
     * opened normally.
     *
     * @param {Function} callback - The function to execute before open the link.
     */
    before: function(callback) {
        beforeFn = callback.bind(this);
        return this;
    },
    /**
     * Sets the function to be executed after the
     * window/link opens.
     *
     * @param {Function} callback - The function to execute after open the link.
     */
    after: function(callback) {
        afterFn = callback.bind(this);
        return this;
    }
};

/**
 * Add the event delegation for listen to clicks on the elements,
 * that matches the passed selector, and open the link.
 *
 * @param {String} selector - The selector that represents the rows with links
 */
function addTableLinks(selector) {
    var _this = this;
    var body = document.body;
    return delegate(body, selector, 'click', function(e) {
        var target = closest(e.delegateTarget, 'tr, th, td', true);

        if (!target) return null;

        e.preventDefault();
        var before = beforeFn();

        if (!before && typeof before != 'undefined') return null;

        if (target.dataset.target === 'blank') {
            window.open(target.dataset.href).focus();
        } else if (!target.dataset.target || target.dataset.target === 'self') {
            location.href = target.dataset.href;
        } else {
            location.href = target.dataset.href;
        }

        afterFn();
    }, true);
};

module.exports = TableLink;


},{"closest":1,"delegate":3}]},{},[4])(4)
});