/*! jQuery v@1.8.0 jquery.com | jquery.org/license */
/*@import jquery plugin*/

/*@carl code refactor*/
(function($){
    jQuery.extend({
        userAgent:navigator.userAgent,
        IsRetina: function(){
            var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
			                  (min--moz-device-pixel-ratio: 1.5),\
			                  (-o-min-device-pixel-ratio: 3/2),\
			                  (min-resolution: 1.5dppx)";
            if (window.devicePixelRatio > 1)
                return true;
            if (window.matchMedia && window.matchMedia(mediaQuery).matches)
                return true;
            return false;
        },
        //Browser Version
        /*@carl code refactor*/
        IsIE: function(){
            return (new RegExp("msie\\s("+Array.prototype.slice.call(arguments).join("|")+")","i")).test(this.userAgent);
        },
        IsTouchMedia: function(){
            return /Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/i.test(this.userAgent);
        },
        IsSafari: function(){
            return /Safari/i.test(this.userAgent)&& !/iphone|ipad|chrome/i.test(this.userAgent);
        },
        IsAndroid: function(){
            return /android/i.test(this.userAgent);
        },
        MaskBox: function(opacity){
            var height,
                maskBox = $('<div class="maskBox popupMaskBox"></div>');
            maskBox.click(function(e){
                return false;
            });
            maskBox.css({
                opacity: !isNaN(parseFloat(opacity))? opacity : 0.4
            })
            $('body').append(maskBox);
        }
    });
})(jQuery);

(function($){
    $.fn.extend({
        ClickSlider: function(options){
            var defaults = {
                Speed: 180
            };
            var opts = $.extend(defaults, options);
            $(window).resize(function(){
                $('.startTime').hide().stop();
            })
            $(this).find('.startTime').hide();
            $(this).click(function(){
                var _self = $(this);
                if(_self.find('.startTime').is(":animated") ){return;}
                // _self.attr('click', 1);
                _self.find('.startTime').stop();
                if(_self.find('.startTime').is(':visible')){
                    return;
                }
                var _t = _self.find('.pic').height();
                _self.find('.startTime').css({'height': _t, 'top': _t})
                    .animate({'top': 0}, opts.Speed, function(){
                        // _self.removeAttr('click');
                    })
                    .show()
                    .delay(2000)
                    .animate({'top': _t}, opts.Speed, function(){
                        $(this).hide();
                        // _self.removeAttr('click');
                    });
                if(_self.find('.text').height() > 18){
                    _self.find('.text').addClass('over');
                }else{
                    _self.find('.text').removeClass('over');
                }
            });
        },
        HoverSlider: function(options) {
            if($.IsTouchMedia()){
                return;
            }
            var _isInit = false;
            var _self = this;
            if($(window).width() <= 768) {
                $(window).resize(function(){
                    if($(window).width() >= 768 && !_isInit) {
                        hover(_self, options);
                    }
                });
            }else{
                hover(_self, options)
            }
            function hover(self, options){
                _isInit = true;
                var defaults = {
                    Speed: 180,
                    AllwaysShow: false,
                    Style: null
                }
                var options =  $.extend(defaults, options);
                return self.each(function() {
                    if(typeof this != 'object') return false;
                    this.o = options;
                    this.a = $(this).find('>a');
                    this.wrap = this.a.find('>.wrap');
                    this.imgs = $(this).find('img');
                    this.price = $(this).find('.price');
                    this.saleTime = $(this).find('.sale_time');
                    this.fullTitle = $(this).find('h3').text();
                    this.info = $(this).find('.info');
                    this.description = $(this).find('.info p').text();
                    this.infoHeight = this.info.outerHeight(true);
                    this.isInserted = false;
                    ResizeHover(this);
                    var _this = this;
                    $(window).resize(function(){
                        if($(window).width() <= 768) {
                            $(_this).unbind('hover');
                            _this._isHovered = false;
                        } else {
                            ResizeHover(_this);
                        }
                    });
                });
            }
            function mouseover(_this){
                var speed = _this.o.Speed;
                if(_this.o.Style == 'small') {
                    if(!_this.isInserted) {
                        CreatCanvas(_this);
                    }
                    if(!_this.box.is(':animated') &&
                        !_this.wrap.is(':animated')) {
                        _this.box.animate({
                            bottom: 0
                        }, speed);
                        _this.wrap.animate({
                            top: -_this.a.outerHeight(true)
                        }, speed);
                    }
                } else { // base styles
                    if(!_this.saleTime.is(':animated')) {
                        _this.saleTime.animate({
                            bottom: _this.info.outerHeight(true)
                        }, speed);
                    }
                }
            }
            function mouseout(_this){
                var speed = _this.o.Speed;
                if(_this.o.Style == 'small') {
                    _this.box.clearQueue().stop()
                        .animate({
                            bottom: -_this.box.outerHeight(true)
                        }, speed);
                    _this.wrap.clearQueue().stop()
                        .animate({
                            top: 0
                        }, speed);
                } else {
                    _this.saleTime.clearQueue().stop()
                        .animate({
                            bottom: -_this.infoHeight
                        }, speed);
                }
            }
            function CreatCanvas(_this) {
                var height = _this.imgs.outerHeight(true),
                    top = ((height < 280 ? 280 : height) - 80) * 0.5, imgs1;
                if(_this.o.Style == 'small') { // for up slider
                    var isActivity = $(_this).find('.price').clone()[0] ? false : true;
                    var title = $('<div class="fullTitle">' + _this.fullTitle + '</div>');
                    var wrap = $('<div class="wrap"></div>');
                    var smallImg = $('<img src="' + _this.imgs[0].src + '">');
                    _this.box = $('<div class="boxA_info"></div>');
                    wrap.append(smallImg);
                    wrap.append(_this.price.clone());
                    wrap.append(title);
                    if(isActivity) {
                        var description = $('<p>' + _this.description + '</p>');
                        description.css('margin-bottom', '8px');
                        wrap.append(description);
                        title.css('max-height', '63px');
                    }
                    _this.box.append(wrap);
                    wrap.append(_this.saleTime.clone().removeClass().addClass('endTime'));
                    _this.box.css({
                        border: '1px solid #e8e8e8',
                        width: _this.a.width() - 40,
                        height: _this.a.height() - 42
                    }).appendTo(_this.a)
                }
                _this.isInserted = true;
                $(window).resize(function(){
                    if(_this.box && $(window).width() > 768) {
                        _this.box.css({
                            bottom: -_this.box.outerHeight(true),
                            width: _this.a.width() - 40,
                            height: _this.a.height() - 42
                        });
                    }
                });
            }
            function ResizeHover(_this) {
                if(!_this._isHovered) {
                    $(_this).hover(function(){
                        mouseover(_this);
                    },function(){
                        mouseout(_this);
                    });
                    _this._isHovered = true;
                }
            }
        }
    });
})(jQuery);
/*
 * textarea auto height
 * textarea word count
 * Dell.J.Du@newegg.com
 */
;!function (window, $, undefined) {
    var TextareaFix = (function () {
        var KEYCODE = [8,35,36,37,38,39,40,46];
        function TextareaFix(bindDom, options) {
            this.$this = bindDom;
            this.setOptions(options);
            this.render();
        }
        TextareaFix.prototype.defaultOpts = {
            limitLen: false,
            limitNum: 500,
            counterElement: '.counter',
            beforeCallback: function (self) {}
        };
        TextareaFix.prototype.setOptions = function (options) {
            this.opts = $.extend({}, this.defaultOpts, options);
        };
        TextareaFix.prototype.calculate = function (obj) {
            var self = this.$this;
            var opts = this.opts;
            if (opts.limitLen) {
                var _count = self.val().length;
                if (_count > opts.limitNum) {
                    self.val(self.val().substring(0, opts.limitNum));
                    _count = opts.limitNum;
                }
                if(_count == opts.limitNum){
                    $(opts.counterElement).css('color', 'red');
                }else{
                    $(opts.counterElement).css('color', '#7f7f7f');
                }
                $(opts.counterElement).html(_count);
            }
            var content = self.val();
            content = content.replace(/\n/g, '<br>');
            $('.hiddendiv').css('width', self.width()).html(content + '<br class="lbr">');
            self.css('height', $('.hiddendiv').height());
            if ($('.hiddendiv').height() > 300) {
                self.addClass('textareaMax');
            } else {
                self.removeClass('textareaMax');
            }
        };
        TextareaFix.prototype.bindEvent = function () {
            var _self = this;
            $(window).bind('resize.' + _self.$this.constructor.expando, function () {
                _self.opts.resizeBeforeCallback(_self.$this);
                _self.calculate(_self.$this);
            });
        };
        TextareaFix.prototype.unBindEvent = function () {
            $(window).unbind('.' + this.$this.constructor.expando);
        };
        TextareaFix.prototype.render = function () {
            var opts = this.opts;
            var _self = this;
            if ($('.hiddendiv').length == 0) {
                var hiddenDiv = $(document.createElement('div'));
                hiddenDiv.addClass('hiddendiv textarea');
                $('body').append(hiddenDiv);
            }
            opts.beforeCallback(this.$this);
            this.$this.addClass('txtstuff');
            _self.calculate();
            this.$this.keydown(function (e) {
                if(
                    $(opts.counterElement).html() == opts.limitNum &&
                    (
                        KEYCODE.indexOf(e.keyCode) < 0 &&
                        !(e.ctrlKey == true && e.keyCode == 65)
                        )
                    ){
                    return false;
                }
                // if ($(opts.counterElement).html() == opts.limitNum &&
                // 	((KEYCODE.indexOf(e.keyCode) < 0 && e.ctrlKey == false)
                //                      || (e.ctrlKey == true && e.keyCode == 86))) {
                //                     return false;
                //                 }
            });
            this.$this.keyup(function (e) {
                _self.calculate();
            });
            this.$this.change(function () {
                _self.calculate();
            });
            this.bindEvent();
            return this;
        };
        return TextareaFix;
    })();
    $.fn.TextareaFix = function (opts) {
        var $this = $(this),
            data = $this.data();
        if (data.TextareaFix) {
            delete data.TextareaFix;
        }
        if (opts !== false) {
            data.TextareaFix = new TextareaFix($this, opts);
        }
        return data.TextareaFix;
    };
}(window, jQuery);
/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*
 Masked Input plugin for jQuery
 Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
 Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
 Version: 1.3
 */
;(function(a){var b=(a.browser.msie?"paste":"input")+".mask",c=window.orientation!=undefined;a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},dataName:"rawMaskFn"},a.fn.extend({caret:function(a,b){if(this.length!=0){if(typeof a=="number"){b=typeof b=="number"?b:a;return this.each(function(){if(this.setSelectionRange)this.setSelectionRange(a,b);else if(this.createTextRange){var c=this.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select()}})}if(this[0].setSelectionRange)a=this[0].selectionStart,b=this[0].selectionEnd;else if(document.selection&&document.selection.createRange){var c=document.selection.createRange();a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length}return{begin:a,end:b}}},unmask:function(){return this.trigger("unmask")},mask:function(d,e){if(!d&&this.length>0){var f=a(this[0]);return f.data(a.mask.dataName)()}e=a.extend({placeholder:"_",completed:null},e);var g=a.mask.definitions,h=[],i=d.length,j=null,k=d.length;a.each(d.split(""),function(a,b){b=="?"?(k--,i=a):g[b]?(h.push(new RegExp(g[b])),j==null&&(j=h.length-1)):h.push(null)});return this.trigger("unmask").each(function(){function v(a){var b=f.val(),c=-1;for(var d=0,g=0;d<k;d++)if(h[d]){l[d]=e.placeholder;while(g++<b.length){var m=b.charAt(g-1);if(h[d].test(m)){l[d]=m,c=d;break}}if(g>b.length)break}else l[d]==b.charAt(g)&&d!=i&&(g++,c=d);if(!a&&c+1<i)f.val(""),t(0,k);else if(a||c+1>=i)u(),a||f.val(f.val().substring(0,c+1));return i?d:j}function u(){return f.val(l.join("")).val()}function t(a,b){for(var c=a;c<b&&c<k;c++)h[c]&&(l[c]=e.placeholder)}function s(a){var b=a.which,c=f.caret();if(a.ctrlKey||a.altKey||a.metaKey||b<32)return!0;if(b){c.end-c.begin!=0&&(t(c.begin,c.end),p(c.begin,c.end-1));var d=n(c.begin-1);if(d<k){var g=String.fromCharCode(b);if(h[d].test(g)){q(d),l[d]=g,u();var i=n(d);f.caret(i),e.completed&&i>=k&&e.completed.call(f)}}return!1}}function r(a){var b=a.which;if(b==8||b==46||c&&b==127){var d=f.caret(),e=d.begin,g=d.end;g-e==0&&(e=b!=46?o(e):g=n(e-1),g=b==46?n(g):g),t(e,g),p(e,g-1);return!1}if(b==27){f.val(m),f.caret(0,v());return!1}}function q(a){for(var b=a,c=e.placeholder;b<k;b++)if(h[b]){var d=n(b),f=l[b];l[b]=c;if(d<k&&h[d].test(f))c=f;else break}}function p(a,b){if(!(a<0)){for(var c=a,d=n(b);c<k;c++)if(h[c]){if(d<k&&h[c].test(l[d]))l[c]=l[d],l[d]=e.placeholder;else break;d=n(d)}u(),f.caret(Math.max(j,a))}}function o(a){while(--a>=0&&!h[a]);return a}function n(a){while(++a<=k&&!h[a]);return a}var f=a(this),l=a.map(d.split(""),function(a,b){if(a!="?")return g[a]?e.placeholder:a}),m=f.val();f.data(a.mask.dataName,function(){return a.map(l,function(a,b){return h[b]&&a!=e.placeholder?a:null}).join("")}),f.attr("readonly")||f.one("unmask",function(){f.unbind(".mask").removeData(a.mask.dataName)}).bind("focus.mask",function(){m=f.val();var b=v();u();var c=function(){b==d.length?f.caret(0,b):f.caret(b)};(a.browser.msie?c:function(){setTimeout(c,0)})()}).bind("blur.mask",function(){v(),f.val()!=m&&f.change()}).bind("keydown.mask",r).bind("keypress.mask",s).bind(b,function(){setTimeout(function(){f.caret(v(!0))},0)}),v()})}})})(jQuery);
/*!
 Copyright (c) 2011 Peter van der Spek
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
;(function(a){function m(){if(!d){d=!0;for(var c in b)a(c).each(function(){var d,e;d=a(this),e=d.data("jqae"),(e.containerWidth!=d.width()||e.containerHeight!=d.height())&&f(d,b[c])});d=!1}}function l(a){b[a]&&(delete b[a],b.length||c&&(window.clearInterval(c),c=undefined))}function k(a,d){b[a]=d,c||(c=window.setInterval(function(){m()},200))}function j(){return this.nodeType===3}function i(b){if(b.contents().length){var c=b.contents(),d=c.eq(c.length-1);if(d.filter(j).length){var e=d.get(0).nodeValue;e=a.trim(e);if(e==""){d.remove();return!0}return!1}while(i(d));if(d.contents().length)return!1;d.remove();return!0}return!1}function h(a){if(a.contents().length){var b=a.contents(),c=b.eq(b.length-1);return c.filter(j).length?c:h(c)}a.append("");var b=a.contents();return b.eq(b.length-1)}function g(b){var c=h(b);if(c.length){var d=c.get(0).nodeValue,e=d.lastIndexOf(" ");e>-1?(d=a.trim(d.substring(0,e)),c.get(0).nodeValue=d):c.get(0).nodeValue="";return!0}return!1}function f(b,c){var d=b.data("jqae");d||(d={});var e=d.wrapperElement;e||(e=b.wrapInner("<div/>").find(">div"),e.css({margin:0,padding:0,border:0}));var f=e.data("jqae");f||(f={});var j=f.originalContent;j?e=f.originalContent.clone(!0).data("jqae",{originalContent:j}).replaceAll(e):e.data("jqae",{originalContent:e.clone(!0)}),b.data("jqae",{wrapperElement:e,containerWidth:b.width(),containerHeight:b.height()});var k=b.height(),l=(parseInt(b.css("padding-top"),10)||0)+(parseInt(b.css("border-top-width"),10)||0)-(e.offset().top-b.offset().top),m=!1,n=e;c.selector&&(n=a(e.find(c.selector).get().reverse())),n.each(function(){var b=a(this),d=b.text(),f=!1;if(e.innerHeight()-b.innerHeight()>k+l)b.remove();else{i(b);if(b.contents().length){m&&(h(b).get(0).nodeValue+=c.ellipsis,m=!1);while(e.innerHeight()>k+l){f=g(b);if(!f){m=!0,b.remove();break}i(b);if(b.contents().length)h(b).get(0).nodeValue+=c.ellipsis;else{m=!0,b.remove();break}}c.setTitle=="onEllipsis"&&f||c.setTitle=="always"?b.attr("title",d):c.setTitle!="never"&&b.removeAttr("title")}}})}var b={},c,d=!1,e={ellipsis:"...",setTitle:"never",live:!1};a.fn.ellipsis=function(b,c){var d,g;d=a(this),typeof b!="string"&&(c=b,b=undefined),g=a.extend({},e,c),g.selector=b,d.each(function(){var b=a(this);f(b,g)}),g.live?k(d.selector,g):l(d.selector);return this}})(jQuery);
// retina.libs, a high-resolution image swapper (http://retinajs.com), v0.0.2
// (function(){function t(e){this.path=e;var t=this.path.split("."),n=t.slice(0,t.length-1).join("."),r=t[t.length-1];this.at_2x_path=n+"@2x."+r}function n(e){this.el=e,this.path=new t(this.el.getAttribute("src"));var n=this;this.path.check_2x_variant(function(e){e&&n.swap()})}var e=typeof exports=="undefined"?window:exports;e.RetinaImagePath=t,t.confirmed_paths=[],t.prototype.is_external=function(){return!!this.path.match(/^https?\:/i)&&!this.path.match("//"+document.domain)},t.prototype.check_2x_variant=function(e){var n,r=this;if(this.is_external())return e(!1);if(this.at_2x_path in t.confirmed_paths)return e(!0);n=new XMLHttpRequest,n.open("HEAD",this.at_2x_path),n.onreadystatechange=function(){return n.readyState!=4?e(!1):n.status>=200&&n.status<=399?(t.confirmed_paths.push(r.at_2x_path),e(!0)):e(!1)},n.send()},e.RetinaImage=n,n.prototype.swap=function(e){function n(){t.el.complete?(t.el.setAttribute("width",t.el.offsetWidth),t.el.setAttribute("height",t.el.offsetHeight),t.el.setAttribute("src",e)):setTimeout(n,5)}typeof e=="undefined"&&(e=this.path.at_2x_path);var t=this;n()},e.devicePixelRatio>1&&(window.onload=function(){var e=document.getElementsByTagName("img"),t=[],r,i;for(r=0;r<e.length;r++)i=e[r],t.push(new n(i))})})();
!function(win,$,undefined){var BannerSwiper=(function(){function BannerSwiper(dom,options){this.dom=dom;this.setOptions(options);this.render();this.adjustHeight();this.bindEvent();this.resizeTimer=0}BannerSwiper.prototype.defaultOpts={pagination:".thumbnail",paginationActiveClass:"current",paginationClickable:true,loop:true,grabCursor:false,autoplay:5000,calculateHeight:true};BannerSwiper.prototype.setOptions=function(options){this.opts=$.extend({},this.defaultOpts,options);this.opts.swiperStatus=0;if($(".sectionBanner").width()>960&&!$.IsIE(7)&&!$.IsIE(8)){this.dom.find(".swiper-slide").addClass("sliderPadding");this.opts=$.extend({},this.opts,{slidesPerView:"auto",keyboardControl:true,centeredSlides:true,watchActiveIndex:true,fixPerView:true,touchRatio:false});this.opts.swiperStatus=1}};BannerSwiper.prototype.adjustHeight=function(options){if(!$.IsIE(7)&&!$.IsIE(8)){var _selfHeight;var _winWidth=$(window).width();if(_winWidth>960){_winWidth=$(".header_wrap").width()}var _padding=$.IsTouchMedia()?0:15;if(_winWidth>0&&_winWidth<=320){_selfHeight=140}else{if(_winWidth>320&&_winWidth<=640-_padding){_selfHeight=(_winWidth*1.5)*280/960}else{if(_winWidth>640-_padding&&_winWidth<=960-_padding){_selfHeight=_winWidth*280/960}else{_selfHeight=280}}}this.dom.height(_selfHeight)}};BannerSwiper.prototype.render=function(){var opt=this.options,_self=this.dom;this.isSingle=_self.find("img").length<2;var _winWidth=$(window).width();if(_winWidth>960){_winWidth=$(".header_wrap").width()}if(_winWidth>960&&this.isSingle){_self.find(".swiper-slide").addClass("swiper-slide-center");return}if(this.isSingle){this.opts=$.extend({},this.opts,{"onlyExternal":true,"autoplay":false})}this.swiper=new Swiper("#"+_self.attr("id"),this.opts)};BannerSwiper.prototype.bindEvent=function(){var _self=this.dom,_bannerSwiper=this.swiper;var _winWidth=$(window).width();if(_winWidth>960){_winWidth=$(".header_wrap").width()}if(_winWidth>960&&this.isSingle){return}var _slidePrev=_self.find(".slide_prev"),_slideNext=_self.find(".slide_next");if(!this.isSingle){$(_bannerSwiper.container).on("mouseenter.swiper",function(){var _bannerHeight=_self.outerHeight()/2-40;_slidePrev.css("top",_bannerHeight).animate({"left":0},200);_slideNext.css("top",_bannerHeight).animate({"right":0},200);_bannerSwiper.stopAutoplay()});$(_bannerSwiper.container).on("mouseleave.swiper",function(){_slidePrev.animate({"left":-40},200);_slideNext.animate({"right":-40},200);_bannerSwiper.startAutoplay()});$(_bannerSwiper.container).on("click.swiper",function(e){if($(e.target).closest(".swiper-slide-visible").is("div")){if($(e.target).closest(".swiper-slide-visible").hasClass("swiper-slide-active")){return}var _index=$(".swiper-slide-visible").index($(e.target).closest(".swiper-slide-visible"));if(_index==0){_slidePrev.click()}else{if(_index==2){_slideNext.click()}}}});_slidePrev.on("click.swiper",function(e){_bannerSwiper.swipePrev()});_slideNext.on("click.swiper",function(e){_bannerSwiper.swipeNext()})}else{_self.find(".thumbnail").hide()}var _that=this;$(window).on("resize.swiper",function(){clearTimeout(_that.resizeTimer);_that.resizeTimer=setTimeout(function(){_that.adjustHeight();var _winWidth=$(window).width();if(_winWidth>960){_winWidth=$(".header_wrap").width()}if(_winWidth<768){if(!_that.isSingle){_slidePrev.hide();_slideNext.hide()}}else{if(!_that.isSingle){_slidePrev.show();_slideNext.show()}}},10)})};BannerSwiper.prototype.destroys=function(){var opt=this.options,_self=this.dom,_bannerSwiper=this.swiper;_bannerSwiper.destroy();_self.find(".thumbnail").html("");_self.find(".swiper-slide").removeAttr("style").removeClass("swiper-slide-visible swiper-slide-active");_self.find(".swiper-wrapper").removeAttr("style");_self.find(".swiper-slide-duplicate").remove();clearTimeout(this.resizeTimer);$(window).off(".swiper");$(_bannerSwiper.container).off(".swiper");_self.find(".slide_prev").off(".swiper");_self.find(".slide_next").off(".swiper");_self.find(".swiper-slide-visible").off(".swiper")};return BannerSwiper})();$.fn.BannerSwiper=function(opts){var $this=$(this),data=$this.data();if(data.BannerSwiper){delete data.BannerSwiper}if(opts!==false){data.BannerSwiper=new BannerSwiper($this,opts)}return data.BannerSwiper}}(window,jQuery);
// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return -c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b}return -c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b}return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b}return -c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b}return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0){return b}if(t==d){return b+c}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b}return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0){return b}if((t/=d/2)==2){return b+c}if(!p){p=d*(0.3*1.5)}if(a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158}return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2){return jQuery.easing.easeInBounce(x,t*2,0,c,d)*0.5+b}return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*0.5+c*0.5+b}});
/*
 * jQuery Easing Compatibility v1 - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Adds compatibility for applications that use the pre 1.2 easing names
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
jQuery.extend(jQuery.easing,{easeIn:function(x,t,b,c,d){return jQuery.easing.easeInQuad(x,t,b,c,d)},easeOut:function(x,t,b,c,d){return jQuery.easing.easeOutQuad(x,t,b,c,d)},easeInOut:function(x,t,b,c,d){return jQuery.easing.easeInOutQuad(x,t,b,c,d)},expoin:function(x,t,b,c,d){return jQuery.easing.easeInExpo(x,t,b,c,d)},expoout:function(x,t,b,c,d){return jQuery.easing.easeOutExpo(x,t,b,c,d)},expoinout:function(x,t,b,c,d){return jQuery.easing.easeInOutExpo(x,t,b,c,d)},bouncein:function(x,t,b,c,d){return jQuery.easing.easeInBounce(x,t,b,c,d)},bounceout:function(x,t,b,c,d){return jQuery.easing.easeOutBounce(x,t,b,c,d)},bounceinout:function(x,t,b,c,d){return jQuery.easing.easeInOutBounce(x,t,b,c,d)},elasin:function(x,t,b,c,d){return jQuery.easing.easeInElastic(x,t,b,c,d)},elasout:function(x,t,b,c,d){return jQuery.easing.easeOutElastic(x,t,b,c,d)},elasinout:function(x,t,b,c,d){return jQuery.easing.easeInOutElastic(x,t,b,c,d)},backin:function(x,t,b,c,d){return jQuery.easing.easeInBack(x,t,b,c,d)},backout:function(x,t,b,c,d){return jQuery.easing.easeOutBack(x,t,b,c,d)},backinout:function(x,t,b,c,d){return jQuery.easing.easeInOutBack(x,t,b,c,d)}});

/*load libs
* carl
* */
;(function(w){
    w.loads=function(json){
        var d=document,sc="script",s=d.getElementsByTagName(sc)[0],c= d.createElement(sc);
        for(var i in json){c[i]=json[i];}
        s.parentNode.appendChild(c);
    }
}(window));
/*
* support placeholder for ie 7 8 9
* @carl
* */
;(function(){
    $.fn.placeholder = function(){
        var i = document.createElement('input'),
            placeholdersupport = 'placeholder' in i;
        if(!placeholdersupport){
            var inputs = jQuery(this);
            inputs.each(function(){
                var input = jQuery(this),
                    text = input.attr('placeholder'),
                    pdl = 0,
                    height = input.outerHeight(),
                    width = input.outerWidth(),
                    placeholder = jQuery('<span class="phTips">'+text+'</span>');
                try{
                    pdl = input.css('padding-left').match(/\d*/i)[0] * 1;
                }catch(e){
                    pdl = 5;
                }
                placeholder.css({'margin-left': -(width-pdl),'height':height,'line-height':height+"px",'position':'absolute', 'color': "#757575"});
                placeholder.click(function(){
                    input.focus();
                });
                if(input.val() != ""){
                    placeholder.css({display:'none'});
                }else{
                    placeholder.css({display:'inline'});
                }
                placeholder.insertAfter(input);
                input.keyup(function(e){
                    if(jQuery(this).val() != ""){
                        placeholder.css({display:'none'});
                    }else{
                        placeholder.css({display:'inline'});
                    }
                });
            });
        }
        return this;
    };
    /*IE placeholder suport*/
    //$('input[placeholder]:not("#SearchMobileInput")').placeholder();
}());

