import{s as Rt,f as k,l as $t,a as V,e as dt,g as L,h as z,A as J,m as te,d as _,c as P,j as T,i as H,x,y as Ht,o as he,n as We,B as $,C as en,D as Gt,E as Lt,F as Jt,G as Yt,p as nn,r as ge,u as ve,v as pe,w as ye,H as on,I as sn,J as rn,k as Ae}from"../chunks/scheduler.b62641ca.js";import{S as St,i as It,g as ee,t as F,c as ne,a as D,f as tt,b as pt,d as yt,m as bt,e as wt}from"../chunks/index.91daa77f.js";import{f as Ut,t as ln,g as qe,a as je,b as ft,T as an}from"../chunks/TopBanner.b7ca72bd.js";import{F as cn,M as fn}from"../chunks/MedicalDisclaimer.d621663c.js";import"../chunks/singletons.ad51fe39.js";function De(e){let t,n,o,s;return{c(){t=k("div"),n=k("h1"),o=$t(e[1]),this.h()},l(i){t=L(i,"DIV",{class:!0});var r=z(t);n=L(r,"H1",{class:!0});var l=z(n);o=te(l,e[1]),l.forEach(_),r.forEach(_),this.h()},h(){T(n,"class","highlighted-word svelte-1ww5z53"),T(t,"class","half svelte-1ww5z53")},m(i,r){H(i,t,r),x(t,n),x(n,o)},p(i,r){r&2&&We(o,i[1])},i(i){s||$(()=>{s=tt(n,Ut,{y:-25,delay:0}),s.start()})},o:Ht,d(i){i&&_(t)}}}function Re(e){let t,n,o='<div class="inline">Get <span class="bold svelte-1ww5z53">insights</span> based on your <span class="bold svelte-1ww5z53">conditions &amp; medications</span></div>',s;return{c(){t=k("div"),n=k("h2"),n.innerHTML=o,this.h()},l(i){t=L(i,"DIV",{class:!0});var r=z(t);n=L(r,"H2",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-uxcmxc"&&(n.innerHTML=o),r.forEach(_),this.h()},h(){T(n,"class","svelte-1ww5z53"),T(t,"class","sub-heading text-center svelte-1ww5z53")},m(i,r){H(i,t,r),x(t,n)},i(i){s||$(()=>{s=tt(n,Ut,{y:100,delay:50,duration:1e3}),s.start()})},o:Ht,d(i){i&&_(t)}}}function un(e){let t,n,o='<h1 class="fixed-word svelte-1ww5z53">Your</h1>',s,i=e[1],r,l,a=De(e),c=e[0]&&Re();return{c(){t=k("div"),n=k("div"),n.innerHTML=o,s=$t(`
    
  `),a.c(),r=V(),c&&c.c(),l=dt(),this.h()},l(u){t=L(u,"DIV",{class:!0});var f=z(t);n=L(f,"DIV",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-1a73zgs"&&(n.innerHTML=o),s=te(f,`
    
  `),a.l(f),f.forEach(_),r=P(u),c&&c.l(u),l=dt(),this.h()},h(){T(n,"class","half svelte-1ww5z53"),T(t,"class","rotating-text svelte-1ww5z53")},m(u,f){H(u,t,f),x(t,n),x(t,s),a.m(t,null),H(u,r,f),c&&c.m(u,f),H(u,l,f)},p(u,[f]){f&2&&Rt(i,i=u[1])?(ee(),F(a,1,1,Ht),ne(),a=De(u),a.c(),D(a,1),a.m(t,null)):a.p(u,f),u[0]?c?f&1&&D(c,1):(c=Re(),c.c(),D(c,1),c.m(l.parentNode,l)):c&&(c.d(1),c=null)},i(u){D(a),D(c)},o(u){F(a)},d(u){u&&(_(t),_(r),_(l)),a.d(u),c&&c.d(u)}}}const dn=2e3;function mn(e,t,n){let o=!1;he(()=>n(0,o=!0));const s=[" Health."," Medication.","Journey.","Insight."];let i=0,r=s[i];return setInterval(()=>{i=(i+1)%s.length,n(1,r=s[i])},dn),[o,r]}class hn extends St{constructor(t){super(),It(this,t,mn,un,Rt,{})}}const At=Math.min,_t=Math.max,Kt=Math.round,Xt=Math.floor,mt=e=>({x:e,y:e}),gn={left:"right",right:"left",bottom:"top",top:"bottom"},vn={start:"end",end:"start"};function de(e,t,n){return _t(e,At(t,n))}function Vt(e,t){return typeof e=="function"?e(t):e}function xt(e){return e.split("-")[0]}function Pt(e){return e.split("-")[1]}function Ye(e){return e==="x"?"y":"x"}function be(e){return e==="y"?"height":"width"}function ie(e){return["top","bottom"].includes(xt(e))?"y":"x"}function we(e){return Ye(ie(e))}function pn(e,t,n){n===void 0&&(n=!1);const o=Pt(e),s=we(e),i=be(s);let r=s==="x"?o===(n?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(r=Qt(r)),[r,Qt(r)]}function yn(e){const t=Qt(e);return[me(e),t,me(t)]}function me(e){return e.replace(/start|end/g,t=>vn[t])}function bn(e,t,n){const o=["left","right"],s=["right","left"],i=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return n?t?s:o:t?o:s;case"left":case"right":return t?i:r;default:return[]}}function wn(e,t,n,o){const s=Pt(e);let i=bn(xt(e),n==="start",o);return s&&(i=i.map(r=>r+"-"+s),t&&(i=i.concat(i.map(me)))),i}function Qt(e){return e.replace(/left|right|bottom|top/g,t=>gn[t])}function _n(e){return{top:0,right:0,bottom:0,left:0,...e}}function Xe(e){return typeof e!="number"?_n(e):{top:e,right:e,bottom:e,left:e}}function Zt(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function Oe(e,t,n){let{reference:o,floating:s}=e;const i=ie(t),r=we(t),l=be(r),a=xt(t),c=i==="y",u=o.x+o.width/2-s.width/2,f=o.y+o.height/2-s.height/2,g=o[l]/2-s[l]/2;let d;switch(a){case"top":d={x:u,y:o.y-s.height};break;case"bottom":d={x:u,y:o.y+o.height};break;case"right":d={x:o.x+o.width,y:f};break;case"left":d={x:o.x-s.width,y:f};break;default:d={x:o.x,y:o.y}}switch(Pt(t)){case"start":d[r]-=g*(n&&c?-1:1);break;case"end":d[r]+=g*(n&&c?-1:1);break}return d}const xn=async(e,t,n)=>{const{placement:o="bottom",strategy:s="absolute",middleware:i=[],platform:r}=n,l=i.filter(Boolean),a=await(r.isRTL==null?void 0:r.isRTL(t));let c=await r.getElementRects({reference:e,floating:t,strategy:s}),{x:u,y:f}=Oe(c,o,a),g=o,d={},h=0;for(let v=0;v<l.length;v++){const{name:b,fn:w}=l[v],{x:E,y:p,data:C,reset:y}=await w({x:u,y:f,initialPlacement:o,placement:g,strategy:s,middlewareData:d,rects:c,platform:r,elements:{reference:e,floating:t}});if(u=E??u,f=p??f,d={...d,[b]:{...d[b],...C}},y&&h<=50){h++,typeof y=="object"&&(y.placement&&(g=y.placement),y.rects&&(c=y.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:s}):y.rects),{x:u,y:f}=Oe(c,g,a)),v=-1;continue}}return{x:u,y:f,placement:g,strategy:s,middlewareData:d}};async function Ge(e,t){var n;t===void 0&&(t={});const{x:o,y:s,platform:i,rects:r,elements:l,strategy:a}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:f="floating",altBoundary:g=!1,padding:d=0}=Vt(t,e),h=Xe(d),b=l[g?f==="floating"?"reference":"floating":f],w=Zt(await i.getClippingRect({element:(n=await(i.isElement==null?void 0:i.isElement(b)))==null||n?b:b.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(l.floating)),boundary:c,rootBoundary:u,strategy:a})),E=f==="floating"?{...r.floating,x:o,y:s}:r.reference,p=await(i.getOffsetParent==null?void 0:i.getOffsetParent(l.floating)),C=await(i.isElement==null?void 0:i.isElement(p))?await(i.getScale==null?void 0:i.getScale(p))||{x:1,y:1}:{x:1,y:1},y=Zt(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({rect:E,offsetParent:p,strategy:a}):E);return{top:(w.top-y.top+h.top)/C.y,bottom:(y.bottom-w.bottom+h.bottom)/C.y,left:(w.left-y.left+h.left)/C.x,right:(y.right-w.right+h.right)/C.x}}const En=e=>({name:"arrow",options:e,async fn(t){const{x:n,y:o,placement:s,rects:i,platform:r,elements:l,middlewareData:a}=t,{element:c,padding:u=0}=Vt(e,t)||{};if(c==null)return{};const f=Xe(u),g={x:n,y:o},d=we(s),h=be(d),v=await r.getDimensions(c),b=d==="y",w=b?"top":"left",E=b?"bottom":"right",p=b?"clientHeight":"clientWidth",C=i.reference[h]+i.reference[d]-g[d]-i.floating[h],y=g[d]-i.reference[d],S=await(r.getOffsetParent==null?void 0:r.getOffsetParent(c));let R=S?S[p]:0;(!R||!await(r.isElement==null?void 0:r.isElement(S)))&&(R=l.floating[p]||i.floating[h]);const X=C/2-y/2,N=R/2-v[h]/2-1,U=At(f[w],N),nt=At(f[E],N),B=U,I=R-v[h]-nt,A=R/2-v[h]/2+X,O=de(B,A,I),W=!a.arrow&&Pt(s)!=null&&A!=O&&i.reference[h]/2-(A<B?U:nt)-v[h]/2<0,q=W?A<B?A-B:A-I:0;return{[d]:g[d]+q,data:{[d]:O,centerOffset:A-O-q,...W&&{alignmentOffset:q}},reset:W}}}),Cn=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var n,o;const{placement:s,middlewareData:i,rects:r,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:u=!0,crossAxis:f=!0,fallbackPlacements:g,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:v=!0,...b}=Vt(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};const w=xt(s),E=xt(l)===l,p=await(a.isRTL==null?void 0:a.isRTL(c.floating)),C=g||(E||!v?[Qt(l)]:yn(l));!g&&h!=="none"&&C.push(...wn(l,v,h,p));const y=[l,...C],S=await Ge(t,b),R=[];let X=((o=i.flip)==null?void 0:o.overflows)||[];if(u&&R.push(S[w]),f){const B=pn(s,r,p);R.push(S[B[0]],S[B[1]])}if(X=[...X,{placement:s,overflows:R}],!R.every(B=>B<=0)){var N,U;const B=(((N=i.flip)==null?void 0:N.index)||0)+1,I=y[B];if(I)return{data:{index:B,overflows:X},reset:{placement:I}};let A=(U=X.filter(O=>O.overflows[0]<=0).sort((O,W)=>O.overflows[1]-W.overflows[1])[0])==null?void 0:U.placement;if(!A)switch(d){case"bestFit":{var nt;const O=(nt=X.map(W=>[W.placement,W.overflows.filter(q=>q>0).reduce((q,K)=>q+K,0)]).sort((W,q)=>W[1]-q[1])[0])==null?void 0:nt[0];O&&(A=O);break}case"initialPlacement":A=l;break}if(s!==A)return{reset:{placement:A}}}return{}}}};async function Tn(e,t){const{placement:n,platform:o,elements:s}=e,i=await(o.isRTL==null?void 0:o.isRTL(s.floating)),r=xt(n),l=Pt(n),a=ie(n)==="y",c=["left","top"].includes(r)?-1:1,u=i&&a?-1:1,f=Vt(t,e);let{mainAxis:g,crossAxis:d,alignmentAxis:h}=typeof f=="number"?{mainAxis:f,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...f};return l&&typeof h=="number"&&(d=l==="end"?h*-1:h),a?{x:d*u,y:g*c}:{x:g*c,y:d*u}}const kn=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){const{x:n,y:o}=t,s=await Tn(t,e);return{x:n+s.x,y:o+s.y,data:s}}}},Ln=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:o,placement:s}=t,{mainAxis:i=!0,crossAxis:r=!1,limiter:l={fn:b=>{let{x:w,y:E}=b;return{x:w,y:E}}},...a}=Vt(e,t),c={x:n,y:o},u=await Ge(t,a),f=ie(xt(s)),g=Ye(f);let d=c[g],h=c[f];if(i){const b=g==="y"?"top":"left",w=g==="y"?"bottom":"right",E=d+u[b],p=d-u[w];d=de(E,d,p)}if(r){const b=f==="y"?"top":"left",w=f==="y"?"bottom":"right",E=h+u[b],p=h-u[w];h=de(E,h,p)}const v=l.fn({...t,[g]:d,[f]:h});return{...v,data:{x:v.x-n,y:v.y-o}}}}};function ht(e){return Je(e)?(e.nodeName||"").toLowerCase():"#document"}function Q(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function lt(e){var t;return(t=(Je(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Je(e){return e instanceof Node||e instanceof Q(e).Node}function rt(e){return e instanceof Element||e instanceof Q(e).Element}function st(e){return e instanceof HTMLElement||e instanceof Q(e).HTMLElement}function Me(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof Q(e).ShadowRoot}function Bt(e){const{overflow:t,overflowX:n,overflowY:o,display:s}=et(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+n)&&!["inline","contents"].includes(s)}function An(e){return["table","td","th"].includes(ht(e))}function _e(e){const t=xe(),n=et(e);return n.transform!=="none"||n.perspective!=="none"||(n.containerType?n.containerType!=="normal":!1)||!t&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!t&&(n.filter?n.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(n.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(n.contain||"").includes(o))}function Dn(e){let t=Dt(e);for(;st(t)&&!oe(t);){if(_e(t))return t;t=Dt(t)}return null}function xe(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function oe(e){return["html","body","#document"].includes(ht(e))}function et(e){return Q(e).getComputedStyle(e)}function se(e){return rt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function Dt(e){if(ht(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Me(e)&&e.host||lt(e);return Me(t)?t.host:t}function Ue(e){const t=Dt(e);return oe(t)?e.ownerDocument?e.ownerDocument.body:e.body:st(t)&&Bt(t)?t:Ue(t)}function Mt(e,t,n){var o;t===void 0&&(t=[]),n===void 0&&(n=!0);const s=Ue(e),i=s===((o=e.ownerDocument)==null?void 0:o.body),r=Q(s);return i?t.concat(r,r.visualViewport||[],Bt(s)?s:[],r.frameElement&&n?Mt(r.frameElement):[]):t.concat(s,Mt(s,[],n))}function Ke(e){const t=et(e);let n=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const s=st(e),i=s?e.offsetWidth:n,r=s?e.offsetHeight:o,l=Kt(n)!==i||Kt(o)!==r;return l&&(n=i,o=r),{width:n,height:o,$:l}}function Ee(e){return rt(e)?e:e.contextElement}function kt(e){const t=Ee(e);if(!st(t))return mt(1);const n=t.getBoundingClientRect(),{width:o,height:s,$:i}=Ke(t);let r=(i?Kt(n.width):n.width)/o,l=(i?Kt(n.height):n.height)/s;return(!r||!Number.isFinite(r))&&(r=1),(!l||!Number.isFinite(l))&&(l=1),{x:r,y:l}}const Rn=mt(0);function Qe(e){const t=Q(e);return!xe()||!t.visualViewport?Rn:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function On(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==Q(e)?!1:t}function Et(e,t,n,o){t===void 0&&(t=!1),n===void 0&&(n=!1);const s=e.getBoundingClientRect(),i=Ee(e);let r=mt(1);t&&(o?rt(o)&&(r=kt(o)):r=kt(e));const l=On(i,n,o)?Qe(i):mt(0);let a=(s.left+l.x)/r.x,c=(s.top+l.y)/r.y,u=s.width/r.x,f=s.height/r.y;if(i){const g=Q(i),d=o&&rt(o)?Q(o):o;let h=g.frameElement;for(;h&&o&&d!==g;){const v=kt(h),b=h.getBoundingClientRect(),w=et(h),E=b.left+(h.clientLeft+parseFloat(w.paddingLeft))*v.x,p=b.top+(h.clientTop+parseFloat(w.paddingTop))*v.y;a*=v.x,c*=v.y,u*=v.x,f*=v.y,a+=E,c+=p,h=Q(h).frameElement}}return Zt({width:u,height:f,x:a,y:c})}function Mn(e){let{rect:t,offsetParent:n,strategy:o}=e;const s=st(n),i=lt(n);if(n===i)return t;let r={scrollLeft:0,scrollTop:0},l=mt(1);const a=mt(0);if((s||!s&&o!=="fixed")&&((ht(n)!=="body"||Bt(i))&&(r=se(n)),st(n))){const c=Et(n);l=kt(n),a.x=c.x+n.clientLeft,a.y=c.y+n.clientTop}return{width:t.width*l.x,height:t.height*l.y,x:t.x*l.x-r.scrollLeft*l.x+a.x,y:t.y*l.y-r.scrollTop*l.y+a.y}}function Hn(e){return Array.from(e.getClientRects())}function Ze(e){return Et(lt(e)).left+se(e).scrollLeft}function Sn(e){const t=lt(e),n=se(e),o=e.ownerDocument.body,s=_t(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),i=_t(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let r=-n.scrollLeft+Ze(e);const l=-n.scrollTop;return et(o).direction==="rtl"&&(r+=_t(t.clientWidth,o.clientWidth)-s),{width:s,height:i,x:r,y:l}}function In(e,t){const n=Q(e),o=lt(e),s=n.visualViewport;let i=o.clientWidth,r=o.clientHeight,l=0,a=0;if(s){i=s.width,r=s.height;const c=xe();(!c||c&&t==="fixed")&&(l=s.offsetLeft,a=s.offsetTop)}return{width:i,height:r,x:l,y:a}}function Vn(e,t){const n=Et(e,!0,t==="fixed"),o=n.top+e.clientTop,s=n.left+e.clientLeft,i=st(e)?kt(e):mt(1),r=e.clientWidth*i.x,l=e.clientHeight*i.y,a=s*i.x,c=o*i.y;return{width:r,height:l,x:a,y:c}}function He(e,t,n){let o;if(t==="viewport")o=In(e,n);else if(t==="document")o=Sn(lt(e));else if(rt(t))o=Vn(t,n);else{const s=Qe(e);o={...t,x:t.x-s.x,y:t.y-s.y}}return Zt(o)}function $e(e,t){const n=Dt(e);return n===t||!rt(n)||oe(n)?!1:et(n).position==="fixed"||$e(n,t)}function Pn(e,t){const n=t.get(e);if(n)return n;let o=Mt(e,[],!1).filter(l=>rt(l)&&ht(l)!=="body"),s=null;const i=et(e).position==="fixed";let r=i?Dt(e):e;for(;rt(r)&&!oe(r);){const l=et(r),a=_e(r);!a&&l.position==="fixed"&&(s=null),(i?!a&&!s:!a&&l.position==="static"&&!!s&&["absolute","fixed"].includes(s.position)||Bt(r)&&!a&&$e(e,r))?o=o.filter(u=>u!==r):s=l,r=Dt(r)}return t.set(e,o),o}function Bn(e){let{element:t,boundary:n,rootBoundary:o,strategy:s}=e;const r=[...n==="clippingAncestors"?Pn(t,this._c):[].concat(n),o],l=r[0],a=r.reduce((c,u)=>{const f=He(t,u,s);return c.top=_t(f.top,c.top),c.right=At(f.right,c.right),c.bottom=At(f.bottom,c.bottom),c.left=_t(f.left,c.left),c},He(t,l,s));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function Fn(e){return Ke(e)}function Nn(e,t,n){const o=st(t),s=lt(t),i=n==="fixed",r=Et(e,!0,i,t);let l={scrollLeft:0,scrollTop:0};const a=mt(0);if(o||!o&&!i)if((ht(t)!=="body"||Bt(s))&&(l=se(t)),o){const c=Et(t,!0,i,t);a.x=c.x+t.clientLeft,a.y=c.y+t.clientTop}else s&&(a.x=Ze(s));return{x:r.left+l.scrollLeft-a.x,y:r.top+l.scrollTop-a.y,width:r.width,height:r.height}}function Se(e,t){return!st(e)||et(e).position==="fixed"?null:t?t(e):e.offsetParent}function tn(e,t){const n=Q(e);if(!st(e))return n;let o=Se(e,t);for(;o&&An(o)&&et(o).position==="static";)o=Se(o,t);return o&&(ht(o)==="html"||ht(o)==="body"&&et(o).position==="static"&&!_e(o))?n:o||Dn(e)||n}const zn=async function(e){let{reference:t,floating:n,strategy:o}=e;const s=this.getOffsetParent||tn,i=this.getDimensions;return{reference:Nn(t,await s(n),o),floating:{x:0,y:0,...await i(n)}}};function Wn(e){return et(e).direction==="rtl"}const qn={convertOffsetParentRelativeRectToViewportRelativeRect:Mn,getDocumentElement:lt,getClippingRect:Bn,getOffsetParent:tn,getElementRects:zn,getClientRects:Hn,getDimensions:Fn,getScale:kt,isElement:rt,isRTL:Wn};function jn(e,t){let n=null,o;const s=lt(e);function i(){clearTimeout(o),n&&n.disconnect(),n=null}function r(l,a){l===void 0&&(l=!1),a===void 0&&(a=1),i();const{left:c,top:u,width:f,height:g}=e.getBoundingClientRect();if(l||t(),!f||!g)return;const d=Xt(u),h=Xt(s.clientWidth-(c+f)),v=Xt(s.clientHeight-(u+g)),b=Xt(c),E={rootMargin:-d+"px "+-h+"px "+-v+"px "+-b+"px",threshold:_t(0,At(1,a))||1};let p=!0;function C(y){const S=y[0].intersectionRatio;if(S!==a){if(!p)return r();S?r(!1,S):o=setTimeout(()=>{r(!1,1e-7)},100)}p=!1}try{n=new IntersectionObserver(C,{...E,root:s.ownerDocument})}catch{n=new IntersectionObserver(C,E)}n.observe(e)}return r(!0),i}function Ie(e,t,n,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:r=typeof ResizeObserver=="function",layoutShift:l=typeof IntersectionObserver=="function",animationFrame:a=!1}=o,c=Ee(e),u=s||i?[...c?Mt(c):[],...Mt(t)]:[];u.forEach(w=>{s&&w.addEventListener("scroll",n,{passive:!0}),i&&w.addEventListener("resize",n)});const f=c&&l?jn(c,n):null;let g=-1,d=null;r&&(d=new ResizeObserver(w=>{let[E]=w;E&&E.target===c&&d&&(d.unobserve(t),cancelAnimationFrame(g),g=requestAnimationFrame(()=>{d&&d.observe(t)})),n()}),c&&!a&&d.observe(c),d.observe(t));let h,v=a?Et(e):null;a&&b();function b(){const w=Et(e);v&&(w.x!==v.x||w.y!==v.y||w.width!==v.width||w.height!==v.height)&&n(),v=w,h=requestAnimationFrame(b)}return n(),()=>{u.forEach(w=>{s&&w.removeEventListener("scroll",n),i&&w.removeEventListener("resize",n)}),f&&f(),d&&d.disconnect(),d=null,a&&cancelAnimationFrame(h)}}const Yn=(e,t,n)=>{const o=new Map,s={platform:qn,...n},i={...s.platform,_c:o};return xn(e,t,{...s,platform:i})};function Xn(){const e=en();return(t,n,o)=>{const s=e.$$.callbacks[t];if(s){const i=new CustomEvent(t,{detail:o});n.dispatchEvent(i),s.slice().forEach(r=>{r.call(e,i)})}}}function Ve(e){let t;return{c(){t=k("div")},l(n){t=L(n,"DIV",{}),z(t).forEach(_)},m(n,o){H(n,t,o),e[22](t)},p:Ht,d(n){n&&_(t),e[22](null)}}}function Pe(e){let t,n;const o=[{use:e[9]},{options:e[3]},{role:"tooltip"},{tabindex:e[1]?-1:void 0},e[11]];let s={$$slots:{default:[Gn]},$$scope:{ctx:e}};for(let i=0;i<o.length;i+=1)s=Lt(s,o[i]);return t=new cn({props:s}),t.$on("focusin",function(){Yt(ut(e[1],e[7]))&&ut(e[1],e[7]).apply(this,arguments)}),t.$on("focusout",function(){Yt(ut(e[1],e[8]))&&ut(e[1],e[8]).apply(this,arguments)}),t.$on("mouseenter",function(){Yt(ut(e[1]&&!e[4],e[7]))&&ut(e[1]&&!e[4],e[7]).apply(this,arguments)}),t.$on("mouseleave",function(){Yt(ut(e[1]&&!e[4],e[8]))&&ut(e[1]&&!e[4],e[8]).apply(this,arguments)}),{c(){pt(t.$$.fragment)},l(i){yt(t.$$.fragment,i)},m(i,r){bt(t,i,r),n=!0},p(i,r){e=i;const l=r[0]&2570?qe(o,[r[0]&512&&{use:e[9]},r[0]&8&&{options:e[3]},o[2],r[0]&2&&{tabindex:e[1]?-1:void 0},r[0]&2048&&je(e[11])]):{};r[0]&8388676&&(l.$$scope={dirty:r,ctx:e}),t.$set(l)},i(i){n||(D(t.$$.fragment,i),n=!0)},o(i){F(t.$$.fragment,i),n=!1},d(i){wt(t,i)}}}function Be(e){let t,n,o;return{c(){t=k("div"),this.h()},l(s){t=L(s,"DIV",{class:!0}),z(t).forEach(_),this.h()},h(){T(t,"class",e[6])},m(s,i){H(s,t,i),n||(o=on(e[10].call(null,t)),n=!0)},p(s,i){i[0]&64&&T(t,"class",s[6])},d(s){s&&_(t),n=!1,o()}}}function Gn(e){let t,n,o;const s=e[21].default,i=ge(s,e,e[23],null);let r=e[2]&&Be(e);return{c(){i&&i.c(),t=V(),r&&r.c(),n=dt()},l(l){i&&i.l(l),t=P(l),r&&r.l(l),n=dt()},m(l,a){i&&i.m(l,a),H(l,t,a),r&&r.m(l,a),H(l,n,a),o=!0},p(l,a){i&&i.p&&(!o||a[0]&8388608)&&ve(i,s,l,l[23],o?ye(s,l[23],a,null):pe(l[23]),null),l[2]?r?r.p(l,a):(r=Be(l),r.c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null)},i(l){o||(D(i,l),o=!0)},o(l){F(i,l),o=!1},d(l){l&&(_(t),_(n)),i&&i.d(l),r&&r.d(l)}}}function Jn(e){let t,n,o,s=!e[3]&&Ve(e),i=e[0]&&e[3]&&Pe(e);return{c(){s&&s.c(),t=V(),i&&i.c(),n=dt()},l(r){s&&s.l(r),t=P(r),i&&i.l(r),n=dt()},m(r,l){s&&s.m(r,l),H(r,t,l),i&&i.m(r,l),H(r,n,l),o=!0},p(r,l){r[3]?s&&(s.d(1),s=null):s?s.p(r,l):(s=Ve(r),s.c(),s.m(t.parentNode,t)),r[0]&&r[3]?i?(i.p(r,l),l[0]&9&&D(i,1)):(i=Pe(r),i.c(),D(i,1),i.m(n.parentNode,n)):i&&(ee(),F(i,1,1,()=>{i=null}),ne())},i(r){o||(D(i),o=!0)},o(r){F(i),o=!1},d(r){r&&(_(t),_(n)),s&&s.d(r),i&&i.d(r)}}}function ut(e,t){return e?t:()=>{}}function Un(e,t,n){const o=["activeContent","arrow","offset","placement","trigger","triggeredBy","reference","strategy","open","yOnly"];let s=Gt(t,o),{$$slots:i={},$$scope:r}=t,{activeContent:l=!1}=t,{arrow:a=!0}=t,{offset:c=8}=t,{placement:u="top"}=t,{trigger:f="hover"}=t,{triggeredBy:g=void 0}=t,{reference:d=void 0}=t,{strategy:h="absolute"}=t,{open:v=!1}=t,{yOnly:b=!1}=t;const w=Xn();let E,p,C,y,S,R=[],X=!1;const N=()=>(X=!0,setTimeout(()=>X=!1,250)),U=m=>{p===void 0&&console.error("trigger undefined"),!d&&R.includes(m.target)&&p!==m.target&&(n(3,p=m.target),N()),E&&m.type==="focusin"&&!v&&N(),n(0,v=E&&m.type==="click"&&!X?!v:!0)},nt=m=>m.matches(":hover"),B=m=>m.contains(document.activeElement),I=m=>m!=null?`${m}px`:"",A=m=>{l?setTimeout(()=>{const j=[p,C,...R].filter(Boolean);m.type==="mouseleave"&&j.some(nt)||m.type==="focusout"&&j.some(B)||n(0,v=!1)},100):n(0,v=!1)};let O;const W={left:"right",right:"left",bottom:"top",top:"bottom"};let q;function K(){Yn(p,C,{placement:u,strategy:h,middleware:q}).then(({x:m,y:j,middlewareData:G,placement:it,strategy:Z})=>{C.style.position=Z,C.style.left=b?"0":I(m),C.style.top=I(j),G.arrow&&y instanceof HTMLDivElement&&(n(19,y.style.left=I(G.arrow.x),y),n(19,y.style.top=I(G.arrow.y),y),n(20,O=W[it.split("-")[0]]),n(19,y.style[O]=I(-y.offsetWidth/2-(t.border?1:0)),y))})}function Ft(m,j){C=m;let G=Ie(j,C,K);return{update(it){G(),G=Ie(it,C,K)},destroy(){G()}}}he(()=>{const m=[["focusin",U,!0],["focusout",A,!0],["click",U,E],["mouseenter",U,!E],["mouseleave",A,!E]];return g?R=[...document.querySelectorAll(g)]:R=S.previousElementSibling?[S.previousElementSibling]:[],R.length||console.error("No triggers found."),R.forEach(j=>{j.tabIndex<0&&(j.tabIndex=0);for(const[G,it,Z]of m)Z&&j.addEventListener(G,it)}),d?(n(3,p=document.querySelector(d)??document.body),p===document.body?console.error(`Popup reference not found: '${d}'`):(p.addEventListener("focusout",A),E||p.addEventListener("mouseleave",A))):n(3,p=R[0]),()=>{R.forEach(j=>{if(j)for(const[G,it]of m)j.removeEventListener(G,it)}),p&&(p.removeEventListener("focusout",A),p.removeEventListener("mouseleave",A))}});let Ct;function Ot(m){return n(19,y=m),{destroy(){n(19,y=null)}}}function ot(m){nn[m?"unshift":"push"](()=>{S=m,n(5,S)})}return e.$$set=m=>{n(35,t=Lt(Lt({},t),Jt(m))),n(11,s=Gt(t,o)),"activeContent"in m&&n(1,l=m.activeContent),"arrow"in m&&n(2,a=m.arrow),"offset"in m&&n(12,c=m.offset),"placement"in m&&n(13,u=m.placement),"trigger"in m&&n(14,f=m.trigger),"triggeredBy"in m&&n(15,g=m.triggeredBy),"reference"in m&&n(16,d=m.reference),"strategy"in m&&n(17,h=m.strategy),"open"in m&&n(0,v=m.open),"yOnly"in m&&n(18,b=m.yOnly),"$$scope"in m&&n(23,r=m.$$scope)},e.$$.update=()=>{e.$$.dirty[0]&16384&&n(4,E=f==="click"),e.$$.dirty[0]&8200&&u&&(n(3,p),n(13,u)),e.$$.dirty[0]&9&&w("show",p,v),e.$$.dirty[0]&528384&&(q=[Cn(),Ln(),kn(+c),y&&En({element:y,padding:10})]),n(6,Ct=ln("absolute pointer-events-none block w-[10px] h-[10px] rotate-45 bg-inherit border-inherit",t.border&&O==="bottom"&&"border-b border-r",t.border&&O==="top"&&"border-t border-l ",t.border&&O==="right"&&"border-t border-r ",t.border&&O==="left"&&"border-b border-l "))},t=Jt(t),[v,l,a,p,E,S,Ct,U,A,Ft,Ot,s,c,u,f,g,d,h,b,y,O,i,ot,r]}class Kn extends St{constructor(t){super(),It(this,t,Un,Jn,Rt,{activeContent:1,arrow:2,offset:12,placement:13,trigger:14,triggeredBy:15,reference:16,strategy:17,open:0,yOnly:18},null,[-1,-1])}}const Qn=e=>({}),Fe=e=>({});function Ne(e){let t,n;const o=e[5].title,s=ge(o,e,e[7],Fe),i=s||Zn(e);return{c(){t=k("div"),i&&i.c(),this.h()},l(r){t=L(r,"DIV",{class:!0});var l=z(t);i&&i.l(l),l.forEach(_),this.h()},h(){T(t,"class","py-2 px-3 bg-gray-100 rounded-t-md border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700")},m(r,l){H(r,t,l),i&&i.m(t,null),n=!0},p(r,l){s?s.p&&(!n||l&128)&&ve(s,o,r,r[7],n?ye(o,r[7],l,Qn):pe(r[7]),Fe):i&&i.p&&(!n||l&1)&&i.p(r,n?l:-1)},i(r){n||(D(i,r),n=!0)},o(r){F(i,r),n=!1},d(r){r&&_(t),i&&i.d(r)}}}function Zn(e){let t,n;return{c(){t=k("h3"),n=$t(e[0]),this.h()},l(o){t=L(o,"H3",{class:!0});var s=z(t);n=te(s,e[0]),s.forEach(_),this.h()},h(){T(t,"class","font-semibold text-gray-900 dark:text-white")},m(o,s){H(o,t,s),x(t,n)},p(o,s){s&1&&We(n,o[0])},d(o){o&&_(t)}}}function $n(e){let t,n,o,s=(e[4].title||e[0])&&Ne(e);const i=e[5].default,r=ge(i,e,e[7],null);return{c(){s&&s.c(),t=V(),n=k("div"),r&&r.c(),this.h()},l(l){s&&s.l(l),t=P(l),n=L(l,"DIV",{class:!0});var a=z(n);r&&r.l(a),a.forEach(_),this.h()},h(){T(n,"class",e[1])},m(l,a){s&&s.m(l,a),H(l,t,a),H(l,n,a),r&&r.m(n,null),o=!0},p(l,a){l[4].title||l[0]?s?(s.p(l,a),a&17&&D(s,1)):(s=Ne(l),s.c(),D(s,1),s.m(t.parentNode,t)):s&&(ee(),F(s,1,1,()=>{s=null}),ne()),r&&r.p&&(!o||a&128)&&ve(r,i,l,l[7],o?ye(i,l[7],a,null):pe(l[7]),null),(!o||a&2)&&T(n,"class",l[1])},i(l){o||(D(s),D(r,l),o=!0)},o(l){F(s),F(r,l),o=!1},d(l){l&&(_(t),_(n)),s&&s.d(l),r&&r.d(l)}}}function ti(e){let t,n;const o=[{activeContent:!0},{border:!0},{shadow:!0},{rounded:!0},e[2],{class:"dark:!border-gray-600 "+e[3].class}];let s={$$slots:{default:[$n]},$$scope:{ctx:e}};for(let i=0;i<o.length;i+=1)s=Lt(s,o[i]);return t=new Kn({props:s}),t.$on("show",e[6]),{c(){pt(t.$$.fragment)},l(i){yt(t.$$.fragment,i)},m(i,r){bt(t,i,r),n=!0},p(i,[r]){const l=r&12?qe(o,[o[0],o[1],o[2],o[3],r&4&&je(i[2]),r&8&&{class:"dark:!border-gray-600 "+i[3].class}]):{};r&147&&(l.$$scope={dirty:r,ctx:i}),t.$set(l)},i(i){n||(D(t.$$.fragment,i),n=!0)},o(i){F(t.$$.fragment,i),n=!1},d(i){wt(t,i)}}}function ei(e,t,n){const o=["title","defaultClass"];let s=Gt(t,o),{$$slots:i={},$$scope:r}=t;const l=sn(i);let{title:a=""}=t,{defaultClass:c="py-2 px-3"}=t;function u(f){rn.call(this,e,f)}return e.$$set=f=>{n(3,t=Lt(Lt({},t),Jt(f))),n(2,s=Gt(t,o)),"title"in f&&n(0,a=f.title),"defaultClass"in f&&n(1,c=f.defaultClass),"$$scope"in f&&n(7,r=f.$$scope)},t=Jt(t),[a,c,s,t,l,i,u,r]}class ni extends St{constructor(t){super(),It(this,t,ei,ti,Rt,{title:0,defaultClass:1})}}function ze(e){let t,n,o='<a href="/home" class="whitebutton">Get started—it&#39;s free</a>',s,i,r='We collect open-source tickborne disease data so you can see how people with your <a class="highlight" href="/about#what_conditions_are_supported">conditions</a> react to <a class="highlight" href="/about#what_medications_are_supported">medications</a> <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button"><svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg> <span class="sr-only">Show information</span></button>',l,a,c,u,f,g,d='<img src="/bacteria_images/img1.png" alt="img1"/>',h,v,b,w=`<strong>Search</strong> 
                Query our database to find tickborne illness experiences`,E,p,C,y,S=`<strong>Learn</strong> 
                Find treatment ideas with an AI model that knows conventional &amp; alternative treatments`,R,X,N,U='<img src="/bacteria_images/img2.png" alt="img2"/>',nt,B,I,A,O='<img src="/bacteria_images/img3.png" alt="img3"/>',W,q,K,Ft=`<strong>Contribute</strong>
                Share your health successes and obstacles with the community`,Ct,Ot,ot,m,j=`<strong>Stay Updated</strong>
                Check back often as we add more medications, supplements, and treatments`,G,it,Z,Ce='<img src="/bacteria_images/img4.png" alt="img4"/>',re,le,ae,gt,Te='<hr class="svelte-ymxa46"/> <div class="transparenttext svelte-ymxa46">Scanned Comments</div> <div class="numbertext svelte-ymxa46">19,663,903</div> <hr class="svelte-ymxa46"/> <div class="transparenttext svelte-ymxa46">Cataloged Experiences</div> <div class="numbertext svelte-ymxa46">6,964</div> <hr class="svelte-ymxa46"/> <div class="transparenttext svelte-ymxa46">Supported Medications</div> <div class="numbertext svelte-ymxa46">240</div> <hr class="svelte-ymxa46"/> <div class="transparenttext svelte-ymxa46">Supported Supplements</div> <div class="numbertext svelte-ymxa46">147</div> <hr class="svelte-ymxa46"/>',ce,at,ke='<a href="/home" class="whitebutton">Get started</a>',fe,Tt,vt,ue,Nt;return a=new ni({props:{class:"w-64 text-sm font-light",triggeredBy:"#info-button","data-popper-placement":"left",$$slots:{default:[ii]},$$scope:{ctx:e}}}),vt=new fn({}),{c(){t=k("div"),n=k("div"),n.innerHTML=o,s=V(),i=k("h3"),i.innerHTML=r,l=V(),pt(a.$$.fragment),c=V(),u=k("div"),f=k("div"),g=k("div"),g.innerHTML=d,v=V(),b=k("div"),b.innerHTML=w,p=V(),C=k("div"),y=k("div"),y.innerHTML=S,X=V(),N=k("div"),N.innerHTML=U,B=V(),I=k("div"),A=k("div"),A.innerHTML=O,q=V(),K=k("div"),K.innerHTML=Ft,Ot=V(),ot=k("div"),m=k("div"),m.innerHTML=j,it=V(),Z=k("div"),Z.innerHTML=Ce,ae=V(),gt=k("div"),gt.innerHTML=Te,ce=V(),at=k("div"),at.innerHTML=ke,fe=V(),Tt=k("div"),pt(vt.$$.fragment),this.h()},l(M){t=L(M,"DIV",{class:!0});var Y=z(t);n=L(Y,"DIV",{class:!0,style:!0,"data-svelte-h":!0}),J(n)!=="svelte-gonqbo"&&(n.innerHTML=o),s=P(Y),i=L(Y,"H3",{class:!0,"data-svelte-h":!0}),J(i)!=="svelte-f06k8i"&&(i.innerHTML=r),l=P(Y),yt(a.$$.fragment,Y),c=P(Y),u=L(Y,"DIV",{class:!0});var ct=z(u);f=L(ct,"DIV",{class:!0});var zt=z(f);g=L(zt,"DIV",{class:!0,"data-svelte-h":!0}),J(g)!=="svelte-1xdbzlm"&&(g.innerHTML=d),v=P(zt),b=L(zt,"DIV",{class:!0,"data-svelte-h":!0}),J(b)!=="svelte-17ov29w"&&(b.innerHTML=w),zt.forEach(_),p=P(ct),C=L(ct,"DIV",{class:!0});var Wt=z(C);y=L(Wt,"DIV",{class:!0,"data-svelte-h":!0}),J(y)!=="svelte-1pi6cdk"&&(y.innerHTML=S),X=P(Wt),N=L(Wt,"DIV",{class:!0,"data-svelte-h":!0}),J(N)!=="svelte-12nnjf7"&&(N.innerHTML=U),Wt.forEach(_),B=P(ct),I=L(ct,"DIV",{class:!0});var qt=z(I);A=L(qt,"DIV",{class:!0,"data-svelte-h":!0}),J(A)!=="svelte-1k8tcny"&&(A.innerHTML=O),q=P(qt),K=L(qt,"DIV",{class:!0,"data-svelte-h":!0}),J(K)!=="svelte-1x82f32"&&(K.innerHTML=Ft),qt.forEach(_),Ot=P(ct),ot=L(ct,"DIV",{class:!0});var jt=z(ot);m=L(jt,"DIV",{class:!0,"data-svelte-h":!0}),J(m)!=="svelte-j9ziqz"&&(m.innerHTML=j),it=P(jt),Z=L(jt,"DIV",{class:!0,"data-svelte-h":!0}),J(Z)!=="svelte-2s7ger"&&(Z.innerHTML=Ce),jt.forEach(_),ct.forEach(_),ae=P(Y),gt=L(Y,"DIV",{class:!0,"data-svelte-h":!0}),J(gt)!=="svelte-1h2z6vq"&&(gt.innerHTML=Te),ce=P(Y),at=L(Y,"DIV",{class:!0,style:!0,"data-svelte-h":!0}),J(at)!=="svelte-193qeel"&&(at.innerHTML=ke),fe=P(Y),Tt=L(Y,"DIV",{class:!0});var Le=z(Tt);yt(vt.$$.fragment,Le),Le.forEach(_),Y.forEach(_),this.h()},h(){T(n,"class","buttondiv svelte-ymxa46"),Ae(n,"text-align","center"),T(i,"class","infonote svelte-ymxa46"),T(g,"class","imgdiv left svelte-ymxa46"),T(b,"class","text-info right svelte-ymxa46"),T(f,"class","info-row svelte-ymxa46"),T(y,"class","text-info left svelte-ymxa46"),T(N,"class","imgdiv right svelte-ymxa46"),T(C,"class","info-row svelte-ymxa46"),T(A,"class","imgdiv left svelte-ymxa46"),T(K,"class","text-info right svelte-ymxa46"),T(I,"class","info-row svelte-ymxa46"),T(m,"class","text-info left svelte-ymxa46"),T(Z,"class","imgdiv right svelte-ymxa46"),T(ot,"class","info-row svelte-ymxa46"),T(u,"class","divbg svelte-ymxa46"),T(gt,"class","numbersdiv svelte-ymxa46"),T(at,"class","buttondiv svelte-ymxa46"),Ae(at,"text-align","center"),T(Tt,"class","disclaimer-container svelte-ymxa46"),T(t,"class","content-container svelte-ymxa46")},m(M,Y){H(M,t,Y),x(t,n),x(t,s),x(t,i),x(t,l),bt(a,t,null),x(t,c),x(t,u),x(u,f),x(f,g),x(f,v),x(f,b),x(u,p),x(u,C),x(C,y),x(C,X),x(C,N),x(u,B),x(u,I),x(I,A),x(I,q),x(I,K),x(u,Ot),x(u,ot),x(ot,m),x(ot,it),x(ot,Z),x(t,ae),x(t,gt),x(t,ce),x(t,at),x(t,fe),x(t,Tt),bt(vt,Tt,null),Nt=!0},i(M){Nt||(D(a.$$.fragment,M),M&&(h||$(()=>{h=tt(g,ft,{delay:1e3,duration:1500}),h.start()})),M&&(E||$(()=>{E=tt(b,ft,{delay:1e3,duration:1500}),E.start()})),M&&(R||$(()=>{R=tt(y,ft,{delay:1e3,duration:1500}),R.start()})),M&&(nt||$(()=>{nt=tt(N,ft,{delay:1e3,duration:1500}),nt.start()})),M&&(W||$(()=>{W=tt(A,ft,{delay:1e3,duration:1500}),W.start()})),M&&(Ct||$(()=>{Ct=tt(K,ft,{delay:1e3,duration:1500}),Ct.start()})),M&&(G||$(()=>{G=tt(m,ft,{delay:1e3,duration:1500}),G.start()})),M&&(re||$(()=>{re=tt(Z,ft,{delay:1e3,duration:1500}),re.start()})),M&&(le||$(()=>{le=tt(u,Ut,{y:50,delay:1e3,duration:1500}),le.start()})),D(vt.$$.fragment,M),M&&(ue||$(()=>{ue=tt(t,Ut,{y:50,delay:500,duration:1500}),ue.start()})),Nt=!0)},o(M){F(a.$$.fragment,M),F(vt.$$.fragment,M),Nt=!1},d(M){M&&_(t),wt(a),wt(vt)}}}function ii(e){let t;return{c(){t=$t("This research is currently focused on tickborne disease data from Reddit, but will expand in the future")},l(n){t=te(n,"This research is currently focused on tickborne disease data from Reddit, but will expand in the future")},m(n,o){H(n,t,o)},d(n){n&&_(t)}}}function oi(e){let t,n,o=e[0]&&ze(e);return{c(){o&&o.c(),t=dt()},l(s){o&&o.l(s),t=dt()},m(s,i){o&&o.m(s,i),H(s,t,i),n=!0},p(s,[i]){s[0]?o?i&1&&D(o,1):(o=ze(s),o.c(),D(o,1),o.m(t.parentNode,t)):o&&(ee(),F(o,1,1,()=>{o=null}),ne())},i(s){n||(D(o),n=!0)},o(s){F(o),n=!1},d(s){s&&_(t),o&&o.d(s)}}}function si(e,t,n){let o=!1;return he(()=>n(0,o=!0)),[o]}class ri extends St{constructor(t){super(),It(this,t,si,oi,Rt,{})}}function li(e){let t,n,o,s,i,r,l;return t=new an({}),s=new hn({}),r=new ri({}),{c(){pt(t.$$.fragment),n=V(),o=k("div"),pt(s.$$.fragment),i=V(),pt(r.$$.fragment),this.h()},l(a){yt(t.$$.fragment,a),n=P(a),o=L(a,"DIV",{class:!0});var c=z(o);yt(s.$$.fragment,c),c.forEach(_),i=P(a),yt(r.$$.fragment,a),this.h()},h(){T(o,"class","intro-container svelte-1y6roqi")},m(a,c){bt(t,a,c),H(a,n,c),H(a,o,c),bt(s,o,null),H(a,i,c),bt(r,a,c),l=!0},p:Ht,i(a){l||(D(t.$$.fragment,a),D(s.$$.fragment,a),D(r.$$.fragment,a),l=!0)},o(a){F(t.$$.fragment,a),F(s.$$.fragment,a),F(r.$$.fragment,a),l=!1},d(a){a&&(_(n),_(o),_(i)),wt(t,a),wt(s),wt(r,a)}}}class mi extends St{constructor(t){super(),It(this,t,null,li,Rt,{})}}export{mi as component};