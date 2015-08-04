/**
 * Jnose: tab.js v1.0
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

    NS.fn = NS.prototype;

    /*Initialize*/
    NS.fn.init = function (el) {
        this.$el=el;
    };

    NS.fn.show = function () {

        var ths = this,
            $source    = ths.$el,
            $tab = $source.parent(".ns-tab"),
            $targets = $("#"+$tab.attr('data-target')),
            index = $source.index(),
            $target = $($(".ns-tab-panel",$targets).get(index));

        $(".ns-tab-active",$tab).removeClass("ns-tab-active");
        $source.addClass("ns-tab-active");

        $(".ns-tab-p-active",$targets).removeClass("ns-tab-p-active");
        $target.addClass("ns-tab-p-active");


    };

    /*Event*/
    /*Get Property*/
    NS.fn.props = function ($el) {
        var rslts = {};
        this.ext(rslts, $el.offset());
        rslts.width = $el.width();
        rslts.height = $el.height();
        rslts.right = rslts.left + rslts.width;
        rslts.bottom = rslts.top + rslts.height;
        rslts.max = $(window).width();
        return rslts;
    };
    /*Extend Object*/
    NS.fn.ext = function (o, s) {
        if (o && s) {
            for (var i in s) {
                if (typeof s[i] === "object") {
                    if (!(typeof o[i] === "object")) {
                        o[i] = {}
                    }
                    this.ext(o[i], s[i]);
                } else if (typeof s[i] === "array") {
                    if (!(typeof o[i] === "array")) {
                        o[i] = [];
                    }
                    this.ext(o[i], s[i]);
                } else {
                    o[i] = s[i];
                }
            }
        }
        return o;
    };
    NS.fn.init.prototype = NS.fn;


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {

        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('ns.tab');

            if (!data) $this.data('ns.tab', (data = NS($(this))));

            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tab;

    $.fn.tab             = Plugin;
    $.fn.tab.Constructor = NS.init;


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old;
        return this
    };


    // TAB DATA-API
    // ============

    var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    };

    $(document)
        .on('click.ns.tab', '.ns-tab-item', clickHandler);


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