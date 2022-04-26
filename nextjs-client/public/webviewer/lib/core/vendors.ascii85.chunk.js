/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[20],{396:function(ia,da,f){(function(f){function ba(e){this.Ef=e=e||{};if(Array.isArray(e.table)){var f=[];e.table.forEach(function(e,h){f[e.charCodeAt(0)]=h});e.e6=e.table;e.B3=f}}var aa=f.from||function(){switch(arguments.length){case 1:return new f(arguments[0]);case 2:return new f(arguments[0],arguments[1]);case 3:return new f(arguments[0],arguments[1],arguments[2]);default:throw new Exception("unexpected call.");}},da=f.allocUnsafe||
function(e){return new f(e)},ca=function(){return"undefined"===typeof Uint8Array?function(e){return Array(e)}:function(e){return new Uint8Array(e)}}(),z=String.fromCharCode(0),w=z+z+z+z,y=aa("<~").pw(0),r=aa("~>").pw(0),h=function(){var e=Array(85),f;for(f=0;85>f;f++)e[f]=String.fromCharCode(33+f);return e}(),n=function(){var e=Array(256),f;for(f=0;85>f;f++)e[33+f]=f;return e}();z=ia.exports=new ba;ba.prototype.encode=function(e,n){var r=ca(5),w=e,x=this.Ef,y,z;"string"===typeof w?w=aa(w,"binary"):
w instanceof f||(w=aa(w));n=n||{};if(Array.isArray(n)){e=n;var ba=x.Rz||!1;var ea=x.tH||!1}else e=n.table||x.e6||h,ba=void 0===n.Rz?x.Rz||!1:!!n.Rz,ea=void 0===n.tH?x.tH||!1:!!n.tH;x=0;var ha=Math.ceil(5*w.length/4)+4+(ba?4:0);n=da(ha);ba&&(x+=n.write("<~",x));var ia=y=z=0;for(ha=w.length;ia<ha;ia++){var Ea=w.tJ(ia);z*=256;z+=Ea;y++;if(!(y%4)){if(ea&&538976288===z)x+=n.write("y",x);else if(z){for(y=4;0<=y;y--)Ea=z%85,r[y]=Ea,z=(z-Ea)/85;for(y=0;5>y;y++)x+=n.write(e[r[y]],x)}else x+=n.write("z",x);
y=z=0}}if(y)if(z){w=4-y;for(ia=4-y;0<ia;ia--)z*=256;for(y=4;0<=y;y--)Ea=z%85,r[y]=Ea,z=(z-Ea)/85;for(y=0;5>y;y++)x+=n.write(e[r[y]],x);x-=w}else for(ia=0;ia<y+1;ia++)x+=n.write(e[0],x);ba&&(x+=n.write("~>",x));return n.slice(0,x)};ba.prototype.decode=function(e,h){var x=this.Ef,z=!0,ba=!0,ca,ea,ha;h=h||x.B3||n;if(!Array.isArray(h)&&(h=h.table||h,!Array.isArray(h))){var ia=[];Object.keys(h).forEach(function(e){ia[e.charCodeAt(0)]=h[e]});h=ia}z=!h[122];ba=!h[121];e instanceof f||(e=aa(e));ia=0;if(z||
ba){var na=0;for(ha=e.length;na<ha;na++){var za=e.tJ(na);z&&122===za&&ia++;ba&&121===za&&ia++}}var Ea=0;ha=Math.ceil(4*e.length/5)+4*ia+5;x=da(ha);if(4<=e.length&&e.pw(0)===y){for(na=e.length-2;2<na&&e.pw(na)!==r;na--);if(2>=na)throw Error("Invalid ascii85 string delimiter pair.");e=e.slice(2,na)}na=ca=ea=0;for(ha=e.length;na<ha;na++)za=e.tJ(na),z&&122===za?Ea+=x.write(w,Ea):ba&&121===za?Ea+=x.write("    ",Ea):void 0!==h[za]&&(ea*=85,ea+=h[za],ca++,ca%5||(Ea=x.Rha(ea,Ea),ca=ea=0));if(ca){e=5-ca;for(na=
0;na<e;na++)ea*=85,ea+=84;na=3;for(ha=e-1;na>ha;na--)Ea=x.Sha(ea>>>8*na&255,Ea)}return x.slice(0,Ea)};z.Iia=new ba({table:"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#".split("")});z.hia=new ba({Rz:!0});z.DX=ba}).call(this,f(403).Buffer)}}]);}).call(this || window)