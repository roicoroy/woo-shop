"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8308],{8308:(y,d,a)=>{a.r(d),a.d(d,{DeviceWeb:()=>w});var n=a(8239),v=a(6352);class w extends v.Uw{getId(){var e=this;return(0,n.Z)(function*(){return{identifier:e.getUid()}})()}getInfo(){var e=this;return(0,n.Z)(function*(){if(typeof navigator>"u"||!navigator.userAgent)throw e.unavailable("Device API not available in this browser");const t=navigator.userAgent,s=e.parseUa(t);return{model:s.model,platform:"web",operatingSystem:s.operatingSystem,osVersion:s.osVersion,manufacturer:navigator.vendor,isVirtual:!1,webViewVersion:s.browserVersion}})()}getBatteryInfo(){var e=this;return(0,n.Z)(function*(){if(typeof navigator>"u"||!navigator.getBattery)throw e.unavailable("Device API not available in this browser");let t={};try{t=yield navigator.getBattery()}catch{}return{batteryLevel:t.level,isCharging:t.charging}})()}getLanguageCode(){return(0,n.Z)(function*(){return{value:navigator.language.split("-")[0].toLowerCase()}})()}getLanguageTag(){return(0,n.Z)(function*(){return{value:navigator.language}})()}parseUa(e){const t={},s=e.indexOf("(")+1;let c=e.indexOf(") AppleWebKit");-1!==e.indexOf(") Gecko")&&(c=e.indexOf(") Gecko"));const o=e.substring(s,c);if(-1!==e.indexOf("Android")){const i=o.replace("; wv","").split("; ").pop();i&&(t.model=i.split(" Build")[0]),t.osVersion=o.split("; ")[1]}else if(t.model=o.split("; ")[0],typeof navigator<"u"&&navigator.oscpu)t.osVersion=navigator.oscpu;else if(-1!==e.indexOf("Windows"))t.osVersion=o;else{const i=o.split("; ").pop();if(i){const r=i.replace(" like Mac OS X","").split(" ");t.osVersion=r[r.length-1].replace(/_/g,".")}}t.operatingSystem=/android/i.test(e)?"android":/iPad|iPhone|iPod/.test(e)&&!window.MSStream?"ios":/Win/.test(e)?"windows":/Mac/i.test(e)?"mac":"unknown";const f=!!window.ApplePaySession,h=!!window.chrome,m=/Firefox/.test(e),g=/Edg/.test(e),p=/FxiOS/.test(e),u=/CriOS/.test(e),x=/EdgiOS/.test(e);if(f||h&&!g||p||u||x){let i;i=p?"FxiOS":u?"CriOS":x?"EdgiOS":f?"Version":"Chrome";const r=e.split(" ");for(const l of r)if(l.includes(i)){const S=l.split("/")[1];t.browserVersion=S}}else if(m||g){const l=e.split("").reverse().join("").split("/")[0].split("").reverse().join("");t.browserVersion=l}return t}getUid(){if(typeof window<"u"&&window.localStorage){let e=window.localStorage.getItem("_capuid");return e||(e=this.uuid4(),window.localStorage.setItem("_capuid",e),e)}return this.uuid4()}uuid4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})}}}}]);