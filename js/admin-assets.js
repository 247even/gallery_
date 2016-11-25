var adminAssets = true;

/*! selectize.js - v0.12.1 | https://github.com/brianreavis/selectize.js | Apache License (v2) */
!function(a,b){"function"==typeof define&&define.amd?define("sifter",b):"object"==typeof exports?module.exports=b():a.Sifter=b()}(this,function(){var a=function(a,b){this.items=a,this.settings=b||{diacritics:!0}};a.prototype.tokenize=function(a){if(a=d(String(a||"").toLowerCase()),!a||!a.length)return[];var b,c,f,h,i=[],j=a.split(/ +/);for(b=0,c=j.length;c>b;b++){if(f=e(j[b]),this.settings.diacritics)for(h in g)g.hasOwnProperty(h)&&(f=f.replace(new RegExp(h,"g"),g[h]));i.push({string:j[b],regex:new RegExp(f,"i")})}return i},a.prototype.iterator=function(a,b){var c;c=f(a)?Array.prototype.forEach||function(a){for(var b=0,c=this.length;c>b;b++)a(this[b],b,this)}:function(a){for(var b in this)this.hasOwnProperty(b)&&a(this[b],b,this)},c.apply(a,[b])},a.prototype.getScoreFunction=function(a,b){var c,d,e,f;c=this,a=c.prepareSearch(a,b),e=a.tokens,d=a.options.fields,f=e.length;var g=function(a,b){var c,d;return a?(a=String(a||""),d=a.search(b.regex),-1===d?0:(c=b.string.length/a.length,0===d&&(c+=.5),c)):0},h=function(){var a=d.length;return a?1===a?function(a,b){return g(b[d[0]],a)}:function(b,c){for(var e=0,f=0;a>e;e++)f+=g(c[d[e]],b);return f/a}:function(){return 0}}();return f?1===f?function(a){return h(e[0],a)}:"and"===a.options.conjunction?function(a){for(var b,c=0,d=0;f>c;c++){if(b=h(e[c],a),0>=b)return 0;d+=b}return d/f}:function(a){for(var b=0,c=0;f>b;b++)c+=h(e[b],a);return c/f}:function(){return 0}},a.prototype.getSortFunction=function(a,c){var d,e,f,g,h,i,j,k,l,m,n;if(f=this,a=f.prepareSearch(a,c),n=!a.query&&c.sort_empty||c.sort,l=function(a,b){return"$score"===a?b.score:f.items[b.id][a]},h=[],n)for(d=0,e=n.length;e>d;d++)(a.query||"$score"!==n[d].field)&&h.push(n[d]);if(a.query){for(m=!0,d=0,e=h.length;e>d;d++)if("$score"===h[d].field){m=!1;break}m&&h.unshift({field:"$score",direction:"desc"})}else for(d=0,e=h.length;e>d;d++)if("$score"===h[d].field){h.splice(d,1);break}for(k=[],d=0,e=h.length;e>d;d++)k.push("desc"===h[d].direction?-1:1);return i=h.length,i?1===i?(g=h[0].field,j=k[0],function(a,c){return j*b(l(g,a),l(g,c))}):function(a,c){var d,e,f;for(d=0;i>d;d++)if(f=h[d].field,e=k[d]*b(l(f,a),l(f,c)))return e;return 0}:null},a.prototype.prepareSearch=function(a,b){if("object"==typeof a)return a;b=c({},b);var d=b.fields,e=b.sort,g=b.sort_empty;return d&&!f(d)&&(b.fields=[d]),e&&!f(e)&&(b.sort=[e]),g&&!f(g)&&(b.sort_empty=[g]),{options:b,query:String(a||"").toLowerCase(),tokens:this.tokenize(a),total:0,items:[]}},a.prototype.search=function(a,b){var c,d,e,f,g=this;return d=this.prepareSearch(a,b),b=d.options,a=d.query,f=b.score||g.getScoreFunction(d),a.length?g.iterator(g.items,function(a,e){c=f(a),(b.filter===!1||c>0)&&d.items.push({score:c,id:e})}):g.iterator(g.items,function(a,b){d.items.push({score:1,id:b})}),e=g.getSortFunction(d,b),e&&d.items.sort(e),d.total=d.items.length,"number"==typeof b.limit&&(d.items=d.items.slice(0,b.limit)),d};var b=function(a,b){return"number"==typeof a&&"number"==typeof b?a>b?1:b>a?-1:0:(a=h(String(a||"")),b=h(String(b||"")),a>b?1:b>a?-1:0)},c=function(a){var b,c,d,e;for(b=1,c=arguments.length;c>b;b++)if(e=arguments[b])for(d in e)e.hasOwnProperty(d)&&(a[d]=e[d]);return a},d=function(a){return(a+"").replace(/^\s+|\s+$|/g,"")},e=function(a){return(a+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")},f=Array.isArray||$&&$.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},g={a:"[aÀÁÂÃÄÅàáâãäåĀāąĄ]",c:"[cÇçćĆčČ]",d:"[dđĐďĎ]",e:"[eÈÉÊËèéêëěĚĒēęĘ]",i:"[iÌÍÎÏìíîïĪī]",l:"[lłŁ]",n:"[nÑñňŇńŃ]",o:"[oÒÓÔÕÕÖØòóôõöøŌō]",r:"[rřŘ]",s:"[sŠšśŚ]",t:"[tťŤ]",u:"[uÙÚÛÜùúûüůŮŪū]",y:"[yŸÿýÝ]",z:"[zŽžżŻźŹ]"},h=function(){var a,b,c,d,e="",f={};for(c in g)if(g.hasOwnProperty(c))for(d=g[c].substring(2,g[c].length-1),e+=d,a=0,b=d.length;b>a;a++)f[d.charAt(a)]=c;var h=new RegExp("["+e+"]","g");return function(a){return a.replace(h,function(a){return f[a]}).toLowerCase()}}();return a}),function(a,b){"function"==typeof define&&define.amd?define("microplugin",b):"object"==typeof exports?module.exports=b():a.MicroPlugin=b()}(this,function(){var a={};a.mixin=function(a){a.plugins={},a.prototype.initializePlugins=function(a){var c,d,e,f=this,g=[];if(f.plugins={names:[],settings:{},requested:{},loaded:{}},b.isArray(a))for(c=0,d=a.length;d>c;c++)"string"==typeof a[c]?g.push(a[c]):(f.plugins.settings[a[c].name]=a[c].options,g.push(a[c].name));else if(a)for(e in a)a.hasOwnProperty(e)&&(f.plugins.settings[e]=a[e],g.push(e));for(;g.length;)f.require(g.shift())},a.prototype.loadPlugin=function(b){var c=this,d=c.plugins,e=a.plugins[b];if(!a.plugins.hasOwnProperty(b))throw new Error('Unable to find "'+b+'" plugin');d.requested[b]=!0,d.loaded[b]=e.fn.apply(c,[c.plugins.settings[b]||{}]),d.names.push(b)},a.prototype.require=function(a){var b=this,c=b.plugins;if(!b.plugins.loaded.hasOwnProperty(a)){if(c.requested[a])throw new Error('Plugin has circular dependency ("'+a+'")');b.loadPlugin(a)}return c.loaded[a]},a.define=function(b,c){a.plugins[b]={name:b,fn:c}}};var b={isArray:Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)}};return a}),function(a,b){"function"==typeof define&&define.amd?define("selectize",["jquery","sifter","microplugin"],b):"object"==typeof exports?module.exports=b(require("jquery"),require("sifter"),require("microplugin")):a.Selectize=b(a.jQuery,a.Sifter,a.MicroPlugin)}(this,function(a,b,c){"use strict";var d=function(a,b){if("string"!=typeof b||b.length){var c="string"==typeof b?new RegExp(b,"i"):b,d=function(a){var b=0;if(3===a.nodeType){var e=a.data.search(c);if(e>=0&&a.data.length>0){var f=a.data.match(c),g=document.createElement("span");g.className="highlight";var h=a.splitText(e),i=(h.splitText(f[0].length),h.cloneNode(!0));g.appendChild(i),h.parentNode.replaceChild(g,h),b=1}}else if(1===a.nodeType&&a.childNodes&&!/(script|style)/i.test(a.tagName))for(var j=0;j<a.childNodes.length;++j)j+=d(a.childNodes[j]);return b};return a.each(function(){d(this)})}},e=function(){};e.prototype={on:function(a,b){this._events=this._events||{},this._events[a]=this._events[a]||[],this._events[a].push(b)},off:function(a,b){var c=arguments.length;return 0===c?delete this._events:1===c?delete this._events[a]:(this._events=this._events||{},void(a in this._events!=!1&&this._events[a].splice(this._events[a].indexOf(b),1)))},trigger:function(a){if(this._events=this._events||{},a in this._events!=!1)for(var b=0;b<this._events[a].length;b++)this._events[a][b].apply(this,Array.prototype.slice.call(arguments,1))}},e.mixin=function(a){for(var b=["on","off","trigger"],c=0;c<b.length;c++)a.prototype[b[c]]=e.prototype[b[c]]};var f=/Mac/.test(navigator.userAgent),g=65,h=13,i=27,j=37,k=38,l=80,m=39,n=40,o=78,p=8,q=46,r=16,s=f?91:17,t=f?18:17,u=9,v=1,w=2,x=!/android/i.test(window.navigator.userAgent)&&!!document.createElement("form").validity,y=function(a){return"undefined"!=typeof a},z=function(a){return"undefined"==typeof a||null===a?null:"boolean"==typeof a?a?"1":"0":a+""},A=function(a){return(a+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},B=function(a){return(a+"").replace(/\$/g,"$$$$")},C={};C.before=function(a,b,c){var d=a[b];a[b]=function(){return c.apply(a,arguments),d.apply(a,arguments)}},C.after=function(a,b,c){var d=a[b];a[b]=function(){var b=d.apply(a,arguments);return c.apply(a,arguments),b}};var D=function(a){var b=!1;return function(){b||(b=!0,a.apply(this,arguments))}},E=function(a,b){var c;return function(){var d=this,e=arguments;window.clearTimeout(c),c=window.setTimeout(function(){a.apply(d,e)},b)}},F=function(a,b,c){var d,e=a.trigger,f={};a.trigger=function(){var c=arguments[0];return-1===b.indexOf(c)?e.apply(a,arguments):void(f[c]=arguments)},c.apply(a,[]),a.trigger=e;for(d in f)f.hasOwnProperty(d)&&e.apply(a,f[d])},G=function(a,b,c,d){a.on(b,c,function(b){for(var c=b.target;c&&c.parentNode!==a[0];)c=c.parentNode;return b.currentTarget=c,d.apply(this,[b])})},H=function(a){var b={};if("selectionStart"in a)b.start=a.selectionStart,b.length=a.selectionEnd-b.start;else if(document.selection){a.focus();var c=document.selection.createRange(),d=document.selection.createRange().text.length;c.moveStart("character",-a.value.length),b.start=c.text.length-d,b.length=d}return b},I=function(a,b,c){var d,e,f={};if(c)for(d=0,e=c.length;e>d;d++)f[c[d]]=a.css(c[d]);else f=a.css();b.css(f)},J=function(b,c){if(!b)return 0;var d=a("<test>").css({position:"absolute",top:-99999,left:-99999,width:"auto",padding:0,whiteSpace:"pre"}).text(b).appendTo("body");I(c,d,["letterSpacing","fontSize","fontFamily","fontWeight","textTransform"]);var e=d.width();return d.remove(),e},K=function(a){var b=null,c=function(c,d){var e,f,g,h,i,j,k,l;c=c||window.event||{},d=d||{},c.metaKey||c.altKey||(d.force||a.data("grow")!==!1)&&(e=a.val(),c.type&&"keydown"===c.type.toLowerCase()&&(f=c.keyCode,g=f>=97&&122>=f||f>=65&&90>=f||f>=48&&57>=f||32===f,f===q||f===p?(l=H(a[0]),l.length?e=e.substring(0,l.start)+e.substring(l.start+l.length):f===p&&l.start?e=e.substring(0,l.start-1)+e.substring(l.start+1):f===q&&"undefined"!=typeof l.start&&(e=e.substring(0,l.start)+e.substring(l.start+1))):g&&(j=c.shiftKey,k=String.fromCharCode(c.keyCode),k=j?k.toUpperCase():k.toLowerCase(),e+=k)),h=a.attr("placeholder"),!e&&h&&(e=h),i=J(e,a)+4,i!==b&&(b=i,a.width(i),a.triggerHandler("resize")))};a.on("keydown keyup update blur",c),c()},L=function(c,d){var e,f,g,h,i=this;h=c[0],h.selectize=i;var j=window.getComputedStyle&&window.getComputedStyle(h,null);if(g=j?j.getPropertyValue("direction"):h.currentStyle&&h.currentStyle.direction,g=g||c.parents("[dir]:first").attr("dir")||"",a.extend(i,{order:0,settings:d,$input:c,tabIndex:c.attr("tabindex")||"",tagType:"select"===h.tagName.toLowerCase()?v:w,rtl:/rtl/i.test(g),eventNS:".selectize"+ ++L.count,highlightedValue:null,isOpen:!1,isDisabled:!1,isRequired:c.is("[required]"),isInvalid:!1,isLocked:!1,isFocused:!1,isInputHidden:!1,isSetup:!1,isShiftDown:!1,isCmdDown:!1,isCtrlDown:!1,ignoreFocus:!1,ignoreBlur:!1,ignoreHover:!1,hasOptions:!1,currentResults:null,lastValue:"",caretPos:0,loading:0,loadedSearches:{},$activeOption:null,$activeItems:[],optgroups:{},options:{},userOptions:{},items:[],renderCache:{},onSearchChange:null===d.loadThrottle?i.onSearchChange:E(i.onSearchChange,d.loadThrottle)}),i.sifter=new b(this.options,{diacritics:d.diacritics}),i.settings.options){for(e=0,f=i.settings.options.length;f>e;e++)i.registerOption(i.settings.options[e]);delete i.settings.options}if(i.settings.optgroups){for(e=0,f=i.settings.optgroups.length;f>e;e++)i.registerOptionGroup(i.settings.optgroups[e]);delete i.settings.optgroups}i.settings.mode=i.settings.mode||(1===i.settings.maxItems?"single":"multi"),"boolean"!=typeof i.settings.hideSelected&&(i.settings.hideSelected="multi"===i.settings.mode),i.initializePlugins(i.settings.plugins),i.setupCallbacks(),i.setupTemplates(),i.setup()};return e.mixin(L),c.mixin(L),a.extend(L.prototype,{setup:function(){var b,c,d,e,g,h,i,j,k,l=this,m=l.settings,n=l.eventNS,o=a(window),p=a(document),q=l.$input;if(i=l.settings.mode,j=q.attr("class")||"",b=a("<div>").addClass(m.wrapperClass).addClass(j).addClass(i),c=a("<div>").addClass(m.inputClass).addClass("items").appendTo(b),d=a('<input type="text" autocomplete="off" />').appendTo(c).attr("tabindex",q.is(":disabled")?"-1":l.tabIndex),h=a(m.dropdownParent||b),e=a("<div>").addClass(m.dropdownClass).addClass(i).hide().appendTo(h),g=a("<div>").addClass(m.dropdownContentClass).appendTo(e),l.settings.copyClassesToDropdown&&e.addClass(j),b.css({width:q[0].style.width}),l.plugins.names.length&&(k="plugin-"+l.plugins.names.join(" plugin-"),b.addClass(k),e.addClass(k)),(null===m.maxItems||m.maxItems>1)&&l.tagType===v&&q.attr("multiple","multiple"),l.settings.placeholder&&d.attr("placeholder",m.placeholder),!l.settings.splitOn&&l.settings.delimiter){var u=l.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");l.settings.splitOn=new RegExp("\\s*"+u+"+\\s*")}q.attr("autocorrect")&&d.attr("autocorrect",q.attr("autocorrect")),q.attr("autocapitalize")&&d.attr("autocapitalize",q.attr("autocapitalize")),l.$wrapper=b,l.$control=c,l.$control_input=d,l.$dropdown=e,l.$dropdown_content=g,e.on("mouseenter","[data-selectable]",function(){return l.onOptionHover.apply(l,arguments)}),e.on("mousedown click","[data-selectable]",function(){return l.onOptionSelect.apply(l,arguments)}),G(c,"mousedown","*:not(input)",function(){return l.onItemSelect.apply(l,arguments)}),K(d),c.on({mousedown:function(){return l.onMouseDown.apply(l,arguments)},click:function(){return l.onClick.apply(l,arguments)}}),d.on({mousedown:function(a){a.stopPropagation()},keydown:function(){return l.onKeyDown.apply(l,arguments)},keyup:function(){return l.onKeyUp.apply(l,arguments)},keypress:function(){return l.onKeyPress.apply(l,arguments)},resize:function(){l.positionDropdown.apply(l,[])},blur:function(){return l.onBlur.apply(l,arguments)},focus:function(){return l.ignoreBlur=!1,l.onFocus.apply(l,arguments)},paste:function(){return l.onPaste.apply(l,arguments)}}),p.on("keydown"+n,function(a){l.isCmdDown=a[f?"metaKey":"ctrlKey"],l.isCtrlDown=a[f?"altKey":"ctrlKey"],l.isShiftDown=a.shiftKey}),p.on("keyup"+n,function(a){a.keyCode===t&&(l.isCtrlDown=!1),a.keyCode===r&&(l.isShiftDown=!1),a.keyCode===s&&(l.isCmdDown=!1)}),p.on("mousedown"+n,function(a){if(l.isFocused){if(a.target===l.$dropdown[0]||a.target.parentNode===l.$dropdown[0])return!1;l.$control.has(a.target).length||a.target===l.$control[0]||l.blur(a.target)}}),o.on(["scroll"+n,"resize"+n].join(" "),function(){l.isOpen&&l.positionDropdown.apply(l,arguments)}),o.on("mousemove"+n,function(){l.ignoreHover=!1}),this.revertSettings={$children:q.children().detach(),tabindex:q.attr("tabindex")},q.attr("tabindex",-1).hide().after(l.$wrapper),a.isArray(m.items)&&(l.setValue(m.items),delete m.items),x&&q.on("invalid"+n,function(a){a.preventDefault(),l.isInvalid=!0,l.refreshState()}),l.updateOriginalInput(),l.refreshItems(),l.refreshState(),l.updatePlaceholder(),l.isSetup=!0,q.is(":disabled")&&l.disable(),l.on("change",this.onChange),q.data("selectize",l),q.addClass("selectized"),l.trigger("initialize"),m.preload===!0&&l.onSearchChange("")},setupTemplates:function(){var b=this,c=b.settings.labelField,d=b.settings.optgroupLabelField,e={optgroup:function(a){return'<div class="optgroup">'+a.html+"</div>"},optgroup_header:function(a,b){return'<div class="optgroup-header">'+b(a[d])+"</div>"},option:function(a,b){return'<div class="option">'+b(a[c])+"</div>"},item:function(a,b){return'<div class="item">'+b(a[c])+"</div>"},option_create:function(a,b){return'<div class="create">Add <strong>'+b(a.input)+"</strong>&hellip;</div>"}};b.settings.render=a.extend({},e,b.settings.render)},setupCallbacks:function(){var a,b,c={initialize:"onInitialize",change:"onChange",item_add:"onItemAdd",item_remove:"onItemRemove",clear:"onClear",option_add:"onOptionAdd",option_remove:"onOptionRemove",option_clear:"onOptionClear",optgroup_add:"onOptionGroupAdd",optgroup_remove:"onOptionGroupRemove",optgroup_clear:"onOptionGroupClear",dropdown_open:"onDropdownOpen",dropdown_close:"onDropdownClose",type:"onType",load:"onLoad",focus:"onFocus",blur:"onBlur"};for(a in c)c.hasOwnProperty(a)&&(b=this.settings[c[a]],b&&this.on(a,b))},onClick:function(a){var b=this;b.isFocused||(b.focus(),a.preventDefault())},onMouseDown:function(b){{var c=this,d=b.isDefaultPrevented();a(b.target)}if(c.isFocused){if(b.target!==c.$control_input[0])return"single"===c.settings.mode?c.isOpen?c.close():c.open():d||c.setActiveItem(null),!1}else d||window.setTimeout(function(){c.focus()},0)},onChange:function(){this.$input.trigger("change")},onPaste:function(b){var c=this;c.isFull()||c.isInputHidden||c.isLocked?b.preventDefault():c.settings.splitOn&&setTimeout(function(){for(var b=a.trim(c.$control_input.val()||"").split(c.settings.splitOn),d=0,e=b.length;e>d;d++)c.createItem(b[d])},0)},onKeyPress:function(a){if(this.isLocked)return a&&a.preventDefault();var b=String.fromCharCode(a.keyCode||a.which);return this.settings.create&&"multi"===this.settings.mode&&b===this.settings.delimiter?(this.createItem(),a.preventDefault(),!1):void 0},onKeyDown:function(a){var b=(a.target===this.$control_input[0],this);if(b.isLocked)return void(a.keyCode!==u&&a.preventDefault());switch(a.keyCode){case g:if(b.isCmdDown)return void b.selectAll();break;case i:return void(b.isOpen&&(a.preventDefault(),a.stopPropagation(),b.close()));case o:if(!a.ctrlKey||a.altKey)break;case n:if(!b.isOpen&&b.hasOptions)b.open();else if(b.$activeOption){b.ignoreHover=!0;var c=b.getAdjacentOption(b.$activeOption,1);c.length&&b.setActiveOption(c,!0,!0)}return void a.preventDefault();case l:if(!a.ctrlKey||a.altKey)break;case k:if(b.$activeOption){b.ignoreHover=!0;var d=b.getAdjacentOption(b.$activeOption,-1);d.length&&b.setActiveOption(d,!0,!0)}return void a.preventDefault();case h:return void(b.isOpen&&b.$activeOption&&(b.onOptionSelect({currentTarget:b.$activeOption}),a.preventDefault()));case j:return void b.advanceSelection(-1,a);case m:return void b.advanceSelection(1,a);case u:return b.settings.selectOnTab&&b.isOpen&&b.$activeOption&&(b.onOptionSelect({currentTarget:b.$activeOption}),b.isFull()||a.preventDefault()),void(b.settings.create&&b.createItem()&&a.preventDefault());case p:case q:return void b.deleteSelection(a)}return!b.isFull()&&!b.isInputHidden||(f?a.metaKey:a.ctrlKey)?void 0:void a.preventDefault()},onKeyUp:function(a){var b=this;if(b.isLocked)return a&&a.preventDefault();var c=b.$control_input.val()||"";b.lastValue!==c&&(b.lastValue=c,b.onSearchChange(c),b.refreshOptions(),b.trigger("type",c))},onSearchChange:function(a){var b=this,c=b.settings.load;c&&(b.loadedSearches.hasOwnProperty(a)||(b.loadedSearches[a]=!0,b.load(function(d){c.apply(b,[a,d])})))},onFocus:function(a){var b=this,c=b.isFocused;return b.isDisabled?(b.blur(),a&&a.preventDefault(),!1):void(b.ignoreFocus||(b.isFocused=!0,"focus"===b.settings.preload&&b.onSearchChange(""),c||b.trigger("focus"),b.$activeItems.length||(b.showInput(),b.setActiveItem(null),b.refreshOptions(!!b.settings.openOnFocus)),b.refreshState()))},onBlur:function(a,b){var c=this;if(c.isFocused&&(c.isFocused=!1,!c.ignoreFocus)){if(!c.ignoreBlur&&document.activeElement===c.$dropdown_content[0])return c.ignoreBlur=!0,void c.onFocus(a);var d=function(){c.close(),c.setTextboxValue(""),c.setActiveItem(null),c.setActiveOption(null),c.setCaret(c.items.length),c.refreshState(),(b||document.body).focus(),c.ignoreFocus=!1,c.trigger("blur")};c.ignoreFocus=!0,c.settings.create&&c.settings.createOnBlur?c.createItem(null,!1,d):d()}},onOptionHover:function(a){this.ignoreHover||this.setActiveOption(a.currentTarget,!1)},onOptionSelect:function(b){var c,d,e=this;b.preventDefault&&(b.preventDefault(),b.stopPropagation()),d=a(b.currentTarget),d.hasClass("create")?e.createItem(null,function(){e.settings.closeAfterSelect&&e.close()}):(c=d.attr("data-value"),"undefined"!=typeof c&&(e.lastQuery=null,e.setTextboxValue(""),e.addItem(c),e.settings.closeAfterSelect?e.close():!e.settings.hideSelected&&b.type&&/mouse/.test(b.type)&&e.setActiveOption(e.getOption(c))))},onItemSelect:function(a){var b=this;b.isLocked||"multi"===b.settings.mode&&(a.preventDefault(),b.setActiveItem(a.currentTarget,a))},load:function(a){var b=this,c=b.$wrapper.addClass(b.settings.loadingClass);b.loading++,a.apply(b,[function(a){b.loading=Math.max(b.loading-1,0),a&&a.length&&(b.addOption(a),b.refreshOptions(b.isFocused&&!b.isInputHidden)),b.loading||c.removeClass(b.settings.loadingClass),b.trigger("load",a)}])},setTextboxValue:function(a){var b=this.$control_input,c=b.val()!==a;c&&(b.val(a).triggerHandler("update"),this.lastValue=a)},getValue:function(){return this.tagType===v&&this.$input.attr("multiple")?this.items:this.items.join(this.settings.delimiter)},setValue:function(a,b){var c=b?[]:["change"];F(this,c,function(){this.clear(b),this.addItems(a,b)})},setActiveItem:function(b,c){var d,e,f,g,h,i,j,k,l=this;if("single"!==l.settings.mode){if(b=a(b),!b.length)return a(l.$activeItems).removeClass("active"),l.$activeItems=[],void(l.isFocused&&l.showInput());if(d=c&&c.type.toLowerCase(),"mousedown"===d&&l.isShiftDown&&l.$activeItems.length){for(k=l.$control.children(".active:last"),g=Array.prototype.indexOf.apply(l.$control[0].childNodes,[k[0]]),h=Array.prototype.indexOf.apply(l.$control[0].childNodes,[b[0]]),g>h&&(j=g,g=h,h=j),e=g;h>=e;e++)i=l.$control[0].childNodes[e],-1===l.$activeItems.indexOf(i)&&(a(i).addClass("active"),l.$activeItems.push(i));c.preventDefault()}else"mousedown"===d&&l.isCtrlDown||"keydown"===d&&this.isShiftDown?b.hasClass("active")?(f=l.$activeItems.indexOf(b[0]),l.$activeItems.splice(f,1),b.removeClass("active")):l.$activeItems.push(b.addClass("active")[0]):(a(l.$activeItems).removeClass("active"),l.$activeItems=[b.addClass("active")[0]]);l.hideInput(),this.isFocused||l.focus()}},setActiveOption:function(b,c,d){var e,f,g,h,i,j=this;j.$activeOption&&j.$activeOption.removeClass("active"),j.$activeOption=null,b=a(b),b.length&&(j.$activeOption=b.addClass("active"),(c||!y(c))&&(e=j.$dropdown_content.height(),f=j.$activeOption.outerHeight(!0),c=j.$dropdown_content.scrollTop()||0,g=j.$activeOption.offset().top-j.$dropdown_content.offset().top+c,h=g,i=g-e+f,g+f>e+c?j.$dropdown_content.stop().animate({scrollTop:i},d?j.settings.scrollDuration:0):c>g&&j.$dropdown_content.stop().animate({scrollTop:h},d?j.settings.scrollDuration:0)))},selectAll:function(){var a=this;"single"!==a.settings.mode&&(a.$activeItems=Array.prototype.slice.apply(a.$control.children(":not(input)").addClass("active")),a.$activeItems.length&&(a.hideInput(),a.close()),a.focus())},hideInput:function(){var a=this;a.setTextboxValue(""),a.$control_input.css({opacity:0,position:"absolute",left:a.rtl?1e4:-1e4}),a.isInputHidden=!0},showInput:function(){this.$control_input.css({opacity:1,position:"relative",left:0}),this.isInputHidden=!1},focus:function(){var a=this;a.isDisabled||(a.ignoreFocus=!0,a.$control_input[0].focus(),window.setTimeout(function(){a.ignoreFocus=!1,a.onFocus()},0))},blur:function(a){this.$control_input[0].blur(),this.onBlur(null,a)},getScoreFunction:function(a){return this.sifter.getScoreFunction(a,this.getSearchOptions())},getSearchOptions:function(){var a=this.settings,b=a.sortField;return"string"==typeof b&&(b=[{field:b}]),{fields:a.searchField,conjunction:a.searchConjunction,sort:b}},search:function(b){var c,d,e,f=this,g=f.settings,h=this.getSearchOptions();if(g.score&&(e=f.settings.score.apply(this,[b]),"function"!=typeof e))throw new Error('Selectize "score" setting must be a function that returns a function');if(b!==f.lastQuery?(f.lastQuery=b,d=f.sifter.search(b,a.extend(h,{score:e})),f.currentResults=d):d=a.extend(!0,{},f.currentResults),g.hideSelected)for(c=d.items.length-1;c>=0;c--)-1!==f.items.indexOf(z(d.items[c].id))&&d.items.splice(c,1);return d},refreshOptions:function(b){var c,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;"undefined"==typeof b&&(b=!0);var t=this,u=a.trim(t.$control_input.val()),v=t.search(u),w=t.$dropdown_content,x=t.$activeOption&&z(t.$activeOption.attr("data-value"));for(g=v.items.length,"number"==typeof t.settings.maxOptions&&(g=Math.min(g,t.settings.maxOptions)),h={},i=[],c=0;g>c;c++)for(j=t.options[v.items[c].id],k=t.render("option",j),l=j[t.settings.optgroupField]||"",m=a.isArray(l)?l:[l],e=0,f=m&&m.length;f>e;e++)l=m[e],t.optgroups.hasOwnProperty(l)||(l=""),h.hasOwnProperty(l)||(h[l]=[],i.push(l)),h[l].push(k);for(this.settings.lockOptgroupOrder&&i.sort(function(a,b){var c=t.optgroups[a].$order||0,d=t.optgroups[b].$order||0;return c-d}),n=[],c=0,g=i.length;g>c;c++)l=i[c],t.optgroups.hasOwnProperty(l)&&h[l].length?(o=t.render("optgroup_header",t.optgroups[l])||"",o+=h[l].join(""),n.push(t.render("optgroup",a.extend({},t.optgroups[l],{html:o})))):n.push(h[l].join(""));if(w.html(n.join("")),t.settings.highlight&&v.query.length&&v.tokens.length)for(c=0,g=v.tokens.length;g>c;c++)d(w,v.tokens[c].regex);if(!t.settings.hideSelected)for(c=0,g=t.items.length;g>c;c++)t.getOption(t.items[c]).addClass("selected");p=t.canCreate(u),p&&(w.prepend(t.render("option_create",{input:u})),s=a(w[0].childNodes[0])),t.hasOptions=v.items.length>0||p,t.hasOptions?(v.items.length>0?(r=x&&t.getOption(x),r&&r.length?q=r:"single"===t.settings.mode&&t.items.length&&(q=t.getOption(t.items[0])),q&&q.length||(q=s&&!t.settings.addPrecedence?t.getAdjacentOption(s,1):w.find("[data-selectable]:first"))):q=s,t.setActiveOption(q),b&&!t.isOpen&&t.open()):(t.setActiveOption(null),b&&t.isOpen&&t.close())},addOption:function(b){var c,d,e,f=this;if(a.isArray(b))for(c=0,d=b.length;d>c;c++)f.addOption(b[c]);else(e=f.registerOption(b))&&(f.userOptions[e]=!0,f.lastQuery=null,f.trigger("option_add",e,b))},registerOption:function(a){var b=z(a[this.settings.valueField]);return!b||this.options.hasOwnProperty(b)?!1:(a.$order=a.$order||++this.order,this.options[b]=a,b)},registerOptionGroup:function(a){var b=z(a[this.settings.optgroupValueField]);return b?(a.$order=a.$order||++this.order,this.optgroups[b]=a,b):!1},addOptionGroup:function(a,b){b[this.settings.optgroupValueField]=a,(a=this.registerOptionGroup(b))&&this.trigger("optgroup_add",a,b)},removeOptionGroup:function(a){this.optgroups.hasOwnProperty(a)&&(delete this.optgroups[a],this.renderCache={},this.trigger("optgroup_remove",a))},clearOptionGroups:function(){this.optgroups={},this.renderCache={},this.trigger("optgroup_clear")},updateOption:function(b,c){var d,e,f,g,h,i,j,k=this;if(b=z(b),f=z(c[k.settings.valueField]),null!==b&&k.options.hasOwnProperty(b)){if("string"!=typeof f)throw new Error("Value must be set in option data");j=k.options[b].$order,f!==b&&(delete k.options[b],g=k.items.indexOf(b),-1!==g&&k.items.splice(g,1,f)),c.$order=c.$order||j,k.options[f]=c,h=k.renderCache.item,i=k.renderCache.option,h&&(delete h[b],delete h[f]),i&&(delete i[b],delete i[f]),-1!==k.items.indexOf(f)&&(d=k.getItem(b),e=a(k.render("item",c)),d.hasClass("active")&&e.addClass("active"),d.replaceWith(e)),k.lastQuery=null,k.isOpen&&k.refreshOptions(!1)}},removeOption:function(a,b){var c=this;a=z(a);var d=c.renderCache.item,e=c.renderCache.option;d&&delete d[a],e&&delete e[a],delete c.userOptions[a],delete c.options[a],c.lastQuery=null,c.trigger("option_remove",a),c.removeItem(a,b)},clearOptions:function(){var a=this;a.loadedSearches={},a.userOptions={},a.renderCache={},a.options=a.sifter.items={},a.lastQuery=null,a.trigger("option_clear"),a.clear()},getOption:function(a){return this.getElementWithValue(a,this.$dropdown_content.find("[data-selectable]"))},getAdjacentOption:function(b,c){var d=this.$dropdown.find("[data-selectable]"),e=d.index(b)+c;return e>=0&&e<d.length?d.eq(e):a()},getElementWithValue:function(b,c){if(b=z(b),"undefined"!=typeof b&&null!==b)for(var d=0,e=c.length;e>d;d++)if(c[d].getAttribute("data-value")===b)return a(c[d]);return a()},getItem:function(a){return this.getElementWithValue(a,this.$control.children())},addItems:function(b,c){for(var d=a.isArray(b)?b:[b],e=0,f=d.length;f>e;e++)this.isPending=f-1>e,this.addItem(d[e],c)},addItem:function(b,c){var d=c?[]:["change"];F(this,d,function(){var d,e,f,g,h,i=this,j=i.settings.mode;return b=z(b),-1!==i.items.indexOf(b)?void("single"===j&&i.close()):void(i.options.hasOwnProperty(b)&&("single"===j&&i.clear(c),"multi"===j&&i.isFull()||(d=a(i.render("item",i.options[b])),h=i.isFull(),i.items.splice(i.caretPos,0,b),i.insertAtCaret(d),(!i.isPending||!h&&i.isFull())&&i.refreshState(),i.isSetup&&(f=i.$dropdown_content.find("[data-selectable]"),i.isPending||(e=i.getOption(b),g=i.getAdjacentOption(e,1).attr("data-value"),i.refreshOptions(i.isFocused&&"single"!==j),g&&i.setActiveOption(i.getOption(g))),!f.length||i.isFull()?i.close():i.positionDropdown(),i.updatePlaceholder(),i.trigger("item_add",b,d),i.updateOriginalInput({silent:c})))))})},removeItem:function(a,b){var c,d,e,f=this;c="object"==typeof a?a:f.getItem(a),a=z(c.attr("data-value")),d=f.items.indexOf(a),-1!==d&&(c.remove(),c.hasClass("active")&&(e=f.$activeItems.indexOf(c[0]),f.$activeItems.splice(e,1)),f.items.splice(d,1),f.lastQuery=null,!f.settings.persist&&f.userOptions.hasOwnProperty(a)&&f.removeOption(a,b),d<f.caretPos&&f.setCaret(f.caretPos-1),f.refreshState(),f.updatePlaceholder(),f.updateOriginalInput({silent:b}),f.positionDropdown(),f.trigger("item_remove",a,c))},createItem:function(b,c){var d=this,e=d.caretPos;b=b||a.trim(d.$control_input.val()||"");var f=arguments[arguments.length-1];if("function"!=typeof f&&(f=function(){}),"boolean"!=typeof c&&(c=!0),!d.canCreate(b))return f(),!1;d.lock();var g="function"==typeof d.settings.create?this.settings.create:function(a){var b={};return b[d.settings.labelField]=a,b[d.settings.valueField]=a,b},h=D(function(a){if(d.unlock(),!a||"object"!=typeof a)return f();var b=z(a[d.settings.valueField]);return"string"!=typeof b?f():(d.setTextboxValue(""),d.addOption(a),d.setCaret(e),d.addItem(b),d.refreshOptions(c&&"single"!==d.settings.mode),void f(a))}),i=g.apply(this,[b,h]);return"undefined"!=typeof i&&h(i),!0},refreshItems:function(){this.lastQuery=null,this.isSetup&&this.addItem(this.items),this.refreshState(),this.updateOriginalInput()},refreshState:function(){var a,b=this;b.isRequired&&(b.items.length&&(b.isInvalid=!1),b.$control_input.prop("required",a)),b.refreshClasses()},refreshClasses:function(){var b=this,c=b.isFull(),d=b.isLocked;b.$wrapper.toggleClass("rtl",b.rtl),b.$control.toggleClass("focus",b.isFocused).toggleClass("disabled",b.isDisabled).toggleClass("required",b.isRequired).toggleClass("invalid",b.isInvalid).toggleClass("locked",d).toggleClass("full",c).toggleClass("not-full",!c).toggleClass("input-active",b.isFocused&&!b.isInputHidden).toggleClass("dropdown-active",b.isOpen).toggleClass("has-options",!a.isEmptyObject(b.options)).toggleClass("has-items",b.items.length>0),b.$control_input.data("grow",!c&&!d)},isFull:function(){return null!==this.settings.maxItems&&this.items.length>=this.settings.maxItems},updateOriginalInput:function(a){var b,c,d,e,f=this;if(a=a||{},f.tagType===v){for(d=[],b=0,c=f.items.length;c>b;b++)e=f.options[f.items[b]][f.settings.labelField]||"",d.push('<option value="'+A(f.items[b])+'" selected="selected">'+A(e)+"</option>");d.length||this.$input.attr("multiple")||d.push('<option value="" selected="selected"></option>'),f.$input.html(d.join(""))}else f.$input.val(f.getValue()),f.$input.attr("value",f.$input.val());f.isSetup&&(a.silent||f.trigger("change",f.$input.val()))},updatePlaceholder:function(){if(this.settings.placeholder){var a=this.$control_input;this.items.length?a.removeAttr("placeholder"):a.attr("placeholder",this.settings.placeholder),a.triggerHandler("update",{force:!0})}},open:function(){var a=this;a.isLocked||a.isOpen||"multi"===a.settings.mode&&a.isFull()||(a.focus(),a.isOpen=!0,a.refreshState(),a.$dropdown.css({visibility:"hidden",display:"block"}),a.positionDropdown(),a.$dropdown.css({visibility:"visible"}),a.trigger("dropdown_open",a.$dropdown))},close:function(){var a=this,b=a.isOpen;"single"===a.settings.mode&&a.items.length&&a.hideInput(),a.isOpen=!1,a.$dropdown.hide(),a.setActiveOption(null),a.refreshState(),b&&a.trigger("dropdown_close",a.$dropdown)},positionDropdown:function(){var a=this.$control,b="body"===this.settings.dropdownParent?a.offset():a.position();b.top+=a.outerHeight(!0),this.$dropdown.css({width:a.outerWidth(),top:b.top,left:b.left})},clear:function(a){var b=this;b.items.length&&(b.$control.children(":not(input)").remove(),b.items=[],b.lastQuery=null,b.setCaret(0),b.setActiveItem(null),b.updatePlaceholder(),b.updateOriginalInput({silent:a}),b.refreshState(),b.showInput(),b.trigger("clear"))},insertAtCaret:function(b){var c=Math.min(this.caretPos,this.items.length);0===c?this.$control.prepend(b):a(this.$control[0].childNodes[c]).before(b),this.setCaret(c+1)},deleteSelection:function(b){var c,d,e,f,g,h,i,j,k,l=this;if(e=b&&b.keyCode===p?-1:1,f=H(l.$control_input[0]),l.$activeOption&&!l.settings.hideSelected&&(i=l.getAdjacentOption(l.$activeOption,-1).attr("data-value")),g=[],l.$activeItems.length){for(k=l.$control.children(".active:"+(e>0?"last":"first")),h=l.$control.children(":not(input)").index(k),e>0&&h++,c=0,d=l.$activeItems.length;d>c;c++)g.push(a(l.$activeItems[c]).attr("data-value"));
b&&(b.preventDefault(),b.stopPropagation())}else(l.isFocused||"single"===l.settings.mode)&&l.items.length&&(0>e&&0===f.start&&0===f.length?g.push(l.items[l.caretPos-1]):e>0&&f.start===l.$control_input.val().length&&g.push(l.items[l.caretPos]));if(!g.length||"function"==typeof l.settings.onDelete&&l.settings.onDelete.apply(l,[g])===!1)return!1;for("undefined"!=typeof h&&l.setCaret(h);g.length;)l.removeItem(g.pop());return l.showInput(),l.positionDropdown(),l.refreshOptions(!0),i&&(j=l.getOption(i),j.length&&l.setActiveOption(j)),!0},advanceSelection:function(a,b){var c,d,e,f,g,h,i=this;0!==a&&(i.rtl&&(a*=-1),c=a>0?"last":"first",d=H(i.$control_input[0]),i.isFocused&&!i.isInputHidden?(f=i.$control_input.val().length,g=0>a?0===d.start&&0===d.length:d.start===f,g&&!f&&i.advanceCaret(a,b)):(h=i.$control.children(".active:"+c),h.length&&(e=i.$control.children(":not(input)").index(h),i.setActiveItem(null),i.setCaret(a>0?e+1:e))))},advanceCaret:function(a,b){var c,d,e=this;0!==a&&(c=a>0?"next":"prev",e.isShiftDown?(d=e.$control_input[c](),d.length&&(e.hideInput(),e.setActiveItem(d),b&&b.preventDefault())):e.setCaret(e.caretPos+a))},setCaret:function(b){var c=this;if(b="single"===c.settings.mode?c.items.length:Math.max(0,Math.min(c.items.length,b)),!c.isPending){var d,e,f,g;for(f=c.$control.children(":not(input)"),d=0,e=f.length;e>d;d++)g=a(f[d]).detach(),b>d?c.$control_input.before(g):c.$control.append(g)}c.caretPos=b},lock:function(){this.close(),this.isLocked=!0,this.refreshState()},unlock:function(){this.isLocked=!1,this.refreshState()},disable:function(){var a=this;a.$input.prop("disabled",!0),a.$control_input.prop("disabled",!0).prop("tabindex",-1),a.isDisabled=!0,a.lock()},enable:function(){var a=this;a.$input.prop("disabled",!1),a.$control_input.prop("disabled",!1).prop("tabindex",a.tabIndex),a.isDisabled=!1,a.unlock()},destroy:function(){var b=this,c=b.eventNS,d=b.revertSettings;b.trigger("destroy"),b.off(),b.$wrapper.remove(),b.$dropdown.remove(),b.$input.html("").append(d.$children).removeAttr("tabindex").removeClass("selectized").attr({tabindex:d.tabindex}).show(),b.$control_input.removeData("grow"),b.$input.removeData("selectize"),a(window).off(c),a(document).off(c),a(document.body).off(c),delete b.$input[0].selectize},render:function(a,b){var c,d,e="",f=!1,g=this,h=/^[\t \r\n]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;return("option"===a||"item"===a)&&(c=z(b[g.settings.valueField]),f=!!c),f&&(y(g.renderCache[a])||(g.renderCache[a]={}),g.renderCache[a].hasOwnProperty(c))?g.renderCache[a][c]:(e=g.settings.render[a].apply(this,[b,A]),("option"===a||"option_create"===a)&&(e=e.replace(h,"<$1 data-selectable")),"optgroup"===a&&(d=b[g.settings.optgroupValueField]||"",e=e.replace(h,'<$1 data-group="'+B(A(d))+'"')),("option"===a||"item"===a)&&(e=e.replace(h,'<$1 data-value="'+B(A(c||""))+'"')),f&&(g.renderCache[a][c]=e),e)},clearCache:function(a){var b=this;"undefined"==typeof a?b.renderCache={}:delete b.renderCache[a]},canCreate:function(a){var b=this;if(!b.settings.create)return!1;var c=b.settings.createFilter;return!(!a.length||"function"==typeof c&&!c.apply(b,[a])||"string"==typeof c&&!new RegExp(c).test(a)||c instanceof RegExp&&!c.test(a))}}),L.count=0,L.defaults={options:[],optgroups:[],plugins:[],delimiter:",",splitOn:null,persist:!0,diacritics:!0,create:!1,createOnBlur:!1,createFilter:null,highlight:!0,openOnFocus:!0,maxOptions:1e3,maxItems:null,hideSelected:null,addPrecedence:!1,selectOnTab:!1,preload:!1,allowEmptyOption:!1,closeAfterSelect:!1,scrollDuration:60,loadThrottle:300,loadingClass:"loading",dataAttr:"data-data",optgroupField:"optgroup",valueField:"value",labelField:"text",optgroupLabelField:"label",optgroupValueField:"value",lockOptgroupOrder:!1,sortField:"$order",searchField:["text"],searchConjunction:"and",mode:null,wrapperClass:"selectize-control",inputClass:"selectize-input",dropdownClass:"selectize-dropdown",dropdownContentClass:"selectize-dropdown-content",dropdownParent:null,copyClassesToDropdown:!0,render:{}},a.fn.selectize=function(b){var c=a.fn.selectize.defaults,d=a.extend({},c,b),e=d.dataAttr,f=d.labelField,g=d.valueField,h=d.optgroupField,i=d.optgroupLabelField,j=d.optgroupValueField,k=function(b,c){var h,i,j,k,l=b.attr(e);if(l)for(c.options=JSON.parse(l),h=0,i=c.options.length;i>h;h++)c.items.push(c.options[h][g]);else{var m=a.trim(b.val()||"");if(!d.allowEmptyOption&&!m.length)return;for(j=m.split(d.delimiter),h=0,i=j.length;i>h;h++)k={},k[f]=j[h],k[g]=j[h],c.options.push(k);c.items=j}},l=function(b,c){var k,l,m,n,o=c.options,p={},q=function(a){var b=e&&a.attr(e);return"string"==typeof b&&b.length?JSON.parse(b):null},r=function(b,e){b=a(b);var i=z(b.attr("value"));if(i||d.allowEmptyOption)if(p.hasOwnProperty(i)){if(e){var j=p[i][h];j?a.isArray(j)?j.push(e):p[i][h]=[j,e]:p[i][h]=e}}else{var k=q(b)||{};k[f]=k[f]||b.text(),k[g]=k[g]||i,k[h]=k[h]||e,p[i]=k,o.push(k),b.is(":selected")&&c.items.push(i)}},s=function(b){var d,e,f,g,h;for(b=a(b),f=b.attr("label"),f&&(g=q(b)||{},g[i]=f,g[j]=f,c.optgroups.push(g)),h=a("option",b),d=0,e=h.length;e>d;d++)r(h[d],f)};for(c.maxItems=b.attr("multiple")?null:1,n=b.children(),k=0,l=n.length;l>k;k++)m=n[k].tagName.toLowerCase(),"optgroup"===m?s(n[k]):"option"===m&&r(n[k])};return this.each(function(){if(!this.selectize){var e,f=a(this),g=this.tagName.toLowerCase(),h=f.attr("placeholder")||f.attr("data-placeholder");h||d.allowEmptyOption||(h=f.children('option[value=""]').text());var i={placeholder:h,options:[],optgroups:[],items:[]};"select"===g?l(f,i):k(f,i),e=new L(f,a.extend(!0,{},c,i,b))}})},a.fn.selectize.defaults=L.defaults,a.fn.selectize.support={validity:x},L.define("drag_drop",function(){if(!a.fn.sortable)throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');if("multi"===this.settings.mode){var b=this;b.lock=function(){var a=b.lock;return function(){var c=b.$control.data("sortable");return c&&c.disable(),a.apply(b,arguments)}}(),b.unlock=function(){var a=b.unlock;return function(){var c=b.$control.data("sortable");return c&&c.enable(),a.apply(b,arguments)}}(),b.setup=function(){var c=b.setup;return function(){c.apply(this,arguments);var d=b.$control.sortable({items:"[data-value]",forcePlaceholderSize:!0,disabled:b.isLocked,start:function(a,b){b.placeholder.css("width",b.helper.css("width")),d.css({overflow:"visible"})},stop:function(){d.css({overflow:"hidden"});var c=b.$activeItems?b.$activeItems.slice():null,e=[];d.children("[data-value]").each(function(){e.push(a(this).attr("data-value"))}),b.setValue(e),b.setActiveItem(c)}})}}()}}),L.define("dropdown_header",function(b){var c=this;b=a.extend({title:"Untitled",headerClass:"selectize-dropdown-header",titleRowClass:"selectize-dropdown-header-title",labelClass:"selectize-dropdown-header-label",closeClass:"selectize-dropdown-header-close",html:function(a){return'<div class="'+a.headerClass+'"><div class="'+a.titleRowClass+'"><span class="'+a.labelClass+'">'+a.title+'</span><a href="javascript:void(0)" class="'+a.closeClass+'">&times;</a></div></div>'}},b),c.setup=function(){var d=c.setup;return function(){d.apply(c,arguments),c.$dropdown_header=a(b.html(b)),c.$dropdown.prepend(c.$dropdown_header)}}()}),L.define("optgroup_columns",function(b){var c=this;b=a.extend({equalizeWidth:!0,equalizeHeight:!0},b),this.getAdjacentOption=function(b,c){var d=b.closest("[data-group]").find("[data-selectable]"),e=d.index(b)+c;return e>=0&&e<d.length?d.eq(e):a()},this.onKeyDown=function(){var a=c.onKeyDown;return function(b){var d,e,f,g;return!this.isOpen||b.keyCode!==j&&b.keyCode!==m?a.apply(this,arguments):(c.ignoreHover=!0,g=this.$activeOption.closest("[data-group]"),d=g.find("[data-selectable]").index(this.$activeOption),g=b.keyCode===j?g.prev("[data-group]"):g.next("[data-group]"),f=g.find("[data-selectable]"),e=f.eq(Math.min(f.length-1,d)),void(e.length&&this.setActiveOption(e)))}}();var d=function(){var a,b=d.width,c=document;return"undefined"==typeof b&&(a=c.createElement("div"),a.innerHTML='<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>',a=a.firstChild,c.body.appendChild(a),b=d.width=a.offsetWidth-a.clientWidth,c.body.removeChild(a)),b},e=function(){var e,f,g,h,i,j,k;if(k=a("[data-group]",c.$dropdown_content),f=k.length,f&&c.$dropdown_content.width()){if(b.equalizeHeight){for(g=0,e=0;f>e;e++)g=Math.max(g,k.eq(e).height());k.css({height:g})}b.equalizeWidth&&(j=c.$dropdown_content.innerWidth()-d(),h=Math.round(j/f),k.css({width:h}),f>1&&(i=j-h*(f-1),k.eq(f-1).css({width:i})))}};(b.equalizeHeight||b.equalizeWidth)&&(C.after(this,"positionDropdown",e),C.after(this,"refreshOptions",e))}),L.define("remove_button",function(b){if("single"!==this.settings.mode){b=a.extend({label:"&times;",title:"Remove",className:"remove",append:!0},b);var c=this,d='<a href="javascript:void(0)" class="'+b.className+'" tabindex="-1" title="'+A(b.title)+'">'+b.label+"</a>",e=function(a,b){var c=a.search(/(<\/[^>]+>\s*)$/);return a.substring(0,c)+b+a.substring(c)};this.setup=function(){var f=c.setup;return function(){if(b.append){var g=c.settings.render.item;c.settings.render.item=function(){return e(g.apply(this,arguments),d)}}f.apply(this,arguments),this.$control.on("click","."+b.className,function(b){if(b.preventDefault(),!c.isLocked){var d=a(b.currentTarget).parent();c.setActiveItem(d),c.deleteSelection()&&c.setCaret(c.items.length)}})}}()}}),L.define("restore_on_backspace",function(a){var b=this;a.text=a.text||function(a){return a[this.settings.labelField]},this.onKeyDown=function(){var c=b.onKeyDown;return function(b){var d,e;return b.keyCode===p&&""===this.$control_input.val()&&!this.$activeItems.length&&(d=this.caretPos-1,d>=0&&d<this.items.length)?(e=this.options[this.items[d]],this.deleteSelection(b)&&(this.setTextboxValue(a.text.apply(this,[e])),this.refreshOptions(!0)),void b.preventDefault()):c.apply(this,arguments)}}()}),L});
'use strict';

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'workingFolder': '',
    'existingImages' : {},

    '_options': {},
    set options(val) {
        for (var key in val) {
            this._options[key] = val[key];
        }
        if (this._options !== options) {
            saveStatus(true);
        }
    },
    get options() {
        for (var key in this._options) {

        }
        return this._options;
    },

    '_effect': ['blur', 5],
    set effect(val) {
        this._effect = val;
        blur('#effect-preview-image', stat.effect[1]);
        blur('#effect-fullscreen', stat.effect[1]);
    },
    get effect() {
        return this._effect;
    },

    'sliders': {},
    'workingSlider': 's1',
    '_sliderNumber': 5,
    set sliderNumber(val) {
        this._sliderNumber = val;
        statSaveSlider();
    },
    get sliderNumber() {
        return this._sliderNumber;
    },
    '_sliderInterval': 3,
    set sliderInterval(val) {
        this._sliderInterval = val;
        statSaveSlider();
    },
    get sliderInterval() {
        return this._sliderInterval;
    },
    '_selectedIds': [],
    set selectedIds(val) {
        this._selectedIds = val;
        statSaveSlider();
    },
    get selectedIds() {
        return this._selectedIds;
    },

    '_workingImage': '',
    set workingImage(val) {
        this._workingImage = val;
        //console.log('workingImage: ' + this._workingImage);
    },
    get workingImage() {
        return this._workingImage;
    },

    '_workingSize': '',
    set workingSize(val) {
        this._workingSize = val;
        //console.log('workingSize: ' + this._workingSize);
    },
    get workingSize() {
        return this._workingSize;
    },

    '_folderImages': [],
    set folderImages(val) {
        this._folderImages = val;
        buildFolderTable();
    },
    get folderImages() {
        return this._folderImages;
    },

    '_allImages': {},
    set allImages(val) {
        this._allImages = val || {};
        if (Object.keys(this._allImages).length > 0) {
            getNewImages();
        }
    },
    get allImages() {
        return this._allImages;
    },

    '_newImages': [],
    set newImages(val) {
        this._newImages = val;
        //console.log('stat.newImages: ' + stat.newImages.length);
        //console.log(stat.folderImages);
    },
    get newImages() {
        return this._newImages;
    },

    '_allFolders': [],
    set allFolders(val) {
        this._allFolders = val;
        //console.log('stat.allFolders buildFolderTable:');
        //buildFolderTable();
    },
    get allFolders() {
        return this._allFolders;
    },

    '_newFolders': [],
    set newFolders(val) {
        this._newFolders = val;
        if (stat.newFolders.length > 0) {
            var folder = stat.newFolders[0];
            stat.workingFolder = folder;
            var msg = '"' + folder + '"';
            if (stat.folderImages[folder]) {
                msg = msg + ' (' + stat.folderImages[folder][0] + ')';
            }

            bootbox.confirm({
                size: 'small',
                title: 'New folder found:',
                message: msg,
                buttons: {
                    confirm: {
                        label: 'Add folder',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'Do not...',
                        className: 'btn-default'
                    }
                },
                callback: function(result) {
                    if (result) {
                        // add folder:
                        gJ.folders.push(folder);
                        setFolderSelect();
                        $('#upload-folder-select').val(folder).prop('selected', true);
                        processNewFolder({
                            'folder': folder,
                            'cb': function() {
                                stat.newFolders = arrayWithout(stat.newFolders, stat.workingFolder);
                            }
                        });
                        return;
                    }
                    // ignore folder:
                    ignoreFolder(folder);
                    stat.newFolders = arrayWithout(stat.newFolders, folder);
                }
            });
        }
    },
    get newFolders() {
        return this._newFolders;
    },

    '_ignoreFolders': [],
    set ignoreFolders(val) {
        var tr = $("#foldersTable tr[data='" + val + "']");
        if (this._ignoreFolders.indexOf(val) === -1) {
            this._ignoreFolders.push(val);
            tr.removeClass().addClass('warning');
        } else {
            this._ignoreFolders.splice(this._ignoreFolders.indexOf(val), 1);
            tr.removeClass().addClass('default');
        }
    },
    get ignoreFolders() {
        return this._ignoreFolders;
    },

    '_tagsSelectedIds': [],
    set tagsSelectedIds(val) {
        var index = this._tagsSelectedIds.indexOf(val);
        if (index > -1) {
            this._tagsSelectedIds.splice(index, 1);
        } else {
            this._tagsSelectedIds.push(val);
        }
    },
    get tagsSelectedIds() {
        return this._tagsSelectedIds;
    },

    '_imageTags': {},
    set imageTags(val) {

    },
    get imageTags() {
        return this._imageTags;
    },

    '_tagsEdited': [],
    set tagsEdited(val) {
        this._tagsEdited.push(val);
        this._tagsEdited = this._tagsEdited.unique();
    },
    get tagsEdited() {
        return this._tagsEdited;
    },

    '_allTags': [],
    set allTags(val) {
        this._allTags = [];
        this._allTags = val;
        var stl = stat.allTags.length;
        for (var i = 0; i < stl; i++) {
            prototype({
                'template': '#tag-button-prototype',
                'selectors': ['text'],
                'values': [stat.allTags[i]],
                'targets': '#all-tags'
            });
        }
    },
    get allTags() {
        return this._allTags;
    }
};

function statSaveSlider(im) {
    stat.sliders[stat.workingSlider] = [
        im || stat.selectedIds,
        stat.sliderInterval,
        stat.sliderNumber
    ];
};

// admin-func.js

Array.prototype.unique = function() {
    var u = [];
    var l = this.length;
    for (var i = 0; i < l; i++) {
        if (u.indexOf(this[i]) == -1) {
            u.push(this[i]);
        }
    }
    return u;
};

function unique(arr) {
    var u = [];
    return arr.filter(function(v) {
        if (u.indexOf(v) == -1) {
            u.push(v);
            return v;
        }
    });
};

function checkIrregularFilename(file) {
    var response = {};
    response.error = false;
    response.expression = [];
    var osl = options.sizes.length;
    for (var i = 0; i < osl; i++) {
        if (file.indexOf('_' + options.sizes[i]) !== -1) {
            response.error = true;
            response.expression.push('_' + options.sizes[i]);
        }
    }
    return response;
};

function pickFromObject(obj, pick) {
    var ret = {};
    var objKeys = Object.keys(obj);
    var pL = pick.length;

    for (var i = 0; i < pL; i++) {
        if (obj[pick[i]]) {
            ret[pick[i]] = obj[pick[i]];
        }
    }
    console.log(ret);
    return ret;
};

function arrayIntersection(arr1, arr2) {
    // all values from arr1 which are in arr2
    var inter1 = arr1.filter(function(value) {
        if (arr2.indexOf(value) > -1) {
            return value;
        }
    });

    // all values from arr2 which are in arr1
    var inter2 = arr2.filter(function(value) {
        if (inter1.indexOf(value) > -1) {
            return value;
        }
    });

    return inter1.concat(inter2).unique();
};

function arrayWithout(arr1, arr2) {
    /*
      if (typeof arr2 === 'string') {
        var arr2 = [arr2];
      }
    */
    // all values from arr1 which are not in arr2
    return arr1.filter(function(value) {
        if (arr2.indexOf(value) === -1) {
            return value;
        }
    });
};

function arrayDiff(arr1, arr2, concat) {
    var concat = concat || false;
    var diff = {};

    // all values from arr1 which are not in arr2
    diff.arr1 = arr1.filter(function(value) {
        if (arr2.indexOf(value) === -1) {
            return value;
        }
    });

    if (!concat) {
        return diff.arr1;
    }

    // all values from arr2 which are not in arr1
    diff.arr2 = arr2.filter(function(value) {
        if (arr1.indexOf(value) === -1) {
            return value;
        }
    });

    diff.concat = diff.arr1.concat(diff.arr2);

    return diff;
};

/*
var arr1 = [1,2,3,4];
var arr2 = [4,6,1,4];
console.log(arrayDiff(arr1,arr2));
console.log(arrayDiff(arr1,arr2,true).arr2);
console.log(arrayDiff(arr1,arr2,true).concat);
*/

function withoutGalleryBase(data) {
    if (typeof data === 'string') {
        if (data.indexOf('/') !== -1) {
            value = data.split('/');
            var vl = value.length;
            return value[vl-1];
        }
        return false;
        //return data.replace('../gallery/', '');
    }

    return data.map(function(value) {
        if (value.indexOf('/') !== -1) {
            value = value.split('/');
            var vl = value.length;
            return value[vl-1];
        }
        //return value.replace('../'+options.galleryPath, '');
    });
};

function ignoreFolder(f) {
    var tr = $("#foldersTable tr[data='" + f + "']");
    if (stat.ignoreFolders.indexOf(f) == -1) {
        stat.ignoreFolders.push(f);
        tr.removeClass().addClass('warning');
    } else {
        stat.ignoreFolders.splice(stat.ignoreFolders.indexOf(f), 1);
        tr.removeClass().addClass('default');
    }
    //console.log(stat.ignoreFolders);
};

function addNewImages() {
    var ani = 0;

    function addImages() {

        var length = imagesAddedKeys.length;

        if (length <= 0) {
            return false;
        }

        if (ani < length) {
            var key = imagesAddedKeys[ani];
            var file = imagesAdded[key].file;
            var folder = imagesAdded[key].folder;

            resizeStore(folder, file).done(function() {
                gJ.images[key] = imagesAdded[key];
                ani++;
                addImages();
            });
        } else {
            //console.log('all images added');
            buildGallery(gJ);
            saveStatus(true);
        }
    };
};

function getNewImages(images) {

    if (!images) {
        var images = stat.allImages;
    }

    var match = [];
    stat.newImages = [];

    for (var key in images) {
        if (!gJ.images[key]) {
            // this image is not in gJ, must be new
            //match[key] = images[key];
            match.push(key);
        }
    }

    if (match.length > 0) {
        // we have new images
        //console.log('we have ' + match.length + ' new images');
    } else {
        //console.log('no new images');
    }
    stat.newImages = match;
    return match;


    /*
        var matchKeys = Object.keys(match);
        if (matchKeys.length > 0) {
            // we have new images
            console.log('we have '+matchKeys.length+' new images');
            stat.newImages = matchKeys;
            return matchKeys;
        }
        return false;
        */
};

function gjFilteredByFolder(fo) {
    var folder = fo || stat.workingFolder;
    var result = {};
    var keys = Object.keys(gJ.images);
    var klength = keys.length;

    for (var i = 0; klength > i; i++) {
        var image = gJ.images[keys[i]];
        if (image.folder === folder) {
            result[keys[i]] = image;
        }
    }

    return result;
};

function deleteFolderRelations(folder, cb) {
    var folders = [folder];
    var sizesLength = options.sizes.length;
    var i = 0;

    //check if folder is in 'ignore' and remove it
    var ignoreKey = gJ.ignore.indexOf(folder);
    if (ignoreKey > -1) {
        gJ.ignore.splice(ignoreKey, 1);
    } else {
        // remove images from galleryJSON:
        var imageKeys = Object.keys(gJ.images);
        var imagesLength = imageKeys.length;
        for (var j = 0; j < imagesLength; j++) {
            if (gJ.images[imageKeys[j]].folder == folder) {
                delete gJ.images[imageKeys[j]];
            }
        }
        /*
        _.omitBy(gJ.images, {
            'folder': folder
        });
        */
    }

    for (var l = 0; l < sizesLength; l++) {
        folders.push(folder + '_' + options.sizes[l]);
    }

    function deleteFolder() {
        if (i < folders.length) {
            removeFolder(folders[i])
                .done(function(e) {

                })
                .always(function(e) {
                    i++
                    deleteFolder();
                });
        } else {
            //console.log('deleteFolder done');
            if (cb) {
                cb();
            }
        }
    }

    deleteFolder();
};

function getRemovedImages(folder) {
    var galleryByFolder = gjFilteredByFolder(folder);
    for (var key in galleryByFolder) {
        if (!stat.imagesFromFolder[key]) {
            // this image is not present anymore
            stat.imagesRemoved.push(kk);
        }
    }
};

var saving = false;

function saveJSON() {
    //saveStatus(false);
    saving = true;
    $('#saveButton').prop('disabled', true).text('saving');
    backup().done(function() {
        var content = JSON.stringify(gJ);
        var target = 'gallery.json';
        saveFileAs(content, target).done(function() {
            //saveStatus(true);
            $('#saveButton').prop('disabled', false).text('Save');
            saving = false;
        });
    });
};

function saveStatus(state) {
    var st = state ? false : true;
    if (saving) {
        st = true
    }
    $('#saveButton').prop('disabled', st);
};

/* options */

//$('#optionsForm').validator();

function setOptions() {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click');

    stat.options = options;

    $('#thumb-size-select').val(
        stat.options.thumbSize
    ).on('change', function() {

        removeClasses('div#gallery-row div.gallery-item', stat.options.thumbSizeSizes[stat.options.thumbSize]);
        stat.options = {
            'thumbSize': $(this).val()
        };
        var ntds = stat.options.thumbSizeSizes[stat.options.thumbSize].toString().replace(/,/g, ' ');
        $('div#gallery-row').find('div.gallery-item').addClass(ntds);
        proportion({
            selector: 'section#gallery-section div.gallery-item',
            proportion: stat.options.proportion,
            className: 'pgi',
            styleId: 'prop-gallery-item'
        });

        saveStatus(true);
    });

    $('#thumb-proportion-select').val(
        stat.options.proportion.toString()
    ).on('change', function() {
        stat.options = {
            'proportion': $(this).val().split(',').map(function(n) {
                return parseInt(n);
            })
        };
        proportion({
            selector: 'section#gallery-section div.gallery-item',
            proportion: stat.options.proportion,
            className: 'pgi',
            styleId: 'prop-gallery-item'
        });
        saveStatus(true);
    });


    $('#thumb-fit-select').val(
        stat.options.thumbFit.toString()
    ).on('change', function() {
        stat.options = {
            'thumbFit': $(this).val()
        };
        $('div#gallery-row').find('div.gallery-item div.thumb-div').removeClass('cover-image contain-image').addClass(stat.options.thumbFit + '-image');
        saveStatus(true);
    });

    $('#thumb-padding-input').val(
        stat.options.thumbPadding
    ).on('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
            return false;
        }
    }).on('change input', function() {
        var value = $(this).val() || 0;
        stat.options = {
            'thumbPadding': (!value || value < 1) ? 0 : value
        };
        createStyle({
            id: 'item-padding',
            style: 'div#gallery-row div.gallery-item {padding: ' + stat.options.thumbPadding + 'px}'
        });
        saveStatus(true);
    });

    $('#input-sizes').val(stat.options.sizes.toString()).attr('placeholder', stat.options.sizes.toString()).on('keydown', function(e) {

        var value = $(this).val();
        // prevent comma at start
        if (e.keyCode == 188 && value == '') {
            return false;
        }
        // prevent double commatas
        if (e.keyCode == 188 && value.charAt(value.length - 1) == ',' && value.charAt(value.length - 1) == ',') {
            return false;
        }

        if ([46, 8, 9, 27, 13, 188].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // don't do anything
            return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

    }).on('change input', function() {
        var value = $(this).val().split(',').unique()
            .filter(function(v) {
                if (parseInt(v)) {
                    return v
                }
            }).map(function(v, k) {
                return parseInt(v);
            }).sort(function(a, b) {
                return a - b;
            });

        stat.options = {
            'sizes': value
        };
        saveStatus(true);
    });

};

$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

    setOptions();

    $('#options-reset').on('click', function() {
        setOptions();
        buildGallery(gJ);
    });

    $('#options-save').on('click', function(e) {
        e.preventDefault();
        //          saveFileAs('var options ='+JSON.stringify(stat.options), 'options2.js').done(function(e){
        saveFileAs(JSON.stringify('var options =' + JSON.stringify(stat.options)), 'options2.js').done(function(e) {
            //console.log(e);
        }).always(function(e) {
            //console.log(e);
        });
    });

});

/* Raw Panel */
$('.admin-header a[aria-controls="raw-panel"]').on('shown.bs.tab', function(e) {

    loader();
		$('#gallery-row').find('.gallery-item').off('click').removeClass('selected-image');
		$('#json-output').text(JSON.stringify(gJ, null, '\t'));

    getAllBackups().done(function(data) {
        $('#loadBackupSelect').html('').append('<option>---</option>');
        var dataLength = data.length;
        for (var i = 0; i < dataLength; i++) {
            var split = data[i].split('.');
            $('#loadBackupSelect').append(
                '<option data-url=' + data[i] + '>' + convertTimestamp(split[1]) + '</option>'
            );
        };

        $('#loadBackupSelect').on('change', function() {
            loader();
            var dataUrl = $(this).find('option:selected').attr('data-url');
            var url = 'gallery/' + dataUrl;

            if (!dataUrl) {
                $('#json-output').text(JSON.stringify(gJ, null, '\t'));
                $('#outputFile').text('Gallery JSON');
                return false;
            }

						loadBackup(url).done(function(data) {
								$('#json-output').text(JSON.stringify(data, null, '\t'));
								$('#outputFile').text(dataUrl);
								$('#loadBuBtn').on('click', function() {
		                buildGallery(data);
		            });
								loader('off');
						});
        });

				loader('off');
    });
});

/* Sliders */

var dis = true;

$('#slider-wrapper').on('click', function() {
    $(this).addClass('hidden');
});

$('#slider-interval-select').on('change', function() {
    stat.sliderInterval = $(this).val();
});

$('#slider-number-select').on('change', function() {
    stat.sliderNumber = $(this).val();
});

$('#slider-clear-btn').on('click', function() {
    reset();
});

$('#slider-fill-btn').on('click', function() {
    reset();
    for (var i = 0; i < stat.sliderNumber; i++) {
        $('#gallery-row').find('div.gallery-item').eq(i).trigger('click');
    }
});

$('#slider-auto-btn').on('click', function() {
    reset();

    if ($(this).attr('aria-pressed') === 'true') {
        $(this).html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
        return true;
    }

    $(this).html('auto <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>');

    var sliderNumber = $('#slider-number-select').val();
    for (var i = 0; i < sliderNumber; i++) {
        $('#gallery-section').find('div.gallery-item').eq(i).trigger('click');
    }
   //console.log(stat.selectedIds);
    stat.selectedIds = 'auto';
   //console.log(stat.selectedIds);
    buttonDisable(false);
});

$('#slider-save-btn').on('click', function() {
    //gJ.sliders[0] = selectedIds();
    gJ.sliders = stat.sliders;
    saveStatus(true);
});

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

    $('#slider-interval-select').val(stat.sliderInterval).prop('selected', true);
    $('#slider-number-select').val(stat.sliderNumber).prop('selected', true);
    $('#blur-slider').val(stat.effect[1]);
    $('#blur-input').val(stat.effect[1]);
    $('#gallery-row').find('div.selected-image').removeClass('selected-image');
    $('#slider-sortable').html('');
    buttonDisable(dis);
    autoIds();

    if (stat.sliders[stat.workingSlider] && stat.sliders[stat.workingSlider][0] === 'auto') {
        $('#slider-auto-btn').addClass('active').attr('aria-pressed', true);
    } else {
        $('#slider-auto-btn').removeClass('active').attr('aria-pressed', false);
    }

    if ($('#slider-sortable').is(':empty')) {
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });

        proportion({
          selector : 'div#slider-sortable div.placeholder-item',
          proportion : [1,1],
          className : 'ssp',
          styleId : 'slider-sortable-prop'
        });
    }

    $('#slider-preview-btn').on('click', function() {
        $('#slider-1').attr('id', stat.workingSlider);
       //console.log(_.pick(stat.sliders, [stat.workingSlider]));
        //buildSliders(_.pick(stat.sliders, [stat.workingSlider]));
        buildSliders(pickFromObject(stat.sliders, [stat.workingSlider]))
        $('#slider-wrapper').removeClass('hidden');
        $('#' + stat.workingSlider).find('.item').respi();
        setTimeout(function() {
            //$('#'+stat.workingSlider).carousel();
        }, stat.sliders[stat.workingSlider][1]);
    });

    sortable('.sortable', {
        placeholderClass: 'col-xs-2 gallery-item sort-placeholder',
        forcePlaceholderSize: true,
        hoverClass: 'is-hovered'
    })

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed','false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
        selectedIds();
    });

    $('#gallery-row').find('div.gallery-item').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed','false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');

        $(this).toggleClass('selected-image');

        if ($(this).hasClass('selected-image')) {

            var cl = 'gallery-item col-xs-2 selected-image sortable-item';

            prototype({
                'template': '#sortable-item-prototype',
                'selectors': [
                    'data-id',
                    'bg-image'
                ],
                'values': [
                    $(this).attr('data-id'),
                    $(this).find('div.thumb-div').attr('data-src')
                ],
                'targets': '#slider-sortable'
            });

            var el = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
            $(el).removeClass('selected-image');

            $(el).off().on('click', function() {
                $(el).removeClass('selected-image');
                $(this).addClass('selected-image');
                loadBlur($(this).attr('data-id'));
            });

            // set same height for chrome
            if (el.length > 0) {
                proportion({
                  selector : 'div#slider-sortable div.gallery-item',
                  proportion : [1,1],
                  className : 'ssp',
                  styleId : 'slider-sortable-prop'
                });

                $(el).css('height', Math.round(el[0].offsetHeight));
            }

        } else {
            $('#slider-sortable').find('div.gallery-item[data-id="' + $(this).attr('data-id') + '"]').remove();
        }

        sortable('.sortable');
        $('#slider-sortable').find('div.placeholder-item').remove();

        selectedIds();
       //console.log(stat.sliders);
        var selLength = stat.selectedIds.length;

        if (selLength === 0) {
            dis = true;
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            proportion({
              selector : 'div#slider-sortable div.placeholder-item',
              proportion : [1,1],
              className : 'ssp',
              styleId : 'slider-sortable-prop'
            });
            document.getElementById('effect-preview-image').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }

        if (selLength > 0) {
            loadBlur();
        }

        if (selLength === 1) {
            dis = true;
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            proportion({
              selector : 'div#slider-sortable div.placeholder-item',
              proportion : [1,1],
              className : 'ssp',
              styleId : 'slider-sortable-prop'
            });
        }

        if (selLength >= 2) {
            dis = false;
        }

        buttonDisable(dis)

        if (!dis && gJ.sliders[stat.workingSlider] !== stat.sliders[stat.workingSlider]) {
            //$('#slider-save-btn').prop('disabled', false);
            document.getElementById('slider-save-btn').disabled = false;
            saveStatus(true);
            return false;
        }

        document.getElementById('slider-save-btn').disabled = true;
    });

    $('#blur-slider').rangeslider({
        polyfill: false,
        onInit: function(position, value) {},
        onSlide: function(position, value) {
            document.getElementById('blur-input').value = value;
        },
        onSlideEnd: function(position, value) {
            document.getElementById('blur-input').value = value;
            $('#blur-input').trigger('change');
        }
    });

    $('#blur-input').on('change', function() {
        var bs = $('#blur-slider');
        if (bs.val() != this.value) {
            bs.val(this.value).change();
        }
        stat.effect = ['blur', this.value];
    });

    $('#blur-save-button').click(function(e) {
        gJ.effect = stat.effect;
    });

});

function fullScreen(img) {
    var ef = document.getElementById('effect-fullscreen');
    document.getElementById('effect-preview-image').addEventListener('click', function() {
        ef.style.display = 'block';
        ef.style.backgroundImage = 'url(' + img + ')';
    });
    ef.addEventListener('click', function() {
        ef.style.display = 'none';
    });
};

function loadBlur(imgId) {

    if (!imgId) {
        var selImg = document.querySelector('#slider-sortable .selected-image');
        if (!selImg) {
            document.getElementById('slider-sortable').querySelector('.gallery-item')
                .className += ' selected-image';
            selImg = document.querySelector('#slider-sortable .selected-image');
        }
        var imgId = selImg.getAttribute('data-id');
    }

    $('#blurPath').val(imgId);
    var imgSrc_720 = 'gallery/' + gJ.images[imgId].folder + '_720/' + gJ.images[imgId].file;

    $('#blur-image-frame').find('img').attr('src', imgSrc_720).imagesLoaded().always(function() {
        //console.log('blur image');
    }).done(function() {
        blur('#effect-preview-image', stat.effect[1]);
        fullScreen(imgSrc_720);
        blur('#effect-fullscreen', stat.effect[1]);
    });
};

function reset() {
    document.getElementById('slider-sortable').innerHTML = '';
    removeClasses('div.gallery-item.selected-image', ['selected-image']);

    prototype({
        'template': '#placeholder-item-prototype',
        'targets': '#slider-sortable'
    });
    prototype({
        'template': '#placeholder-item-prototype',
        'targets': '#slider-sortable'
    });
    proportion({
      selector : 'div#slider-sortable div.placeholder-item',
      proportion : [1,1],
      className : 'ssp',
      styleId : 'slider-sortable-prop'
    });
    buttonDisable(true);
};

function selectedIds() {
    var selected_ids = [];
    var items = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
    var len = items.length;
    for (var i = 0; i < len; i++) {
        selected_ids.push(items[i].getAttribute('data-id'));
    }
    stat.selectedIds = selected_ids;
    return selected_ids;
};

function buttonDisable(st) {
    document.getElementById('slider-save-btn').disabled = st;
    document.getElementById('slider-clear-btn').disabled = st;
    document.getElementById('slider-preview-btn').disabled = st;
};

function autoIds(q) {

    if (!$('#slider-sortable').is(':empty')) {
        $('#slider-sortable').find('div.gallery-item').each(function() {
            $('div#gallery-row').find('div[data-id="' + $(this).attr('data-id') + '"]')
                .addClass('selected-image');
        });
        return false;
    }

    if (gJ.sliders[0]) {
        var slider1 = gJ.sliders[0];
        var sliderLength = slider1.length;
        if (sliderLength > 1 || slider1 != 'auto') {
            for (var i = 0; i < sliderLength; i++) {
                $('*[data-id="' + slider1[i] + '"]').addClass('selected-image');
                document.getElementById('gallery-row').querySelector('div[data-id="' + gJ.sliders[0][i] + '"]').click();
            }
        }
    }
};

// start-panel

$('.admin-header a[aria-controls="start-panel"]').on('shown.bs.tab', function(e) {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click').on('click', function(e) {
        $('#gallery-lightbox').modal('show');
    });

    $('#admin-panel').find('.scan-button').on('click', function() {
        loader();
        getAllImages();
        loader('off');
    });

});
// <-- end start panel

/* Tags Panel */

var selectedImages_tags;

var selectizeInput = $('#input-tags').selectize({
    plugins: ['remove_button'],
    delimiter: ',',
    persist: false,
    createFilter: '^[a-zA-Z0-9_äüö -]+$',
    create: function(input) {
        for (var i = 0, l = stat.tagsSelectedIds.length; i < l; i++) {
            var id = stat.tagsSelectedIds[i];
            var dataTags = stat.imageTags[id];
            //var unionTags = _.union(dataTags, input.split(','));
            var unionTags = dataTags.concat(input.split(',')).unique();
            //console.log(unionTags);
            if (unionTags != dataTags) {
                stat.imageTags[id] = unionTags;
                stat.tagsEdited = id;
            }
        }
        return {
            'text': input,
            'value': input
        };
    }
});
var selectizeTags = selectizeInput[0].selectize;
selectizeTags.clear();


$('.admin-header a[aria-controls="tags-panel"]').on('shown.bs.tab', function(e) {

    for (var key in gJ.images) {
        stat.imageTags[key] = stat.imageTags[key] || gJ.images[key].tags;
    }

    document.getElementById('all-tags').innerHTML = '';
    stat.allTags = !stat.allTags.length ? gJ.tags : stat.allTags;

    $('#all-tags').find('button').on('click', function() {
        var text = $(this).text();
        for (var key in stat.imageTags) {
            if (stat.imageTags[key] === text || stat.imageTags[key].indexOf(text) > -1) {
                $('#gallery-row').find('div.gallery-item[data-id="' + key + '"]').trigger('click');
            }
        }
    });


    $('#gallery-row').find('div.gallery-item').removeClass('selected-image').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('selected-image');
        stat.tagsSelectedIds = $(this).attr('data-id');
        selectTags();
    });

    $('#tags-submit-button').on('click', function(e) {
        e.preventDefault();

        var tags = [];

        var editedLength = stat.tagsEdited.length;
        for (var i = 0; i < editedLength; i++) {
            gJ.images[stat.tagsEdited[i]].tags = stat.imageTags[stat.tagsEdited[i]];
        }

        for (var key in gJ.images) {
            tags.push(gJ.images[key].tags);
            //console.log(tags);
        }

        //gJ.tags = _.uniq(_.flattenDeep(tags));
        gJ.tags = tags.unique();
        //console.log(gJ.tags);
        buildGalleryNavigation();
        saveStatus(true);

        //console.log(tagsJSON);
        return false;

        var postdata = $('#tags-form').serialize();
    });

    $('#deleteImagesButton').on('click', function() {
        //console.log('delete clicked');
        deleteSelectedImages();
    });

});

function selectTags() {

    var selectedImages = stat.tagsSelectedIds;
    var selectedLength = selectedImages.length;
    var selectedTags = [];

    selectizeTags.clear();

    if (selectedLength === 0) {
        //console.log('nothing selected');
        return false;
    }


    var firstTag = stat.imageTags[stat.tagsSelectedIds[0]] || gJ.images[stat.tagsSelectedIds[0]].tags;
    var groupTags = $('#input-tags').attr('value').split(',');

    if (selectedLength === 1) {

        selectedTags = groupTags = firstTag;

    } else if (selectedLength > 1) {

        groupTags = !groupTags[0] ? firstTag : groupTags;
        for (var i = 0; i < selectedLength; i++) {
            var selectedId = stat.tagsSelectedIds[i];
            attrTags = stat.imageTags[selectedId] || gJ.images[selectedId].tags;
//            selectedTags = _.union(selectedTags, attrTags);
//            groupTags = _.intersection(groupTags, attrTags);
              selectedTags = selectedTags.concat(attrTags).unique();
              groupTags = arrayIntersection(groupTags, attrTags);
        }

    }

    $('#input-tags').attr('value', groupTags);

    $.each(groupTags, function(i, v) {
        selectizeTags.createItem(v);
    });
    selectizeTags.refreshItems();

    //    return groupTags;
};

function deleteSelectedImages() {
    var i = 0;
    var paths = [];

    if (selectedImages.length > 0) {
        selectedImages.each(function() {
            i++;
            var id = $(this).attr('data-id');
            // For testing! >>
            //paths.push(gJ.images[id].path+'/'+gJ.images[id].file);
            for (var sz in gJ.sizes) {
                var size = gJ.sizes[sz];
                paths.push(gJ.images[id].folder + '_' + size + '/' + gJ.images[id].file);
            }
            delete gJ.images[id];
        })

        function deleteImage(path) {
            if (paths.length > 0) {
                $.ajax({
                    type: 'GET',
                    url: 'gallery/removeImage.php',
                    data: 'path=' + path
                }).done(function() {
                    p++;
                    //console.log('done ' + p);
                    deleteFinished();
                }).fail(function() {
                    p++;
                    //console.log('fail ' + p);
                    deleteFinished();
                })
            }
        };

        var p = 0;
        var pl = paths.length;

        function deleteFinished() {
            if (p <= pl) {
                deleteImage(paths[p]);
            } else {
                //console.log('finished deleting');

                // save JSON:
                $('#deleteImagesButton').off('click').text('save').on('click', function() {

                    /*
                     backup().done(function(data){
                     var content = JSON.stringify(gJ);
                     var target = 'gallery.json';
                     saveFileAs(content, target);
                     });
                     */
                    saveJSON();
                });
            }
        };

        deleteFinished();
    }
};

/* Upload Panel */
$('.admin-header a[aria-controls="upload-panel"]').on('shown.bs.tab', function(e) {

    var upldrData = {};
    $('#new-folder-name').val('');
    $('#new-folder-btn').prop('disabled', true);
    setFolderSelect();

    function filesToGJ(f) {
        for (i = 0; f.length > i; i++) {

        }
    };

    $('#new-folder-name').on('keyup', function(event) {
        var valLength = $(this).val().trim().length;

        if (valLength === 0) {
            $('#new-folder-btn').prop('disabled', true);
            return false;
        }

        if (valLength > 1 && event.keyCode != 8) {
            var regex = new RegExp('^[a-zA-Z0-9_äüö -]+$');
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                console.log('test');
            }
        }

        if (valLength < 1) {
            $('#new-folder-btn').prop('disabled', true);
        } else {
            $('#new-folder-btn').prop('disabled', false);
        }
    });

    $('#new-folder-btn').on('click', function() {
        var val = $('#new-folder-name').val();
        if (val) {
            val = val.trim();

            if (stat.allFolders.indexOf(val) !== -1 || gJ.folders.indexOf(val) !== -1 || gJ.ignore.indexOf(val) !== -1) {
                bootbox.alert({
                    size: 'small',
                    message: 'A folder "' + val + '" already exists.',
                    callback: function(result) {
                        if (result) {

                        }
                    }
                });
                return false;
            }

            var checkNameSizes = checkIrregularFilename(val);
            if (checkNameSizes.error) {
                bootbox.alert({
                    size: 'small',
                    message: 'Please choose another name.<br> The phrase "' + checkNameSizes.expression + '" is prohibited.',
                    callback: function(result) {
                        if (result) {

                        }
                    }
                });
                return false;
            }

            createFolder(val).done(function(data) {
                stat.newFolders = [withoutGalleryBase(data.dir)];
                $('#new-folder-name').val('');
            });
        }
    });

    $('#upload-tags').on('change', function() {
        var value = $(this).val();
        if (value && value != ' ') {
            value = value.trim();
            value = value.split(',');
            for (var i = 0; value.length > i; i++) {
                value[i] = value[i].trim();
            }
            //value = _.without(value, '', ' ');
            value = arrayWithout(value, ['',' ']);
            //value = _.uniq(value);
            value = unique(value);
            upldrData.tags = value.toString();
            upldr.options.data = JSON.stringify(upldrData);
        }
    });

    $('#upload-folder-select').on('change', function() {
        upldrData.path = options.galleryPath + $(this).val();
        upldr.options.data = JSON.stringify(upldrData);
    });
    upldrData.path = $('#upload-folder-select').val();
    upldr.options.data = JSON.stringify(upldrData);
    //$('#upload-folder-select').trigger( 'change' );

    /*
     upldr.options = {
     'target' : 'gallery/fileUpload.php',
     //'data' : JSON.stringify(upldrData),
     'cbReaderOnload' : function(src, fName, fType, fSize, fLastMod) {
     prototype({
     'template' : '.file-row-prototype',
     'selectors' : ['src', 'name', 'type', 'size', 'lastMod'],
     'values' : [src, fName, fType, fSize, fLastMod],
     'targets' : '#file-table-body'
     });
     },
     'cbOnloadend' : function(res) {
     console.log(res.target.response);
     setTimeout(function() {
     upldr.reset();
     }, 3000);
     }
     };
     */

    upldr.set({
        'target': 'upldr.php',
        //'data' : JSON.stringify(upldrData),
        'cbReaderOnload': function(src, fName, fType, fSize, fLastMod) {
            //console.log( getSlug(fName, {'custom' : ['.'] }) );
            prototype({
                'template': '.file-row-prototype',
                'selectors': ['src', 'name', 'type', 'size', 'lastMod'],
                'values': [src, fName, fType, fSize, fLastMod],
                'targets': '#file-table-body'
            });
        },
        'cbOnloadend': function(res) {
            console.log(res.target.response);
            processResponse(res.target.response);
            setTimeout(function() {
                upldr.reset();
            }, 3000);
        }
    });
});

function processResponse(res) {
    console.log(res);

    var res = JSON.parse(res);
    var images = res.name;
    var path = res.data.path;
    var folder = path.split('/');
    folder = folder[folder.length - 1];
    var tags = [];
    if (res.data.tags) {
        tags = res.data.tags.split(',');
    }
    tags.push(folder);

    for (var i = 0; i < images.length; i++) {
        var n = Date.now();
        var name = res.name[i];
        var encname = encodeURI(images[i]);
        var id = path + encname;
        var entry = {
            'file': name,
            'folder': path,
            'time': n,
            'tags': tags
        };
        gJ.images[id] = entry;
    };
};

function setFolderSelect(fo) {
    $('#upload-folder-select').html('');
    var folders = fo ? fo : gJ.folders;
    var foldersLength = folders.length;
    for (var i = 0; foldersLength > i; i++) {
        prototype({
            'template': '#folder-select-prototype',
            'selectors': ['folder'],
            'values': [folders[i]],
            'targets': '#upload-folder-select'
        });
    }
};

/**
 * bootbox.js v4.4.0
 *
 * http://bootboxjs.com/license.txt
 */
!function(a,b){"use strict";"function"==typeof define&&define.amd?define(["jquery"],b):"object"==typeof exports?module.exports=b(require("jquery")):a.bootbox=b(a.jQuery)}(this,function a(b,c){"use strict";function d(a){var b=q[o.locale];return b?b[a]:q.en[a]}function e(a,c,d){a.stopPropagation(),a.preventDefault();var e=b.isFunction(d)&&d.call(c,a)===!1;e||c.modal("hide")}function f(a){var b,c=0;for(b in a)c++;return c}function g(a,c){var d=0;b.each(a,function(a,b){c(a,b,d++)})}function h(a){var c,d;if("object"!=typeof a)throw new Error("Please supply an object of options");if(!a.message)throw new Error("Please specify a message");return a=b.extend({},o,a),a.buttons||(a.buttons={}),c=a.buttons,d=f(c),g(c,function(a,e,f){if(b.isFunction(e)&&(e=c[a]={callback:e}),"object"!==b.type(e))throw new Error("button with key "+a+" must be an object");e.label||(e.label=a),e.className||(e.className=2>=d&&f===d-1?"btn-primary":"btn-default")}),a}function i(a,b){var c=a.length,d={};if(1>c||c>2)throw new Error("Invalid argument length");return 2===c||"string"==typeof a[0]?(d[b[0]]=a[0],d[b[1]]=a[1]):d=a[0],d}function j(a,c,d){return b.extend(!0,{},a,i(c,d))}function k(a,b,c,d){var e={className:"bootbox-"+a,buttons:l.apply(null,b)};return m(j(e,d,c),b)}function l(){for(var a={},b=0,c=arguments.length;c>b;b++){var e=arguments[b],f=e.toLowerCase(),g=e.toUpperCase();a[f]={label:d(g)}}return a}function m(a,b){var d={};return g(b,function(a,b){d[b]=!0}),g(a.buttons,function(a){if(d[a]===c)throw new Error("button key "+a+" is not allowed (options are "+b.join("\n")+")")}),a}var n={dialog:"<div class='bootbox modal' tabindex='-1' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>",header:"<div class='modal-header'><h4 class='modal-title'></h4></div>",footer:"<div class='modal-footer'></div>",closeButton:"<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",form:"<form class='bootbox-form'></form>",inputs:{text:"<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",textarea:"<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",email:"<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",select:"<select class='bootbox-input bootbox-input-select form-control'></select>",checkbox:"<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",date:"<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",time:"<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",number:"<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",password:"<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"}},o={locale:"en",backdrop:"static",animate:!0,className:null,closeButton:!0,show:!0,container:"body"},p={};p.alert=function(){var a;if(a=k("alert",["ok"],["message","callback"],arguments),a.callback&&!b.isFunction(a.callback))throw new Error("alert requires callback property to be a function when provided");return a.buttons.ok.callback=a.onEscape=function(){return b.isFunction(a.callback)?a.callback.call(this):!0},p.dialog(a)},p.confirm=function(){var a;if(a=k("confirm",["cancel","confirm"],["message","callback"],arguments),a.buttons.cancel.callback=a.onEscape=function(){return a.callback.call(this,!1)},a.buttons.confirm.callback=function(){return a.callback.call(this,!0)},!b.isFunction(a.callback))throw new Error("confirm requires a callback");return p.dialog(a)},p.prompt=function(){var a,d,e,f,h,i,k;if(f=b(n.form),d={className:"bootbox-prompt",buttons:l("cancel","confirm"),value:"",inputType:"text"},a=m(j(d,arguments,["title","callback"]),["cancel","confirm"]),i=a.show===c?!0:a.show,a.message=f,a.buttons.cancel.callback=a.onEscape=function(){return a.callback.call(this,null)},a.buttons.confirm.callback=function(){var c;switch(a.inputType){case"text":case"textarea":case"email":case"select":case"date":case"time":case"number":case"password":c=h.val();break;case"checkbox":var d=h.find("input:checked");c=[],g(d,function(a,d){c.push(b(d).val())})}return a.callback.call(this,c)},a.show=!1,!a.title)throw new Error("prompt requires a title");if(!b.isFunction(a.callback))throw new Error("prompt requires a callback");if(!n.inputs[a.inputType])throw new Error("invalid prompt type");switch(h=b(n.inputs[a.inputType]),a.inputType){case"text":case"textarea":case"email":case"date":case"time":case"number":case"password":h.val(a.value);break;case"select":var o={};if(k=a.inputOptions||[],!b.isArray(k))throw new Error("Please pass an array of input options");if(!k.length)throw new Error("prompt with select requires options");g(k,function(a,d){var e=h;if(d.value===c||d.text===c)throw new Error("given options in wrong format");d.group&&(o[d.group]||(o[d.group]=b("<optgroup/>").attr("label",d.group)),e=o[d.group]),e.append("<option value='"+d.value+"'>"+d.text+"</option>")}),g(o,function(a,b){h.append(b)}),h.val(a.value);break;case"checkbox":var q=b.isArray(a.value)?a.value:[a.value];if(k=a.inputOptions||[],!k.length)throw new Error("prompt with checkbox requires options");if(!k[0].value||!k[0].text)throw new Error("given options in wrong format");h=b("<div/>"),g(k,function(c,d){var e=b(n.inputs[a.inputType]);e.find("input").attr("value",d.value),e.find("label").append(d.text),g(q,function(a,b){b===d.value&&e.find("input").prop("checked",!0)}),h.append(e)})}return a.placeholder&&h.attr("placeholder",a.placeholder),a.pattern&&h.attr("pattern",a.pattern),a.maxlength&&h.attr("maxlength",a.maxlength),f.append(h),f.on("submit",function(a){a.preventDefault(),a.stopPropagation(),e.find(".btn-primary").click()}),e=p.dialog(a),e.off("shown.bs.modal"),e.on("shown.bs.modal",function(){h.focus()}),i===!0&&e.modal("show"),e},p.dialog=function(a){a=h(a);var d=b(n.dialog),f=d.find(".modal-dialog"),i=d.find(".modal-body"),j=a.buttons,k="",l={onEscape:a.onEscape};if(b.fn.modal===c)throw new Error("$.fn.modal is not defined; please double check you have included the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ for more details.");if(g(j,function(a,b){k+="<button data-bb-handler='"+a+"' type='button' class='btn "+b.className+"'>"+b.label+"</button>",l[a]=b.callback}),i.find(".bootbox-body").html(a.message),a.animate===!0&&d.addClass("fade"),a.className&&d.addClass(a.className),"large"===a.size?f.addClass("modal-lg"):"small"===a.size&&f.addClass("modal-sm"),a.title&&i.before(n.header),a.closeButton){var m=b(n.closeButton);a.title?d.find(".modal-header").prepend(m):m.css("margin-top","-10px").prependTo(i)}return a.title&&d.find(".modal-title").html(a.title),k.length&&(i.after(n.footer),d.find(".modal-footer").html(k)),d.on("hidden.bs.modal",function(a){a.target===this&&d.remove()}),d.on("shown.bs.modal",function(){d.find(".btn-primary:first").focus()}),"static"!==a.backdrop&&d.on("click.dismiss.bs.modal",function(a){d.children(".modal-backdrop").length&&(a.currentTarget=d.children(".modal-backdrop").get(0)),a.target===a.currentTarget&&d.trigger("escape.close.bb")}),d.on("escape.close.bb",function(a){l.onEscape&&e(a,d,l.onEscape)}),d.on("click",".modal-footer button",function(a){var c=b(this).data("bb-handler");e(a,d,l[c])}),d.on("click",".bootbox-close-button",function(a){e(a,d,l.onEscape)}),d.on("keyup",function(a){27===a.which&&d.trigger("escape.close.bb")}),b(a.container).append(d),d.modal({backdrop:a.backdrop?"static":!1,keyboard:!1,show:!1}),a.show&&d.modal("show"),d},p.setDefaults=function(){var a={};2===arguments.length?a[arguments[0]]=arguments[1]:a=arguments[0],b.extend(o,a)},p.hideAll=function(){return b(".bootbox").modal("hide"),p};var q={bg_BG:{OK:"Ок",CANCEL:"Отказ",CONFIRM:"Потвърждавам"},br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},cs:{OK:"OK",CANCEL:"Zrušit",CONFIRM:"Potvrdit"},da:{OK:"OK",CANCEL:"Annuller",CONFIRM:"Accepter"},de:{OK:"OK",CANCEL:"Abbrechen",CONFIRM:"Akzeptieren"},el:{OK:"Εντάξει",CANCEL:"Ακύρωση",CONFIRM:"Επιβεβαίωση"},en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},et:{OK:"OK",CANCEL:"Katkesta",CONFIRM:"OK"},fa:{OK:"قبول",CANCEL:"لغو",CONFIRM:"تایید"},fi:{OK:"OK",CANCEL:"Peruuta",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},he:{OK:"אישור",CANCEL:"ביטול",CONFIRM:"אישור"},hu:{OK:"OK",CANCEL:"Mégsem",CONFIRM:"Megerősít"},hr:{OK:"OK",CANCEL:"Odustani",CONFIRM:"Potvrdi"},id:{OK:"OK",CANCEL:"Batal",CONFIRM:"OK"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"},ja:{OK:"OK",CANCEL:"キャンセル",CONFIRM:"確認"},lt:{OK:"Gerai",CANCEL:"Atšaukti",CONFIRM:"Patvirtinti"},lv:{OK:"Labi",CANCEL:"Atcelt",CONFIRM:"Apstiprināt"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},no:{OK:"OK",CANCEL:"Avbryt",CONFIRM:"OK"},pl:{OK:"OK",CANCEL:"Anuluj",CONFIRM:"Potwierdź"},pt:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Confirmar"},ru:{OK:"OK",CANCEL:"Отмена",CONFIRM:"Применить"},sq:{OK:"OK",CANCEL:"Anulo",CONFIRM:"Prano"},sv:{OK:"OK",CANCEL:"Avbryt",CONFIRM:"OK"},th:{OK:"ตกลง",CANCEL:"ยกเลิก",CONFIRM:"ยืนยัน"},tr:{OK:"Tamam",CANCEL:"İptal",CONFIRM:"Onayla"},zh_CN:{OK:"OK",CANCEL:"取消",CONFIRM:"确认"},zh_TW:{OK:"OK",CANCEL:"取消",CONFIRM:"確認"}};return p.addLocale=function(a,c){return b.each(["OK","CANCEL","CONFIRM"],function(a,b){if(!c[b])throw new Error("Please supply a translation for '"+b+"'")}),q[a]={OK:c.OK,CANCEL:c.CANCEL,CONFIRM:c.CONFIRM},p},p.removeLocale=function(a){return delete q[a],p},p.setLocale=function(a){return p.setDefaults("locale",a)},p.init=function(c){return a(c||b)},p});


function checkImageSizes(images, deep, cb) {
    //console.log('checkImageSizes');

    var images = images || gJ.images;
    var imagesLength = images.length;
    // if 'images' is not an array, but an object:
    if (!imagesLength) {
        var imageKeys = Object.keys(images);
        imagesLength = imageKeys.length;
    };
    var sizesLength = gJ.sizes.length;
    // deep true = request image from server
    var deep = deep ? true : false;
    //deep = true;
    var id = 0;
    var sz = 0;

    function checkImage() {
        //console.log('checkImage');
        if (id < imagesLength) {
            var image = images[imageKeys[id]];
            var folder = image.folder;
            //console.log('checkImageSizeFolder: ' + folder);

            if (sz < sizesLength) {
                var sizeId = folder + '_' + gJ.sizes[sz] + image.file;
                var path = options.galleryPath + folder + '_' + gJ.sizes[sz] + '/' + image.file;

                // deep: request each image from server
                if (deep) {
                    fileExists(path)
                        .done(function() {
                            //console.log(path + ' does deep exist');
                        })
                        .fail(function() {
                            //console.log(path + ' does not deep exist');
                            if (stat.imagesNotProcessed.indexOf(imageKeys[id]) === -1) {
                                stat.imagesNotProcessed.push(imageKeys[id]);
                            }
                            //stat.imagesNotProcessed = stat.imagesNotProcessed.unique();
                        })
                        .always(function() {
                            sz++;
                            checkImage();
                        });

                    return false;
                }

                // quick check against all images in stat.allImages:
                if (!stat.allImages[sizeId]) {
                    //console.log(sizeId + ' does not exist');
                    stat.imagesNotProcessed.push(id);
                    stat.imagesNotProcessed = stat.imagesNotProcessed.unique();
                }
                sz++;
                checkImage();

            } else {
                sz = 0;
                id++;
                checkImage();
            }

        } else {
            //console.log("check image done");
            if (cb) {
                cb();
            }
        }
    };

    // initial call:
    checkImage();
};


function getAllImages(data) {
    // deep = if true, include thumbnail folders;
    var i = 0;
    var si = 0;
    var deep = data && data.deep ? data.deep : false
    var tmpFolderImages = [];
//    var allImagesFromServer = {};
    var sourceFolder = stat.allFolders[0];

    function getImages() {

        var folder = stat.allFolders[i];
        stat.workingFolder = folder;

        imagesFromFolder(sourceFolder).done(function(data) {
            var ol = 0;
            if (data) {
                ol = Object.keys(data).length;
                for (var key in data) {
                    stat.existingImages[key] = data[key];
                }
            }
            tmpFolderImages[folder] = [ol, 0, 0];
        }).fail(function() {
            //console.log('imagesFromFolder fail');
        }).always(function() {
            // si = 0 == base folder, without thumbnails
            if (si === 0) {
                // getNewImages();
                // getRemovedImages();
            }

            // deep === true => check thumbnail-folders
            if (deep && si < options.sizes.length) {
                sourceFolder = folder + '_' + options.sizes[si];
                si++;
                getImages();
            } else {
                // we now have all images from this folder
                //checkImageSizes();

                // Done! Next folder...
                i++;
                if (i < stat.allFolders.length) {
                    si = 0;
                    sourceFolder = stat.allFolders[i];
                    getImages();
                } else {
                    stat.folderImages = tmpFolderImages;
                    if (data && data.cb) {
                        data.cb();
                    }
                }
            }
        });
    };

    getImages();
};

!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.sortable=t()}(this,function(){"use strict";var e,t,n,r=[],a=[],o=function(e,t,n){return void 0===n?e&&e.h5s&&e.h5s.data&&e.h5s.data[t]:(e.h5s=e.h5s||{},e.h5s.data=e.h5s.data||{},e.h5s.data[t]=n,void 0)},i=function(e){e.h5s&&delete e.h5s.data};switch(!0){case"matches"in window.Element.prototype:n="matches";break;case"mozMatchesSelector"in window.Element.prototype:n="mozMatchesSelector";break;case"msMatchesSelector"in window.Element.prototype:n="msMatchesSelector";break;case"webkitMatchesSelector"in window.Element.prototype:n="webkitMatchesSelector"}var s=function(e,t){if(!t)return Array.prototype.slice.call(e);for(var r=[],a=0;a<e.length;++a)"string"==typeof t&&e[a][n](t)&&r.push(e[a]),t.indexOf(e[a])!==-1&&r.push(e[a]);return r},l=function(e,t,n){if(e instanceof Array)for(var r=0;r<e.length;++r)l(e[r],t,n);else e.addEventListener(t,n),e.h5s=e.h5s||{},e.h5s.events=e.h5s.events||{},e.h5s.events[t]=n},d=function(e,t){if(e instanceof Array)for(var n=0;n<e.length;++n)d(e[n],t);else e.h5s&&e.h5s.events&&e.h5s.events[t]&&(e.removeEventListener(t,e.h5s.events[t]),delete e.h5s.events[t])},c=function(e,t,n){if(e instanceof Array)for(var r=0;r<e.length;++r)c(e[r],t,n);else e.setAttribute(t,n)},f=function(e,t){if(e instanceof Array)for(var n=0;n<e.length;++n)f(e[n],t);else e.removeAttribute(t)},p=function(e){var t=e.getClientRects()[0];return{left:t.left+window.scrollX,top:t.top+window.scrollY}},h=function(e){d(e,"dragstart"),d(e,"dragend"),d(e,"selectstart"),d(e,"dragover"),d(e,"dragenter"),d(e,"drop")},u=function(e){d(e,"dragover"),d(e,"dragenter"),d(e,"drop")},g=function(e,t){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text",""),e.dataTransfer.setDragImage&&e.dataTransfer.setDragImage(t.draggedItem,t.x,t.y)},m=function(e,t){return t.x||(t.x=parseInt(e.pageX-p(t.draggedItem).left)),t.y||(t.y=parseInt(e.pageY-p(t.draggedItem).top)),t},v=function(e){return{draggedItem:e}},y=function(e,t){var n=v(t);n=m(e,n),g(e,n)},b=function(e){i(e),f(e,"aria-dropeffect")},E=function(e){f(e,"aria-grabbed"),f(e,"draggable"),f(e,"role")},w=function(e,t){return e===t||void 0!==o(e,"connectWith")&&o(e,"connectWith")===o(t,"connectWith")},x=function(e,t){var n,r=[];if(!t)return e;for(var a=0;a<e.length;++a)n=e[a].querySelectorAll(t),r=r.concat(Array.prototype.slice.call(n));return r},I=function(e){var t=o(e,"opts")||{},n=s(e.children,t.items),r=x(n,t.handle);u(e),b(e),d(r,"mousedown"),h(n),E(n)},A=function(e){var t=o(e,"opts"),n=s(e.children,t.items),r=x(n,t.handle);c(e,"aria-dropeffect","move"),c(r,"draggable","true");var a=(document||window.document).createElement("span");"function"!=typeof a.dragDrop||t.disableIEFix||l(r,"mousedown",function(){if(n.indexOf(this)!==-1)this.dragDrop();else{for(var e=this.parentElement;n.indexOf(e)===-1;)e=e.parentElement;e.dragDrop()}})},C=function(e){var t=o(e,"opts"),n=s(e.children,t.items),r=x(n,t.handle);c(e,"aria-dropeffect","none"),c(r,"draggable","false"),d(r,"mousedown")},S=function(e){var t=o(e,"opts"),n=s(e.children,t.items),r=x(n,t.handle);h(n),d(r,"mousedown"),u(e)},D=function(e){return e.parentElement?Array.prototype.indexOf.call(e.parentElement.children,e):0},L=function(e){return!!e.parentNode},O=function(e){if("string"!=typeof e)return e;var t=document.createElement("div");return t.innerHTML=e,t.firstChild},W=function(e,t){e.parentElement.insertBefore(t,e)},M=function(e,t){e.parentElement.insertBefore(t,e.nextElementSibling)},N=function(e){e.parentNode&&e.parentNode.removeChild(e)},T=function(e,t){var n=document.createEvent("Event");return t&&(n.detail=t),n.initEvent(e,!1,!0),n},k=function(e,t){a.forEach(function(n){w(e,n)&&n.dispatchEvent(t)})},P=function(n,i){var d=String(i);return i=function(e){var t={connectWith:!1,placeholder:null,dragImage:null,disableIEFix:!1,placeholderClass:"sortable-placeholder",draggingClass:"sortable-dragging",hoverClass:!1};for(var n in e)t[n]=e[n];return t}(i),"string"==typeof n&&(n=document.querySelectorAll(n)),n instanceof window.Element&&(n=[n]),n=Array.prototype.slice.call(n),n.forEach(function(n){if(/enable|disable|destroy/.test(d))return void P[d](n);i=o(n,"opts")||i,o(n,"opts",i),S(n);var f,h,u=s(n.children,i.items),m=i.placeholder;if(m||(m=document.createElement(/^ul|ol$/i.test(n.tagName)?"li":"div")),m=O(m),m.classList.add.apply(m.classList,i.placeholderClass.split(" ")),!n.getAttribute("data-sortable-id")){var v=a.length;a[v]=n,c(n,"data-sortable-id",v),c(u,"data-item-sortable-id",v)}if(o(n,"items",i.items),r.push(m),i.connectWith&&o(n,"connectWith",i.connectWith),A(n),c(u,"role","option"),c(u,"aria-grabbed","false"),i.hoverClass){var b="sortable-over";"string"==typeof i.hoverClass&&(b=i.hoverClass),l(u,"mouseenter",function(){this.classList.add(b)}),l(u,"mouseleave",function(){this.classList.remove(b)})}l(u,"dragstart",function(r){r.stopImmediatePropagation(),i.dragImage?(g(r,{draggedItem:i.dragImage,x:0,y:0}),console.log("WARNING: dragImage option is deprecated and will be removed in the future!")):y(r,this),this.classList.add(i.draggingClass),e=this,c(e,"aria-grabbed","true"),f=D(e),t=parseInt(window.getComputedStyle(e).height),h=this.parentElement,k(n,T("sortstart",{item:e,placeholder:m,startparent:h}))}),l(u,"dragend",function(){var a;e&&(e.classList.remove(i.draggingClass),c(e,"aria-grabbed","false"),e.style.display=e.oldDisplay,delete e.oldDisplay,r.forEach(N),a=this.parentElement,k(n,T("sortstop",{item:e,startparent:h})),f===D(e)&&h===a||k(n,T("sortupdate",{item:e,index:s(a.children,o(a,"items")).indexOf(e),oldindex:u.indexOf(e),elementIndex:D(e),oldElementIndex:f,startparent:h,endparent:a})),e=null,t=null)}),l([n,m],"drop",function(t){var a;w(n,e.parentElement)&&(t.preventDefault(),t.stopPropagation(),a=r.filter(L)[0],M(a,e),e.dispatchEvent(T("dragend")))});var E=function(a){if(w(n,e.parentElement))if(a.preventDefault(),a.stopPropagation(),a.dataTransfer.dropEffect="move",u.indexOf(this)!==-1){var o=parseInt(window.getComputedStyle(this).height),l=D(m),d=D(this);if(i.forcePlaceholderSize&&(m.style.height=t+"px"),o>t){var c=o-t,f=p(this).top;if(l<d&&a.pageY<f+c)return;if(l>d&&a.pageY>f+o-c)return}void 0===e.oldDisplay&&(e.oldDisplay=e.style.display),e.style.display="none",l<d?M(this,m):W(this,m),r.filter(function(e){return e!==m}).forEach(N)}else r.indexOf(this)!==-1||s(this.children,i.items).length||(r.forEach(N),this.appendChild(m))};l(u.concat(n),"dragover",E),l(u.concat(n),"dragenter",E)}),n};return P.destroy=function(e){I(e)},P.enable=function(e){A(e)},P.disable=function(e){C(e)},P});
//# sourceMappingURL=html.sortable.min.js.map

var loggedin = function() {
    var loginCookie = document.cookie.split('=')[1];
    return (loginCookie) ? true : false;
};

function checkLoggedin() {
    if (!loggedin) {

    }
};

function requestLogin(postdata) {
    var request = new XMLHttpRequest();
    request.open('POST', 'login.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            loggedin = data;
           //console.log(data);
            if (loggedin) {
                // tba
            }
        } else {
           //console.log("nope");
        }
    };

    request.onerror = function() {
       //console.log("connection error");
    };

    request.send(postdata);
};

//console.log(checkLoggedin());

/*
document.getElementById('inputRememberme').onclick = function(e) {
	e.stopImmediatePropagation();
	var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
	var checked = (element.checked) ? false : true;
	element.checked = (checked) ? false : checked.toString();
};
*/

function initLogin() {
    // Attach a submit handler to the form
    document.getElementById('loginSubmit').onclick = function(e) {

       //console.log("submit");
        // Stop form from submitting normally
        e.preventDefault();

        var username = document.getElementById('inputUsername').value;
        var password = document.getElementById('inputPassword').value;
        var rememberme = 'off';
        if (document.getElementById('inputRememberme').checked) {
            rememberme = 'on';
        }

        var postdata = "username=" + username + "&password=" + password + "&rememberme=" + rememberme;
        //username=&password=&rememberme=on&depth=5
       //console.log("postdata: " + postdata);

        // Send the data using post
        requestLogin(postdata)

        /*
        $.ajax({
            type: "POST",
            url: "login.php",
            data: postdata,
            success: function(data) {
                console.log("data: " + data);
            }
        })
        */
    };
}


function processImages() {

    loader();

    $('#allImagesButton').off('click').text('resize ' + imagesAdded.length + ' image/s').on('click', function() {

        window.ri = 0;
        var data = imagesFromFolderData;
        var keys = imagesAdded;
        var length = 0;
        if (keys) {
            var length = keys.length;
        }
        resizeStoreSync(data, keys, length, folder);

    });

    processImages();
    //loader('off');

};

function resizeStoreSync(data, keys, length, folder) {

    if (window.ri < length) {
        var key = keys[window.ri];
        var val = data[key];
        var folder = val.folder;
        var file = val.file;

        resizeStore(folder, file).done(function(resizeData) {
            window.ri++;

            // add images to gJ
            gJ.images[key] = data[key];

            resizeStoreSync();
        });
    }
};

function processNewFolders(cb) {

    loader();

    if (stat.newFolders.length === 0) {
        return false;
    }

    processNewFolder({
        'folder': stat.newFolders[0],
        'cb': function() {
            if (stat.newFolders.length > 0) {
                // if there are new folders left, do it again...
                processNewFolders();

            } else {

                if (cb) {
                    cb();
                }
            }
        }
    });
};

function processNewFolder(d) {
   //console.log("processNewFolder()");

    var folder = d ? d.folder : stat.workingFolder;

    // read images from folder:
    imagesFromFolder(folder).done(function(imagesFromFolderData) {
        // error:
        var er = false;

        if (imagesFromFolderData) {
            var keys = Object.keys(imagesFromFolderData);
            var kLength = keys.length;
        } else {
            // somethings wrong with the response, so error = true
            er = true;
        }

        if (er || kLength < 1) {
           //console.log("no images");
            stat.newImages = [];
						// callback:
            if (d.cb) {
                d.cb();
            }
            //stat.newFolders = _.without(stat.newFolders, folder);
            return false;
        }

        stat.newImages = keys;

        var i = 0;

        function resizeStoreSync() {

            if (i < kLength) {
                //var key = keys[i];
                var key = stat.newImages[0];
                var val = imagesFromFolderData[key];
                var folder = val.folder;
                var file = val.file;

                stat.workingImage = file;

                var resizeStoreSizes = new _resizeStoreSizes(folder, file);
                resizeStoreSizes.done(function() {
                    // add images to gJ
                    //stat.newImages = _.without(stat.newImages, key);
                    stat.newImages = arrayWithout(stat.newImages, [key])
                    gJ.images[key] = imagesFromFolderData[key];
                    i++;
                    resizeStoreSync();
                });

                // add folder to known folders
                if (gJ.folders.indexOf(folder) === -1) {
                    gJ.folders.push(folder);
                }

            } else {
                // all files from folder processed
                if (d.cb) {
                    d.cb();
                }
            }
        }; // <-- end resizeStoreSync

        resizeStoreSync();

        // ...and remove from stat.newFolders
        //stat.newFolders = _.without(stat.newFolders, folder);
        stat.newFolders = arrayWithout(stat.newFolders, [folder]);

    }).fail(function(){
        //stat.newFolders = _.without(stat.newFolders, folder);
        stat.newFolders = arrayWithout(stat.newFolders, [folder]);
       //console.log("images from folder error");
    });
    // <-- end images from folder function

    fnf++;

};


function removeImages() {
    var l = imagesRemoved.length;
    var folders = [];
    var i = 0;

    if (l > 0) {
        var id = imagesRemoved[i];

        for (var sz in gJ.sizes) {
            var size = gJ.sizes[sz];
            var file = gJ.images[sz].file;
            var folder = gJ.images[sz].folder;
            var gid = folder + '_' + size + file;

            // check if this file's thumbnail is on the server
            if (allImagesFromServer[gid]) {
                folders.push(gJ.images[id].folder + '_' + size + '/' + gJ.images[id].file);
            }
        }
    }

    function removeImageSync() {
        if (i < folders.length) {
            removeImage(folders[i])
                .done(function() {
                    i++;
                    delete gJ.images[key];
                    delete imagesRemoved[key];
                    //console.log('done ' + i);
                    removeImageSync();
                })
                .fail(function() {
                    i++;
                    //console.log('fail ' + i);
                    removeImageSync();
                });
        } else {
            //console.log('finished deleting');
            // save JSON:
            $('#deleteImagesButton').off('click').text('save').on('click', function() {
                /*
                 backup().done(function(data){
                 var content = JSON.stringify(gJ);
                 var target = 'gallery.json';
                 saveFileAs(content, target);
                 });
                 */

                saveJSON();
            });
        }
    };

    var p = 0;
    var pl = folders.length;
    removeImageSync();
};

// requests
var request = true;

var allFolders = function() {
    return $.post('./requests/allFolders.php', 'allFolders', null, 'json');
};

var createFolder = function(folder) {
    return $.post('./requests/createFolder.php', 'folder=gallery/' + folder, null, 'json');
};

var removeFolder = function(folder) {
    return $.post('./requests/removeFolder.php', 'folder=gallery/' + folder, null);
};

var imagesFromFolder = function(f) {
    var postdata = 'folder=../gallery/' + f + '&ts=' + Date.now();
    return $.post('./requests/imagesFromFolder.php', postdata, null, 'json').done(function(data) {
        stat.allImages = data;
    });
};

var resizeStore = function(folder, file, size, force) {
    var postdata = 'folder=gallery/' + folder + '&file=' + file + '&sizes=' + size + '&force=' + force;
    return $.post('./requests/resizeStore.php', postdata, 'json');
};

var removeImage = function(folder) {
    return $.post('./requests/removeImage.php', 'path=gallery/' + folder, null, 'json');
};

var getAllBackups = function() {
    return $.post('./requests/allBackups.php', 'allBackups=true&t=' + Date.now(), null, 'json');
};

var backup = function() {
    return $.post(options.scriptBase + 'backup.php', 'backup=true', null, 'json');
};

var loadBackup = function(url) {
    return $.getJSON(url);
};

var fileExists = function(file) {
    return $.ajax({url: file, type: 'HEAD', async: true});
};

var saveFileAs = function(c, t) {
    return $.post(options.scriptBase + 'saveFileAs.php', 'content=' + c + '&target=' + t);
};

var _resizeStoreSizes = function(folder, file, sizes, force) {

    if (!folder || !file) {
       //console.log("no folder or file!")
        return false;
    }

    var sizes = sizes || options.sizes;
    var force = force || false;

    var done;
    this.done = function(cb) {
        done = cb;
    };

    var i = 0;
    send();

    function send() {
        if (i < sizes.length) {

            stat.workingSize = sizes[i];

            resizeStore(folder, file, sizes[i], false).done(function() {
                i++;
                send();
            }).fail(function() {
               //console.log("resizeStore fail");
            });

        } else {
            done();
        }
    };
};

/**
 * speakingurl
 * @version v10.0.0
 * @link http://pid.github.io/speakingurl/
 * @license BSD
 * @author Sascha Droste
 */!function(e,a){"use strict";var n=function(e,a){var n,t,u,l,s,r,m,c,h,d,g,k,f,y,p,A="-",b=[";","?",":","@","&","=","+","$",",","/"],z=[";","?",":","@","&","=","+","$",","],E=[".","!","~","*","'","(",")"],j="",S="",O=!0,v={},w={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"Ae","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"Oe","Ő":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"Ue","Ű":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"ae","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"oe","ő":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"ue","ű":"u","ý":"y","þ":"th","ÿ":"y","ẞ":"SS","ا":"a","أ":"a","إ":"i","آ":"aa","ؤ":"u","ئ":"e","ء":"a","ب":"b","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ي":"y","ى":"a","ة":"h","ﻻ":"la","ﻷ":"laa","ﻹ":"lai","ﻵ":"laa","َ":"a","ً":"an","ِ":"e","ٍ":"en","ُ":"u","ٌ":"on","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","က":"k","ခ":"kh","ဂ":"g","ဃ":"ga","င":"ng","စ":"s","ဆ":"sa","ဇ":"z","စျ":"za","ည":"ny","ဋ":"t","ဌ":"ta","ဍ":"d","ဎ":"da","ဏ":"na","တ":"t","ထ":"ta","ဒ":"d","ဓ":"da","န":"n","ပ":"p","ဖ":"pa","ဗ":"b","ဘ":"ba","မ":"m","ယ":"y","ရ":"ya","လ":"l","ဝ":"w","သ":"th","ဟ":"h","ဠ":"la","အ":"a","ြ":"y","ျ":"ya","ွ":"w","ြွ":"yw","ျွ":"ywa","ှ":"h","ဧ":"e","၏":"-e","ဣ":"i","ဤ":"-i","ဉ":"u","ဦ":"-u","ဩ":"aw","သြော":"aw","ဪ":"aw","၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","္":"","့":"","း":"","č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z","ހ":"h","ށ":"sh","ނ":"n","ރ":"r","ބ":"b","ޅ":"lh","ކ":"k","އ":"a","ވ":"v","މ":"m","ފ":"f","ދ":"dh","ތ":"th","ލ":"l","ގ":"g","ޏ":"gn","ސ":"s","ޑ":"d","ޒ":"z","ޓ":"t","ޔ":"y","ޕ":"p","ޖ":"j","ޗ":"ch","ޘ":"tt","ޙ":"hh","ޚ":"kh","ޛ":"th","ޜ":"z","ޝ":"sh","ޞ":"s","ޟ":"d","ޠ":"t","ޡ":"z","ޢ":"a","ޣ":"gh","ޤ":"q","ޥ":"w","ަ":"a","ާ":"aa","ި":"i","ީ":"ee","ު":"u","ޫ":"oo","ެ":"e","ޭ":"ey","ޮ":"o","ޯ":"oa","ް":"","α":"a","β":"v","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"ks","ο":"o","π":"p","ρ":"r","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"o","ά":"a","έ":"e","ί":"i","ό":"o","ύ":"y","ή":"i","ώ":"o","ς":"s","ϊ":"i","ΰ":"y","ϋ":"y","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"I","Θ":"TH","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"KS","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ά":"A","Έ":"E","Ί":"I","Ό":"O","Ύ":"Y","Ή":"I","Ώ":"O","Ϊ":"I","Ϋ":"Y","ā":"a","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","ū":"u","Ā":"A","Ē":"E","Ģ":"G","Ī":"I","Ķ":"k","Ļ":"L","Ņ":"N","Ū":"U","Ќ":"Kj","ќ":"kj","Љ":"Lj","љ":"lj","Њ":"Nj","њ":"nj","Тс":"Ts","тс":"ts","ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"E","Ł":"L","Ń":"N","Ś":"S","Ź":"Z","Ż":"Z","Є":"Ye","І":"I","Ї":"Yi","Ґ":"G","є":"ye","і":"i","ї":"yi","ґ":"g","ă":"a","Ă":"A","ș":"s","Ș":"S","ț":"t","Ț":"T","ţ":"t","Ţ":"T","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"i","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ё":"Yo","Ж":"Zh","З":"Z","И":"I","Й":"I","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"Kh","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","ђ":"dj","ј":"j","ћ":"c","џ":"dz","Ђ":"Dj","Ј":"j","Ћ":"C","Џ":"Dz","ľ":"l","ĺ":"l","ŕ":"r","Ľ":"L","Ĺ":"L","Ŕ":"R","ş":"s","Ş":"S","ı":"i","İ":"I","ğ":"g","Ğ":"G","ả":"a","Ả":"A","ẳ":"a","Ẳ":"A","ẩ":"a","Ẩ":"A","đ":"d","Đ":"D","ẹ":"e","Ẹ":"E","ẽ":"e","Ẽ":"E","ẻ":"e","Ẻ":"E","ế":"e","Ế":"E","ề":"e","Ề":"E","ệ":"e","Ệ":"E","ễ":"e","Ễ":"E","ể":"e","Ể":"E","ọ":"o","Ọ":"o","ố":"o","Ố":"O","ồ":"o","Ồ":"O","ổ":"o","Ổ":"O","ộ":"o","Ộ":"O","ỗ":"o","Ỗ":"O","ơ":"o","Ơ":"O","ớ":"o","Ớ":"O","ờ":"o","Ờ":"O","ợ":"o","Ợ":"O","ỡ":"o","Ỡ":"O","Ở":"o","ở":"o","ị":"i","Ị":"I","ĩ":"i","Ĩ":"I","ỉ":"i","Ỉ":"i","ủ":"u","Ủ":"U","ụ":"u","Ụ":"U","ũ":"u","Ũ":"U","ư":"u","Ư":"U","ứ":"u","Ứ":"U","ừ":"u","Ừ":"U","ự":"u","Ự":"U","ữ":"u","Ữ":"U","ử":"u","Ử":"ư","ỷ":"y","Ỷ":"y","ỳ":"y","Ỳ":"Y","ỵ":"y","Ỵ":"Y","ỹ":"y","Ỹ":"Y","ạ":"a","Ạ":"A","ấ":"a","Ấ":"A","ầ":"a","Ầ":"A","ậ":"a","Ậ":"A","ẫ":"a","Ẫ":"A","ắ":"a","Ắ":"A","ằ":"a","Ằ":"A","ặ":"a","Ặ":"A","ẵ":"a","Ẵ":"A","“":'"',"”":'"',"‘":"'","’":"'","∂":"d","ƒ":"f","™":"(TM)","©":"(C)","œ":"oe","Œ":"OE","®":"(R)","†":"+","℠":"(SM)","…":"...","˚":"o","º":"o","ª":"a","•":"*","၊":",","။":".",$:"USD","€":"EUR","₢":"BRN","₣":"FRF","£":"GBP","₤":"ITL","₦":"NGN","₧":"ESP","₩":"KRW","₪":"ILS","₫":"VND","₭":"LAK","₮":"MNT","₯":"GRD","₱":"ARS","₲":"PYG","₳":"ARA","₴":"UAH","₵":"GHS","¢":"cent","¥":"CNY","元":"CNY","円":"YEN","﷼":"IRR","₠":"EWE","฿":"THB","₨":"INR","₹":"INR","₰":"PF"},U=["်","ް"],C={"ာ":"a","ါ":"a","ေ":"e","ဲ":"e","ိ":"i","ီ":"i","ို":"o","ု":"u","ူ":"u","ေါင်":"aung","ော":"aw","ော်":"aw","ေါ":"aw","ေါ်":"aw","်":"်","က်":"et","ိုက်":"aik","ောက်":"auk","င်":"in","ိုင်":"aing","ောင်":"aung","စ်":"it","ည်":"i","တ်":"at","ိတ်":"eik","ုတ်":"ok","ွတ်":"ut","ေတ်":"it","ဒ်":"d","ိုဒ်":"ok","ုဒ်":"ait","န်":"an","ာန်":"an","ိန်":"ein","ုန်":"on","ွန်":"un","ပ်":"at","ိပ်":"eik","ုပ်":"ok","ွပ်":"ut","န်ုပ်":"nub","မ်":"an","ိမ်":"ein","ုမ်":"on","ွမ်":"un","ယ်":"e","ိုလ်":"ol","ဉ်":"in","ံ":"an","ိံ":"ein","ုံ":"on","ައް":"ah","ަށް":"ah"},I={en:{},az:{"ç":"c","ə":"e","ğ":"g","ı":"i","ö":"o","ş":"s","ü":"u","Ç":"C","Ə":"E","Ğ":"G","İ":"I","Ö":"O","Ş":"S","Ü":"U"},cs:{"č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z"},fi:{"ä":"a","Ä":"A","ö":"o","Ö":"O"},hu:{"ä":"a","Ä":"A","ö":"o","Ö":"O","ü":"u","Ü":"U","ű":"u","Ű":"U"},lt:{"ą":"a","č":"c","ę":"e","ė":"e","į":"i","š":"s","ų":"u","ū":"u","ž":"z","Ą":"A","Č":"C","Ę":"E","Ė":"E","Į":"I","Š":"S","Ų":"U","Ū":"U"},lv:{"ā":"a","č":"c","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","š":"s","ū":"u","ž":"z","Ā":"A","Č":"C","Ē":"E","Ģ":"G","Ī":"i","Ķ":"k","Ļ":"L","Ņ":"N","Š":"S","Ū":"u","Ž":"Z"},pl:{"ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"e","Ł":"L","Ń":"N","Ó":"O","Ś":"S","Ź":"Z","Ż":"Z"},sk:{"ä":"a","Ä":"A"},sr:{"љ":"lj","њ":"nj","Љ":"Lj","Њ":"Nj","đ":"dj","Đ":"Dj"},tr:{"Ü":"U","Ö":"O","ü":"u","ö":"o"}},N={ar:{"∆":"delta","∞":"la-nihaya","♥":"hob","&":"wa","|":"aw","<":"aqal-men",">":"akbar-men","∑":"majmou","¤":"omla"},az:{},ca:{"∆":"delta","∞":"infinit","♥":"amor","&":"i","|":"o","<":"menys que",">":"mes que","∑":"suma dels","¤":"moneda"},cz:{"∆":"delta","∞":"nekonecno","♥":"laska","&":"a","|":"nebo","<":"mene jako",">":"vice jako","∑":"soucet","¤":"mena"},de:{"∆":"delta","∞":"unendlich","♥":"Liebe","&":"und","|":"oder","<":"kleiner als",">":"groesser als","∑":"Summe von","¤":"Waehrung"},dv:{"∆":"delta","∞":"kolunulaa","♥":"loabi","&":"aai","|":"noonee","<":"ah vure kuda",">":"ah vure bodu","∑":"jumula","¤":"faisaa"},en:{"∆":"delta","∞":"infinity","♥":"love","&":"and","|":"or","<":"less than",">":"greater than","∑":"sum","¤":"currency"},es:{"∆":"delta","∞":"infinito","♥":"amor","&":"y","|":"u","<":"menos que",">":"mas que","∑":"suma de los","¤":"moneda"},fr:{"∆":"delta","∞":"infiniment","♥":"Amour","&":"et","|":"ou","<":"moins que",">":"superieure a","∑":"somme des","¤":"monnaie"},gr:{},hu:{"∆":"delta","∞":"vegtelen","♥":"szerelem","&":"es","|":"vagy","<":"kisebb mint",">":"nagyobb mint","∑":"szumma","¤":"penznem"},it:{"∆":"delta","∞":"infinito","♥":"amore","&":"e","|":"o","<":"minore di",">":"maggiore di","∑":"somma","¤":"moneta"},lt:{},lv:{"∆":"delta","∞":"bezgaliba","♥":"milestiba","&":"un","|":"vai","<":"mazak neka",">":"lielaks neka","∑":"summa","¤":"valuta"},my:{"∆":"kwahkhyaet","∞":"asaonasme","♥":"akhyait","&":"nhin","|":"tho","<":"ngethaw",">":"kyithaw","∑":"paungld","¤":"ngwekye"},mk:{},nl:{"∆":"delta","∞":"oneindig","♥":"liefde","&":"en","|":"of","<":"kleiner dan",">":"groter dan","∑":"som","¤":"valuta"},pl:{"∆":"delta","∞":"nieskonczonosc","♥":"milosc","&":"i","|":"lub","<":"mniejsze niz",">":"wieksze niz","∑":"suma","¤":"waluta"},pt:{"∆":"delta","∞":"infinito","♥":"amor","&":"e","|":"ou","<":"menor que",">":"maior que","∑":"soma","¤":"moeda"},ro:{"∆":"delta","∞":"infinit","♥":"dragoste","&":"si","|":"sau","<":"mai mic ca",">":"mai mare ca","∑":"suma","¤":"valuta"},ru:{"∆":"delta","∞":"beskonechno","♥":"lubov","&":"i","|":"ili","<":"menshe",">":"bolshe","∑":"summa","¤":"valjuta"},sk:{"∆":"delta","∞":"nekonecno","♥":"laska","&":"a","|":"alebo","<":"menej ako",">":"viac ako","∑":"sucet","¤":"mena"},sr:{},tr:{"∆":"delta","∞":"sonsuzluk","♥":"ask","&":"ve","|":"veya","<":"kucuktur",">":"buyuktur","∑":"toplam","¤":"para birimi"},uk:{"∆":"delta","∞":"bezkinechnist","♥":"lubov","&":"i","|":"abo","<":"menshe",">":"bilshe","∑":"suma","¤":"valjuta"},vn:{"∆":"delta","∞":"vo cuc","♥":"yeu","&":"va","|":"hoac","<":"nho hon",">":"lon hon","∑":"tong","¤":"tien te"}};if("string"!=typeof e)return"";if("string"==typeof a&&(A=a),m=N.en,c=I.en,"object"==typeof a){n=a.maintainCase||!1,v=a.custom&&"object"==typeof a.custom?a.custom:v,u=+a.truncate>1&&a.truncate||!1,l=a.uric||!1,s=a.uricNoSlash||!1,r=a.mark||!1,O=a.symbols!==!1&&a.lang!==!1,A=a.separator||A,l&&(p+=b.join("")),s&&(p+=z.join("")),r&&(p+=E.join("")),m=a.lang&&N[a.lang]&&O?N[a.lang]:O?N.en:{},c=a.lang&&I[a.lang]?I[a.lang]:a.lang===!1||a.lang===!0?{}:I.en,a.titleCase&&"number"==typeof a.titleCase.length&&Array.prototype.toString.call(a.titleCase)?(a.titleCase.forEach(function(e){v[e+""]=e+""}),t=!0):t=!!a.titleCase,a.custom&&"number"==typeof a.custom.length&&Array.prototype.toString.call(a.custom)&&a.custom.forEach(function(e){v[e+""]=e+""}),Object.keys(v).forEach(function(a){var n;n=a.length>1?new RegExp("\\b"+o(a)+"\\b","gi"):new RegExp(o(a),"gi"),e=e.replace(n,v[a])});for(g in v)p+=g}for(p+=A,p=o(p),e=e.replace(/(^\s+|\s+$)/g,""),f=!1,y=!1,d=0,k=e.length;d<k;d++)g=e[d],i(g,v)?f=!1:c[g]?(g=f&&c[g].match(/[A-Za-z0-9]/)?" "+c[g]:c[g],f=!1):g in w?(d+1<k&&U.indexOf(e[d+1])>=0?(S+=g,g=""):y===!0?(g=C[S]+w[g],S=""):g=f&&w[g].match(/[A-Za-z0-9]/)?" "+w[g]:w[g],f=!1,y=!1):g in C?(S+=g,g="",d===k-1&&(g=C[S]),y=!0):!m[g]||l&&b.join("").indexOf(g)!==-1||s&&z.join("").indexOf(g)!==-1?(y===!0?(g=C[S]+g,S="",y=!1):f&&(/[A-Za-z0-9]/.test(g)||j.substr(-1).match(/A-Za-z0-9]/))&&(g=" "+g),f=!1):(g=f||j.substr(-1).match(/[A-Za-z0-9]/)?A+m[g]:m[g],g+=void 0!==e[d+1]&&e[d+1].match(/[A-Za-z0-9]/)?A:"",f=!0),j+=g.replace(new RegExp("[^\\w\\s"+p+"_-]","g"),A);return t&&(j=j.replace(/(\w)(\S*)/g,function(e,a,n){var t=a.toUpperCase()+(null!==n?n:"");return Object.keys(v).indexOf(t.toLowerCase())<0?t:t.toLowerCase()})),j=j.replace(/\s+/g,A).replace(new RegExp("\\"+A+"+","g"),A).replace(new RegExp("(^\\"+A+"+|\\"+A+"+$)","g"),""),u&&j.length>u&&(h=j.charAt(u)===A,j=j.slice(0,u),h||(j=j.slice(0,j.lastIndexOf(A)))),n||t||(j=j.toLowerCase()),j},t=function(e){return function(a){return n(a,e)}},o=function(e){return e.replace(/[-\\^$*+?.()|[\]{}\/]/g,"\\$&")},i=function(e,a){for(var n in a)if(a[n]===e)return!0};if("undefined"!=typeof module&&module.exports)module.exports=n,module.exports.createSlug=t;else if("undefined"!=typeof define&&define.amd)define([],function(){return n});else try{if(e.getSlug||e.createSlug)throw"speakingurl: globals exists /(getSlug|createSlug)/";e.getSlug=n,e.createSlug=t}catch(e){}}(this);
'use strict';

var _upldr = function() {

    this.options = {
        'target': "upldr.php",
        'typeMatch': 'image.*',
        'slug': true,
        'cbReaderOnload': function() {
            //console.log("cbReaderOnload");
        },
        'cbReset': function() {
            document.getElementById('file-table-body').innerHTML = "";
        }
    };
    var options = this.options;

    this.set = function(data) {
        if (data) {
            for (var key in data) {
                options[key] = data[key];
            }
        }
    }

    var files = [];
    var request;
    var form = document.getElementById('upldr-form');
    var inputFile = document.getElementById('upldr-input-file');
    var progressBar = document.getElementById('upldr-progress-bar');
    var submitBtn = document.getElementById('upldr-submit-btn');
    var resetBtn = document.getElementById('upldr-reset-btn');
    var abortBtn = document.getElementById('upldr-abort-btn');
    submitBtn.disabled = true;
    resetBtn.disabled = true;
    abortBtn.disabled = true;

    var submitBtnInitText = submitBtn.innerHTML;

    var dropZone = document.querySelectorAll('.upldr-dropzone');
    if (dropZone.length < 1) {
        dropZone = document.body;
    }

    function fileSelect(evt) {

        evt.stopPropagation();
        evt.preventDefault();

        var evtFiles;
        if (evt.target.files) {
            evtFiles = evt.target.files;
        } else if (evt.dataTransfer.files) {
            evtFiles = evt.dataTransfer.files;
        } else {
            return false;
        }

        for (var i = 0; i < evtFiles.length; i++) {
            // Only process image files:
            if (evtFiles[i].type.match(options.typeMatch)) {
                files.push(evtFiles[i]);
            }
        }

        if (files.length < 1) {
            return false;
        }
        submitBtn.disabled = false;
        resetBtn.disabled = false;

        var ftb = document.getElementById('file-table-body');
        ftb.innerHTML = "";

        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();

            var f = files[i];
            reader.name = f.name;
            if (options.slug && getSlug) {
                var str = f.name.split('.');
                str[0] = getSlug(str[0]);
                reader.name = str.join('.');
            }

            reader.type = f.type;
            // file size from bytes to KB:
            reader.size = (f.size / 1000).toFixed(2);
            //var fLastMod = f.lastModified;
            reader.lastMod = f.lastModifiedDate.toLocaleDateString();

            reader.onload = function(e) {
                var src = e.target.result;
                options.cbReaderOnload(src, this.name, this.type, this.size, this.lastMod);
            };
            reader.readAsDataURL(f);
        }

    };

    function fileDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    function abort() {
        if (request) {
            request.abort();
        }
    };

    this.reset = function() {
       //console.log("reset");
        files = [];
        form.reset();
        progressBar.style.width = 0;
        progressBar.innerHTML = "";
        submitBtn.innerHTML = submitBtnInitText;
        submitBtn.disabled = true;
        resetBtn.disabled = true;
        if (options.cbReset) {
            options.cbReset();
        }
        //document.getElementById('file-table-body').innerHTML = "";
    };

    function progress(e) {
        if (e.lengthComputable) {
            percLoaded = Math.round(e.loaded / e.total * 100) + "%";
            progressBar.style.width = percLoaded;
            progressBar.innerHTML = percLoaded;
            submitBtn.textContent = percLoaded;
        }
    };

    function upload(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        resetBtn.disabled = true;

        if (!files || files.length === 0) {
           //console.log('no files to upload');
            return false;
        }

        var formdata = new FormData();
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (f.type.match(options.typeMatch)) {
                formdata.append('files[]', f);
            }
        }

        if (options.data) {
            formdata.append('data', options.data);
        }

        request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //if (request.readyState == 4) {
            try {
                var resp = JSON.parse(request.response);
            } catch (e) {
                /*
                var resp = {
                	status : 'error',
                	data : 'Unknown error occurred: [' + request.responseText + ']'
                };
                */
            }
            //console.log(resp.status + ': ' + resp.data);
            //}
        };

        request.onloadend = function(e) {
            //console.log(e.target.response);
            if (options.cbOnloadend) {
                options.cbOnloadend(e);
            }
        };

        request.upload.addEventListener("progress", progress, false);
        request.open("POST", options.target, true);
        request.send(formdata);
    };


    form.onsubmit = upload;
    abortBtn.onclick = abort
    resetBtn.onclick = this.reset;
    inputFile.onchange = fileSelect;
    //inputFile.addEventListener('change', fileSelect, false);

    dropZone.addEventListener('dragover', fileDragOver, false);
    dropZone.addEventListener('drop', fileSelect, false);

};

var upldr = new _upldr;
