!function(){"use strict";var e,a=function(e){var a=navigator.appCodeName;try{var s=e.indexOf("Mobile;");if(-1!=s){var t=e.substring(s+8),i=t.indexOf(")");""!=(t=t.substring(0,i))&&(a=t)}}catch(e){}var r="1.0";try{if(e.indexOf("KAIOS/")>-1)r=e.substring(e.indexOf("KAIOS/"));else if(e.indexOf("Firefox/")>-1)r=e.substring(e.indexOf("Firefox/"));else if(e.indexOf("Gecko/")>-1)r=e.substring(e.indexOf("Gecko/"));else if(e.indexOf("rv:")>-1){var n=e.indexOf("rv:");if(-1!=n){var d=e.substring(n),o=d.indexOf(")");""!=(d=d.substring(0,o))&&(r=d)}}}catch(e){}return{deviceModel:a,systemVersion:r,appVersion:"1.0.0"}}(navigator.userAgent),s=idb.openDB("telekram",5,{upgrade:(e,a,s)=>{["profilePhotos","chatPreferences","mediaAttachments","offlineWebpages","appPreferences"].forEach((a=>{e.objectStoreNames.contains(a)||e.createObjectStore(a)}))}}),t={},i=[],r=[],n=[],d=!1;function o(){if(!(r.length<=0)){var a=r[0];i.push(a.fileId);var n,d=a.fileId;e.getMessages(t[a.chatId].entity,{limit:1,ids:a.messageId}).then((a=>e.downloadMedia(a[0].media,{progressCallback:(e,a)=>{self.postMessage({type:1,hash:d,progress:{received:e.toJSNumber(),total:a.toJSNumber()}})}}))).then((e=>(n=e,s))).then((e=>e.put("mediaAttachments",n,a.fileId))).then((e=>{self.postMessage({type:1,hash:d,done:e})})).catch((e=>{self.postMessage({type:1,hash:d,error:e})})).finally((()=>{i.splice(i.indexOf(a.fileId),1),setTimeout((()=>{r.splice(0,1),o()}),1500)}))}}function p(){if(!1===d||!1===e.connected&&n.length>0)setTimeout((()=>{p()}),3e3);else if(!(n.length<=0)){var a=n[0];e.downloadProfilePhoto(telegram.helpers.returnBigInt(a.chatId),{isBig:!0}).then((e=>{self.postMessage({type:2,hash:a,result:e})})).catch((s=>{a.origin&&t[a.origin.chatId]?e.getMessages(t[a.origin.chatId],{ids:[a.origin.messageId]}).then((a=>e.downloadProfilePhoto(a[0].sender))).then((e=>{self.postMessage({type:2,hash:a,result:e})})).catch((e=>{self.postMessage({type:-1,params:e})})).finally((()=>{setTimeout((()=>{n.splice(0,1),p()}),1500)})):(self.postMessage({type:-1,params:s}),setTimeout((()=>{n.splice(0,1),p()}),1500))}))}}self.onmessage=s=>{switch(s.data.type){case-100:e.disconnect().then((()=>{self.postMessage({type:-100,params:{}})})).catch((e=>{self.postMessage({type:-1,params:e})}));break;case 0:var l=new telegram.sessions.MemorySession;s.data.params&&(l.setDC(s.data.params.dcId,s.data.params.serverAddress,s.data.params.port),s.data.params.authKey&&l.setAuthKey(new telegram.AuthKey(s.data.params.authKey._key,s.data.params.authKey._hash),s.data.params.dcId)),(e=new telegram.TelegramClient(l,parseInt("YOUR_APP_ID"),"YOUR_APP_HASH",{maxConcurrentDownloads:1,deviceModel:a.deviceModel,systemVersion:a.systemVersion,appVersion:a.appVersion})).addEventHandler((e=>{})),e.connect().then((()=>{e.getDialogs({offsetPeer:new telegram.Api.InputPeerSelf,limit:100,excludePinned:!0,folderId:0}).then((e=>{for(var a in e)if(e[a].id&&e[a].id.value){var s=e[a].id.value.toString();t[s]=e[a]}})).catch((e=>{self.postMessage({type:-1,params:e})})).finally((()=>{d=!0})),self.postMessage({type:0,params:{}})})).catch((e=>{self.postMessage({type:-1,params:e})}));break;case 1:t[s.data.params.chatId]&&-1===i.indexOf(s.data.params.fileId)?(self.postMessage({type:1,hash:s.data.params.fileId,init:1}),r.push(s.data.params),1===r.length&&o()):i.indexOf(s.data.params.fileId)>-1?self.postMessage({type:1,hash:s.data.params.fileId,init:1}):self.postMessage({type:1,hash:s.data.params.fileId,init:-1});break;case 2:n.push(s.data.params),1===n.length&&p()}}}();
