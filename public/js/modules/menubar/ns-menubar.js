/**
 * Created by cl8m on 7/11/2015.
 */
;(function(){
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], function(){
            return Menubar;
        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = Menubar;
    } else {
        // Browser globals
        window.Menubar=Menubar;
    }


    function Menubar(opts){
        var $this =this;
        this.defs={
            handles:{
                event:"click",
                data:"",
                selecter:".ns-menu-a",
                back:""
            },
            container:".ns-menu"
        };
        var jsons = opts && this.ext(this.defs,opts);

        console.log(jsons);

        var $menu=this.obj=$(this.defs.container),
            $hdls=this.handle=this.defs.handles;

        this.event({
            handle:$hdls.event,
            selecter:$hdls.selecter,
            data:$hdls.data,
            back:function(){
                var $main=$(this).next(".ns-menu-main"),
                    $item=$main.parent(),
                    isItem= /ns-menu-item/ig.test($item.attr("class"));
                console.log($main)

                if(/ns-menu-open/ig.test($main.attr("class"))){
                    $main.removeClass("ns-menu-open").find(".ns-menu-open").removeClass("ns-menu-open");
                }else{
                    $main.addClass("ns-menu-open");
                }
                /*ÅÐ¶Ï·½Ïò*/
                if(isItem){
                    var itemProps=$this.props($item),
                        mainProps=$this.props($main);
                    $main.css("left",itemProps.right-itemProps.left);
                    console.log("============")
                    console.log(itemProps)
                    console.log(mainProps)
                }
        }});



        /*$(window).scroll(function(){
            var sclTop=$(this).scrollTop();

            if(sclTop>pos.top){
                obj.addClass("ns-nav-scroll");
            }else if(sclTop<=pos.top){
                obj.removeClass("ns-nav-scroll");
            }

        }).scroll();*/
        /*initialize*/
    }
    Menubar.prototype.event=function(json){
      this.obj.on(
          json.handle,
          json.selecter,
          json.data,
          json.back
      );
    };

    Menubar.prototype.props=function($obj){
        var rslts={};
        this.ext(rslts,$obj.offset());
        rslts.width=$obj.width();
        rslts.height=$obj.height();
        rslts.right=rslts.left+rslts.width;
        rslts.bottom=rslts.top+rslts.height;
        return rslts;
    };
    Menubar.prototype.ext=function(o,s){
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
