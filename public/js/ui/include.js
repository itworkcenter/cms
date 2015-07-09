function include(json){
    /*{type:link,target:current script}*/
    var dom=document,
        c =json.target||dom.getElementsByTagName("script"),
        l = dom.createElement("link"),cs=dom.createElement("script");
    c = c[c.length-1];l.rel = "stylesheet";l.href=json.href;cs.src=json.href;
    var swtch={
        link:l,
        script:cs
    };
    if(swtch[json.type]){
        c.parentNode.insertBefore(swtch[json.type],c);
    }
}

