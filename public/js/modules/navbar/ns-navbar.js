/**
 * Created by cl8m on 7/11/2015.
 */
;(function(){
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], function(){
            return Navbar;
        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = Navbar;
    } else {
        // Browser globals
        window.Navbar=Navbar;
    }

    function Navbar(opts){
        this.defs={
            handles: {
                event: "click",
                data: "",
                selecter:".ns-nav-bar",
                back: ""
            },
            isScreenFollow:true,
            container:".ns-nav"
        };
        opts && this.ext(this.defs, opts);
        opts && this.ext(this, this.defs);

        var $nav = this.$nav = $(this.defs.container),
            $hdls = this.handles = this.defs.handles;

        this.handle({
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
        });
    }
    Navbar.prototype.handle=function(json){
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
    Navbar.prototype.ext=function(o,s){
        if(o&&s){
            for(var i in s){
                if(typeof s[i] === "object"){
                    if(!(typeof o[i] === "object")){
                        o[i]={}
                    }
                    this.ext(o[i],s[i]);
                }else if(typeof s[i] === "array"){
                    if(!(typeof o[i] === "array")){
                        o[i]=[];
                    }
                    this.ext(o[i],s[i]);
                }else{
                    o[i]=s[i];
                }
            }
        }
        return o;
    };
}());
