// ==UserScript==
// @name        NoLeproReplacements
// @namespace   Hemml
// @description Removes all autoreplacements
// @include     https://*.leprosorium.ru/*
// @include     https://leprosorium.ru/*
// @version     1
// @grant       none
// ==/UserScript==

const NLRP_fn=()=>{
  let uid=document.cookie.match(/uid=([^;]+)(;|$)/)[1];
  let sid=document.cookie.match(/sid=([^;]+)(;|$)/)[1];
  for(let ta of document.getElementsByTagName("textarea")) {
    if(ta.NLRP_has_event) continue;
    ta.NLRP_has_event=true;
    let tim=undefined;
    ta.addEventListener("input",(ev)=>{
      let f=(txt)=>{
        fetch("https://leprosorium.ru/api/replacements/",{
          credentials: "include",
          headers: {
            "Accept":"*/*",
            "Content-Type":"application/json",
            "X-Futuware-UID":uid,
            "X-Futuware-SID":sid
          }
        })
        .then((res)=>{return res.json();})
        .then((res)=>{
          let nt=txt;
          if(ta.value==txt) {
            for(let r of res.replacements) {
              if(r.rating>=0) {
                let rt1=r.old[0].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                let rt2=r.old.substr(1).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                nt=nt.replace(new RegExp("("+rt1+")("+rt2+")",'ig'),"$1<b></b>$2");
              }
            }
            if(nt!=txt) ta.value=nt;
          }
        });
      };
      if(tim!=undefined) clearTimeout(tim);
      tim=setTimeout(()=>{f(ta.value);},300);
    });
  }
};

const NLRP_obs=new MutationObserver((mut)=>{
  NLRP_fn();
});
NLRP_obs.observe(document.body,{childList:true,subtree:true});

window.addEventListener("load",(ev)=>{
  NLRP_fn();
});

