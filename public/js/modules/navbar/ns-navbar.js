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
            isScreenFollow:true,
            container:".ns-nav"
        };
        opts && this.ext(this.defs,opts);
        this.obj=$(this.defs.container);

        var obj=this.obj,pos=obj.offset();

        $(window).scroll(function(){
            var sclTop=$(this).scrollTop();

            if(sclTop>pos.top){
                obj.addClass("ns-nav-scroll");
            }else if(sclTop<=pos.top){
                obj.removeClass("ns-nav-scroll");
            }

        }).scroll();
        /*initialize*/
    }
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
