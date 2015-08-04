/**
 * Jnose: dropdown.js v1.0
 * Auther: Carl.Y.Liu
 * URL: http://jnose.com
 */
+(function ($) {
    'use strict';

    var NS = function (el) {
        return new NS.fn.init(el);
    };

    NS.VERSION = "1.0";
    NS.TRANSITION_DURATION = 150;
    NS.DEFS={};

    NS.fn = NS.prototype;

    /*Initialize*/
    NS.fn.init = function (el) {
        this.$el=el;
    };

    NS.fn.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown', relatedTarget)
        }

        return false
    };

    NS.fn.init.prototype = NS.fn;


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('ns.dropdown')

            if (!data) $this.data('ns.dropdown', (data = NS(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown;

    $.fn.dropdown             = Plugin;
    $.fn.dropdown.Constructor = NS.init;


    // TAB NO CONFLICT
    // ===============

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this
    };

    /*Event*/
    $(document)
        .on('click.ns.dropdown', clearMenus)
        .on('click.ns.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.ns.dropdown', toggle, Dropdown.prototype.toggle)
        .on('keydown.ns.dropdown', toggle, Dropdown.prototype.keydown)
        .on('keydown.ns.dropdown', '[role="menu"]', Dropdown.prototype.keydown)
        .on('keydown.ns.dropdown', '[role="listbox"]', Dropdown.prototype.keydown)


    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], function () {
            return NS;
        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = NS;
    } else {
        // Browser globals
        window.Tab = NS;
    }
}(jQuery));