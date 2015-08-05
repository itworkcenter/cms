/**
 * Jnose: menu.js v1.0
 * Auther: Carl.Y.Liu
 * URL: http://jnose.com
 */
;(function () {
    'use strict';

    var NS = function (el) {
        return new NS.fn.init(el);
    };

    NS.VERSION = "1.0";
    NS.TRANSITION_DURATION = 150;
    NS.DEFS={
        container: ".ns-menu",
        selected:""
    };

    NS.fn = NS.prototype;

    /*Initialize*/
    NS.fn.init = function (opts) {

        var ths =this;

        opts && $.extend(NS.DEFS, opts);
        ths.DEFS=NS.DEFS;

        ths.$item =ths.DEFS.selected;
        ths.$main = ths.$item.children(".ns-menu-main");
        ths.$icon = ths.$item.children("a .ns-icon");
        ths.$menu = ths.$item.closest(".ns-menu");
        
        /*this.events();

        this.handle({
            event: $hdls.event,
            selecter: $hdls.selecter,
            data: $hdls.data,
            back: function () {
                if(this.isTrans){
                    $this.handlefuntrans.apply(this);
                }else{
                    $this.handlefun.apply(this);
                }
            }
        });*/

        this.transform();
    };

    NS.fn.init.prototype = NS.fn;

    NS.fn.isMobile = function(){

    };

    NS.fn.handler=function(){

        var ths=this;

        ths.$trans=$("#"+ths.$menu.attr("transid"));
        ths.isTrans=$(".ns-menu-trans-trigger",ths.$menu).css("display")!="none"?true:false;

        console.log(ths.$item);

        if(ths.isTrans&&/ns-menu/ig.test(ths.$trans.attr("class"))){
            ths.$item=ths.$trans;
            ths.$trans.show();
        }else{
            ths.$trans.hide();
        }

        if(/ns-menu-trans-bar/ig.test($(this).attr("class"))){
            ths.$trans.hide();
        }

        ths.$item.siblings().removeClass("ns-menu-open");

        $(".ns-menu-open", ths.$item.siblings()).removeClass("ns-menu-open");

        return false;
    };

    NS.fn.clear=function(){
        $(".ns-menu-open").removeClass("ns-menu-open");
    };

    /*Transform to mobile*/
    NS.fn.transform=function(){
        console.log(this.$menu)
        this.$menu.each(function(i){
            $(this).attr("transid","trans"+i).prepend("<div class='ns-menu-trans-trigger'></div>");
            define($(this),i);
        });
        function define($menu,i){
            var $trans=$("<div></div>").appendTo("body");
            $trans
                .attr("class",$menu.attr("class"))
                .addClass("ns-menu-trans")
                .attr("id","trans"+i)
                /*.append("<a class='ns-menu-a ns-menu-trans-bar'>Back</a>")*/
                .append($menu.children(".ns-menu-main").clone());
        }
    };

    /*Event*/
    NS.fn.events = function (json) {
        var $this=this;
        $("body").on(
            json.event,
            json.selecter,/*ns-menu-a*/
            json.data,
            function (e) {
                var $menu=$(this).parents(".ns-menu");

                $this.$trans=$("#"+$menu.attr("transid"));
                $this.$item = $(this).parent();
                $this.isTrans=$(".ns-menu-trans-trigger",$menu).css("display")!="none"?true:false;

                if($this.isTrans&&/ns-menu/ig.test($this.$trans.attr("class"))){
                    $this.$item=$this.$trans;
                    $this.$trans.show();
                }else{
                    $this.$trans.hide();
                }

                if(/ns-menu-trans-bar/ig.test($(this).attr("class"))){
                    $this.$trans.hide();
                }

                $this.$item.siblings().removeClass("ns-menu-open");

                $(".ns-menu-open", $this.$item.siblings()).removeClass("ns-menu-open");

                json.back.apply($this);
                e.stopPropagation();
                return false;
            }
        );
        $("body").on(json.event, function () {
            clear();
        });
        $(window).resize(function () {
            clear();
        });
        function clear() {
            $(".ns-menu-open").removeClass("ns-menu-open");
        }
    };
    NS.fn.handlefuntrans=function(){
        var $this =this,
            $item = this.$item,
            $a = $item.children(".ns-menu-a"),
            $main = $item.children(".ns-menu-main"),
            $arrow = $(".ns-icon", $a),
            dir = "left",
            isItem = /ns-menu-item/ig.test($item.attr("class"));

        if (/ns-menu-open/ig.test($item.attr("class"))) {
            $item.removeClass("ns-menu-open")
                .find(".ns-menu-open")
                .removeClass("ns-menu-open");
        } else {
            $item.addClass("ns-menu-open");
        }

    };
    NS.fn.handlefun=function(){
        var $this =this,
            $item = this.$item,
            $a = $item.children(".ns-menu-a"),
            $main = $item.children(".ns-menu-main"),
            $arrow = $(".ns-icon", $a),
            dir = "left",
            isItem = /ns-menu-item/ig.test($item.attr("class"));

        if (/ns-menu-open/ig.test($item.attr("class"))) {
            $item.removeClass("ns-menu-open")
                .find(".ns-menu-open")
                .removeClass("ns-menu-open");
        } else {
            $item.addClass("ns-menu-open");
        }
        /*check direction*/
        if (isItem) {
            var itemProps = $this.props($item),
                mainProps = $this.props($main);
            //console.log(mainProps.max + " " + (mainProps.left + mainProps.width));
            //console.log(mainProps.max - (mainProps.left + mainProps.width));

            dir = (mainProps.max - mainProps.left - mainProps.width) > 0 ? "right" : "left";

            var clone = $arrow
                    .removeAttr("class")
                    .addClass("ns-icon")
                    .clone(),
                dirProcess = {
                    left: function (dir) {
                        $a.prepend(this.clone(dir));
                        $main.css({"left": (itemProps.left - itemProps.right) + "px"});
                    },
                    right: function (dir) {
                        $a.append(this.clone(dir));
                        $main.css({"left": (itemProps.right - itemProps.left) + "px"});
                    },
                    clone: function (dir) {
                        $main.css({"top": 0});
                        return clone.addClass("ns-icon-" + dir);
                    }
                };
            $arrow.remove();
            dirProcess[dir](dir);
        }

    };
    /*Get Property*/
    NS.fn.props = function ($obj) {
        var rslts = {};
        this.ext(rslts, $obj.offset());
        rslts.width = $obj.width();
        rslts.height = $obj.height();
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

    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {

        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('ns.tab');

            if (!data) $this.data('ns.tab', (data = NS({selected:$(this)})));

            if (typeof option == 'string') data[option]()
        });
    }

    var old = $.fn.menu;

    $.fn.menu             = Plugin;
    $.fn.menu.Constructor = NS.init;


    // TAB NO CONFLICT
    // ===============

    $.fn.menu.noConflict = function () {
        $.fn.menu = old;
        return this
    };


    var clickHandler = function (e) {
        e.preventDefault();
        Plugin.call($(this), 'handler');
    };

    /*Event Driven*/
    $(document)
        .on('click.ns.menu', '.ns-menu-item,.ns-menu', clickHandler);


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
}());
