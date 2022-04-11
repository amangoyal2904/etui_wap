/* jStorage Plugin Start */
e$=window.e$||{};(function(){function z(h,k){function i(){if("session"==h){try{j=D.parse(window.name||"{}")}catch(o){j={}}}}var d=!1,g=0,b,e,j={};Math.random();if(k||"undefined"==typeof window[h+"Storage"]){if("local"==h&&window.globalStorage){localStorage=window.globalStorage[window.location.hostname]}else{if("userDataBehavior"==B){k&&(window[h+"Storage"]&&window[h+"Storage"].parentNode)&&window[h+"Storage"].parentNode.removeChild(window[h+"Storage"]);e=document.createElement("button");document.getElementsByTagName("head")[0].appendChild(e);
"local"==h?j=v:"session"==h&&i();for(b in j){j.hasOwnProperty(b)&&("__jstorage_meta"!=b&&"length"!=b&&"undefined"!=typeof j[b])&&(b in e||g++,e[b]=j[b])}e.length=g;e.key=function(Q){var R=0,o;i();for(o in j){if(j.hasOwnProperty(o)&&"__jstorage_meta"!=o&&"length"!=o&&"undefined"!=typeof j[o]){if(R==Q){return o}R++}}};e.getItem=function(o){i();return"session"==h?j[o]:I.jStorage.get(o)};e.setItem=function(o,Q){"undefined"!=typeof Q&&(e[o]=(Q||"").toString())};e.removeItem=function(o){if("local"==h){return I.jStorage.deleteKey(o)
}e[o]=void 0;d=!0;o in e&&e.removeAttribute(o);d=!1};e.clear=function(){"session"==h?(window.name="",z("session",!0)):I.jStorage.flush()};"local"==h&&(K=function(o,Q){"length"!=o&&(d=!0,"undefined"==typeof Q?o in e&&(g--,e.removeAttribute(o)):(o in e||g++,e[o]=(Q||"").toString()),e.length=g,d=!1)});e.attachEvent("onpropertychange",function(o){if("length"!=o.propertyName&&!(d||"length"==o.propertyName)){if("local"==h){!(o.propertyName in j)&&"undefined"!=typeof e[o.propertyName]&&g++}else{if("session"==h){i();
"undefined"!=typeof e[o.propertyName]&&!(o.propertyName in j)?(j[o.propertyName]=e[o.propertyName],g++):"undefined"==typeof e[o.propertyName]&&o.propertyName in j?(delete j[o.propertyName],g--):j[o.propertyName]=e[o.propertyName];"session"==h&&(window.name=D.stringify(j));e.length=g;return}}I.jStorage.set(o.propertyName,e[o.propertyName]);e.length=g}});window[h+"Storage"]=e}}}}function l(){var d="{}";if("userDataBehavior"==B){x.load("jStorage");try{d=x.getAttribute("jStorage")}catch(e){}try{O=x.getAttribute("jStorage_update")
}catch(b){}y.jStorage=d}p();F();r()}function n(){var b;clearTimeout(t);t=setTimeout(function(){if("localStorage"==B||"globalStorage"==B){b=y.jStorage_update}else{if("userDataBehavior"==B){x.load("jStorage");try{b=x.getAttribute("jStorage_update")}catch(h){}}}if(b&&b!=O){O=b;var j=D.parse(D.stringify(v.__jstorage_meta.CRC32)),e;l();e=D.parse(D.stringify(v.__jstorage_meta.CRC32));var i,d=[],g=[];for(i in j){j.hasOwnProperty(i)&&(e[i]?j[i]!=e[i]&&"2."==String(j[i]).substr(0,2)&&d.push(i):g.push(i))}for(i in e){e.hasOwnProperty(i)&&(j[i]||d.push(i))
}c(d,"updated");c(g,"deleted")}},25)}function c(d,g){d=[].concat(d||[]);if("flushed"==g){d=[];for(var e in G){G.hasOwnProperty(e)&&d.push(e)}g="deleted"}e=0;for(var b=d.length;e<b;e++){if(G[d[e]]){for(var h=0,i=G[d[e]].length;h<i;h++){G[d[e]][h](d[e],g)}}}}function q(){var b=(+new Date).toString();"localStorage"==B||"globalStorage"==B?y.jStorage_update=b:"userDataBehavior"==B&&(x.setAttribute("jStorage_update",b),x.save("jStorage"));n()}function p(){if(y.jStorage){try{v=D.parse(String(y.jStorage))
}catch(b){y.jStorage="{}"}}else{y.jStorage="{}"}N=y.jStorage?String(y.jStorage).length:0;v.__jstorage_meta||(v.__jstorage_meta={});v.__jstorage_meta.CRC32||(v.__jstorage_meta.CRC32={})}function s(){if(v.__jstorage_meta.PubSub){for(var e=+new Date-2000,g=0,b=v.__jstorage_meta.PubSub.length;g<b;g++){if(v.__jstorage_meta.PubSub[g][0]<=e){v.__jstorage_meta.PubSub.splice(g,v.__jstorage_meta.PubSub.length-g);break}}v.__jstorage_meta.PubSub.length||delete v.__jstorage_meta.PubSub}try{y.jStorage=D.stringify(v),x&&(x.setAttribute("jStorage",y.jStorage),x.save("jStorage")),N=y.jStorage?String(y.jStorage).length:0
}catch(d){}}function L(b){if(!b||"string"!=typeof b&&"number"!=typeof b){throw new TypeError("Key name must be string or numeric")}if("__jstorage_meta"==b){throw new TypeError("Reserved key name")}return !0}function F(){var g,j,i,d,h=Infinity,b=!1,e=[];clearTimeout(u);if(v.__jstorage_meta&&"object"==typeof v.__jstorage_meta.TTL){g=+new Date;i=v.__jstorage_meta.TTL;d=v.__jstorage_meta.CRC32;for(j in i){i.hasOwnProperty(j)&&(i[j]<=g?(delete i[j],delete d[j],delete v[j],b=!0,e.push(j)):i[j]<h&&(h=i[j]))
}Infinity!=h&&(u=setTimeout(F,h-g));b&&(s(),q(),c(e,"deleted"))}}function r(){if(v.__jstorage_meta.PubSub){for(var e,i=P,h=len=v.__jstorage_meta.PubSub.length-1;0<=h;h--){if(e=v.__jstorage_meta.PubSub[h],e[0]>P){var i=e[0],d=e[1];e=e[2];if(m[d]){for(var g=0,b=m[d].length;g<b;g++){m[d][g](d,D.parse(D.stringify(e)))}}}}P=i}}var I=window.jQuery||window.$||(window.$={}),D={parse:window.JSON&&(window.JSON.parse||window.JSON.decode)||String.prototype.evalJSON&&function(b){return String(b).evalJSON()}||I.parseJSON||I.evalJSON,stringify:Object.toJSON||window.JSON&&(window.JSON.stringify||window.JSON.encode)||I.toJSON};
if(!D.parse||!D.stringify){throw Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page")}var v={__jstorage_meta:{CRC32:{}}},y={jStorage:"{}"},x=null,N=0,B=!1,G={},t=!1,O=0,m={},P=+new Date,u,f={isXML:function(b){return(b=(b?b.ownerDocument||b:0).documentElement)?"HTML"!==b.nodeName:!1},encode:function(d){if(!this.isXML(d)){return !1}try{return(new XMLSerializer).serializeToString(d)}catch(e){try{return d.xml}catch(b){}}return !1},decode:function(b){var d="DOMParser" in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(e){var g=new ActiveXObject("Microsoft.XMLDOM");
g.async="false";g.loadXML(e);return g};if(!d){return !1}b=d.call("DOMParser" in window&&new DOMParser||window,b,"text/xml");return this.isXML(b)?b:!1}},K=function(){};I.jStorage=e$.jStorage={version:"0.3.1",set:function(k,o,g){L(k);g=g||{};if("undefined"==typeof o){return this.deleteKey(k),o}if(f.isXML(o)){o={_is_xml:!0,xml:f.encode(o)}}else{if("function"==typeof o){return}o&&"object"==typeof o&&(o=D.parse(D.stringify(o)))}v[k]=o;for(var j=v.__jstorage_meta.CRC32,d=D.stringify(o),i=d.length,b=NaN^i,h=0,e;
4<=i;){e=d.charCodeAt(h)&255|(d.charCodeAt(++h)&255)<<8|(d.charCodeAt(++h)&255)<<16|(d.charCodeAt(++h)&255)<<24,e=1540483477*(e&65535)+((1540483477*(e>>>16)&65535)<<16),e^=e>>>24,e=1540483477*(e&65535)+((1540483477*(e>>>16)&65535)<<16),b=1540483477*(b&65535)+((1540483477*(b>>>16)&65535)<<16)^e,i-=4,++h}switch(i){case 3:b^=(d.charCodeAt(h+2)&255)<<16;case 2:b^=(d.charCodeAt(h+1)&255)<<8;case 1:b^=d.charCodeAt(h)&255,b=1540483477*(b&65535)+((1540483477*(b>>>16)&65535)<<16)}b^=b>>>13;b=1540483477*(b&65535)+((1540483477*(b>>>16)&65535)<<16);
j[k]="2."+((b^b>>>15)>>>0);this.setTTL(k,g.TTL||0);K(k,o);c(k,"updated");return o},get:function(b,d){L(b);return b in v?v[b]&&"object"==typeof v[b]&&v[b]._is_xml?f.decode(v[b].xml):v[b]:"undefined"==typeof d?null:d},deleteKey:function(b){L(b);return b in v?(delete v[b],"object"==typeof v.__jstorage_meta.TTL&&b in v.__jstorage_meta.TTL&&delete v.__jstorage_meta.TTL[b],delete v.__jstorage_meta.CRC32[b],K(b,void 0),s(),q(),c(b,"deleted"),!0):!1},setTTL:function(d,e){var b=+new Date;L(d);e=Number(e)||0;
return d in v?(v.__jstorage_meta.TTL||(v.__jstorage_meta.TTL={}),0<e?v.__jstorage_meta.TTL[d]=b+e:delete v.__jstorage_meta.TTL[d],s(),F(),q(),!0):!1},getTTL:function(b){var d=+new Date;L(b);return b in v&&v.__jstorage_meta.TTL&&v.__jstorage_meta.TTL[b]?(b=v.__jstorage_meta.TTL[b]-d)||0:0},flush:function(){v={__jstorage_meta:{CRC32:{}}};z("local",!0);s();q();c(null,"flushed");return !0},storageObj:function(){function b(){}b.prototype=v;return new b},index:function(){var b=[],d;for(d in v){v.hasOwnProperty(d)&&"__jstorage_meta"!=d&&b.push(d)
}return b},storageSize:function(){return N},currentBackend:function(){return B},storageAvailable:function(){return !!B},listenKeyChange:function(b,d){L(b);G[b]||(G[b]=[]);G[b].push(d)},stopListening:function(d,e){L(d);if(G[d]){if(e){for(var b=G[d].length-1;0<=b;b--){G[d][b]==e&&G[d].splice(b,1)}}else{delete G[d]}}},subscribe:function(b,d){b=(b||"").toString();if(!b){throw new TypeError("Channel not defined")}m[b]||(m[b]=[]);m[b].push(d)},publish:function(b,d){b=(b||"").toString();if(!b){throw new TypeError("Channel not defined")
}v.__jstorage_meta||(v.__jstorage_meta={});v.__jstorage_meta.PubSub||(v.__jstorage_meta.PubSub=[]);v.__jstorage_meta.PubSub.unshift([+new Date,b,d]);s();q()},reInit:function(){l()}};a:{var w=!1;if("localStorage" in window){try{window.localStorage.setItem("_tmptest","tmpval"),w=!0,window.localStorage.removeItem("_tmptest")}catch(A){}}if(w){try{window.localStorage&&(y=window.localStorage,B="localStorage",O=y.jStorage_update)}catch(C){}}else{if("globalStorage" in window){try{window.globalStorage&&(y=window.globalStorage[window.location.hostname],B="globalStorage",O=y.jStorage_update)
}catch(E){}}else{if(x=document.createElement("link"),x.addBehavior){x.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(x);try{x.load("jStorage")}catch(H){x.setAttribute("jStorage","{}"),x.save("jStorage"),x.load("jStorage")}w="{}";try{w=x.getAttribute("jStorage")}catch(J){}try{O=x.getAttribute("jStorage_update")}catch(M){}y.jStorage=w;B="userDataBehavior"}else{x=null;break a}}}p();F();z("local");z("session");"localStorage"==B||"globalStorage"==B?"addEventListener" in window?window.addEventListener("storage",n,!1):document.attachEvent("onstorage",n):"userDataBehavior"==B&&setInterval(n,1000);
r();"addEventListener" in window&&window.addEventListener("pageshow",function(b){b.persisted&&n()},!1)}})();

/* jStorage Plugin End */


var objVc = {};
var __APP = {};
console.log('objVc, __APP:', objVc, __APP);

var objInts = {
	_log: [],
	log:function (data) {
		objInts._log.push(data);
	},
	adType : 'all',
	permissions: [],
	setCookie: function(cname, cvalue, seconds) {
		var dt, expires;
		dt = new Date();
		dt.setTime(dt.getTime() + (seconds*1000));
		expires = "; expires="+dt.toGMTString();
		document.cookie = cname+"="+cvalue+expires+'; domain=economictimes.com; path=/;';
	},
	init: function() {
		var ssoid = objInts.readCookie('ssoid') || objInts.readCookie('MSCSAuthID');
		var grx_gid = objInts.readCookie('_grx');
		if (grx_gid) {
			objInts.log({gid: grx_gid})
		}
		if(ssoid !== null) {
			
			objInts.setPermissionTTL();
			objInts.log({ssoid: ssoid});
		   
			var ref = document.referrer, wlh = window.location.href, orefType = '', 
				reloadPageFlag = wlh.indexOf('transcode') != -1 || 
								wlh.indexOf('fromsrc=etprime') != -1 || 
								ref.indexOf('success') != -1 || 
								ref.indexOf('plan') != -1 || !objInts.readCookie('OTR') || 0;
								
				orefType = wlh.indexOf('transcode') != -1 ? 'tcode': '';
				orefType = wlh.indexOf('fromsrc=etprime') != -1 ? 'frmprime': orefType;
				orefType = ref.indexOf('success') != -1 ? 'frmsuccess': orefType;
				orefType = ref.indexOf('plan') != -1 ? 'frmplan': orefType;
				orefType = !objInts.readCookie('OTR') ? 'cook': orefType;
				// orefType = !objInts.readCookie('etprc') ? 'prc': orefType;
				orefType = orefType ? orefType : 'def';
			if(reloadPageFlag && wlh.indexOf('_oref') == -1) {
				console.log('refresh page');
				objInts.loadPrimeApi(function () {
					var dt = new Date();
					var pageurl = window.location.origin + window.location.pathname + window.location.search;
					var cacheBust = (pageurl.indexOf('?') == -1 ? '?' : '&')  + '_oref=' + orefType;
					window.location.href = pageurl + cacheBust;  
				}, 1);
			} else {
				objInts.loadPrimeApi();
			}
		} else {
			//objInts.loadInterstitial(); //preventing redirection
			objInts.afterPermissionProcess();
		}
		
		var permissionReload = sessionStorage.getItem('permissionReload');
		if(permissionReload) {
			objInts.afterPermissionCall(function () {
				if(objInts.permissions.indexOf('subscribed') == -1) {
					alert("Sorry, you don't have an active ETPrime subscription");
				}
			});
			sessionStorage.removeItem('permissionReload');
		}
		objInts.afterPermissionCall(function () {
			objInts.log({permissions: objInts.permissions});
		});
		
		//objInts.bindEvents();
	},
	bindEvents: function () {
		try {
			var lastTap = 0, clickCounter = 0;
			document.addEventListener('click', function(e) {
				var isLogDiv = e && e.path && e.path[0] && e.path[0].className == 'log_div' || 0;
				if(!isLogDiv) {
					var currentTime = new Date().getTime();
					var tapLength = currentTime - lastTap;
					if(clickCounter == 0) {
						setTimeout(function () {
							clickCounter = 0;
						}, 1500)
					}
					console.log('clickCounter', clickCounter);
					
					var logDivL = document.getElementsByClassName('log_div').length;
					if (tapLength < 500 && tapLength > 0 && !logDivL && clickCounter >= 4) {
						var body = document.getElementsByTagName('body')[0];
						var div = document.createElement('div');
						div.style["min-height"] = '50px';
						div.style.background = "#FFF";
						div.style.position = 'fixed';
						div.style['z-index'] = 10000;
						div.style.width= '100%';
						div.style.bottom= 0;
						div.className= 'log_div';
						div.style['word-break']= 'break-all';
						
						div.addEventListener("click", function () {
							var logHTML = JSON.stringify(objInts._log);
							div.innerHTML = logHTML;
						});
						body.appendChild(div);
					} else {
						clickCounter++;
					}
					
					lastTap = currentTime;
				} else {
					return false;
				}
			});
		} catch (e) {
			console.log("Error", e);
		}
	},
	setPermissionTTL: function () {
		var tId = objInts.readCookie('TicketId'), key = 'prime_' + tId;
		if(e$.jStorage.getTTL(key) == 0) {
			Date.prototype.addDays = function(days) {this.setDate(this.getDate() + parseInt(days));return this;};
			var currentDate = new Date();
			
			currentDate.addDays(1);
			var a = new Date();
			var b  = new Date(currentDate.toDateString());
			var pendingTo12Pm = (b.getTime() - a.getTime());
			e$.jStorage.setTTL(key, pendingTo12Pm);
		}
		// clearing old storage data
		try {
			var arrKeys = e$.jStorage.index().filter(function (i) {return (i.indexOf('prime_') != -1 && i.indexOf(tId) == -1) ? 1 : 0});
			arrKeys.forEach(function (key, i) {
				e$.jStorage.deleteKey(key);
			});
		} catch (e) {}
	},
	loadPrimeApi: function(cb, grantToken) {
		try{
			var tId = objInts.readCookie('TicketId'), OTR = objInts.readCookie('OTR'), checkPrime = e$.jStorage.get('prime_' + tId), etprc = objInts.readCookie('etprc');
		
			if(document.referrer.indexOf('/ad-free/success') > -1 || localStorage.getItem("etsub_refreshTokenFlag") == 'true' || window.location.search.indexOf('fromsrc=etprime') != -1) {
				grantToken = 1;
				localStorage.removeItem("etsub_refreshTokenFlag");
			}
			objInts.log({OTR: OTR});
			
			if(checkPrime && checkPrime.tId && !grantToken && OTR && etprc && checkPrime.permissions && checkPrime.permissions.length) {
				if(checkPrime.tId == tId) {
					var permissions = checkPrime.permissions;
					if(permissions.indexOf("etadfree_subscribed") > -1) {
						objInts.adType = 'adfree';
					} else if(permissions.indexOf("subscribed") > -1) {
						objInts.adType = 'adfree';
					}
				}
				if(typeof cb == 'function') {
					cb();
				}
				console.log("checkPrime.permissions", checkPrime);
				objInts.permissions = checkPrime.permissions;
				objInts.checkGift(function () {
					objInts.afterPermissionProcess();
				})
				

			} else {
				if(checkPrime && checkPrime.permissions) {
					objInts.permissions = checkPrime.permissions;
				}
				var lh = location.host, isLive = (lh.indexOf('dev8243') != -1 || lh.indexOf('etpwa') != -1) ? 0 : 1;

				var oauthUrl = 'https://' + objAuth.oauth + '.economictimes.indiatimes.com/api/token/generate?frm=pwa', 
					oauthClientId = window.objVc && objVc.oauthClientIdWap || '-',
					deviceId = '6712484b-ca61-4df7-850d-3cbc97d0ZP121';

					var xhr = new XMLHttpRequest();

					var paramsObj = {grant_type: 'refresh_token', restrict_input: 0};
					var params = Object.keys(paramsObj).map(function(k) {
							return encodeURIComponent(k) + '=' + encodeURIComponent(paramsObj[k])
						}).join('&');
					xhr.open('POST', oauthUrl);
					xhr.responseType = 'json';
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					// xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
					var ticketId = objUser.ticketId || objInts.readCookie('TicketId') || '';
					try {
						saveLogs({'type': 'TicketIdIssue', 'from sso': ticketId, 'from cookie': objInts.readCookie('TicketId')});
					} catch (e) {}
					xhr.setRequestHeader('X-TICKET-ID', ticketId);
					xhr.setRequestHeader('X-CLIENT-ID', oauthClientId);
					xhr.setRequestHeader('X-DEVICE-ID', deviceId);
					
					xhr.withCredentials = true;
					xhr.onerror = function (e) { 
						try {
							var userData = {ssoid: objInts.readCookie('ssoid'), TicketId: objInts.readCookie('TicketId')}
							var error = JSON.stringify(e, ["message", "arguments", "type", "name"])
							saveLogs({'userData': userData, 'api_response': {}, 'Service Error': e, 'errortype': error});
						} catch (e) {}
						
						objInts.afterPermissionProcess();
						console.log('error in loadPrimeApi xhr', xhr, xhr.status);
					}; 
					// xhr.timeout = 5000;
					xhr.ontimeout = function (e) {
					  if(typeof objInterstitial != "undefined"){
						objInterstitial.afterInterDone = 1;
					  }
						if(typeof cb == 'function') {
							cb();
						}
					};
					xhr.onload = function() {
						if (xhr.status === 200) {
							var responseData = 'nonPrime', tId = objInts.readCookie('TicketId');
							var res = xhr.response;
							
							if(res.data) {
								responseData = res.data;
								responseData['tId'] = tId;
							} else {
								try {
									saveLogs({'type': 'TicketIdIssue Error','sso response':objUser.ssoApiResp, 'oauth response': xhr.response});
								} catch (e) {}
							}
							console.log("responseData", responseData, responseData.token);
							if(responseData) {
								if(responseData.token) {
									objInts.setCookie("OTR", responseData.token, 3600 * 24 * 30); 
								}
								if(responseData.etprc) {
									objInts.setCookie("etprc", responseData.etprc, 3600 * 24 * 30); 
								}
							}
							
							e$.jStorage.set('prime_' + tId, responseData);
							objInts.setPermissionTTL();
							// console.log('responseData.permissions', responseData)
							if(responseData.permissions && Array.isArray(responseData.permissions) && responseData.permissions.length) {
								if(responseData.permissions.indexOf('etadfree_subscribed') > 0) {
									objInts.adType = 'adfree';
								} else if(responseData.permissions.indexOf("subscribed") > -1) {
									objInts.adType = 'adfree';
								} else {
								   // objInts.loadInterstitial(); //preventing redirection
								}
							}
							objInts.permissions = res.data && res.data.permissions ? res.data.permissions : [];
							try {
								var userData = {ssoid: objInts.readCookie('ssoid'), TicketId: objInts.readCookie('TicketId')}
								saveLogs({'userData': userData, 'api_response': res});
							} catch (e) {}
							if(typeof cb == 'function') {
								cb();
							}
							objInts.checkGift(function () {
								objInts.afterPermissionProcess();
							})
						}
						else {
							console.log('Request failed.  Returned status of ' + xhr.status);
							objInts.afterPermissionProcess();
						}
				};
				xhr.send(params);
			
			}
		}catch(e){console.log('error in loadPrimeApi', e)}
	},
	checkGift: function (cb) {
		if(objInts.permissions && objInts.permissions.indexOf('article_gift') == -1) {
			if(typeof cb == 'function') {cb();}
		} else {
			_ajax({
				url: 'https://'+(objVc && objVc.subscriptions) +'.economictimes.indiatimes.com/api/user/giftDetails?merchantCode=ET&productCode=ETPR',
				timeout:10000,
				subHeader: 1
			}, function (error, data) {
				if(data.msIds) {
					objUser.giftedIds = data.msIds;
				}
				if(typeof cb == 'function') {
					cb();
				}
			});
		}
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	},
	removeCookie: function(name, options) {
		if(objInts.readCookie(name)) {
			document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;Domain=.economictimes.com';
			return true;
		}
		return false;
	},
	afterPermissionStack: [],
	afterPermissionCall:function(cb) {
		if(typeof cb == 'function') {
			if(objInts.afterPermissionProcessDone == 1) {
				cb();
			} else {
				objInts.afterPermissionStack.push(cb);
			}
		}
	},
	afterPermissionProcessDone: 0,
	afterPermissionProcess: function () {
		objInts.afterPermissionProcessDone = 1;
		
		objInts.afterPermissionStack.forEach(function (cb, index) {
			objInts.afterPermissionStack[index] = '';
			if(cb && typeof cb == 'function') {
				cb();
			}
		})
		
	}
}

objInts.afterPermissionCall(function () {
	console.log('objInts.afterPermissionCall callback Called');
});
function saveLogs(data) {
	if(data) {
		try {
			o = window.location.origin, isLive = (o.indexOf('dev') == -1 && o.indexOf('pwa') == -1 ? 1 : 0);
			data.TicketId = objInts.readCookie('TicketId'); 
			data.ssoid = objInts.readCookie('ssoid');
			
			if(window.__APP && __APP.login) {
				if(!data.emailid && __APP.login.email) {
					data.emailid = __APP.login.email;
				}
				if(!data.ssoid && __APP.login.ssoid) {
					data.ssoid = __APP.login.ssoid;
				}
			}
			var logdata = "logdata=" + JSON.stringify({ref: (isLive ? 'live' : 'dev') + '_react_' + jsints_v, data: data, url: window.location.href});
			
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			
			xhr.addEventListener("readystatechange", function() {
			  if(this.readyState === 4) {
				console.log(this.responseText);
			  }
			});
			
			xhr.open("POST", "https://etx.indiatimes.com/log?et=mobile");
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(logdata);
		} catch (e) {}
	}
}

objApps = {
	etMain: false,
	etMarkets: false,
	appState: "pending",
	init: function() {
		try {
			var appCount = 0;
			navigator.getInstalledRelatedApps().then(function(relatedApps){
				// _log('relatedApps');
				relatedApps.forEach(function(app){
					if(app.id == 'com.et.reader.activities') {
						objApps.etMain = true;
						objApps.etMainVersion = app.version;
					}
					if(app.id == 'com.et.market') {
						objApps.etMarkets = true;
						objApps.etMarketsVersion = app.version;
					}
				});
				if(typeof objApps.afterProcessCallback == "function"){
					  objApps.afterProcessCallback()
				}
				objApps.appState = "completed";
			});
		} catch (e) {}
	},
	afterProcess: function(cb){
		if(typeof cb == "function" && objApps.appState == "pending"){
			objApps.afterProcessCallback = cb;
		} else if (typeof cb == "function") {
			cb();
		}
	}
}
objApps.init();

objUser = {
	channel:'et-wap',
	mode:'wap',
	giftedIds: [],
	info: (e$.jStorage.get('userInfo_r') ? e$.jStorage.get('userInfo_r') : {}),
	ticketId: '',
	ssoApiResp: {},
	init: function () {
		objUser.loadSsoApi(objUser.verifyLogin);
	},
	loadSsoApi: function (callback) {
		callback = callback ? callback : function () {};
		if(!document.querySelector('script[src*="jsso_crosswalk"]')) {
			
			var crossWalkApi = (objVc && objVc.lib_login )|| 'https://jssocdnstg.indiatimes.com/crosswalk/jsso_crosswalk_legacy_0.5.9.min.js';
			var script = document.createElement('script');
			script.onload = callback;
			script.onerror = callback;
			
			script.src = crossWalkApi;
			document.head.appendChild(script);
		} else {
			callback();
		}
	},
	verifyLogin: function () {
		try {
			var jsso = new JssoCrosswalk(objUser.channel, objUser.mode);
			jsso.getValidLoggedInUser(function (response) {
				if(response.status == 'SUCCESS') {
					objUser.ssoApiResp = response;
					objUser.ticketId = response.data.ticketId;
					if(objInts.readCookie('TicketId') != response.data.ticketId) {
						objInts.setCookie("TicketId", response.data.ticketId); 
					}
					if(!objInts.readCookie('ssoid') && objUser.info.ssoid) {
						objInts.setCookie("ssoid", objUser.info.ssoid);
					}
					if(response.data.ticketId == objUser.info.ticketId) {
						objUser.afterLoginProcess();
					} else {
						objUser.setUserData(response);
					}
				} else {
					e$.jStorage.set("userInfo", {});
					e$.jStorage.set("userInfo_r", {});
					objInts.setCookie("ssoid", '', -1000); // delete
					objInts.setCookie("TicketId", '', -1000); // delete
					objUser.info = {};
					objUser.afterLoginProcess();
				}
			});
		} catch(e){
			objUser.info = {};
			objUser.afterLoginProcess();
		}
	},
	setUserData: function (response) {
		var jsso = new JssoCrosswalk(objUser.channel, objUser.mode);
		jsso.getUserDetails(function (responseDetails) {
			if(responseDetails.status == 'SUCCESS') {
				
				var data = responseDetails.data;
				var email = data.primaryEmail ? data.primaryEmail : (isNaN(response.data.identifier) ? response.data.identifier : '');
				var mobile = data.mobileData && data.mobileData.Verified && data.mobileData.Verified.mobile && (data.mobileData.Verified.code  + '-' + data.mobileData.Verified.mobile) || '';
				
				var userInfo = data;
				userInfo.isLogged = true;
				userInfo.ticketId = response.data.ticketId;
				userInfo.identifier = response.data.identifier;
				
				e$.jStorage.set('userInfo_r', userInfo);
				objUser.info = userInfo;
				objInts.setCookie("ssoid", userInfo.ssoid); 
				objInts.setCookie("TicketId", userInfo.ticketId); 
			} else {
				objUser.info = {};
				e$.jStorage.set('userInfo', {});
				e$.jStorage.set('userInfo_r', {});
			}
			objUser.afterLoginProcess();
		});
	},
	afterLoginStack: [],
	afterLoginCall:function(cb) {
		if(typeof cb == 'function') {
			objUser.afterLoginStack.push(cb);
			 if(objUser.afterLoginProcessDone == 1) {
				cb();
			}
		}
	},
	afterLoginProcessDone:0,
	afterLoginProcess: function () {
		clearTimeout(objUser.testInterval);
		objUser.afterLoginProcessDone = 1;
		objUser.afterLoginStack.forEach(function (afterLoginCB) {
			if(typeof afterLoginCB == 'function') {
				afterLoginCB();
			}
		});
	},
	gpOneTapLogin: function (token, callback) {
		objUser.loadSsoApi(function () {
			var jsso = new JssoCrosswalk(objUser.channel, objUser.mode);
			jsso.gpOneTapLogin(token, callback);
		});
	},
	logout: function (cb) {
		window.grxEvent && grxEvent('event', {'event_category': 'User', 'event_action': 'SignOut', 'event_label': window.location.href}, 1);
		objUser.loadSsoApi(function () {
			var jsso = new JssoCrosswalk(objUser.channel, objUser.mode);
			jsso.signOutUser(function (response) {
				try {
					var arrKeys = $.jStorage.index().filter(function (i) {return i.indexOf('prime_') == -1 ? 0 : 1});
					arrKeys.forEach(function (key, i) {
						$.jStorage.deleteKey(key);
					});
					e$.jStorage.deleteKey('userInfo');
					e$.jStorage.deleteKey('userInfo_r');
					objUser.removeCookies();
				} catch (e) {}
				if(typeof cb == 'function') {
					cb();
				}
			});
		})  
	},
	removeCookies: function() {
		var sessionCookies = ["FBOOK_ID","FBOOK_NAME","FBOOK_EMAIL","FBOOK_LOCATION","FBOOK_IMAGE","TWEET_ID","TWEET_NAME","TWEET_LOCATION","TWEET_IMAGE","articleid","txtmsg","tflocation","tfemail","setfocus","fbcheck","twtcheck","usercomt","ifrmval","frmbtm","FaceBookEmail","Fbimage","Fboauthid","Fbsecuritykey","Twimage","TwitterUserName","Twoauthid","Twsecuritykey","ssoid","Fbsecuritykey","fbookname","CommLogP","CommLogU","FaceBookEmail","Fbimage","fbooklocation","Fboauthid","fbname","fbLocation","fbimage","fbOAuthId","MSCSAuth","MSCSAuthDetail","MSCSAuthDetails","Twimage","TwitterUserName","Fboauthid","Twoauthid","Twsecuritykey","ssosigninsuccess","ssoid","MSCSAuthDetail","articleid","txtmsg","tflocation","tfemail","setfocus","fbookname","CommLogP","CommLogU","FaceBookEmail","Fbimage","fbooklocation","Fboauthid","Fbsecuritykey","fbname","fbLocation","fbimage","fbOAuthId","MSCSAuth","MSCSAuthDetail","MSCSAuthDetails","ssosigninsuccess","Twimage","TwitterUserName","Twoauthid","Twsecuritykey","peuuid","pfuuid","ticket","ssoid","MSCSAuthID","et_subs","TicketId","OTR","OID","OTP","etprc","etipr", "jsso_crosswalk_tksec_et-wap", "jsso_crosswalk_ssec_et-wap", "jsso_crosswalk_daily_et-wap", "ssec"];
		for (var a in sessionCookies) {
			objInts.removeCookie(sessionCookies[a]);
		}
	},
	updateUserPermissions: function (cb) {
		var timesPoints = window.geolocation == 1 ? 1 : 0;
		var jsso = new JssoCrosswalk(objUser.channel, objUser.mode);
		jsso.updateUserPermissions(1, 1, timesPoints, function () {
			e$.jStorage.deleteKey('userInfo');
			e$.jStorage.deleteKey('userInfo_r');
			if(typeof cb == 'function') {
				cb();
			}
		});
	},
	getGiftDetails: function (cb) {
		_ajax({
			url: 'https://'+(objVc && objVc.subscriptions) +'.economictimes.indiatimes.com/subscription/merchant/ET/product/ETPR/donorGiftArticleDetail',
			timeout:10000,
			subHeader: 1
		}, function (error, data) {
			if(typeof cb == 'function') {
				cb(data);
			}
		});
	}
}
objUser.init();
objUser.afterLoginCall(objInts.init);
objUser.afterLoginCall(function () {console.log('User Info', objUser.info)});