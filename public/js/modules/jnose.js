/**
 * Jnose is dom lib,UI plugin,Mobile,AMD
 * Auther: Carl.Y.Liu
 * URL: http://jnose.com
 */
+(function (window, undefined ) {
    'use strict';

    var Obj = function (opts) {
        return new Tab.fn.init(opts);
    };
    Obj.VERSION = "1.0";
    Obj.fn = Tab.prototype;

    /*Initialize*/
    Obj.prototype.init = function (opts) {

        var this_ = this;

        this.defs = {
            handles: {
                event: "click",
                data: "",
                selecter: ".ns-tab-item",
                back: ""
            },
            container: ".ns-tab"
        };
        opts && this.ext(this.defs, opts);
        opts && this.ext(this, this.defs);

        var $tab = this.$tab = $(this.defs.container),
            $hdls = this.handles = this.defs.handles;

        console.log($tab)

        this.handle({
            event: $hdls.event,
            selecter: $hdls.selecter,
            data: $hdls.data,
            back: function () {

            }
        });
    };

    /*Event*/
    Obj.prototype.handle = function (json) {
        var this_ = this;
        $("body").on(
            json.event,
            json.selecter, /*ns-menu-a*/
            json.data,
            function (e) {

                console.log(this)


                json.back.apply(this_);
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
    Obj.prototype.handlefuntrans = function () {
        var this_ = this,
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
    Obj.prototype.handlefun = function () {
        var this_ = this,
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
            var itemProps = this_.props($item),
                mainProps = this_.props($main);
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
    Obj.prototype.props = function ($obj) {
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
    Obj.prototype.ext = function (o, s) {
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
    Obj.fn.init.prototype = Obj.fn;

    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], function () {
            return Obj;
        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = Obj;
    } else {
        // Browser globals
        window.Tab = Obj;
    }
}(window));