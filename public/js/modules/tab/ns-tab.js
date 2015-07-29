/**
 * Jnose: tab.js v1.0
 * Auther: Carl.Y.Liu
 * URL: http://jnose.com
 */
+(function ($) {
    'use strict';

    var Obj = function (opts) {
        return new Obj.fn.init(opts);
    };

    Obj.VERSION = "1.0";
    Obj.TRANSITION_DURATION = 150;
    Obj.DEFS={
        handles: {
            event: "click",
            data: "",
            selecter: ".ns-tab-item",
            back: ""
        },
        container: ".ns-tab"
    };

    Obj.fn = Obj.prototype;

    /*Initialize*/
    Obj.fn.init = function (opts) {

        var ths = this;

        opts && this.ext(this.DEFS, Obj.DEFS);
        opts && this.ext(this.DEFS, opts);


        var $el = this.$el = $(this.DEFS.container),
            $hdls = this.handles = this.DEFS.handles;

        this.handle({
            event: $hdls.event,
            selecter: $hdls.selecter,
            data: $hdls.data,
            back: function () {

            }
        });
    };

    Obj.fn.show = function () {
        var $this    = this.container;
        var $ul      = $this.closest('ul:not(.dropdown-menu)');
        var selector = $this.data('target');

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return;

        var $previous = $ul.find('.active:last a');
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
    })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Obj.fn.activate = function (element, container, callback) {
        var $active    = container.find('> .active')
        var transition = callback
            && $.support.transition
            && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next()

        $active.removeClass('in')
    }



    /*Event*/
    Obj.fn.handle = function (json) {
        var ths = this;
        $(document).on(
            json.event,
            json.selecter, /*ns-menu-a*/
            json.data,
            function (e) {

                console.log(this)


                json.back.apply(ths);
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
    Obj.fn.handlefuntrans = function () {
        var ths = this,
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
    Obj.fn.handlefun = function () {
        var ths = this,
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
            var itemProps = ths.props($item),
                mainProps = ths.props($main);
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
    Obj.fn.props = function ($el) {
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
    Obj.fn.ext = function (o, s) {
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



    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tab

    $.fn.tab             = Plugin
    $.fn.tab.Constructor = Obj


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)



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
}(jQuery));