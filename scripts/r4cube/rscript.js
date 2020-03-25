/*!
* rscript.js - A lightweight library for manipulating and animating DOM.
* @version 1.1
* https://script.rcubesys.com/
*
* @copyright RCube System Inc <www.rcubesys.com>
* @license MIT
*
* BUILT: Fri April 29 2018 10:01:55 GMT+0100 (GMT+01:00)
*/;
(function() { 
  var r$ = function(arg) { // core constructor
    // ensure to use the `new` operator
    if (!(this instanceof r$))
      return new r$(arg);
    // store an argument for this example 
	function init() {
		return [].slice.call(document.querySelectorAll(arg));//[].slice.call(((/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(arg))?  document.querySelector(arg):document.querySelectorAll(arg)));
	} 
    this.arg = arg; 
	this.$=[];
	if(arg){
		//console.log("init",typeof arg);
		if(typeof arg=='string'){ 
			this.$ = init(); 
		}else{
			//console.log("init",arg.length,arg,typeof arg);
			if(typeof arg.length=="undefined"){//not an array 
				if(arg['$']){ //if this r$ object 
					this.$=arg['$'];
				}else 
					this.$[0]=arg; //plain nodlist object 
			}else{
				if(arg['$']){//r$ object already  
					this.$=arg['$'];
				}else if(typeof arg.window !="undefined" || arg.tagName=="SELECT"){ //window object 
					this.$[0]=arg; 
				}else {
					this.$=arg; 
				}
			}
		} 
	}
	this.length=this.$.length;
	this.idx=0;
  }; 
  // create `fn` alias to `prototype` property
  r$.fn = r$.prototype = {  }
  r$.data={};
  r$.log=true;  
  r$.version=1.1;
r$.ready=function(cb){
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		cb.apply();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}
r$.ready(function() {r$.publish("/r$/onload");}); 
//selector ".r4BodyWrap > div > div  > div:nth-child(2)" start from 1 nth-child(2)
r$.fn.find=function(arg){
	//console.log("find",this,arg); 
	var obj;
	try{
		if((!r$.nul(arg) && typeof arg=='string')){
			obj= [].slice.call(this.$[this.idx].querySelectorAll(arg)); 
		}
	}catch(e){obj=[]; r$.log && console.error("find-error:",e);}    
	return new r$(obj);  
} 
r$.fn.child = function (selector) {
	var obj=Array.prototype.filter.call(this.$[this.idx].children, function (child) {
		return child.matches(selector);
	}); 
	return r$(obj);
};
r$.each=function($el,cb){
	try{Array.prototype.forEach.call($el, cb);}catch(e){}
}
r$.nul=function(obj){//null
	try{if(obj==null || typeof obj=='undefined' || obj.length==0){
		return true;
	}}catch(e){return true;}
	return false;
}
r$.nulv=function(obj,dfv){
	return (r$.nul(obj) ? dfv: obj) 
}
r$.parseJSON=function(string){
	return JSON.parse(string);
}
r$.stringify=function(json){
	return JSON.stringify(json);
} 
//r$.extend({}, objA, objB)
r$.extend=function(out) {
	//console.log(out);
  out = out || {};  
	var arg=arguments;
  for (var i = 1; i < arg.length; i++) {
	var obj = arg[i]; 
	//console.log(obj);
	if (!obj)
	  continue; 
	for (var key in obj) {
	  if (obj.hasOwnProperty(key)) {
		if (typeof obj[key] === 'object'){  
			//console.log(key, out[key], obj[key]);
			out[key] = r$.extend(out[key], obj[key]);
		}else{
		  out[key+""] = obj[key];
		}
	  }else{
		 // console.log(">>"+key, out[key+""], obj[key]);
	//	out[key] = obj[key];
	  }
	}
  } 
  return out;
};
	//document.addEventListener('DOMContentLoaded', ); 
  // expose the library
  window.r$ = (window.r$ || r$);
})();   
r$.fn.each=function(cb){
	try{Array.prototype.forEach.call(this.$,cb);}catch(e){}
	return this;
}
r$.fn.get$=function(){
	return this.$;	
}  
r$.fn.get=function(index){
	this.idx=(index||0);
	return r$(this.$[this.idx]);	
}  
r$.fn.getElm=function(index){
	this.idx=(index||0);
	return this.$[this.idx];	
}  
r$.tags={"script":{parent:document.getElementsByTagName("head"),type:"text/javascript",src:"src"},"link":{parent:document.getElementsByTagName("head"),type:"text/css",src:"href"}}
r$.getAsset=function(json) {
        // include script only once src,callback,errorFun
	r$.data._libast = (r$.data._libast || []);
	var cb={done:function(){ 
			json.done&& json.done.apply(this); 
		},error:function(){ 
			json.error&& json.error.apply(this); 
		}};
	//console.log(r$.data._script,r$.data._script.includes(src));
	if (r$.data._libast.includes(json.src)) {
		return cb;
	} 
	json.tag=(json.tag||( (json.src.toLowerCase().indexOf(".css")!=-1) ? "link" : "script"));
	var script 
	var tag$=r$.tags[json.tag];
	var script = document.createElement(json.tag);
	if(tag$.type)
	script.type = tag$.type;//"text/javascript";    
	script.defer=true; 
	script.async=false; 
	if (script.readyState){ //IE
	 	script.onreadystatechange = function(){
			if (script.readyState == "loaded" || script.readyState == "complete"){
				script.onreadystatechange = null;
				cb.done.apply(this);
				 
			}
		};
	}else{ 
		script.onload = function(){
			cb.done.apply(this);
		};
		script.onerror = function(){
			cb.error.apply(this);
			cb.error=null;
		};  
	}
	try{ 
		r$(script).off("error").on("error",function(e){ 
		  cb.error && cb.error.apply(this);
		});
		if(tag$.src)
		script[tag$.src] = json.src;
		tag$.parent[0].appendChild(script);
	}catch(e){(cb.error.apply(this));}
	 
	// remember included script
	r$.data._libast.push(json.src);
	return this;
};
r$.loadLib=function(json){
	var lib=r$("script[data-r4-lib]").attr("data-r4-lib");
	//$ has to be replaced with library source 
	if(json.src.charAt(0)=='$' && !r$.nul(lib)){
		json.src=lib+json.src.substring(1);
	} 
	return r$.getAsset(json);
}; 

//events 
r$.fn.on=function(evntName,callback,delay){
	r$.data._event = (r$.data._event || []);
	var self=this;
	try{r$.each(this.$, function(el) {  
	 	var eventID=r$.getID(el)+"_"+evntName; 
		r$.data._event[eventID]=(r$.data._event[eventID] || []);
		var handler=r$.data._event[eventID];
		var evn=evntName.split("-")[0];
		if(handler.length!=0){
		 el.removeEventListener(evn,handler,true);
		}
		handler=function(e){ 
			var eObj=(r$.data._event[eventID+"D"] || []);
			if(delay){
				// Clear our timeout throughout the scroll
				window.clearTimeout( eObj.deEvent); 
				// Set a timeout to run after scrolling ends
				eObj.deEvent = setTimeout(function() { 
					callback.apply(el,[e]); 
			//	console.log(evntName,delay,callback);
				}, ((delay && !isNaN(delay)) ? delay : 66));
				r$.data._event[eventID+"D"]=eObj;
			}else{
				callback.apply(el,[e]); 
			}
		};
		r$.data._event[eventID]=handler;  
	  //console.log("on",eventID,evn,handler);
		el.addEventListener(evn,handler,true);
	})}catch(e){};
	//console.log("add",r$.data._event,r$.data._event.length);
	return self;
}; 
r$.unbind = function(){
	var evnt=r$.data._event;  
	for (x in evnt) {
		if(x.charAt(0)!='_' && r$("#"+x).length==0){ 
			delete  r$.data._event[x];
		}
	} 
}
r$.fn.off = function(evntName){  
	try{r$.each(this.$, function(el) {
	 var handler=null;
	 try{ 
		 var eventID=r$.getID(el)+"_"+evntName;
		 handler=r$.data._event[eventID];//.pop();
		  delete  r$.data._event[eventID+"D"]
		 if(r$.data._event[eventID].length==0){
			 delete r$.data._event[eventID];
			//console.log("removed",eventID,r$.data._event[eventID]);
		 }
	  }catch(e){}; 
	  var evn=evntName.split("-")[0];
	 // console.log("off",eventID,evn,handler,r$.data._event);
	  el.removeEventListener(evn,handler,true);
	});}catch(e){}; 
	//console.log("remove",r$.data._event);
	return this;
};  
r$.fn.trigger = function(evntName,data){  
	try{ if (window.CustomEvent) {
	  var event = new CustomEvent(evntName, {detail: data});
	} else {
	  var event = document.createEvent('CustomEvent');
	  event.initCustomEvent(evntName, true, true, data);
	} 
	this.$[this.idx].dispatchEvent(event); }catch(e){}
	return this;
};  
//PUB SUB Eent 
r$.data.t=(function() { 
	r$.topics={};
	r$.topicsap="";//already published. 
	var hOP=r$.topics.hasOwnProperty;
	r$.subscribe=function(topic,listener){
			//Create the topic's object if not yet created 
			if(!hOP.call(r$.topics,topic)) r$.topics[topic]=[];
			//add the listener to queue
			//console.log(topics[topic]); 
			var index=r$.topics[topic].push(listener)-1;
			//provide handel back for removal of topic
			if(r$.isPublished(topic)){
				//console.log("Alread published",topic);
				listener.apply();
			} 
			return{
				remove:function(){
					delete r$.topics[topic][index];
				}
			}; 
	};
	r$.publish=function(topic,info){
		r$.topicsap+=(r$.topicsap.indexOf(topic+",")==-1 ? (topic+",") : "");  
		return r$.notify(topic,info);
	};
	r$.send = function(topic,info){  
		 setTimeout(function(){r$.publish(topic,info);},100);   
	}
	r$.isPublished=function(topic){ 
//console.log(ap)	
		  return (r$.topicsap.indexOf(topic+",")!=-1)
	}  
	r$.notify=function(topic,info){ 
		//if the topic doesnot exits, ot there ino listener in quue, just leave 
		if(!hOP.call(r$.topics,topic))return;
		//cycle through topics queue, fire!
		var val=[];    
		r$.topics[topic].forEach(function(item){
			val.push(((info && info.length>1 && typeof(info) =="object") ? item.apply(this,info) :item(info)) );
		});
		return (val.length==1? val[0]: val);
	};
	r$.publishReset=function(topic){
		var indx=r$.topicsap.indexOf(topic+",");
		if(indx!=-1){
			r$.topicsap=r$.topicsap.substring(0,indx)+r$.topicsap.substring(indx+topic.length+1);
		}
	}
})(); 
//events ends 
//html  
r$.createTag=function(html,outer){
	var template = document.createElement(outer?outer:'div'); 
    template.innerHTML = html.trim(); 
    return new r$(template.firstChild);
}
r$.parseHTML=function(html){
	var tmp = document.implementation.createHTMLDocument();
	tmp.body.innerHTML = html;
	return tmp.body.children
}
r$.fn.html=function(html,outer){ 	
	try{if(html!=null && typeof html!='undefined'){ 
		r$.each(this.$, function(el){
			try{el.innerHTML=html;}catch(e){}
		}); 
	}	
	return (outer ? this.$[this.idx].outerHTML : this.$[this.idx].innerHTML);}catch(e){return ""}
} 
r$.fn.text=function(txt){ 	
	try{if(!r$.nul(txt)){ 
		r$.each(this.$, function(el){
			try{el.textContent =txt;}catch(e){}
		}); 
	}	
	return this.$[this.idx].textContent;}catch(e){return "";}
} 
r$.fn.replaceWith=function(html){ 	
	if(!r$.nul(html)){ 
		r$.each(this.$, function(el){
			try{el.outerHTML =html;}catch(e){}
		}); 
	}	
	return this;
}
r$.fn.parent=function(html){   
	try{return r$(this.$[this.idx].parentNode);}catch(e){return new r$()};
} 
r$.fn.prev=function(html){   
	try{return r$(this.$[this.idx].previousElementSibling);}catch(e){return new r$()};
}
r$.fn.next=function(html){   
	try{return r$(this.$[this.idx].nextElementSibling);}catch(e){return new r$()};
}  
//closest(":not(div)"); inter and edge wont support check pollyfill using  For browsers that do not support Element.closest(), but carry support for element.matches() (or a prefixed equivalent, meaning IE9+), a polyfill exists
r$.fn.closest=function(query){   
	try{//console.log(this.$[this.idx].closest(query));
		return new r$(this.$[this.idx].closest(query));}catch(e){return new r$()};
}  

r$.fn.remove=function(){   
	r$.each(this.$, function(el){
		try{el.parentNode.removeChild(el);}catch(e){}
	});  
	return this;
} 
r$.fn.prepend=function(html){ 	 
	r$.each(this.$, function(el){
		/*try{ 
			if (el.firstChild) {
				el.insertBefore(html, el.firstChild);
			} else {
				el.parentNode(html, el.firstChild); 
			} 
		}catch(e){alert(e);console.log(e)} <!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->*/
		
		try{el.insertAdjacentHTML('afterbegin', html)}catch(e){console.log(e)}

	});  
	return this;
} 
r$.fn.before=function(html){  
	r$.each(this.$, function(el){
		try{el.insertAdjacentHTML('beforebegin', html)}catch(e){}
	});  
	return this; 	
}
r$.fn.after=function(html){  
	r$.each(this.$, function(el){
		try{el.insertAdjacentHTML('afterEnd', html)}catch(e){}
	});  
	return this; 	
}
r$.fn.append=function(html){  
	r$.each(this.$, function(el){
		try{el.insertAdjacentHTML('beforeend', html)}catch(e){console.log(e)} 
	});  
	return this; 	
}  
r$.fn.val=function(val){ 
	try{if(val!=null && typeof val!='undefined'){
this.$[this.idx].value=(""+val).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
	}
	return this.$[this.idx].value.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");	}catch(e){return "";}
}
r$.fn.rval=function(val){ 
	try{if(val!=null && typeof val!='undefined'){
this.$[this.idx].value=val;
	}
	return this.$[this.idx].value;	}catch(e){return "";}
}
r$.fn.focus=function(){ 
	try{ this.$[this.idx].focus(); }catch(e){}
	return this;
} /*
r$.fn.sfocus = function() {
  var x = window.scrollX, y = window.scrollY;
  elem.focus();
  window.scrollTo(x, y);
}*/

//html ends 

//Attribute 
r$.fn.attr = function(key,value){
	if(r$.nul(value)){ 
		try{ return this.$[this.idx].getAttribute(key); }catch(e){ return "";}
	}else{
		r$.each(this.$, function(el){
			el.setAttribute(key,value);
		});
		return this;
	}
};  
r$.fn.removeAttr = function(key){ 
	r$.each(this.$, function(el){
		el.removeAttribute(key);
	});
	return this; 
};   
r$.fn.prop = function(key,value){
	if(r$.nul(value)){ 
		try{ return this.$[this.idx][key]; }catch(e){ return "";}
	}else{
		r$.each(this.$, function(el){
			el[key]=value;
		});
		return this;
	}
};  

r$.fn.css = function(key,value){
	var str=(typeof key=="string");
	if(r$.nul(value) && str){
		try{
			return window.getComputedStyle(this.$[this.idx])[key]; 
		}catch(e){
		return "";}
	}else{
		r$.each(this.$, function(el){
			if(str)
				try{el.style[key]=value;}catch(e){}
			else{
				try{ 
					for (var prop in key) {
						try{ el.style[prop]=key[prop]; }catch(e){}
					}
				}catch(e){}
			}
		}); 
		return this;	
		/*
		var elementStyle=this.$[this.idx].style;var out = "";
		var computedStyle = window.getComputedStyle(this.$[this.idx], null);
		for (prop in elementStyle) {
		  if (elementStyle.hasOwnProperty(prop)) {
			out +=  elementStyle[prop] + "d:" + computedStyle[prop] + "'\n";
		  }
		}
		console.log(out)*/
	}
}; 

r$.fn.addClass = function(key){
	r$.each(this.$, function(el){
		try{el.classList.add(key);}catch(e){}
	}); 
	return this;	 
}
r$.fn.removeClass = function(key){
	r$.each(this.$, function(el){
		try{el.classList.remove(key);}catch(e){}
	}); 
	return this;	 
}
r$.fn.hasClass = function(key){
	 try{return this.$[this.idx].classList.contains(key);}catch(e){} 
	return false;	 
} 
r$.fn.is = function(selector){
	 try{ var el=this.$[this.idx]; return ((typeof selector=="string") ? ( ((el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector))) :  (el === selector) );
}catch(e){r$.log && console.error("is-error:",e);} 
	return false;	 
}
r$.fn.isVisible = function( ) {
    try{ 
		var el=this.$[this.idx];
		return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
	}catch(e){}  
	return false;
} 
//Attribute ends  

//display   
r$.fn.position=function(fstyle){   
	try{ 
		var obj=this.$[this.idx]; 
	return {left: !fstyle ? obj.offsetLeft : (r$.nul(obj.style.left) ? 0: parseInt(obj.style.left.replace(/px/ig,""))), top: !fstyle ? obj.offsetTop : (r$.nul(obj.style.top) ? 0 : parseInt(obj.style.top.replace(/px/ig,"")))};}catch(e){return {left:-1,top:-1}; }
} 
r$.fn.width=function(fstyle){ 
	try{var obj=this.$[this.idx]; return !fstyle ? obj.offsetWidth : (obj.width ||obj.innerWidth); }catch(e){return -1;};
}
r$.fn.height=function(fstyle){ 
	try{var obj=this.$[this.idx]; return  !fstyle ? obj.offsetHeight : (obj.height||obj.innerHeight);}catch(e){return -1;};
}
r$.fn.outerWidth=function(){    
	try{var style = getComputedStyle(this.$[this.idx]); 
	return (this.$[this.idx].offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight));}catch(e){return -1;}; 
} 
r$.fn.outerHeight=function(){    
	try{var style = getComputedStyle(this.$[this.idx]); 
	return (this.$[this.idx].offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom)); }catch(e){return -1;};
} 
r$.fn.offset=function(){    
	try{var rect = this.$[this.idx].getBoundingClientRect(); 
	return {top: rect.top + ( window.pageYOffset||document.body.scrollTop), left: rect.left + ( window.pageXOffset||document.body.scrollLeft)};}catch(e){return -1;}; 
} 
r$.fn.clientRect=function(){
	try{return this.$[this.idx].getBoundingClientRect();}catch(e){return {left:-1,top:-1,bottom:-1,right:-1};}; 
}
r$.fn.isInViewport=function(){
	try{
		var rect = this.$[this.idx].getBoundingClientRect(); 
		return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}catch(e){return false;}; 
}
//display 

r$.ajaxSettings={
	type:"GET",
	"async":true,
	"auth":false,
	username:null,
	password:null,
	param:null
	//,"Content-Type":"application/json"
}
r$.ajaxXHR=function(){ 
  if (window.XMLHttpRequest) {
	// Chrome, Firefox, IE7+, Opera, Safari
	return new XMLHttpRequest(); 
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    return new XDomainRequest();
  } 
  // IE6
  try { 
	// The latest stable version. It has the best security, performance, 
	// reliability, and W3C conformance. Ships with Vista, and available 
	// with other OS's via downloads and updates. 
	return new ActiveXObject('MSXML2.XMLHTTP.6.0');
  } catch (e) { 
	try { 
	  // The fallback.
	  return new ActiveXObject('MSXML2.XMLHTTP.3.0');
	} catch (e) { 
	  alert('This browser is not AJAX enabled.'); 
	  return null;
	} 
  } 
} 
  
r$.ajax=function(url,data,options){
	function r4Ajax(url,data,options){
		var initCB=null; 
		var doneCB=null; 
		var errorCB=null; 
		var progressCB=null; 
		var xmlHttp = r$.ajaxXHR();
		var cb={
			done:function(tcb){
				doneCB=tcb;
				return cb;
			},
			init:function(tcb){
				initCB=tcb;
				return cb;
			},
			process:function(){ 
				xmlHttp.onreadystatechange = function() {
					if (xmlHttp.readyState>3 && xmlHttp.status==200){  
						 doneCB && doneCB(xmlHttp.responseText);
					}
				}; 
				xmlHttp.onprogress = function(){
					if (!event.lengthComputable) {
						progressCB &&  progressCB(-1);
						return;
					}
					var loaded = event.loaded;
					var total = event.total;
					var progress = parseInt( ((loaded / total).toFixed(2))*100); 
					progressCB &&   progressCB(total,loaded,progress);
				} 
				options=r$.extend(r$.ajaxSettings,(options ||{}));
				try{
					xmlHttp.open(
						options.type,
						url+(options.type =="GET" && data!=null ? data:""),
						options.async,
						options.username,
						options.password
					);
					options["Content-Type"] && xmlHttp.setRequestHeader("Content-Type", options["Content-Type"]); 
					if(options.auth){
						xmlHttp.withCredentials=true;
					} 
					var inP=r$.ajaxSettings.param;
					//xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');  
					if(inP){
						for(var i=0;i<inP.length;i++){
							var vl=(options[inP[i]] || r$.ajaxSettings[inP[i]])
							if(inP[i].length>0)
								xmlHttp.setRequestHeader(inP[i], vl); 
						}
					}
					initCB && initCB(xmlHttp); 
					xmlHttp.send((options.type =="GET" ? null : data)); 
					//console.log(callback.data);
					//xmlHttp.open("GET", url, true); // true for asynchronous 
				}catch(e){
					errorCB &&  errorCB(e);
				}  		
				return cb;
			},
			error:function(tcb){
				errorCB=tcb;
				return cb; 
			},
			progress:function(tcb){
				progressCB=tcb;
				return cb; 
			}
		} 
		//console.log(url); 
		return cb;
	}
	var fun=new r4Ajax(url,data,options);
	//fun.process();
	setTimeout(function(){fun.process();},1);
	return fun;
}; 

r$.ready(function(){r$.$bdy=r$("body"); }); 
r$.device="default";
r$.responsive=function(json){
  json=r$.extend({"1025":"desktop","1024":"table","768":"mobile"},json);
  var intAry=[];
  for(var key in json){
	 intAry.push(parseInt(key));
  }
  intAry=intAry.sort(function(a, b){return a-b});
  var iL=intAry.length; 
  r$(window).on("resize",function(){
	var view="desktop";	 
	for(var i=0;i<iL;i++){
		if(this.innerWidth<intAry[i]){
			view=json[intAry[i]];
			console.log("break at",intAry[i]);
			break;
		}
	} 
	//console.log(intAry,"resize ",this.innerWidth,r$.device); 
	if(view!=r$.device){
		r$.publish("/r$/viewchange",view);
		r$.device=view;
	}
  },50).trigger("resize");
}
//util
r$.getParam=function(k,qs){
	var val=new RegExp('[\\?&]'+k+'=([^&#]*)').exec((!qs?window.location.href:qs));
	return (val ?  val[1]: "");
}
	
r$.getRandomID=function(format) {//Random Number 
		// https://stackoverflow.com/a/2117523/1177228
  return (format || 'rxxxxxxx-yxxx-4xxx').replace(/[xy]/g, function(c) {
    var  r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
r$.getID=function(el,format) {
	try{
		var randID=el.getAttribute("id"); 
		if(!randID){ 
			randID=r$.getRandomID(format); 
			el.setAttribute("id",randID);
		} 
		return randID;
	}catch(e){return ""}
}
r$.fn.getID=function (format) {
	try{
		return r$.getID(this.$[this.idx],format);
	}catch(e){return ""}
}
//util 	


//r$.extend(r$.cssKey,{"#p":"padding","#w":"width"}) ;
r$.cssKey={"$b":"background","$c":"color","$d":"display","$h":"height","$m":"margin","$p":"padding","$w":"width"}
r$.compileCSS=function(cssStr){
	for(var i in r$.cssKey){
		var regex=new RegExp("(\\"+i+")", "gim");
		 cssStr=cssStr.replace(regex,r$.cssKey[i]); 
	}
	return 	cssStr;
}
r$.declareCSS=function(cssjson,id){ 	 
	try{
		if(typeof cssjson=="object"){
			var styleEl = document.createElement('style'), styleSheet;
			styleEl.setAttribute("id", (id||r$.getRandomID()));
			document.head.appendChild(styleEl); 
			styleSheet = styleEl.sheet;
			for(var i in cssjson){
				var styleStr = i + " {\n"
				for(var j in cssjson[i]){
						var cssVal=cssjson[i][j];
						if(typeof cssVal=="string")
							styleStr += "\t" + j + ":" + cssVal + ";\n"     
						else{ 
							styleStr +="\t\t"+ j + " {\n" 	
							for(var k in cssVal){ 				 
								styleStr += "\t\t\t" + k  + ":" + cssVal[k] + ";\n"  
							}
							styleStr += "\t\t}\n" 
						
						}
				}
				styleStr += "}\n";
				styleStr=r$.compileCSS(styleStr);				
				//console.log(styleStr);
				//styleEl.insertAdjacentHTML('beforeend', styleStr);
				styleSheet.insertRule(styleStr, 0);  
			}
		}
	}catch(e){}		
	//console.log(document.styleSheets[2]);
	return this;
}   
//To cater for ie you have to set the stylesheet to be disabled as it keeps the css styles in memory so removing the element will not work, it can also cause it to crash in some instances if I remember correctly 
 
//animate  
r$.fn.hide=function(display,none){
	this.show((display || "display"),(none || "none"));
	return this;	
}  
r$.fn.show=function(display,block){
	r$.each(this.$, function(el){
		try{el.style[(display || "display")]=(block || "block");}catch(e){}
	}); 
	return this;	
} 
r$.timer= function($el,json) {  
//console.log(el);
//{duration,start, progress,done,tick,step,distance,timeout,maxStep}
	//json=r$.extend({},json); 
   var timer={name:json.name,"timeout":(json.timeout||25),nstep:(json.nstep||1),maxStep:(json.maxStep||20),remaining:0, 			available:true,hold:false,count:1,loop:(typeof json.loop=="undefined" ? true : json.loop), progress:function(){ 
			json.progress && json.progress.apply($el,[timer]);
		},start:function(){   
			if(!timer.loop && timer.count>1) {
				return false;
			}
			timer.remaining=0;  
			timer.count++; 
			json.start && json.start.apply($el,[timer]);
		    timer.check();
		},done:function(){ 
			//console.log("timer done called");
			json.done && json.done.apply($el,[timer]);
		},
		tick:function(remaining){
			 try{ if(!timer.hold){timer.remaining=remaining+timer.nstep; } }catch(e){} 
			return  timer.remaining;
		},
		check:function(){ 
			timer.available=false;
			if(!timer.hold){ 
				if(timer.remaining<timer.maxStep){
					timer.progress(((json.tick && json.tick.apply($el,[timer])) || timer.remaining));
					timer.tick(timer.remaining);
		//console.log(timer.name,"timer.timeout:"+timer.timeout,timer.remaining,"timer.maxStep",timer.maxStep);
					timer.time=setTimeout(function(){timer.check()},timer.timeout); 
				}else{
					//console.log("timer,this.remaining:"+this.remaining,"this.maxStep"+this.maxStep,this.el)
					timer.stop();
					timer.done();
				}
			}
	   },
	   stop:function(){
			window.clearTimeout(timer.time);
			timer.available=true;
	   },
	   restart:function(){ 
		   timer.unpause();
		   json.restart && json.restart.apply($el,[timer]);
		   if(timer.available)
			timer.start();
		 //  console.log("restart",timer.available);
	   },
	   pause:function(){
		   timer.hold=true;timer.check();
		   //console.log("pause");
	   },
	   unpause:function(){
		   timer.hold=false;timer.check();
		   //console.log("unpause");
	   }
   } 
	!json.init && timer.start();
   return timer;
} 
r$.fn.timer=function(json){
	//{duration,start, progress,done,tick}
	var self=this; 
	r$.data.timer=(r$.data.timer||{}); 
	r$.each(this.$, function(el){
		try{
			var randID=el.getAttribute("id");//+"-"+json.name; 
			if(!randID){
				randID=r$.getRandomID();
				el.setAttribute("id",randID);
			}
			randID+="-"+json.name;
			//console.log(randID);
			if(!json.newObj && r$.data.timer[randID]){
				//var json2=r$.extend({},r$.data.timer[randID]);
				r$.data.timer[randID].restart();
			}else{ 
				var json2=r$.extend({},json);
				//console.log("null"+randID);
				json2.start=function(timer){ 
						json.start && json.start.apply(this,[timer]); 
				};
				json2.progress=function(timer){
						json.progress && json.progress.apply(this,[timer]); 
				}
				json2.done=function(timer){ 
						json.done && json.done.apply(this,[timer]);
				}   
				r$.data.timer[randID]= r$.timer(r$(el),json2);   
			}
		}catch(e){r$.log && console.error("timer-error:",e);}
	}); 
	return this;	
}
r$.fn.fadeOut=function(json){
	var self=this;
	var json=(json||{});
	r$.each(this.$, function(el){
		try{ 	
			var json2=r$.extend({name:"fadeOut",remaining:0,maxStep:1,nstep:.08,timeout:30},json,{
				start:function(timer){ 
					var s = el.style;
					s.opacity = s.opacity || 1;
				},
				progress:function(timer){
					var s = el.style; 
					s.opacity =  (1-timer.remaining); 
				},
				done:function(timer){
					el.style[json.display || "display"]= json.none || "none";
					json.done && json.done.apply(el,[timer]);
				},restart:function(timer){ 
					timer.loop=true;
					if(el.style[json.display || "display"]== (json.none || "none")){
						timer.loop=false;
					}
					json.restart && json.restart.apply(el,[timer]);
				}
			}); 
			r$(el).timer(json2); 
		}catch(e){r$.log && console.error("fadeOut-error:",e);}
	}); 
	return self;	
}  
r$.fn.fadeIn=function(json){
	var self=this;
	var json=(json||{});//duration,done,display,block
	//console.log(this.$,json); 
	r$.each(this.$, function(el,index){ 
		try{ 	
		//console.log("json.duration",json.duration); 
			
			var json2=r$.extend({name:"fadeIn",remaining:0,maxStep:1,nstep:.08,timeout:30},json,{
				start:function(timer){ 
					var s = el.style; 
					s.opacity =0;
					s[json.display || "display"]= json.block || "block";
				},
				progress:function(timer){
					//console.log(timer,arguments,this);
					el.style.opacity =  timer.remaining;
				},
				done:function(timer){
					el.style.opacity =1;
					json.done && json.done.apply(el,[timer]);
				},restart:function(timer){ 
					timer.loop=true;
					if(el.style[json.display || "display"]== (json.none || "block")){
						timer.loop=false;
					} 
					json.restart && json.restart.apply(el,[timer]);
				}
			});
			r$(el).timer(json2); 
		}catch(e){r$.log && console.error("fadeIn-error:",e);}
	}); 
	return self;	 
}  

r$.fn.scrollTo=function(json){
	var self=this;
	var json=(json||{}); 
	setTimeout(function(){
	r$.each(self.$, function(el,index){
	try{ 	 
			var ofset=el.offsetTop;  
			var num=(json.distance||( ofset- window.pageYOffset));
			var json2=r$.extend({name:"scrollTo","timeout":25, "step" :1,duration:100,maxStep:num,distance:num},json,{start:function(timer){   
			if(num>0){
				timer.remaining=50;
				timer.maxStep=(ofset- window.pageYOffset);
				timer.forward=true;
			}else{
				timer.remaining=-100;
				timer.maxStep=0;
				timer.forward=false; 
			}
		} ,
				progress:function(timer){
					var curPos=( ofset- window.pageYOffset);
					/*var curPos=( ofset- window.pageYOffset)+timer.step; 
					console.log("scroll2>>remaining:",timer.remaining,"step:"+timer.step,"timer.distance:"+timer.distance,"pageYOffset:"+window.pageYOffset,"curPos:"+curPos,"duration:"+json2.duration,"timer.maxStep:"+timer.maxStep,"ofset:"+ofset," window.pageYOffset:"+ window.pageYOffset,"timer.forward:"+timer.forward);
					if(curPos>0){
						if(timer.remaining>0 && (timer.remaining>= curPos || timer.distance<=window.pageYOffset)){
							//console.log("reached max");
							timer.remaining=timer.maxStep+20;
						}
						if(timer.forward)
							window.scrollBy(0, timer.remaining);
					}else{ 
						window.scrollBy(0, -timer.remaining);
					}
					*/
					//console.log(window.pageYOffset,timer.remaining,"curPos:",curPos,"num:",num,(curPos+window.pageYOffset));
					if(timer.forward){
						if(timer.maxStep>(curPos+window.pageYOffset)){
							timer.remaining=1;
							timer.maxStep=1; 
						}
						window.scrollBy(0, (timer.remaining));
					}else{
						if(curPos==0){
							timer.remaining=1;
							timer.maxStep=1;
						}
						window.scrollBy(0, (timer.remaining)); 					
					}
				},
				done:function(timer){
					json.done && json.done.apply(el,timer);
				},
			}); 
			r$(el).timer(json2);  
		}catch(e){r$.log && console.error("scrollTo-error:",e);}
	}); 
	},10);
	return self;	
}

r$.fn.viewport=function(callback,delay){
	var self=this; 
	var init=function(scrolling){ 
		r$.each(self.$, function(el,index){
		    try{ 	 
				var bounding = el.getBoundingClientRect();
				var check=(
					bounding.top >= 0 &&
					bounding.left >= 0 &&
					bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
					bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
				)
				if(el["viewstate"]!=check){
					callback && callback.apply(el,[check,scrolling]); 
					el["viewstate"]=check; 
				}
			}catch(e){}
		}); 
	}
	function scroll(){
		init(true); 
	} 
	//alert("scorll adding");
	r$(window).off("scroll",scroll).on("scroll",scroll,delay);
	setTimeout(function(){init(false)},10);
	return self;	
}
//animate ends 

//Store values locally 

r$.data.t=function(){   
	r$.encrypt=function(s){
		var enc='';var i=0;var iL=s.length;for(i;i<iL;i++){enc=enc+(String.fromCharCode(s.charCodeAt(i)^1))} return enc;
	}
	r$.store=function(key,opt){ 
		return new r$._store(key,opt);
	} 
	r$._store=function(key,opt){
		var self=this; 
		var k;
		var kExp;
		var store=sessionStorage;
		var options=r$.extend({expire:1,encrypt:true,local:false},opt);
		function set(ky,val){	
			val=((typeof val=="object") ? JSON.stringify(val): ""+val);
			val=((options.encrypt)? r$.encrypt(val):val);
			//console.log("Setting cookie",val,options.encrypt);
			store.setItem(ky,val); 
		}
		function get(ky){    
			var val=store.getItem(ky);
			val=(val==null ?"":val);  
			return ( options.encrypt? r$.encrypt(val):val);
			//return ( (val.charAt(0)=='{' || val.charAt(1)=='{' ) ? JSON.parse(val) : val);
		}
		
		function remove(){
			try{
				store.removeItem(k); 
				store.removeItem(kExp);
			}catch(e){
				console && console.log("Error removing key["+k+"]");
			} 
		}
		function isExpried(kExp){  
			var exp=get(kExp);
			if(r$.nul(exp)||exp==""){exp==0}else exp=parseInt(exp); 
			//console.log(kExp,exp,(exp>0 && exp<Date.now()),Date.now());
			return (exp>0 && exp<Date.now()) 
			return false;
		}
		function init(){    
			if(options.local){
				store=localStorage;
			}
			var i=0,iL=store.length;
			var keys="";
			for(i;i<iL;i++){
				var kys=""+store.key(i); 
				if(kys.indexOf("_exp")!=-1 && isExpried((kys))){ 
					keys+=kys+","; 
				} 
			}
			keys=keys.split(",");
			iL=keys.length-1;
			for(i=0;i<iL;i++){
				store.removeItem(keys[i]); 
				store.removeItem(keys[i].substring(0,keys[i].length-4));
			}
			 for(var ks in opt){
				 options[ks]=opt[ks];
			 } 
			options.expire=(options.expire>1 ? (options.expire*(60*1000)) : 0); 
			k=key; 
			kExp=key+"_exp";
		} 
		
		function clearAll(flag,ikey){  
			var keys="";
			var i=0,iL=store.length;
			for(i;i<iL;i++){
				var kys=""+store.key(i); 
				if(flag||kys.indexOf("_exp")!=-1){ 
					if(ikey&&ikey[kys]) continue;
					keys+=kys+","; 
				} 
			}
			//console.log(keys);
			keys=keys.split(",");
			iL=keys.length-1;
			for(i=0;i<iL;i++){
				store.removeItem(keys[i]); 
				store.removeItem(keys[i].substring(0,keys[i].length-4));
			}
			return true;
		}
		function json(val){
			val=text(val);
			val=( (val.charAt(0)=='{' || val.charAt(1)=='{' ) ? JSON.parse(val) : val);
			//return ;
			return ((val.length==0) ? {} : val);
		}
		function text(val){ 
			if(isExpried(kExp)){ 
				remove();
			} 
			if(!r$.nul(val)){
				set(k,val);		 
				if(options.expire>1 ){ //&& options.text
					set(kExp,Date.now()+options.expire);
				}else{ 
					store.removeItem(kExp); 
				} 
			}
			return get(k);
		}  
		init();
		return {
				'options':options,
				"init":init , 
				"text":text,
				"json":json,
				"remove":remove, 
				"clearAll":clearAll,
				"isExpried":isExpried};
	};
	
}();
//store values ends 

r$.declareCSS({
"@media handheld, only screen and (max-$w: 1024px)":{  
	".r4Container":{
		"max-width":"95%",
		"$m-left":"auto",
		"$m-right":"auto"
	}
},	
"@media handheld, only screen and (max-$w: 767px)":{ 
	"body":{
 		"min-$w":"auto",
		"font-size":"1.09em",
		"letter-spacing":".01em"
	},
	".r4Grid":{
		"$w":"100%",
		"min-$w":"0",
		"$m-left":"0",
		"$m-right":"0",
		"$p-left":"10px", 
		"$p-right":"10px"
	}, 
	"[class*='r4Col-']":{
		"$w":"auto",
		"float":"none",
		"$m":"10px 0",
		"$p-left":"0",
		"$p-right":"10px"
	}, 
	"[class*='r4Col-'] [class*='r4Col-']":{
		"$p-right":"0"
	}, 
	"[class*='r4MCol-']":{
		"float":"left",
		"$m":"0 0 10px",
		"$p-left":"0",
		"$p-right":"10px",
		"$p-bottom":"0"
	}, 
	".r4MCol-1-1":{
		"$w":"100%"
	},
	".r4MCol-2-3, .r4MCol-8-12":{
		"$w":"66.66%"
	}, 
	".r4MCol-1-2, .r4MCol-6-12":{
		"$w":"50%"
	}, 
	".r4MCol-1-3, .r4MCol-4-12":{
		"$w":"33.33%"
	}, 
	".r4MCol-1-4, .r4MCol-3-12":{
		"$w":"25%"
	}, 
	".r4MCol-1-5":{
		"$w":"20%"
	}, 
	".r4MCol-1-6, .r4MCol-2-12":{
		"$w":"16.667%"
	}, 
	".r4MCol-1-7":{
		"$w":"14.28%"
	}, 
	".r4MCol-1-8":{
		"$w":"12.5%"
	}, 
	".r4MCol-1-9":{
		"$w":"11.1%"
	}, 
	".r4MCol-1-10":{
		"$w":"10%"
	}, 
	".r4MCol-1-11":{
		"$w":"9.09%"
	}, 
	".r4MCol-1-12":{
		"$w":"8.33%"
	}, 
	".r4MCol-11-12":{
		"$w":"91.66%"
	}, 
	".r4MCol-10-12":{
		"$w":"83.333%"
	}, 
	".r4MCol-9-12":{
		"$w":"75%"
	}, 
	".r4MCol-5-12":{
		"$w":"41.66%"
	}, 
	".r4MCol-7-12":{
		"$w":"58.33%"
	}, 
	".r4Hide-on-mobile":{
		"$d":"none !important",
		"$w":"0",
		"$h":"0"
	}
},"body": {
	"overflow-x":"hidden",
	"overflow-y":"auto",
	"$m":"0px",
	"$p":"0px", 
   "line-$h":"25px",	 
   "font-weight":"500",
	"letter-spacing":".01em",
	"min-$w":"500px"
}, 
".r4ContainerWrap:after, .r4Container:after, .r4Row:after, .r4Row:after":{
 "content":"''",
 "$d":"table",
 "clear":"both"
 },
".r4ContainerWrap":{
	"$w":"100%"
},
".r4Container":{
	"max-$w":"1200px",
	"$m":"0px auto 0 auto", 
	"$w":"100%"
}, 
".r4ContentWrap":{ 
	"$p":"0",
	"$m":"0"
}, 
".r4Content":{
	"$p":"0 10px 0 10px"
}, 
".r4Row":{
	"$d":"table",
	"$w":"100%"
}, 
".r4Col":{
	"float":"left",
	"vertical-align":"middle"
}, 
".r4FRow":{ 
	"$d":"flex",
	"flex-wrap":"wrap",
	"$w":"100%"
}, 
".r4FCol":{
	"$d":"table-cell",	
	"vertical-align":"middle"
},   
"[class*='r4Grid'],[class*='r4Col-'],[class*='mobile-'],.r4Grid:after":{
	"-webkit-box-sizing":"border-box",
	"-moz-box-sizing":"border-box",
	"box-sizing":"border-box"	
}, 
"[class*='r4Col-']":{
	"float":"left",
  	"min-$h":"1px",
	"$p-right":"20px" 
}, 
"[class*='r4Col-'] [class*='r4Col-']:last-child":{
	"$p-right":"0"
}, 
".r4Grid":{
	"$w":"100%",
	"max-$w":"1140px",
	"min-$w":"748px", 
	"$m":"0 auto",
	"overflow":"hidden"
}, 
".r4Grid:after":{
	"content":"''",
	"$d":"table",
	"clear":"both"
},  
".r4Col-1-1":{
	"$w":"100%"
},
".r4Col-2-3, .r4Col-8-12":{
	"$w":"66.66%"
}, 
".r4Col-1-2, .r4Col-6-12":{
	"$w":"50%"
}, 
".r4Col-1-3, .r4Col-4-12":{
	"$w":"33.33%"
}, 
".r4Col-1-4, .r4Col-3-12":{
	"$w":"25%"
}, 
".r4Col-1-5":{
	"$w":"20%"
}, 
".r4Col-1-6, .r4Col-2-12":{
	"$w":"16.667%"
}, 
".r4Col-1-7":{
	"$w":"14.28%"
}, 
".r4Col-1-8":{
	"$w":"12.5%"
}, 
".r4Col-1-9":{
	"$w":"11.1%"
}, 
".r4Col-1-10":{
	"$w":"10%"
}, 
".r4Col-1-11":{
	"$w":"9.09%"
}, 
".r4Col-1-12":{
	"$w":"8.33%"
}, 
".r4Col-11-12":{
	"$w":"91.66%"
}, 
".r4Col-10-12":{
	"$w":"83.333%"
}, 
".r4Col-9-12":{
	"$w":"75%"
}, 
".r4Col-5-12":{
	"$w":"41.66%"
}, 
".r4Col-7-12":{
	"$w":"58.33%"
}, 
".r4Push-2-3, .r4Push-8-12":{
	"$m-left":"66.66%"
}, 
".r4Push-1-2, .r4Push-6-12":{
	"$m-left":"50%"
}, 
".r4Push-1-3, .r4Push-4-12":{
	"$m-left":"33.33%"
},
".r4Push-1-4, .r4Push-3-12":{
	"$m-left":"25%"
}, 
".r4Push-1-5":{
	"$m-left":"20%"
}, 
".r4Push-1-6, .r4Push-2-12":{
	"$m-left":"16.667%"
}, 
".r4Push-1-7":{
	"$m-left":"14.28%"
}, 
".r4Push-1-8":{
	"$m-left":"12.5%"
}, 
".r4Push-1-9":{
	"$m-left":"11.1%"
}, 
".r4Push-1-10":{
	"$m-left":"10%"
}, 
".r4Push-1-11":{
	"$m-left":"9.09%"
}, 
".r4Push-1-12":{
	"$m-left":"8.33%"
}},"r4grid");
r$.responsive();	