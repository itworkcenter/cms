include({type:"link",href:"/js/ui/popMenu/popMenu.css"});

$.fn.popMenu=function(json){
    return $(this).each(function(){
        var $popMenu = $(this);
        var popObj={
            init:function(){
                this.json=json;
                $popMenu.append(this.subMenu(json));
                this.style();
                this.event();
            },
            subMenu:function(json){
                var subMenuStr="<div class='pop-menu'>";
                if(json){
                    for(var i=0;i<json.data.length;i++){
                        subMenuStr += this.option({data:json.data[i]});
                    }
                }
                subMenuStr+="</div>";
                this.$subMenu=$(subMenuStr);
                return this.$subMenu;
            },
            option:function(json){
                return "<div class='pop-menu-opt'>"+json.data+"</div>\r";
            },
            event:function(){
                var $this = this;
                $popMenu.mouseover(function(){
                    $this.$subMenu.show();

                }).mouseout(function(){
                    $this.$subMenu.hide();
                })
            },
            style:function(){
                var $this= this;
                setTimeout(function(){
                    var popM={
                        top:$popMenu.offset().top+$popMenu.height(),
                        left:$popMenu.offset().left
                    };
                    $this.$subMenu.css({top:+popM.top+"px"});

                    var allWidth = $popMenu.parent().width(),
                        subleft=popM.left+$this.$subMenu.width();

                    if(subleft>=allWidth){
                        $this.$subMenu.css({left:"-"+(subleft-allWidth)+"px"});
                    }
                },300);

            }
        };

        popObj.init();
    });


};