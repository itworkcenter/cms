/**
 * Jnose: nav.js v1.0
 * Auther: Carl.Y.Liu
 * URL: http://jnose.com
 */
;(function(){
    'use strict';

    var NS = function (el) {
        return new NS.fn.init(el);
    };

    NS.VERSION = "1.0";
    NS.TRANSITION_DURATION = 150;
    NS.DEFS={
        isScreenFollow:true,
        container:".ns-nav",
        selectedItem:""
    };

    NS.fn = NS.prototype;

    /*Initialize*/
    NS.fn.init = function (opts) {

        var ths=this;

        opts && $.extend(NS.DEFS, opts);
        ths.DEFS=NS.DEFS;

        var $nav = ths.$nav = $(ths.DEFS.container);

        /*this.handle({
            event: $hdls.event,
            selecter: $hdls.selecter,
            data: $hdls.data,
            back: function () {
                var $a = $(this),
                    $item = $a.parent(),
                    $main = $a.next(".ns-nav-main"),
                    $arrow = $(".ns-icon", this),
                    dir = "left";

                if (/ns-nav-bar-open/ig.test($item.attr("class"))) {
                    $item.removeClass("ns-nav-bar-open")
                        .find(".ns-nav-bar-open")
                        .removeClass("ns-nav-bar-open");
                } else {
                    $item.addClass("ns-nav-bar-open");
                }

            }
        });*/
    };

    NS.fn.show=function(){

        var ths =this,
            $sledItem = ths.DEFS.selectedItem;

        var $a = $(this),
            $item = $a.parent(),
            $main = $a.next(".ns-nav-main"),
            $arrow = $(".ns-icon", this),
            dir = "left";

        if (/ns-nav-bar-open/ig.test($item.attr("class"))) {
            $item.removeClass("ns-nav-bar-open")
                .find(".ns-nav-bar-open")
                .removeClass("ns-nav-bar-open");
        } else {
            $item.addClass("ns-nav-bar-open");
        }


    };


    NS.fn.handle=function(json){
        var $nav = this.$nav,
            pos=$nav.offset();

        this.$nav.on(
            json.event,
            json.selecter,
            json.data,
            function (e) {

                var $currBar = $(this).parent();

                $currBar.siblings().removeClass("ns-nav-bar-open");
                //clearopen($currBar.siblings());

                json.back.apply(this, e);
            }
        );

        $(window).resize(function(){
            /*add transform trigger*/
            if($(".ns-nav-bar").css("display")=="none"){
                $(".ns-nav-bar-open").removeClass("ns-nav-bar-open");
            }
        });

        $(window).scroll(function(){

            var sclTop=$(this).scrollTop();

            if(sclTop>pos.top){
                $nav.addClass("ns-nav-scroll");
            }else if(sclTop<=pos.top){
                $nav.removeClass("ns-nav-scroll");
            }
        }).scroll();

        /*clear open*/
        function clearopen(scope){
            $("[class*='-open']",scope).each(function(){
                var curr = $(this),
                    currCls=curr.attr("class").replace(/-open/ig,"");
                curr.attr("class",currCls);
            });
        }
    };

    NS.fn.init.prototype = NS.fn;

    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {

        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('ns.tab');

            if (!data) $this.data('ns.tab', (data = NS({selectedItem:$(this)})));

            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.nav;

    $.fn.nav             = Plugin;
    $.fn.nav.Constructor = NS.init;


    // TAB NO CONFLICT
    // ===============

    $.fn.nav.noConflict = function () {
        $.fn.nav = old;
        return this
    };


    // TAB DATA-API
    // ============
    var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    };

    $(document)
        .on('click.ns.nav', '.ns-nav-item', clickHandler);


    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], function(){
            return NS;
        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = NS;
    } else {
        // Browser globals
        window.Navbar=NS;
    }
}(jQuery));