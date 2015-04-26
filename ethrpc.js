/**
 * Send JSON-RPC commands to Ethereum from the safety and convenience of
 * your browser!
 * 
 * @author Jack Peterson (jack@augur.net)
 * @date 4/12/2015
 * @license MIT
 */

var primary_account = "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89";
var rpc = {
    protocol: "http",
    host: "127.0.0.1",
    port: 8545
};

var NODE_JS = typeof(module) != 'undefined';
if (NODE_JS) {
    var http = require('http');
    var httpsync = require('http-sync');
    var keccak_256 = require('js-sha3').keccak_256;
    // var BigNumber = require('bignumber.js');
} else {
    /*
     * js-sha3 v0.2.0
     * https://github.com/emn178/js-sha3
     *
     * Copyright 2015, emn178@gmail.com
     *
     * Licensed under the MIT license:
     * http://www.opensource.org/licenses/MIT
     */
    (function(e,za){var E="undefined"!=typeof module;E&&(e=global,e.JS_SHA3_TEST&&(e.navigator={userAgent:"Chrome"}));var Aa=(e.JS_SHA3_TEST||!E)&&-1!=navigator.userAgent.indexOf("Chrome"),b="0123456789abcdef".split(""),H=[1,256,65536,16777216],B=[6,1536,393216,100663296],C=[0,8,16,24],sa=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,
2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648],f=[],a=[],G=function(a){return A(a,224,H)},ta=function(a){return A(a,256,H)},ua=function(a){return A(a,384,H)},va=function(a){return A(a,224,B)},wa=function(a){return A(a,256,B)},xa=function(a){return A(a,384,B)},ya=function(a){return A(a,512,B)},A=function(v,e,A){e===za&&(e=512,A=H);var B,g,E=!1,D=0,G=0,qa=v.length,c,d,h,k,l,m,n,p,q,r,t,u,w,x,y,z,I,J,K,L,M,N,O,P,Q,R,
S,T,U,V,W,X,Y,Z,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,F=(1600-2*e)/32,ra=4*F;for(c=0;50>c;++c)a[c]=0;B=0;do{f[0]=B;for(c=1;c<F+1;++c)f[c]=0;for(c=G;D<qa&&c<ra;++D)g=v.charCodeAt(D),128>g?f[c>>2]|=g<<C[c++&3]:(2048>g?f[c>>2]|=(192|g>>6)<<C[c++&3]:(55296>g||57344<=g?f[c>>2]|=(224|g>>12)<<C[c++&3]:(g=65536+((g&1023)<<10|v.charCodeAt(++D)&1023),f[c>>2]|=(240|g>>18)<<C[c++&3],f[c>>2]|=(128|g>>12&63)<<C[c++&3]),f[c>>2]|=(128|g>>6&63)<<C[c++&3]),f[c>>2]|=(128|g&63)<<C[c++&3]);G=c-ra;D==qa&&(f[c>>
2]|=A[c&3],++D);B=f[F];D>qa&&c<ra&&(f[F-1]|=2147483648,E=!0);for(c=0;c<F;++c)a[c]^=f[c];for(g=0;48>g;g+=2)h=a[0]^a[10]^a[20]^a[30]^a[40],k=a[1]^a[11]^a[21]^a[31]^a[41],l=a[2]^a[12]^a[22]^a[32]^a[42],m=a[3]^a[13]^a[23]^a[33]^a[43],n=a[4]^a[14]^a[24]^a[34]^a[44],p=a[5]^a[15]^a[25]^a[35]^a[45],q=a[6]^a[16]^a[26]^a[36]^a[46],r=a[7]^a[17]^a[27]^a[37]^a[47],t=a[8]^a[18]^a[28]^a[38]^a[48],u=a[9]^a[19]^a[29]^a[39]^a[49],d=t^(l<<1|m>>>31),c=u^(m<<1|l>>>31),a[0]^=d,a[1]^=c,a[10]^=d,a[11]^=c,a[20]^=d,a[21]^=
c,a[30]^=d,a[31]^=c,a[40]^=d,a[41]^=c,d=h^(n<<1|p>>>31),c=k^(p<<1|n>>>31),a[2]^=d,a[3]^=c,a[12]^=d,a[13]^=c,a[22]^=d,a[23]^=c,a[32]^=d,a[33]^=c,a[42]^=d,a[43]^=c,d=l^(q<<1|r>>>31),c=m^(r<<1|q>>>31),a[4]^=d,a[5]^=c,a[14]^=d,a[15]^=c,a[24]^=d,a[25]^=c,a[34]^=d,a[35]^=c,a[44]^=d,a[45]^=c,d=n^(t<<1|u>>>31),c=p^(u<<1|t>>>31),a[6]^=d,a[7]^=c,a[16]^=d,a[17]^=c,a[26]^=d,a[27]^=c,a[36]^=d,a[37]^=c,a[46]^=d,a[47]^=c,d=q^(h<<1|k>>>31),c=r^(k<<1|h>>>31),a[8]^=d,a[9]^=c,a[18]^=d,a[19]^=c,a[28]^=d,a[29]^=c,a[38]^=
d,a[39]^=c,a[48]^=d,a[49]^=c,d=a[0],c=a[1],Y=a[11]<<4|a[10]>>>28,Z=a[10]<<4|a[11]>>>28,y=a[20]<<3|a[21]>>>29,z=a[21]<<3|a[20]>>>29,ma=a[31]<<9|a[30]>>>23,na=a[30]<<9|a[31]>>>23,U=a[40]<<18|a[41]>>>14,V=a[41]<<18|a[40]>>>14,M=a[2]<<1|a[3]>>>31,N=a[3]<<1|a[2]>>>31,h=a[13]<<12|a[12]>>>20,k=a[12]<<12|a[13]>>>20,aa=a[22]<<10|a[23]>>>22,ba=a[23]<<10|a[22]>>>22,I=a[33]<<13|a[32]>>>19,J=a[32]<<13|a[33]>>>19,oa=a[42]<<2|a[43]>>>30,pa=a[43]<<2|a[42]>>>30,ga=a[5]<<30|a[4]>>>2,ha=a[4]<<30|a[5]>>>2,O=a[14]<<6|
a[15]>>>26,P=a[15]<<6|a[14]>>>26,l=a[25]<<11|a[24]>>>21,m=a[24]<<11|a[25]>>>21,ca=a[34]<<15|a[35]>>>17,da=a[35]<<15|a[34]>>>17,K=a[45]<<29|a[44]>>>3,L=a[44]<<29|a[45]>>>3,t=a[6]<<28|a[7]>>>4,u=a[7]<<28|a[6]>>>4,ia=a[17]<<23|a[16]>>>9,ja=a[16]<<23|a[17]>>>9,Q=a[26]<<25|a[27]>>>7,R=a[27]<<25|a[26]>>>7,n=a[36]<<21|a[37]>>>11,p=a[37]<<21|a[36]>>>11,ea=a[47]<<24|a[46]>>>8,fa=a[46]<<24|a[47]>>>8,W=a[8]<<27|a[9]>>>5,X=a[9]<<27|a[8]>>>5,w=a[18]<<20|a[19]>>>12,x=a[19]<<20|a[18]>>>12,ka=a[29]<<7|a[28]>>>25,
la=a[28]<<7|a[29]>>>25,S=a[38]<<8|a[39]>>>24,T=a[39]<<8|a[38]>>>24,q=a[48]<<14|a[49]>>>18,r=a[49]<<14|a[48]>>>18,a[0]=d^~h&l,a[1]=c^~k&m,a[10]=t^~w&y,a[11]=u^~x&z,a[20]=M^~O&Q,a[21]=N^~P&R,a[30]=W^~Y&aa,a[31]=X^~Z&ba,a[40]=ga^~ia&ka,a[41]=ha^~ja&la,a[2]=h^~l&n,a[3]=k^~m&p,a[12]=w^~y&I,a[13]=x^~z&J,a[22]=O^~Q&S,a[23]=P^~R&T,a[32]=Y^~aa&ca,a[33]=Z^~ba&da,a[42]=ia^~ka&ma,a[43]=ja^~la&na,a[4]=l^~n&q,a[5]=m^~p&r,a[14]=y^~I&K,a[15]=z^~J&L,a[24]=Q^~S&U,a[25]=R^~T&V,a[34]=aa^~ca&ea,a[35]=ba^~da&fa,a[44]=
ka^~ma&oa,a[45]=la^~na&pa,a[6]=n^~q&d,a[7]=p^~r&c,a[16]=I^~K&t,a[17]=J^~L&u,a[26]=S^~U&M,a[27]=T^~V&N,a[36]=ca^~ea&W,a[37]=da^~fa&X,a[46]=ma^~oa&ga,a[47]=na^~pa&ha,a[8]=q^~d&h,a[9]=r^~c&k,a[18]=K^~t&w,a[19]=L^~u&x,a[28]=U^~M&O,a[29]=V^~N&P,a[38]=ea^~W&Y,a[39]=fa^~X&Z,a[48]=oa^~ga&ia,a[49]=pa^~ha&ja,a[0]^=sa[g],a[1]^=sa[g+1]}while(!E);v="";if(Aa)d=a[0],c=a[1],h=a[2],k=a[3],l=a[4],m=a[5],n=a[6],p=a[7],q=a[8],r=a[9],t=a[10],u=a[11],w=a[12],x=a[13],y=a[14],z=a[15],v+=b[d>>4&15]+b[d&15]+b[d>>12&15]+b[d>>
8&15]+b[d>>20&15]+b[d>>16&15]+b[d>>28&15]+b[d>>24&15]+b[c>>4&15]+b[c&15]+b[c>>12&15]+b[c>>8&15]+b[c>>20&15]+b[c>>16&15]+b[c>>28&15]+b[c>>24&15]+b[h>>4&15]+b[h&15]+b[h>>12&15]+b[h>>8&15]+b[h>>20&15]+b[h>>16&15]+b[h>>28&15]+b[h>>24&15]+b[k>>4&15]+b[k&15]+b[k>>12&15]+b[k>>8&15]+b[k>>20&15]+b[k>>16&15]+b[k>>28&15]+b[k>>24&15]+b[l>>4&15]+b[l&15]+b[l>>12&15]+b[l>>8&15]+b[l>>20&15]+b[l>>16&15]+b[l>>28&15]+b[l>>24&15]+b[m>>4&15]+b[m&15]+b[m>>12&15]+b[m>>8&15]+b[m>>20&15]+b[m>>16&15]+b[m>>28&15]+b[m>>24&15]+
b[n>>4&15]+b[n&15]+b[n>>12&15]+b[n>>8&15]+b[n>>20&15]+b[n>>16&15]+b[n>>28&15]+b[n>>24&15],256<=e&&(v+=b[p>>4&15]+b[p&15]+b[p>>12&15]+b[p>>8&15]+b[p>>20&15]+b[p>>16&15]+b[p>>28&15]+b[p>>24&15]),384<=e&&(v+=b[q>>4&15]+b[q&15]+b[q>>12&15]+b[q>>8&15]+b[q>>20&15]+b[q>>16&15]+b[q>>28&15]+b[q>>24&15]+b[r>>4&15]+b[r&15]+b[r>>12&15]+b[r>>8&15]+b[r>>20&15]+b[r>>16&15]+b[r>>28&15]+b[r>>24&15]+b[t>>4&15]+b[t&15]+b[t>>12&15]+b[t>>8&15]+b[t>>20&15]+b[t>>16&15]+b[t>>28&15]+b[t>>24&15]+b[u>>4&15]+b[u&15]+b[u>>12&
15]+b[u>>8&15]+b[u>>20&15]+b[u>>16&15]+b[u>>28&15]+b[u>>24&15]),512==e&&(v+=b[w>>4&15]+b[w&15]+b[w>>12&15]+b[w>>8&15]+b[w>>20&15]+b[w>>16&15]+b[w>>28&15]+b[w>>24&15]+b[x>>4&15]+b[x&15]+b[x>>12&15]+b[x>>8&15]+b[x>>20&15]+b[x>>16&15]+b[x>>28&15]+b[x>>24&15]+b[y>>4&15]+b[y&15]+b[y>>12&15]+b[y>>8&15]+b[y>>20&15]+b[y>>16&15]+b[y>>28&15]+b[y>>24&15]+b[z>>4&15]+b[z&15]+b[z>>12&15]+b[z>>8&15]+b[z>>20&15]+b[z>>16&15]+b[z>>28&15]+b[z>>24&15]);else for(c=0,g=e/32;c<g;++c)d=a[c],v+=b[d>>4&15]+b[d&15]+b[d>>12&
15]+b[d>>8&15]+b[d>>20&15]+b[d>>16&15]+b[d>>28&15]+b[d>>24&15];return v};!e.JS_SHA3_TEST&&E?module.exports={sha3_512:ya,sha3_384:xa,sha3_256:wa,sha3_224:va,keccak_512:A,keccak_384:ua,keccak_256:ta,keccak_224:G}:e&&(e.sha3_512=ya,e.sha3_384=xa,e.sha3_256=wa,e.sha3_224=va,e.keccak_512=A,e.keccak_384=ua,e.keccak_256=ta,e.keccak_224=G)})(this);
    /* bignumber.js v2.0.7 https://github.com/MikeMcl/bignumber.js/LICENCE */
    // !function(e){"use strict";function n(e){function a(e,n){var t,r,i,o,u,s,f=this;if(!(f instanceof a))return j&&L(26,"constructor call without new",e),new a(e,n);if(null!=n&&H(n,2,64,M,"base")){if(n=0|n,s=e+"",10==n)return f=new a(e instanceof a?e:s),U(f,P+f.e+1,k);if((o="number"==typeof e)&&0*e!=0||!new RegExp("^-?"+(t="["+O.slice(0,n)+"]+")+"(?:\\."+t+")?$",37>n?"i":"").test(s))return g(f,s,o,n);o?(f.s=0>1/e?(s=s.slice(1),-1):1,j&&s.replace(/^0\.0*|\./,"").length>15&&L(M,b,e),o=!1):f.s=45===s.charCodeAt(0)?(s=s.slice(1),-1):1,s=D(s,10,n,f.s)}else{if(e instanceof a)return f.s=e.s,f.e=e.e,f.c=(e=e.c)?e.slice():e,void(M=0);if((o="number"==typeof e)&&0*e==0){if(f.s=0>1/e?(e=-e,-1):1,e===~~e){for(r=0,i=e;i>=10;i/=10,r++);return f.e=r,f.c=[e],void(M=0)}s=e+""}else{if(!p.test(s=e+""))return g(f,s,o);f.s=45===s.charCodeAt(0)?(s=s.slice(1),-1):1}}for((r=s.indexOf("."))>-1&&(s=s.replace(".","")),(i=s.search(/e/i))>0?(0>r&&(r=i),r+=+s.slice(i+1),s=s.substring(0,i)):0>r&&(r=s.length),i=0;48===s.charCodeAt(i);i++);for(u=s.length;48===s.charCodeAt(--u););if(s=s.slice(i,u+1))if(u=s.length,o&&j&&u>15&&L(M,b,f.s*e),r=r-i-1,r>z)f.c=f.e=null;else if(G>r)f.c=[f.e=0];else{if(f.e=r,f.c=[],i=(r+1)%y,0>r&&(i+=y),u>i){for(i&&f.c.push(+s.slice(0,i)),u-=y;u>i;)f.c.push(+s.slice(i,i+=y));s=s.slice(i),i=y-s.length}else i-=u;for(;i--;s+="0");f.c.push(+s)}else f.c=[f.e=0];M=0}function D(e,n,t,i){var o,u,f,c,h,g,p,d=e.indexOf("."),m=P,w=k;for(37>t&&(e=e.toLowerCase()),d>=0&&(f=J,J=0,e=e.replace(".",""),p=new a(t),h=p.pow(e.length-d),J=f,p.c=s(l(r(h.c),h.e),10,n),p.e=p.c.length),g=s(e,t,n),u=f=g.length;0==g[--f];g.pop());if(!g[0])return"0";if(0>d?--u:(h.c=g,h.e=u,h.s=i,h=C(h,p,m,w,n),g=h.c,c=h.r,u=h.e),o=u+m+1,d=g[o],f=n/2,c=c||0>o||null!=g[o+1],c=4>w?(null!=d||c)&&(0==w||w==(h.s<0?3:2)):d>f||d==f&&(4==w||c||6==w&&1&g[o-1]||w==(h.s<0?8:7)),1>o||!g[0])e=c?l("1",-m):"0";else{if(g.length=o,c)for(--n;++g[--o]>n;)g[o]=0,o||(++u,g.unshift(1));for(f=g.length;!g[--f];);for(d=0,e="";f>=d;e+=O.charAt(g[d++]));e=l(e,u)}return e}function _(e,n,t,i){var o,u,s,c,h;if(t=null!=t&&H(t,0,8,i,v)?0|t:k,!e.c)return e.toString();if(o=e.c[0],s=e.e,null==n)h=r(e.c),h=19==i||24==i&&B>=s?f(h,s):l(h,s);else if(e=U(new a(e),n,t),u=e.e,h=r(e.c),c=h.length,19==i||24==i&&(u>=n||B>=u)){for(;n>c;h+="0",c++);h=f(h,u)}else if(n-=s,h=l(h,u),u+1>c){if(--n>0)for(h+=".";n--;h+="0");}else if(n+=u-c,n>0)for(u+1==c&&(h+=".");n--;h+="0");return e.s<0&&o?"-"+h:h}function x(e,n){var t,r,i=0;for(u(e[0])&&(e=e[0]),t=new a(e[0]);++i<e.length;){if(r=new a(e[i]),!r.s){t=r;break}n.call(t,r)&&(t=r)}return t}function F(e,n,t,r,i){return(n>e||e>t||e!=c(e))&&L(r,(i||"decimal places")+(n>e||e>t?" out of range":" not an integer"),e),!0}function I(e,n,t){for(var r=1,i=n.length;!n[--i];n.pop());for(i=n[0];i>=10;i/=10,r++);return(t=r+t*y-1)>z?e.c=e.e=null:G>t?e.c=[e.e=0]:(e.e=t,e.c=n),e}function L(e,n,t){var r=new Error(["new BigNumber","cmp","config","div","divToInt","eq","gt","gte","lt","lte","minus","mod","plus","precision","random","round","shift","times","toDigits","toExponential","toFixed","toFormat","toFraction","pow","toPrecision","toString","BigNumber"][e]+"() "+n+": "+t);throw r.name="BigNumber Error",M=0,r}function U(e,n,t,r){var i,o,u,s,f,l,c,a=e.c,h=R;if(a){e:{for(i=1,s=a[0];s>=10;s/=10,i++);if(o=n-i,0>o)o+=y,u=n,f=a[l=0],c=f/h[i-u-1]%10|0;else if(l=d((o+1)/y),l>=a.length){if(!r)break e;for(;a.length<=l;a.push(0));f=c=0,i=1,o%=y,u=o-y+1}else{for(f=s=a[l],i=1;s>=10;s/=10,i++);o%=y,u=o-y+i,c=0>u?0:f/h[i-u-1]%10|0}if(r=r||0>n||null!=a[l+1]||(0>u?f:f%h[i-u-1]),r=4>t?(c||r)&&(0==t||t==(e.s<0?3:2)):c>5||5==c&&(4==t||r||6==t&&(o>0?u>0?f/h[i-u]:0:a[l-1])%10&1||t==(e.s<0?8:7)),1>n||!a[0])return a.length=0,r?(n-=e.e+1,a[0]=h[n%y],e.e=-n||0):a[0]=e.e=0,e;if(0==o?(a.length=l,s=1,l--):(a.length=l+1,s=h[y-o],a[l]=u>0?m(f/h[i-u]%h[u])*s:0),r)for(;;){if(0==l){for(o=1,u=a[0];u>=10;u/=10,o++);for(u=a[0]+=s,s=1;u>=10;u/=10,s++);o!=s&&(e.e++,a[0]==N&&(a[0]=1));break}if(a[l]+=s,a[l]!=N)break;a[l--]=0,s=1}for(o=a.length;0===a[--o];a.pop());}e.e>z?e.c=e.e=null:e.e<G&&(e.c=[e.e=0])}return e}var C,M=0,T=a.prototype,q=new a(1),P=20,k=4,B=-7,$=21,G=-1e7,z=1e7,j=!0,H=F,V=!1,W=1,J=100,X={decimalSeparator:".",groupSeparator:",",groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:" ",fractionGroupSize:0};return a.another=n,a.ROUND_UP=0,a.ROUND_DOWN=1,a.ROUND_CEIL=2,a.ROUND_FLOOR=3,a.ROUND_HALF_UP=4,a.ROUND_HALF_DOWN=5,a.ROUND_HALF_EVEN=6,a.ROUND_HALF_CEIL=7,a.ROUND_HALF_FLOOR=8,a.EUCLID=9,a.config=function(){var e,n,t=0,r={},i=arguments,s=i[0],f=s&&"object"==typeof s?function(){return s.hasOwnProperty(n)?null!=(e=s[n]):void 0}:function(){return i.length>t?null!=(e=i[t++]):void 0};return f(n="DECIMAL_PLACES")&&H(e,0,E,2,n)&&(P=0|e),r[n]=P,f(n="ROUNDING_MODE")&&H(e,0,8,2,n)&&(k=0|e),r[n]=k,f(n="EXPONENTIAL_AT")&&(u(e)?H(e[0],-E,0,2,n)&&H(e[1],0,E,2,n)&&(B=0|e[0],$=0|e[1]):H(e,-E,E,2,n)&&(B=-($=0|(0>e?-e:e)))),r[n]=[B,$],f(n="RANGE")&&(u(e)?H(e[0],-E,-1,2,n)&&H(e[1],1,E,2,n)&&(G=0|e[0],z=0|e[1]):H(e,-E,E,2,n)&&(0|e?G=-(z=0|(0>e?-e:e)):j&&L(2,n+" cannot be zero",e))),r[n]=[G,z],f(n="ERRORS")&&(e===!!e||1===e||0===e?(M=0,H=(j=!!e)?F:o):j&&L(2,n+w,e)),r[n]=j,f(n="CRYPTO")&&(e===!!e||1===e||0===e?(V=!(!e||!h||"object"!=typeof h),e&&!V&&j&&L(2,"crypto unavailable",h)):j&&L(2,n+w,e)),r[n]=V,f(n="MODULO_MODE")&&H(e,0,9,2,n)&&(W=0|e),r[n]=W,f(n="POW_PRECISION")&&H(e,0,E,2,n)&&(J=0|e),r[n]=J,f(n="FORMAT")&&("object"==typeof e?X=e:j&&L(2,n+" not an object",e)),r[n]=X,r},a.max=function(){return x(arguments,T.lt)},a.min=function(){return x(arguments,T.gt)},a.random=function(){var e=9007199254740992,n=Math.random()*e&2097151?function(){return m(Math.random()*e)}:function(){return 8388608*(1073741824*Math.random()|0)+(8388608*Math.random()|0)};return function(e){var t,r,i,o,u,s=0,f=[],l=new a(q);if(e=null!=e&&H(e,0,E,14)?0|e:P,o=d(e/y),V)if(h&&h.getRandomValues){for(t=h.getRandomValues(new Uint32Array(o*=2));o>s;)u=131072*t[s]+(t[s+1]>>>11),u>=9e15?(r=h.getRandomValues(new Uint32Array(2)),t[s]=r[0],t[s+1]=r[1]):(f.push(u%1e14),s+=2);s=o/2}else if(h&&h.randomBytes){for(t=h.randomBytes(o*=7);o>s;)u=281474976710656*(31&t[s])+1099511627776*t[s+1]+4294967296*t[s+2]+16777216*t[s+3]+(t[s+4]<<16)+(t[s+5]<<8)+t[s+6],u>=9e15?h.randomBytes(7).copy(t,s):(f.push(u%1e14),s+=7);s=o/7}else j&&L(14,"crypto unavailable",h);if(!s)for(;o>s;)u=n(),9e15>u&&(f[s++]=u%1e14);for(o=f[--s],e%=y,o&&e&&(u=R[y-e],f[s]=m(o/u)*u);0===f[s];f.pop(),s--);if(0>s)f=[i=0];else{for(i=-1;0===f[0];f.shift(),i-=y);for(s=1,u=f[0];u>=10;u/=10,s++);y>s&&(i-=y-s)}return l.e=i,l.c=f,l}}(),C=function(){function e(e,n,t){var r,i,o,u,s=0,f=e.length,l=n%A,c=n/A|0;for(e=e.slice();f--;)o=e[f]%A,u=e[f]/A|0,r=c*o+u*l,i=l*o+r%A*A+s,s=(i/t|0)+(r/A|0)+c*u,e[f]=i%t;return s&&e.unshift(s),e}function n(e,n,t,r){var i,o;if(t!=r)o=t>r?1:-1;else for(i=o=0;t>i;i++)if(e[i]!=n[i]){o=e[i]>n[i]?1:-1;break}return o}function r(e,n,t,r){for(var i=0;t--;)e[t]-=i,i=e[t]<n[t]?1:0,e[t]=i*r+e[t]-n[t];for(;!e[0]&&e.length>1;e.shift());}return function(i,o,u,s,f){var l,c,h,g,p,d,w,v,b,O,S,R,A,E,D,_,x,F=i.s==o.s?1:-1,I=i.c,L=o.c;if(!(I&&I[0]&&L&&L[0]))return new a(i.s&&o.s&&(I?!L||I[0]!=L[0]:L)?I&&0==I[0]||!L?0*F:F/0:0/0);for(v=new a(F),b=v.c=[],c=i.e-o.e,F=u+c+1,f||(f=N,c=t(i.e/y)-t(o.e/y),F=F/y|0),h=0;L[h]==(I[h]||0);h++);if(L[h]>(I[h]||0)&&c--,0>F)b.push(1),g=!0;else{for(E=I.length,_=L.length,h=0,F+=2,p=m(f/(L[0]+1)),p>1&&(L=e(L,p,f),I=e(I,p,f),_=L.length,E=I.length),A=_,O=I.slice(0,_),S=O.length;_>S;O[S++]=0);x=L.slice(),x.unshift(0),D=L[0],L[1]>=f/2&&D++;do{if(p=0,l=n(L,O,_,S),0>l){if(R=O[0],_!=S&&(R=R*f+(O[1]||0)),p=m(R/D),p>1)for(p>=f&&(p=f-1),d=e(L,p,f),w=d.length,S=O.length;1==n(d,O,w,S);)p--,r(d,w>_?x:L,w,f),w=d.length,l=1;else 0==p&&(l=p=1),d=L.slice(),w=d.length;if(S>w&&d.unshift(0),r(O,d,S,f),S=O.length,-1==l)for(;n(L,O,_,S)<1;)p++,r(O,S>_?x:L,S,f),S=O.length}else 0===l&&(p++,O=[0]);b[h++]=p,O[0]?O[S++]=I[A]||0:(O=[I[A]],S=1)}while((A++<E||null!=O[0])&&F--);g=null!=O[0],b[0]||b.shift()}if(f==N){for(h=1,F=b[0];F>=10;F/=10,h++);U(v,u+(v.e=h+c*y-1)+1,s,g)}else v.e=c,v.r=+g;return v}}(),g=function(){var e=/^(-?)0([xbo])(?=\w[\w.]*$)/i,n=/^([^.]+)\.$/,t=/^\.([^.]+)$/,r=/^-?(Infinity|NaN)$/,i=/^\s*\+(?=[\w.])|^\s+|\s+$/g;return function(o,u,s,f){var l,c=s?u:u.replace(i,"");if(r.test(c))o.s=isNaN(c)?null:0>c?-1:1;else{if(!s&&(c=c.replace(e,function(e,n,t){return l="x"==(t=t.toLowerCase())?16:"b"==t?2:8,f&&f!=l?e:n}),f&&(l=f,c=c.replace(n,"$1").replace(t,"0.$1")),u!=c))return new a(c,l);j&&L(M,"not a"+(f?" base "+f:"")+" number",u),o.s=null}o.c=o.e=null,M=0}}(),T.absoluteValue=T.abs=function(){var e=new a(this);return e.s<0&&(e.s=1),e},T.ceil=function(){return U(new a(this),this.e+1,2)},T.comparedTo=T.cmp=function(e,n){return M=1,i(this,new a(e,n))},T.decimalPlaces=T.dp=function(){var e,n,r=this.c;if(!r)return null;if(e=((n=r.length-1)-t(this.e/y))*y,n=r[n])for(;n%10==0;n/=10,e--);return 0>e&&(e=0),e},T.dividedBy=T.div=function(e,n){return M=3,C(this,new a(e,n),P,k)},T.dividedToIntegerBy=T.divToInt=function(e,n){return M=4,C(this,new a(e,n),0,1)},T.equals=T.eq=function(e,n){return M=5,0===i(this,new a(e,n))},T.floor=function(){return U(new a(this),this.e+1,3)},T.greaterThan=T.gt=function(e,n){return M=6,i(this,new a(e,n))>0},T.greaterThanOrEqualTo=T.gte=function(e,n){return M=7,1===(n=i(this,new a(e,n)))||0===n},T.isFinite=function(){return!!this.c},T.isInteger=T.isInt=function(){return!!this.c&&t(this.e/y)>this.c.length-2},T.isNaN=function(){return!this.s},T.isNegative=T.isNeg=function(){return this.s<0},T.isZero=function(){return!!this.c&&0==this.c[0]},T.lessThan=T.lt=function(e,n){return M=8,i(this,new a(e,n))<0},T.lessThanOrEqualTo=T.lte=function(e,n){return M=9,-1===(n=i(this,new a(e,n)))||0===n},T.minus=T.sub=function(e,n){var r,i,o,u,s=this,f=s.s;if(M=10,e=new a(e,n),n=e.s,!f||!n)return new a(0/0);if(f!=n)return e.s=-n,s.plus(e);var l=s.e/y,c=e.e/y,h=s.c,g=e.c;if(!l||!c){if(!h||!g)return h?(e.s=-n,e):new a(g?s:0/0);if(!h[0]||!g[0])return g[0]?(e.s=-n,e):new a(h[0]?s:3==k?-0:0)}if(l=t(l),c=t(c),h=h.slice(),f=l-c){for((u=0>f)?(f=-f,o=h):(c=l,o=g),o.reverse(),n=f;n--;o.push(0));o.reverse()}else for(i=(u=(f=h.length)<(n=g.length))?f:n,f=n=0;i>n;n++)if(h[n]!=g[n]){u=h[n]<g[n];break}if(u&&(o=h,h=g,g=o,e.s=-e.s),n=(i=g.length)-(r=h.length),n>0)for(;n--;h[r++]=0);for(n=N-1;i>f;){if(h[--i]<g[i]){for(r=i;r&&!h[--r];h[r]=n);--h[r],h[i]+=N}h[i]-=g[i]}for(;0==h[0];h.shift(),--c);return h[0]?I(e,h,c):(e.s=3==k?-1:1,e.c=[e.e=0],e)},T.modulo=T.mod=function(e,n){var t,r,i=this;return M=11,e=new a(e,n),!i.c||!e.s||e.c&&!e.c[0]?new a(0/0):!e.c||i.c&&!i.c[0]?new a(i):(9==W?(r=e.s,e.s=1,t=C(i,e,0,3),e.s=r,t.s*=r):t=C(i,e,0,W),i.minus(t.times(e)))},T.negated=T.neg=function(){var e=new a(this);return e.s=-e.s||null,e},T.plus=T.add=function(e,n){var r,i=this,o=i.s;if(M=12,e=new a(e,n),n=e.s,!o||!n)return new a(0/0);if(o!=n)return e.s=-n,i.minus(e);var u=i.e/y,s=e.e/y,f=i.c,l=e.c;if(!u||!s){if(!f||!l)return new a(o/0);if(!f[0]||!l[0])return l[0]?e:new a(f[0]?i:0*o)}if(u=t(u),s=t(s),f=f.slice(),o=u-s){for(o>0?(s=u,r=l):(o=-o,r=f),r.reverse();o--;r.push(0));r.reverse()}for(o=f.length,n=l.length,0>o-n&&(r=l,l=f,f=r,n=o),o=0;n;)o=(f[--n]=f[n]+l[n]+o)/N|0,f[n]%=N;return o&&(f.unshift(o),++s),I(e,f,s)},T.precision=T.sd=function(e){var n,t,r=this,i=r.c;if(null!=e&&e!==!!e&&1!==e&&0!==e&&(j&&L(13,"argument"+w,e),e!=!!e&&(e=null)),!i)return null;if(t=i.length-1,n=t*y+1,t=i[t]){for(;t%10==0;t/=10,n--);for(t=i[0];t>=10;t/=10,n++);}return e&&r.e+1>n&&(n=r.e+1),n},T.round=function(e,n){var t=new a(this);return(null==e||H(e,0,E,15))&&U(t,~~e+this.e+1,null!=n&&H(n,0,8,15,v)?0|n:k),t},T.shift=function(e){var n=this;return H(e,-S,S,16,"argument")?n.times("1e"+c(e)):new a(n.c&&n.c[0]&&(-S>e||e>S)?n.s*(0>e?0:1/0):n)},T.squareRoot=T.sqrt=function(){var e,n,i,o,u,s=this,f=s.c,l=s.s,c=s.e,h=P+4,g=new a("0.5");if(1!==l||!f||!f[0])return new a(!l||0>l&&(!f||f[0])?0/0:f?s:1/0);if(l=Math.sqrt(+s),0==l||l==1/0?(n=r(f),(n.length+c)%2==0&&(n+="0"),l=Math.sqrt(n),c=t((c+1)/2)-(0>c||c%2),l==1/0?n="1e"+c:(n=l.toExponential(),n=n.slice(0,n.indexOf("e")+1)+c),i=new a(n)):i=new a(l+""),i.c[0])for(c=i.e,l=c+h,3>l&&(l=0);;)if(u=i,i=g.times(u.plus(C(s,u,h,1))),r(u.c).slice(0,l)===(n=r(i.c)).slice(0,l)){if(i.e<c&&--l,n=n.slice(l-3,l+1),"9999"!=n&&(o||"4999"!=n)){(!+n||!+n.slice(1)&&"5"==n.charAt(0))&&(U(i,i.e+P+2,1),e=!i.times(i).eq(s));break}if(!o&&(U(u,u.e+P+2,0),u.times(u).eq(s))){i=u;break}h+=4,l+=4,o=1}return U(i,i.e+P+1,k,e)},T.times=T.mul=function(e,n){var r,i,o,u,s,f,l,c,h,g,p,d,m,w,v,b=this,O=b.c,S=(M=17,e=new a(e,n)).c;if(!(O&&S&&O[0]&&S[0]))return!b.s||!e.s||O&&!O[0]&&!S||S&&!S[0]&&!O?e.c=e.e=e.s=null:(e.s*=b.s,O&&S?(e.c=[0],e.e=0):e.c=e.e=null),e;for(i=t(b.e/y)+t(e.e/y),e.s*=b.s,l=O.length,g=S.length,g>l&&(m=O,O=S,S=m,o=l,l=g,g=o),o=l+g,m=[];o--;m.push(0));for(w=N,v=A,o=g;--o>=0;){for(r=0,p=S[o]%v,d=S[o]/v|0,s=l,u=o+s;u>o;)c=O[--s]%v,h=O[s]/v|0,f=d*c+h*p,c=p*c+f%v*v+m[u]+r,r=(c/w|0)+(f/v|0)+d*h,m[u--]=c%w;m[u]=r}return r?++i:m.shift(),I(e,m,i)},T.toDigits=function(e,n){var t=new a(this);return e=null!=e&&H(e,1,E,18,"precision")?0|e:null,n=null!=n&&H(n,0,8,18,v)?0|n:k,e?U(t,e,n):t},T.toExponential=function(e,n){return _(this,null!=e&&H(e,0,E,19)?~~e+1:null,n,19)},T.toFixed=function(e,n){return _(this,null!=e&&H(e,0,E,20)?~~e+this.e+1:null,n,20)},T.toFormat=function(e,n){var t=_(this,null!=e&&H(e,0,E,21)?~~e+this.e+1:null,n,21);if(this.c){var r,i=t.split("."),o=+X.groupSize,u=+X.secondaryGroupSize,s=X.groupSeparator,f=i[0],l=i[1],c=this.s<0,a=c?f.slice(1):f,h=a.length;if(u&&(r=o,o=u,u=r,h-=r),o>0&&h>0){for(r=h%o||o,f=a.substr(0,r);h>r;r+=o)f+=s+a.substr(r,o);u>0&&(f+=s+a.slice(r)),c&&(f="-"+f)}t=l?f+X.decimalSeparator+((u=+X.fractionGroupSize)?l.replace(new RegExp("\\d{"+u+"}\\B","g"),"$&"+X.fractionGroupSeparator):l):f}return t},T.toFraction=function(e){var n,t,i,o,u,s,f,l,c,h=j,g=this,p=g.c,d=new a(q),m=t=new a(q),w=f=new a(q);if(null!=e&&(j=!1,s=new a(e),j=h,(!(h=s.isInt())||s.lt(q))&&(j&&L(22,"max denominator "+(h?"out of range":"not an integer"),e),e=!h&&s.c&&U(s,s.e+1,1).gte(q)?s:null)),!p)return g.toString();for(c=r(p),o=d.e=c.length-g.e-1,d.c[0]=R[(u=o%y)<0?y+u:u],e=!e||s.cmp(d)>0?o>0?d:m:s,u=z,z=1/0,s=new a(c),f.c[0]=0;l=C(s,d,0,1),i=t.plus(l.times(w)),1!=i.cmp(e);)t=w,w=i,m=f.plus(l.times(i=m)),f=i,d=s.minus(l.times(i=d)),s=i;return i=C(e.minus(t),w,0,1),f=f.plus(i.times(m)),t=t.plus(i.times(w)),f.s=m.s=g.s,o*=2,n=C(m,w,o,k).minus(g).abs().cmp(C(f,t,o,k).minus(g).abs())<1?[m.toString(),w.toString()]:[f.toString(),t.toString()],z=u,n},T.toNumber=function(){var e=this;return+e||(e.s?0*e.s:0/0)},T.toPower=T.pow=function(e){var n,t,r=m(0>e?-e:+e),i=this;if(!H(e,-S,S,23,"exponent")&&(!isFinite(e)||r>S&&(e/=0)||parseFloat(e)!=e&&!(e=0/0)))return new a(Math.pow(+i,e));for(n=J?d(J/y+2):0,t=new a(q);;){if(r%2){if(t=t.times(i),!t.c)break;n&&t.c.length>n&&(t.c.length=n)}if(r=m(r/2),!r)break;i=i.times(i),n&&i.c&&i.c.length>n&&(i.c.length=n)}return 0>e&&(t=q.div(t)),n?U(t,J,k):t},T.toPrecision=function(e,n){return _(this,null!=e&&H(e,1,E,24,"precision")?0|e:null,n,24)},T.toString=function(e){var n,t=this,i=t.s,o=t.e;return null===o?i?(n="Infinity",0>i&&(n="-"+n)):n="NaN":(n=r(t.c),n=null!=e&&H(e,2,64,25,"base")?D(l(n,o),0|e,10,i):B>=o||o>=$?f(n,o):l(n,o),0>i&&t.c[0]&&(n="-"+n)),n},T.truncated=T.trunc=function(){return U(new a(this),this.e+1,1)},T.valueOf=T.toJSON=function(){return this.toString()},null!=e&&a.config(e),a}function t(e){var n=0|e;return e>0||e===n?n:n-1}function r(e){for(var n,t,r=1,i=e.length,o=e[0]+"";i>r;){for(n=e[r++]+"",t=y-n.length;t--;n="0"+n);o+=n}for(i=o.length;48===o.charCodeAt(--i););return o.slice(0,i+1||1)}function i(e,n){var t,r,i=e.c,o=n.c,u=e.s,s=n.s,f=e.e,l=n.e;if(!u||!s)return null;if(t=i&&!i[0],r=o&&!o[0],t||r)return t?r?0:-s:u;if(u!=s)return u;if(t=0>u,r=f==l,!i||!o)return r?0:!i^t?1:-1;if(!r)return f>l^t?1:-1;for(s=(f=i.length)<(l=o.length)?f:l,u=0;s>u;u++)if(i[u]!=o[u])return i[u]>o[u]^t?1:-1;return f==l?0:f>l^t?1:-1}function o(e,n,t){return(e=c(e))>=n&&t>=e}function u(e){return"[object Array]"==Object.prototype.toString.call(e)}function s(e,n,t){for(var r,i,o=[0],u=0,s=e.length;s>u;){for(i=o.length;i--;o[i]*=n);for(o[r=0]+=O.indexOf(e.charAt(u++));r<o.length;r++)o[r]>t-1&&(null==o[r+1]&&(o[r+1]=0),o[r+1]+=o[r]/t|0,o[r]%=t)}return o.reverse()}function f(e,n){return(e.length>1?e.charAt(0)+"."+e.slice(1):e)+(0>n?"e":"e+")+n}function l(e,n){var t,r;if(0>n){for(r="0.";++n;r+="0");e=r+e}else if(t=e.length,++n>t){for(r="0",n-=t;--n;r+="0");e+=r}else t>n&&(e=e.slice(0,n)+"."+e.slice(n));return e}function c(e){return e=parseFloat(e),0>e?d(e):m(e)}var a,h,g,p=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,d=Math.ceil,m=Math.floor,w=" not a boolean or binary digit",v="rounding mode",b="number type has more than 15 significant digits",O="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_",N=1e14,y=14,S=9007199254740991,R=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],A=1e7,E=1e9;if(a=n(),"function"==typeof define&&define.amd)define(function(){return a});else if("undefined"!=typeof module&&module.exports){if(module.exports=a,!h)try{h=require("crypto")}catch(D){}}else e.BigNumber=a}(this);
}

function encode_int(value) {
    var cs = [];
    while (value > 0) {
        cs.push(String.fromCharCode(value % 256));
        value = Math.floor(value / 256);
    }
    return (cs.reverse()).join('');
}

function encode_hex(str) {
    var result = '';
    for (var i = 0, len = str.length; i < len; ++i) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

function zeropad(r) {
    var output = encode_hex(r);
    while (output.length < 64) {
        output = '0' + output;
    }
    return output;
}

function encode_single(arg, base, sub) {
    var normal_args, len_args, var_args;
    normal_args = '';
    len_args = '';
    var_args = '';
    if (base === "int") {
        normal_args = zeropad(encode_int(arg % Math.pow(2, sub)));
    } else if (base === "string") {
        len_args = zeropad(encode_int(arg.length));
        var_args = arg;
    }
    return {
        len_args: len_args,
        normal_args: normal_args,
        var_args: var_args
    }
}

function encode_any(arg, base, sub, arrlist) {
    if (arrlist) {
        var res;
        var o = '';
        for (var j = 0, l = arg.length; j < l; ++j) {
            res = encode_any(arg[j], base, sub, arrlist.slice(0,-1));
            o += res.normal_args;
        }
        return {
            len_args: zeropad(encode_int(arg.length)),
            normal_args: '',
            var_args: o
        }
    } else {
        var len_args = '';
        var normal_args = '';
        var var_args = '';
        if (base === "string") {
            len_args = zeropad(encode_int(arg.length));
            var_args = arg;
        }
        if (base === "int") {
            normal_args = zeropad(encode_int(arg % Math.pow(2, 256)));
        }
        return {
            len_args: len_args,
            normal_args: normal_args,
            var_args: var_args
        }
    }
}

function get_prefix(funcname, signature) {
    signature = signature || "";
    var summary = funcname + "(";
    for (var i = 0, len = signature.length; i < len; ++i) {
        switch (signature[i]) {
            case 's':
                summary += "string";
                break;
            case 'i':
                summary += "int256";
                break;
            case 'a':
                summary += "int256[]";
                break;
            default:
                summary += "weird";
        }
        if (i != len - 1) summary += ",";
    }
    summary += ")";
    return "0x" + keccak_256(summary).slice(0, 8);
}

function parse_array(string, stride, init) {
    stride = stride || 64;
    var elements = (string.length - 2) / stride;
    var array = Array(elements);
    var position = init || 2;
    for (var i = 0; i < elements; ++i) {
        // array[i] = new BigNumber("0x" + string.slice(position, position + stride));
        array[i] = string.slice(position, position + stride);
        position += stride;
    }
    return array;
}

var EthRPC = (function (rpc, primary) {

    var pdata, id = 1;
    var rpc_url = rpc.protocol + "://" + rpc.host + ":" + rpc.port.toString()

    function parse(response, callback) {
        response = JSON.parse(response);
        if (response.error) {
            console.error(
                "[" + response.error.code + "]",
                response.error.message
            );
        } else {
            if (response.result && callback) {
                return callback(response);
            } else if (response.result) {
                return response.result;
            } else {
                return response;
            }
        }
    }

    // post json-rpc command to ethereum client
    function json_rpc(command, callback, async) {
        var req, xhr = null;
        if (NODE_JS) {
            if (async) {
                req = http.request({
                    protocol: rpc.protocol,
                    host: rpc.host,
                    path: '/',
                    port: rpc.port,
                    method: 'POST'
                }, function (response) {
                    var body = '';
                    response.on('data', function (d) {
                        body += d;
                    });
                    response.on('end', function () {
                        parse(body, callback);
                    });
                });
                req.write(command);
                req.end();
            } else {
                req = httpsync.request({
                    protocol: rpc.protocol,
                    host: rpc.host,
                    path: '/',
                    port: rpc.port,
                    method: 'POST'
                });
                req.write(command);
                return parse((req.end()).body.toString(), callback);
            }
        } else {
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (async) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        parse(xhr.responseText, callback);
                    }
                };
                xhr.open("POST", rpc_url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(command));
            } else {            
                xhr.open("POST", rpc_url, false);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(command));
                return parse(xhr.responseText, callback);
            }
        }
    }

    function postdata(command, params, prefix) {
        pdata = {
            id: id++,
            jsonrpc: "2.0"
        };
        if (prefix === "null") {
            pdata.method = command.toString();
        } else {
            pdata.method = (prefix || "eth_") + command.toString();
        }
        if (params) {
            if (params.constructor === Array) {
                pdata.params = params;
            } else {
                pdata.params = [params];
            }
        } else {
            pdata.params = null;
        }
        return pdata;
    }

    return {
        rpc: function (command, params, f) {
            return json_rpc(postdata(command, params, "null"), f);
        },
        eth: function (command, params, f) {
            return json_rpc(postdata(command, params), f);
        },
        net: function (command, params, f) {
            return json_rpc(postdata(command, params, "net_"), f);
        },
        web3: function (command, params, f) {
            return json_rpc(postdata(command, params, "web3_"), f);
        },
        db: function (command, params, f) {
            return json_rpc(postdata(command, params, "db_"), f);
        },
        shh: function (command, params, f) {
            return json_rpc(postdata(command, params, "shh_"), f);
        },
        hash: function (data, small, f) {
            if (data) {
                if (data.constructor === Array || data.constructor === Object) {
                    data = JSON.stringify(data);
                }
                return json_rpc(postdata("sha3", data.toString(), "web3_"), function (data) {
                    var hash = (small) ? data.result.slice(0, 10) : data.result;
                    if (f) {
                        return f(hash);
                    } else {
                        return hash;
                    }
                });
            }
        },
        blockNumber: function (f) {
            return json_rpc(postdata("blockNumber"), function (data) {
                var blocknum = parseInt(data.result, 16);
                if (f) {
                    return f(blocknum);
                } else {
                    return blocknum;
                }
            });
        },
        balance: function (address, block, f) {
            return json_rpc(postdata("getBalance", [address, block || "latest"]), f || function (data) {
                return parseInt(data.result, 16) / 1e18;
            });
        },
        txCount: function (address, f) {
            return json_rpc(postdata("getTransactionCount", address), f);
        },
        call: function (tx, f) {
            tx.to = tx.to || "";
            tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : "0x989680";
            return json_rpc(postdata("call", tx), f);
        },
        sendTx: function (tx, f) {
            tx.to = tx.to || "";
            tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : "0x989680";
            return json_rpc(postdata("sendTransaction", tx), f);
        },
        getTx: function (hash, f) {
            return json_rpc(postdata("getTransactionByHash", hash), f);
        },
        peerCount: function (f) {
            return json_rpc(postdata("peerCount", [], "net_"), f);
        },
        // publish a new contract to the blockchain (from the primary account)
        publish: function (compiled, f) {
            return this.sendTx({ from: primary, data: compiled }, f);
        },
        // invoke a function from a contract on the blockchain
        invoke: function (address, funcname, sig, data, f) {
            var prefix = get_prefix(funcname, sig);
            var data_abi = prefix;
            var types = [];
            for (var i = 0, len = sig.length; i < len; ++i) {
                if (sig[i] == 's') {
                    types.push("string");
                } else if (sig[i] == 'a') {
                    types.push("int256[]");
                } else {
                    types.push("int256");
                }
            }
            var len_args = '';
            var normal_args = '';
            var var_args = '';
            var base, sub, arrlist;
            if (data && data.constructor === String) {
                data = JSON.parse(data);
            }
            if (types.length == data.length) {
                for (i = 0, len = types.length; i < len; ++i) {
                    if (types[i] === "string") {
                        base = "string";
                        sub = '';
                    } else if (types[i] === "int256[]") {
                        base = "int";
                        sub = 256;
                        arrlist = "[]";
                    } else {
                        base = "int";
                        sub = 256;
                    }
                    res = encode_any(data[i], base, sub, arrlist);
                    len_args += res.len_args;
                    normal_args += res.normal_args;
                    var_args += res.var_args;
                }
                data_abi += len_args + normal_args + var_args;
                // console.log("ABI data: ", data_abi);
                return this.call({ from: primary, to: address, data: data_abi }, f);
            } else {
                return console.error("Wrong number of arguments");
            }
        },
        // read the code in a contract on the blockchain
        read: function (address, block, f) {
            if (address) {
                return json_rpc(postdata("getCode", [address, block || "latest"]), f);
            }
        },
        id: function () { return id; },
        data: function () { return pdata; },
        // aliases
        sha3: function (data, f) { return this.hash(data, f); },
        getBalance: function (address, block, f) { return this.balance(address, block, f); },
        getTransactionCount: function (address, f) { return this.txCount(address, f); },
        sendTransaction: function (tx, f) { return this.sendTx(tx, f); },
        getTransactionByHash: function (hash, f) { return this.getTx(hash, f); },
        getCode: function (address, block, f) { return this.read(address, block, f); }
    };
})(rpc, primary_account);
