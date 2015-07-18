/**
 * Created by cl8m on 7/11/2015.
 */
;(function () {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], function () {
            return Menubar;
        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = Menubar;
    } else {
        // Browser globals
        window.Menubar = Menubar;
    }


    function Menubar(opts) {
        var $this = this;
        this.defs = {
            handles: {
                event: "click",
                data: "",
                selecter: ".ns-menu-a",
                back: ""
            },
            container: ".ns-menu"
        };
        opts && this.ext(this.defs, opts);
        opts && this.ext(this, this.defs);

        var $menu = this.$menu = $(this.defs.container),
            $hdls = this.handles = this.defs.handles;

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
        });

        this.transform();
    }

    /*Transform to mobile*/
    Menubar.prototype.transform=function(){
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
                .append($menu.children(".ns-menu-main").clone());
        }
    };

    /*Event*/
    Menubar.prototype.handle = function (json) {
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
    Menubar.prototype.handlefuntrans=function(){
        console.log("handlefuntrans");
        var $this =this,
            $item = this.$item,
            $a = $item.children(".ns-menu-a"),
            $main = $item.children(".ns-menu-main"),
            $arrow = $(".ns-icon", $a),
            dir = "left",
            isItem = /ns-menu-item/ig.test($item.attr("class"));

        console.log($item)

        if (/ns-menu-open/ig.test($item.attr("class"))) {
            $item.removeClass("ns-menu-open")
                .find(".ns-menu-open")
                .removeClass("ns-menu-open");
        } else {
            $item.addClass("ns-menu-open");
        }

    };
    Menubar.prototype.handlefun=function(){
        console.log("handlefun");
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
    Menubar.prototype.props = function ($obj) {
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
    Menubar.prototype.ext = function (o, s) {
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
}());
