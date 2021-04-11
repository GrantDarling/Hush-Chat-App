(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{54:function(e,t,c){},55:function(e,t,c){},93:function(e,t,c){"use strict";c.r(t);var a=c(2),n=c.n(a),s=c(47),o=c.n(s),r=(c(54),c(55),c(10)),i=c(4),l=c.p+"static/media/hush_logo.1eaab3f2.png",j=c(0),m=function(){return Object(j.jsxs)("nav",{className:"Navbar",children:[Object(j.jsx)(r.b,{exact:!0,to:"/",children:Object(j.jsx)("img",{className:"logo",src:l,alt:"Logo"})}),Object(j.jsxs)("div",{className:"links-container",children:[Object(j.jsxs)("div",{className:"links",children:[Object(j.jsx)(r.b,{exact:!0,to:"/",children:"HOME"}),Object(j.jsx)("span",{children:" | "}),Object(j.jsx)(r.b,{exact:!0,to:"/lobby",children:"LOBBY"}),Object(j.jsx)("span",{children:" | "}),Object(j.jsx)(r.b,{exact:!0,to:{pathname:"/room",state:{clickedNewRoom:"true"}},children:" NEW ROOM"})]}),Object(j.jsx)("div",{className:"tagline",children:"the only chat app that doesn't care enough to track you."})]})]})},b=function(){return Object(j.jsxs)("section",{className:"Landing",children:[Object(j.jsx)("h1",{children:"Hush."}),Object(j.jsx)("p",{children:"Video | Voice | Messenger"})]})},h=c(3),d=function(e){var t=e.children,c=e.toggleModal,a=e.isOpen;return Object(j.jsx)("section",{className:a?"modal-backdrop":"display-none",children:Object(j.jsxs)("div",{className:"modal",children:[Object(j.jsx)("div",{className:"modal-header"}),Object(j.jsx)(r.b,{to:"/",className:"modal-button",onClick:c}),t,Object(j.jsx)("div",{className:"modal-footer"})]})})},u=c(5),O=function(e,t,c){return[function(a){a.preventDefault(),e(),t(Object(u.a)(Object(u.a)({},c),{},{isCreated:!0}))}]},x=function(e){var t=e.onChange,c=e.toggleModal,a=e.setRoom,n=e.room,s=O(c,a,n),o=Object(h.a)(s,1)[0];return Object(j.jsxs)("div",{className:"modal-child",children:[Object(j.jsx)("h1",{children:"CREATE ROOM"}),Object(j.jsxs)("form",{onSubmit:o,children:[Object(j.jsx)("label",{htmlFor:"name",children:"Room Name:"}),Object(j.jsx)("input",{type:"text",placeholder:"Room Name",name:"name",value:n.name,onChange:t,required:!0}),Object(j.jsx)("label",{htmlFor:"host",children:"Username:"}),Object(j.jsx)("input",{type:"text",placeholder:"Username",name:"host","target-child":"name",value:n.host.name,onChange:t,required:!0}),Object(j.jsx)("button",{type:"submit",name:"submit",children:"CREATE"})]})]})},f=c.p+"static/media/user-placeholder1.1a3fcc6d.png",g=c.p+"static/media/user-placeholder2.11d001cc.png",p=c(19),v=function(){return[function(e,t){return e=document.createElement(e),t&&(e.className=t.className||"",e.innerHTML=t.innerHTML||""),e}]},N=function(){var e=v(),t=Object(h.a)(e,1)[0];return[function(e,c,a,n){if(null!==c){var s=document.getElementById("chat"),o=t("div",{className:"".concat(a)}),r=t("h3",{innerHTML:"".concat(e)}),i=t("p",{innerHTML:"".concat(c)});o.appendChild(r),o.appendChild(i),s.appendChild(o),s.scrollTop=s.scrollHeight-s.clientHeight}}]},k=function(){var e=Object(a.useState)(!1),t=Object(h.a)(e,2),c=t[0],n=t[1];return[c,function(e){switch(e){case"open":n(!0);break;case"close":n(!1);break;default:n(!c)}}]};var w=function(e,t,c,n,s){var o=Object(a.useState)(!1),r=Object(h.a)(o,2),i=r[0],l=r[1],j=Object(a.useCallback)((function(){e.on("broadcast room state",(function(e){n(Object(u.a)(Object(u.a)({},s),{},{name:e.name,host:{name:e.host,allowVideo:e.allowVideo},guest:{name:e.other,allowVideo:e.allowOtherVideo}}))}))}),[n,s,e]);Object(a.useEffect)((function(){t.clickedNewRoom&&!i&&(e.emit("close all rooms by client id"),c("open"),j(),l(!0))}),[e,t,i,c,j])};var C=function(e,t,c,n){Object(a.useEffect)((function(){n&&(e.emit("create room",t.name,t.host.name,t.host.allowVideo),e.emit("join room",t.name),c(Object(u.a)(Object(u.a)({},t),{},{isCreated:!1})))}),[n,e,t,c])};var y=function(e,t,c,n){var s=Object(a.useState)(!1),o=Object(h.a)(s,2),r=o[0],i=o[1],l=Object(a.useCallback)((function(e){n(Object(u.a)(Object(u.a)({},c),{},{name:e.name,host:{name:e.other,allowVideo:e.allowOtherVideo},guest:{name:e.host,allowVideo:e.allowVideo},isCreated:!1,isHost:!1,hasJoined:!0}))}),[n,c]);Object(a.useEffect)((function(){t.hasJoined&&!r&&(l(t),e.emit("join room",t.name),e.emit("broadcast room state",t.name,t),i(!0))}),[l,e,t,r])};var M=function(e,t,c,n){var s=c.setURL,o=c.isHost;Object(a.useEffect)((function(){return function(){var a=window.location.href;return a!==s&&o?(t.clickedNewRoom="true",e.emit("close room",c.name),e.emit("message","".concat(c.host.name," left the chat. Room closed..."),c.name,"","message-general",!0),n({})):a!==s?(e.emit("message","".concat(c.host.name," left the chat."),c.name,"","message-general",!0),e.emit("leave all rooms"),n({})):void 0}}),[e,c,t,o,s,n])},R=function(e,t){var c=k(),n=Object(h.a)(c,2),s=n[0],o=n[1],r=N(),i=Object(h.a)(r,1)[0],l=Object(a.useState)({name:"",host:{name:"",allowVideo:""},guest:{name:"",allowVideo:""},chatMessage:"",isCreated:!1,isHost:!0,setURL:window.location.href}),j=Object(h.a)(l,2),m=j[0],b=j[1],d=m.isCreated,O=m.chatMessage;return w(e,t,o,b,m),C(e,m,b,d),y(e,t,m,b),M(e,t,m,b),[function(e){return"host"===e.target.name?b(Object(u.a)(Object(u.a)({},m),{},Object(p.a)({},e.target.name,Object(u.a)(Object(u.a)({},m.host),{},Object(p.a)({},e.target.getAttribute("target-child"),e.target.value))))):b(Object(u.a)(Object(u.a)({},m),{},Object(p.a)({},e.target.name,e.target.value)))},function(t){t.preventDefault(),i(m.host.name,O,"message-host",!1),e.emit("message",O,m.name,m.host.name,"message-guest",!0),b(Object(u.a)(Object(u.a)({},m),{},{chatMessage:""}))},m,b,s,o]},E=function(e){var t=e.state,c=e.socket,a=R(c,t),n=Object(h.a)(a,6),s=n[0],o=n[1],r=n[2],i=n[3],l=n[4],m=n[5],b=r.chatMessage;return Object(j.jsxs)("section",{className:"Room",children:[Object(j.jsxs)("h3",{className:"Room-name",children:["Chatroom: ",r.name]}),Object(j.jsx)("section",{className:"select",children:Object(j.jsx)("select",{id:"videoSource"})}),Object(j.jsxs)("div",{className:"chatbox",children:[Object(j.jsxs)("div",{className:"chat",children:[Object(j.jsx)("div",{className:"messages",id:"chat",children:Object(j.jsxs)("ul",{className:"message-emit",children:[Object(j.jsx)("li",{children:r.name?"'".concat(r.name,"' group created..."):""}),Object(j.jsx)("li",{children:r.host.name?"".concat(r.host.name," has entered the chat."):""}),Object(j.jsx)("li",{children:r.guest.name?"".concat(r.guest.name," has entered the chat."):""})]})}),Object(j.jsxs)("form",{className:"input-controller",onSubmit:o,children:[Object(j.jsx)("input",{type:"text",id:"message-input",name:"chatMessage",value:b,onChange:s}),Object(j.jsx)("button",{type:"submit",children:"SEND"})]})]}),Object(j.jsxs)("div",{className:"videos",children:[Object(j.jsxs)("div",{className:"host",children:[Object(j.jsx)("h4",{className:"username",children:r.host.name?"@".concat(r.host.name):""}),Object(j.jsx)("img",{src:f,alt:"Host Placeholder",className:""})]}),Object(j.jsxs)("div",{className:"guest",children:[Object(j.jsx)("h4",{className:"username",children:r.guest.name?"@".concat(r.guest.name):"waiting for guest..."}),Object(j.jsx)("img",{src:g,alt:"Guest Placeholder",className:""})]})]}),Object(j.jsx)(d,{isOpen:l,children:Object(j.jsx)(x,{socket:c,onChange:s,toggleModal:m,room:r,setRoom:i})})]})]})},V=function(e,t){var c=Object(a.useState)(!1),n=Object(h.a)(c,2),s=n[0],o=n[1],r=Object(a.useState)(""),i=Object(h.a)(r,2),l=i[0],j=i[1];return[function(e){e.preventDefault(),o(!0)},function(e){return j(e.target.value)},s,l]},S=function(e){var t=e.room,c=e.lobby,a=V(t,c),n=Object(h.a)(a,5),s=n[0],o=n[1],r=n[2],l=n[3],m=n[4];return Object(j.jsxs)("div",{className:"modal-child",children:[Object(j.jsx)("h1",{children:"JOIN ROOM"}),Object(j.jsxs)("form",{onSubmit:s,children:[Object(j.jsx)("label",{htmlFor:"username",children:"Username: "}),Object(j.jsx)("input",{type:"text",placeholder:"Username",name:"other",value:l,onChange:o,required:!0}),Object(j.jsx)("button",{type:"submit",name:"submit",children:"JOIN"})]}),r?Object(j.jsx)(i.a,{exact:!0,to:{pathname:"/room",state:{name:t.name,host:t.host.name,allowVideo:t.host.allowVideo,other:l,allowOtherVideo:m,hasJoined:!0}}}):""]})};var H=function(e){var t=Object(a.useState)([]),c=Object(h.a)(t,2),n=c[0],s=c[1];return Object(a.useEffect)((function(){return e.on("get rooms",(function(e){return s(e)})),e.emit("get rooms"),function(){s({})}}),[e]),n},L=function(e){var t=k(),c=Object(h.a)(t,2),n=c[0],s=c[1],o=Object(a.useState)({}),r=Object(h.a)(o,2),i=r[0],l=r[1];return[function(e){l(e),s()},H(e),i,n,s]},J=function(e){var t=e.socket,c=L(t),a=Object(h.a)(c,5),n=a[0],s=a[1],o=a[2],r=a[3],i=a[4];return Object(j.jsx)("section",{className:"Lobby",children:Object(j.jsxs)("div",{className:"chatrooms",children:[s.length>0?s.map((function(e){return Object(j.jsxs)("div",{className:e.users.length<2?"chatroom":"chatroom--locked",children:[Object(j.jsxs)("div",{className:"details-container",children:[Object(j.jsxs)("h3",{children:[Object(j.jsx)("small",{children:"Room Name: "}),e.name]}),Object(j.jsxs)("h3",{children:[Object(j.jsx)("small",{children:"Host: "}),e.host.name]}),e.users.length<2?Object(j.jsxs)("h4",{children:["Capacity: ",e.users.length,"/2"]}):Object(j.jsx)("div",{className:"join",children:"FULL"})]}),e.users.length<2?Object(j.jsx)("button",{className:"join",onClick:function(){return n(e)},children:"JOIN"}):""]},e.name)})):Object(j.jsx)("div",{className:"chatrooms--none",children:Object(j.jsx)("h1",{children:"Currently no chatrooms available."})}),Object(j.jsx)(d,{isOpen:r,toggleModal:i,children:Object(j.jsx)(S,{room:o,lobby:s})})]})})},T=function(e){var t=e.socket,c=e.location;return Object(j.jsx)("section",{className:"container",children:Object(j.jsxs)(i.d,{socket:t,children:[Object(j.jsx)(i.b,{exact:!0,path:"/",component:b}),Object(j.jsx)(i.b,{exact:!0,path:"/room",component:function(){return Object(j.jsx)(E,{socket:t,state:c.state})}}),Object(j.jsx)(i.b,{exact:!0,path:"/lobby",component:function(){return Object(j.jsx)(J,{socket:t,state:c.state})}})]})})},U=c(49);var I=function(e){var t=N(),c=Object(h.a)(t,1)[0],n=Object(a.useState)(!1),s=Object(h.a)(n,2),o=s[0],r=s[1];Object(a.useEffect)((function(){o||(e.on("message",(function(e,t,a,n){c(e,t,a,n)})),r(!0))}),[e,c,o])},B=c.n(U).a.connect("hush-chat-app"),D=function(){return I(B),Object(j.jsxs)(r.a,{children:[Object(j.jsx)(m,{}),Object(j.jsx)(i.d,{children:Object(j.jsx)(T,{socket:B})})]})};o.a.render(Object(j.jsx)(n.a.StrictMode,{children:Object(j.jsx)(D,{})}),document.getElementById("root"))}},[[93,1,2]]]);
//# sourceMappingURL=main.3aa6ed74.chunk.js.map