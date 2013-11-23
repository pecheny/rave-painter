(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var ApplicationMain = function() { }
$hxClasses["ApplicationMain"] = ApplicationMain;
ApplicationMain.__name__ = ["ApplicationMain"];
ApplicationMain.main = function() {
	ApplicationMain.completed = 0;
	ApplicationMain.loaders = new haxe.ds.StringMap();
	ApplicationMain.urlLoaders = new haxe.ds.StringMap();
	ApplicationMain.total = 0;
	flash.Lib.get_current().loaderInfo = flash.display.LoaderInfo.create(null);
	flash.Lib.get_stage().frameRate = 130;
	flash.Lib.get_current().addChild(ApplicationMain.preloader = new NMEPreloader());
	ApplicationMain.preloader.onInit();
	var resourcePrefix = "NME_:bitmap_";
	var _g = 0, _g1 = haxe.Resource.listNames();
	while(_g < _g1.length) {
		var resourceName = _g1[_g];
		++_g;
		if(StringTools.startsWith(resourceName,resourcePrefix)) {
			var type = Type.resolveClass(StringTools.replace(resourceName.substring(resourcePrefix.length),"_","."));
			if(type != null) {
				ApplicationMain.total++;
				var instance = Type.createInstance(type,[0,0,true,16777215,ApplicationMain.bitmapClass_onComplete]);
			}
		}
	}
	if(ApplicationMain.total != 0) {
		ApplicationMain.loaderStack = [];
		var $it0 = ApplicationMain.loaders.keys();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			ApplicationMain.loaderStack.push(p);
		}
		ApplicationMain.urlLoaderStack = [];
		var $it1 = ApplicationMain.urlLoaders.keys();
		while( $it1.hasNext() ) {
			var p = $it1.next();
			ApplicationMain.urlLoaderStack.push(p);
		}
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			ApplicationMain.nextLoader();
		}
	} else ApplicationMain.begin();
}
ApplicationMain.nextLoader = function() {
	if(ApplicationMain.loaderStack.length != 0) {
		var p = ApplicationMain.loaderStack.shift(), o = ApplicationMain.loaders.get(p);
		o.contentLoaderInfo.addEventListener("complete",ApplicationMain.loader_onComplete);
		o.load(new flash.net.URLRequest(p));
	} else if(ApplicationMain.urlLoaderStack.length != 0) {
		var p = ApplicationMain.urlLoaderStack.shift(), o = ApplicationMain.urlLoaders.get(p);
		o.addEventListener("complete",ApplicationMain.loader_onComplete);
		o.load(new flash.net.URLRequest(p));
	}
}
ApplicationMain.loadFile = function(p) {
	ApplicationMain.loaders.set(p,new flash.display.Loader());
	ApplicationMain.total++;
}
ApplicationMain.loadBinary = function(p) {
	var o = new flash.net.URLLoader();
	o.set_dataFormat(flash.net.URLLoaderDataFormat.BINARY);
	ApplicationMain.urlLoaders.set(p,o);
	ApplicationMain.total++;
}
ApplicationMain.loadSound = function(p) {
	return;
	var i = p.lastIndexOf("."), c = flash.media.Sound, s, o, f = null, q = "canplaythrough";
	if(i == -1) return;
	if(!c.canPlayType || !c.canPlayType(HxOverrides.substr(p,i + 1,null))) return;
	if(!c.library) c.library = new haxe.ds.StringMap();
	s = HxOverrides.substr(p,0,i) + ".mp3";
	if(c.library.exists(s)) return;
	ApplicationMain.total++;
	c.library.set(s,o = new Audio(p));
	f = function(e) {
		o.removeEventListener(q,f);
		ApplicationMain.preloader.onUpdate(++ApplicationMain.completed,ApplicationMain.total);
		if(ApplicationMain.completed == ApplicationMain.total) ApplicationMain.begin();
	};
	o.addEventListener(q,f);
}
ApplicationMain.begin = function() {
	ApplicationMain.preloader.addEventListener("complete",ApplicationMain.preloader_onComplete);
	ApplicationMain.preloader.onLoaded();
}
ApplicationMain.bitmapClass_onComplete = function(instance) {
	ApplicationMain.completed++;
	var classType = Type.getClass(instance);
	classType.preload = instance;
	if(ApplicationMain.completed == ApplicationMain.total) ApplicationMain.begin();
}
ApplicationMain.loader_onComplete = function(event) {
	ApplicationMain.completed++;
	ApplicationMain.preloader.onUpdate(ApplicationMain.completed,ApplicationMain.total);
	if(ApplicationMain.completed == ApplicationMain.total) ApplicationMain.begin(); else ApplicationMain.nextLoader();
}
ApplicationMain.preloader_onComplete = function(event) {
	ApplicationMain.preloader.removeEventListener("complete",ApplicationMain.preloader_onComplete);
	flash.Lib.get_current().removeChild(ApplicationMain.preloader);
	ApplicationMain.preloader = null;
	if(Reflect.field(Main,"main") == null) {
		var mainDisplayObj = Type.createInstance(DocumentClass,[]);
		if(js.Boot.__instanceof(mainDisplayObj,flash.display.DisplayObject)) flash.Lib.get_current().addChild(mainDisplayObj);
	} else Reflect.field(Main,"main").apply(Main,[]);
}
var flash = {}
flash.events = {}
flash.events.IEventDispatcher = function() { }
$hxClasses["flash.events.IEventDispatcher"] = flash.events.IEventDispatcher;
flash.events.IEventDispatcher.__name__ = ["flash","events","IEventDispatcher"];
flash.events.IEventDispatcher.prototype = {
	__class__: flash.events.IEventDispatcher
}
flash.events.EventDispatcher = function() {
	this.eventList = new haxe.ds.StringMap();
};
$hxClasses["flash.events.EventDispatcher"] = flash.events.EventDispatcher;
flash.events.EventDispatcher.__name__ = ["flash","events","EventDispatcher"];
flash.events.EventDispatcher.__interfaces__ = [flash.events.IEventDispatcher];
flash.events.EventDispatcher.prototype = {
	dispatchEvent: function(event) {
		if(event.get_target() == null) event.set_target(this);
		var t = event.type;
		if(this.eventList.exists(t)) {
			var _g = 0, _g1 = this.eventList.get(t);
			while(_g < _g1.length) {
				var o = _g1[_g];
				++_g;
				o(event);
			}
		}
		return true;
	}
	,hasEventListener: function(type) {
		return this.eventList.exists(type);
	}
	,removeEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		if(this.eventList.exists(type)) {
			var r = this.eventList.get(type);
			var _g = 0;
			while(_g < r.length) {
				var o = r[_g];
				++_g;
				if(Reflect.compareMethods(o,listener)) {
					HxOverrides.remove(r,o);
					break;
				}
			}
			if(r.length == 0) this.eventList.remove(type);
		}
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o;
		if(!this.eventList.exists(type)) this.eventList.set(type,o = []); else o = this.eventList.get(type);
		o.push(listener);
	}
	,__class__: flash.events.EventDispatcher
}
flash.events.EventWrapper = function() {
	flash.events.EventDispatcher.call(this);
	this.eventMap = new haxe.ds.ObjectMap();
};
$hxClasses["flash.events.EventWrapper"] = flash.events.EventWrapper;
flash.events.EventWrapper.__name__ = ["flash","events","EventWrapper"];
flash.events.EventWrapper.__super__ = flash.events.EventDispatcher;
flash.events.EventWrapper.prototype = $extend(flash.events.EventDispatcher.prototype,{
	removeEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		flash.events.EventDispatcher.prototype.removeEventListener.call(this,type,listener,useCapture,priority,weak);
		if(this.eventMap.h.hasOwnProperty(listener.__id__)) {
			this.component.removeEventListener(type,this.eventMap.h[listener.__id__],useCapture);
			this.eventMap.remove(listener);
		}
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var _g = this;
		flash.events.EventDispatcher.prototype.addEventListener.call(this,type,listener,useCapture,priority,weak);
		var f = (function($this) {
			var $r;
			var wrapper = function(e) {
				if(e.get_target() == _g.component) e.set_target(_g);
				e.set_currentTarget(_g);
				listener(e);
			};
			$r = wrapper;
			return $r;
		}(this));
		if(!this.eventMap.h.hasOwnProperty(listener.__id__)) this.eventMap.set(listener,f);
		this.component.addEventListener(type,f,useCapture);
	}
	,__class__: flash.events.EventWrapper
});
flash.display = {}
flash.display.DisplayObject = function() {
	this.y = 0;
	this.x = 0;
	this.rotation = 0;
	this.scaleY = 1;
	this.scaleX = 1;
	this.alpha = 1;
	this.visible = true;
	flash.events.EventWrapper.call(this);
	this.eventRemap = new haxe.ds.StringMap();
	if(this.component == null) this.component = flash.Lib.jsDiv();
	this.component.node = this;
	this.transform = new flash.geom.Transform(this);
};
$hxClasses["flash.display.DisplayObject"] = flash.display.DisplayObject;
flash.display.DisplayObject.__name__ = ["flash","display","DisplayObject"];
flash.display.DisplayObject.__super__ = flash.events.EventWrapper;
flash.display.DisplayObject.prototype = $extend(flash.events.EventWrapper.prototype,{
	toString: function() {
		return Type.getClassName(Type.getClass(this));
	}
	,addEventListener: function(type,listener,useCapture,priority,weak) {
		if(weak == null) weak = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var _g = this;
		flash.events.EventWrapper.prototype.addEventListener.call(this,type,listener,useCapture,priority,weak);
		if(flash.display.DisplayObject.remapTouch.exists(type)) {
			var f = function(e) {
				var n = new flash.events.MouseEvent(type,e.bubbles,e.cancelable,0,0,_g,e.ctrlKey,e.altKey,e.shiftKey,false), l = e.targetTouches;
				if(l.length > 0) {
					n.pageX = l[0].pageX;
					n.pageY = l[0].pageY;
				} else {
					n.pageX = _g.get_stage().mousePos.x;
					n.pageY = _g.get_stage().mousePos.y;
				}
				_g.dispatchEvent(n);
			};
			flash.events.EventWrapper.prototype.addEventListener.call(this,flash.display.DisplayObject.remapTouch.get(type),f,useCapture,priority,weak);
		}
	}
	,get_mouseY: function() {
		return (flash.display.DisplayObject.convPoint = this.globalToLocal(flash.Lib.get_current().get_stage().mousePos,flash.display.DisplayObject.convPoint)).y;
	}
	,get_mouseX: function() {
		return (flash.display.DisplayObject.convPoint = this.globalToLocal(flash.Lib.get_current().get_stage().mousePos,flash.display.DisplayObject.convPoint)).x;
	}
	,localToGlobal: function(q,r) {
		if(r == null) r = new flash.geom.Point();
		var m = flash.display.DisplayObject.convMatrix, u = q.x, v = q.y;
		if(m == null) m = flash.display.DisplayObject.convMatrix = new flash.geom.Matrix();
		m.identity();
		m = this.getGlobalMatrix(m);
		r.x = u * m.a + v * m.c + m.tx;
		r.y = u * m.b + v * m.d + m.ty;
		return r;
	}
	,globalToLocal: function(q,r) {
		if(r == null) r = new flash.geom.Point();
		var m = flash.display.DisplayObject.convMatrix, u = q.x, v = q.y;
		if(m == null) m = flash.display.DisplayObject.convMatrix = new flash.geom.Matrix();
		m.identity();
		m = this.getGlobalMatrix(m);
		m.invert();
		r.x = u * m.a + v * m.c + m.tx;
		r.y = u * m.b + v * m.d + m.ty;
		return r;
	}
	,getGlobalMatrix: function(m) {
		if(m == null) m = new flash.geom.Matrix();
		var o = this;
		while(o != null) {
			if(this.x != 0 || this.y != 0) m.translate(this.x,this.y);
			if(this.scaleX != 1 || this.scaleY != 1) m.scale(this.scaleX,this.scaleY);
			if(this.rotation != 0) m.rotate(this.rotation);
			m.concat(o.transform.get_matrix());
			o = o.parent;
		}
		return m;
	}
	,getBounds: function(o) {
		return null;
	}
	,set_stage: function(v) {
		if(this._stage != v) {
			var z = this._stage != null != (v != null);
			this._stage = v;
			if(z) this.dispatchEvent(new flash.events.Event(v != null?"addedToStage":"removedFromStage"));
		}
		return v;
	}
	,get_stage: function() {
		return this._stage;
	}
	,set_scrollRect: function(v) {
		return v;
	}
	,set_visible: function(v) {
		this.component.style.display = (this.visible = v)?null:"none";
		return v;
	}
	,set_alpha: function(v) {
		if(v != this.alpha) this.component.style.opacity = (this.alpha = v).toFixed(4);
		return v;
	}
	,set_height: function(v) {
		return v;
	}
	,set_width: function(v) {
		return v;
	}
	,get_height: function() {
		return this.qHeight || 0;
	}
	,get_width: function() {
		return this.qWidth || 0;
	}
	,set_scaleY: function(v) {
		if(this.scaleY != v) {
			this.scaleY = v;
			this.syncMtx();
		}
		return v;
	}
	,set_scaleX: function(v) {
		if(this.scaleX != v) {
			this.scaleX = v;
			this.syncMtx();
		}
		return v;
	}
	,set_rotation: function(v) {
		if(this.rotation != v) {
			this.rotation = v;
			this.syncMtx();
		}
		return v;
	}
	,set_y: function(v) {
		if(this.y != v) {
			this.y = v;
			this.syncMtx();
		}
		return v;
	}
	,set_x: function(v) {
		if(this.x != v) {
			this.x = v;
			this.syncMtx();
		}
		return v;
	}
	,syncMtx: function() {
		var s = this.component.style, v, n;
		if(this._syncMtx_set != true) {
			this._syncMtx_set = true;
			v = "0% 0%";
			n = "syncMtx-origin";
			s.setProperty(n,v,null);
			s.setProperty("-o-" + n,v,null);
			s.setProperty("-ms-" + n,v,null);
			s.setProperty("-moz-" + n,v,null);
			s.setProperty("-webkit-" + n,v,null);
		}
		v = "";
		if(this.x != 0 || this.y != 0) v += "translate(" + this.x + "px, " + this.y + "px) ";
		if(this.scaleX != 1 || this.scaleY != 1) v += "scale(" + this.scaleX + ", " + this.scaleY + ") ";
		if(this.rotation != 0) v += "rotate(" + this.rotation + "deg) ";
		if(this.transform != null) {
			var m = this.transform.get_matrix();
			if(m != null && !m.isIdentity()) v += "matrix(" + m.a + ", " + m.b + ", " + m.c + ", " + m.d + ", " + m.tx + ", " + m.ty + ")" + " ";
		}
		n = "transform";
		s.setProperty(n,v,null);
		s.setProperty("-o-" + n,v,null);
		s.setProperty("-ms-" + n,v,null);
		s.setProperty("-moz-" + n,v,null);
		s.setProperty("-webkit-" + n,v,null);
	}
	,invalidate: function() {
	}
	,broadcastEvent: function(e) {
		this.dispatchEvent(e);
	}
	,__class__: flash.display.DisplayObject
});
flash.display.InteractiveObject = function() {
	flash.display.DisplayObject.call(this);
	this.tabEnabled = false;
	this.tabIndex = 0;
	this.mouseEnabled = this.doubleClickEnabled = true;
};
$hxClasses["flash.display.InteractiveObject"] = flash.display.InteractiveObject;
flash.display.InteractiveObject.__name__ = ["flash","display","InteractiveObject"];
flash.display.InteractiveObject.__super__ = flash.display.DisplayObject;
flash.display.InteractiveObject.prototype = $extend(flash.display.DisplayObject.prototype,{
	__class__: flash.display.InteractiveObject
});
flash.display.DisplayObjectContainer = function() {
	flash.display.InteractiveObject.call(this);
	this.children = [];
};
$hxClasses["flash.display.DisplayObjectContainer"] = flash.display.DisplayObjectContainer;
flash.display.DisplayObjectContainer.__name__ = ["flash","display","DisplayObjectContainer"];
flash.display.DisplayObjectContainer.__super__ = flash.display.InteractiveObject;
flash.display.DisplayObjectContainer.prototype = $extend(flash.display.InteractiveObject.prototype,{
	set_stage: function(v) {
		flash.display.InteractiveObject.prototype.set_stage.call(this,v);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			o.set_stage(v);
		}
		return v;
	}
	,broadcastEvent: function(e) {
		this.dispatchEvent(e);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			o.broadcastEvent(e);
		}
	}
	,contains: function(v) {
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			if(o == v) return true;
		}
		return false;
	}
	,getChildIndex: function(v) {
		var i = -1, l = this.children.length;
		while(++i < l) if(this.children[i] == v) return i;
		return -1;
	}
	,getChildAt: function(v) {
		return this.children[v];
	}
	,removeChildAt: function(v) {
		return this.removeChild(this.children[v]);
	}
	,addChildAt: function(o,v) {
		if(v < this.children.length) {
			if(o.parent != null) o.parent.removeChild(o);
			o.parent = this;
			o.set_stage(this.get_stage());
			this.component.insertBefore(o.component,this.children[v].component);
			this.children.splice(v,0,o);
			return o;
		} else return this.addChild(o);
	}
	,removeChild: function(o) {
		o.parent = null;
		o.set_stage(null);
		HxOverrides.remove(this.children,o);
		this.component.removeChild(o.component);
		var e = new flash.events.Event("removed");
		o.dispatchEvent(e);
		this.dispatchEvent(e);
		return o;
	}
	,addChild: function(o) {
		if(o.parent != null) o.parent.removeChild(o);
		o.parent = this;
		o.set_stage(this.get_stage());
		this.children.push(o);
		this.component.appendChild(o.component);
		var e = new flash.events.Event("added");
		o.dispatchEvent(e);
		this.dispatchEvent(e);
		return o;
	}
	,__class__: flash.display.DisplayObjectContainer
});
flash.display.IBitmapDrawable = function() { }
$hxClasses["flash.display.IBitmapDrawable"] = flash.display.IBitmapDrawable;
flash.display.IBitmapDrawable.__name__ = ["flash","display","IBitmapDrawable"];
flash.display.IBitmapDrawable.prototype = {
	__class__: flash.display.IBitmapDrawable
}
flash.display.Sprite = function() {
	flash.display.DisplayObjectContainer.call(this);
};
$hxClasses["flash.display.Sprite"] = flash.display.Sprite;
flash.display.Sprite.__name__ = ["flash","display","Sprite"];
flash.display.Sprite.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Sprite.__super__ = flash.display.DisplayObjectContainer;
flash.display.Sprite.prototype = $extend(flash.display.DisplayObjectContainer.prototype,{
	drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		this.get_graphics().drawToSurface(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing);
	}
	,set_useHandCursor: function(o) {
		this.component.style.cursor = o?"pointer":null;
		return this.useHandCursor = o;
	}
	,set_stage: function(v) {
		var z = this.get_stage() == null && v != null, r = flash.display.DisplayObjectContainer.prototype.set_stage.call(this,v);
		if(z && this._graphics != null) this._graphics.invalidate();
		return r;
	}
	,get_graphics: function() {
		if(this._graphics == null) {
			var o = new flash.display.Graphics(), q = o.component;
			o.set_displayObject(this);
			if(this.children.length == 0) this.component.appendChild(q); else this.component.insertBefore(q,this.children[0].component);
			this._graphics = o;
		}
		return this._graphics;
	}
	,__class__: flash.display.Sprite
});
var Main = function() {
	flash.display.Sprite.call(this);
	this.addEventListener("addedToStage",$bind(this,this.added));
};
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	flash.Lib.get_current().get_stage().align = flash.display.StageAlign.TOP_LEFT;
	flash.Lib.get_current().get_stage().scaleMode = flash.display.StageScaleMode.NO_SCALE;
	flash.Lib.get_current().addChild(new Main());
}
Main.__super__ = flash.display.Sprite;
Main.prototype = $extend(flash.display.Sprite.prototype,{
	chZoom: function(deltaScale) {
		var mx = this.get_stage().get_mouseX();
		var my = this.get_stage().get_mouseY();
		var center = new flash.geom.Point(mx,my);
		var sourceMatrix = this.transform.get_matrix().clone();
		var zoomMatrix = new flash.geom.Matrix();
		zoomMatrix.translate(-center.x,-center.y);
		zoomMatrix.scale(deltaScale,deltaScale);
		zoomMatrix.translate(center.x,center.y);
		sourceMatrix.concat(zoomMatrix);
		this.transform.set_matrix(sourceMatrix);
	}
	,keyDownHandler: function(event) {
		switch(event.keyCode) {
		case 90:
			this.chZoom(1.5);
			break;
		case 88:
			this.chZoom(0.5);
			break;
		}
	}
	,drawingHandler: function(e) {
		var spacing = 1;
		Main.destinationPoint.x = this._bitmap.get_mouseX() - this.brush.get_width() / 2;
		Main.destinationPoint.y = this._bitmap.get_mouseY() - this.brush.get_height() / 2;
		if(Main.destinationPoint.x <= this._bitmap.get_width() && Main.destinationPoint.y < this._bitmap.get_height()) {
			var distance = Main.destinationPoint.subtract(Main.lastPoint).get_length();
			var shotNumber = distance / spacing;
			var xStep = (Main.destinationPoint.x - Main.lastPoint.x) / shotNumber;
			var yStep = (Main.destinationPoint.y - Main.lastPoint.y) / shotNumber;
			var _g1 = 0, _g = shotNumber + 1 | 0;
			while(_g1 < _g) {
				var i = _g1++;
				Main.currentPoint.x = Main.lastPoint.x + i * xStep;
				Main.currentPoint.y = Main.lastPoint.y + i * yStep;
				this._bitmap.bitmapData.copyPixels(this.brush.bitmapData,this.brush.getBounds(this.brush),Main.currentPoint,null,null,true);
			}
			Main.lastPoint.x = Main.destinationPoint.x;
			Main.lastPoint.y = Main.destinationPoint.y;
		}
	}
	,stopDraw: function() {
		this.removeEventListener("mousemove",$bind(this,this.drawingHandler));
	}
	,startDraw: function() {
		Main.lastPoint.x = this._bitmap.get_mouseX() - this.brush.get_width() / 2;
		Main.lastPoint.y = this._bitmap.get_mouseY() - this.brush.get_height() / 2;
		this._bitmap.bitmapData.copyPixels(this.brush.bitmapData,this.brush.getBounds(this.brush),Main.lastPoint,null,null,true);
		this.addEventListener("mousemove",$bind(this,this.drawingHandler));
	}
	,mouseUpHandler: function(event) {
		this.stopDraw();
	}
	,mouseDownHandler: function(event) {
		this.startDraw();
		this.addEventListener("mouseup",$bind(this,this.mouseUpHandler));
	}
	,added: function(e) {
		this.removeEventListener("addedToStage",$bind(this,this.added));
		this.get_stage().addEventListener("resize",$bind(this,this.resize));
		this.init();
	}
	,init: function() {
		if(this.inited) return;
		this.inited = true;
		Main.currentPoint = new flash.geom.Point();
		Main.lastPoint = new flash.geom.Point();
		Main.destinationPoint = new flash.geom.Point();
		this._bitmap = new flash.display.Bitmap(new flash.display.BitmapData(640,480,false,16777215));
		this.addChild(this._bitmap);
		this.brush = new flash.display.Bitmap(new flash.display.BitmapData(4,4,false,0));
		this.addEventListener("mousedown",$bind(this,this.mouseDownHandler));
		flash.Lib.get_current().get_stage().addEventListener("keydown",$bind(this,this.keyDownHandler));
	}
	,resize: function(e) {
		if(!this.inited) this.init();
	}
	,__class__: Main
});
var DocumentClass = function() {
	Main.call(this);
};
$hxClasses["DocumentClass"] = DocumentClass;
DocumentClass.__name__ = ["DocumentClass"];
DocumentClass.__super__ = Main;
DocumentClass.prototype = $extend(Main.prototype,{
	get_stage: function() {
		return flash.Lib.get_current().get_stage();
	}
	,__class__: DocumentClass
});
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
var NMEPreloader = function() {
	flash.display.Sprite.call(this);
	var backgroundColor = this.getBackgroundColor();
	var r = backgroundColor >> 16 & 255;
	var g = backgroundColor >> 8 & 255;
	var b = backgroundColor & 255;
	var perceivedLuminosity = 0.299 * r + 0.587 * g + 0.114 * b;
	var color = 0;
	if(perceivedLuminosity < 70) color = 16777215;
	var x = 30;
	var height = 9;
	var y = this.getHeight() / 2 - height / 2;
	var width = this.getWidth() - x * 2;
	var padding = 3;
	this.outline = new flash.display.Sprite();
	this.outline.get_graphics().lineStyle(1,color,0.15,true);
	this.outline.get_graphics().drawRoundRect(0,0,width,height,padding * 2,padding * 2);
	this.outline.set_x(x);
	this.outline.set_y(y);
	this.addChild(this.outline);
	this.progress = new flash.display.Sprite();
	this.progress.get_graphics().beginFill(color,0.35);
	this.progress.get_graphics().drawRect(0,0,width - padding * 2,height - padding * 2);
	this.progress.set_x(x + padding);
	this.progress.set_y(y + padding);
	this.progress.set_scaleX(0);
	this.addChild(this.progress);
};
$hxClasses["NMEPreloader"] = NMEPreloader;
NMEPreloader.__name__ = ["NMEPreloader"];
NMEPreloader.__super__ = flash.display.Sprite;
NMEPreloader.prototype = $extend(flash.display.Sprite.prototype,{
	onUpdate: function(bytesLoaded,bytesTotal) {
		var percentLoaded = bytesLoaded / bytesTotal;
		if(percentLoaded > 1) percentLoaded == 1;
		this.progress.set_scaleX(percentLoaded);
	}
	,onLoaded: function() {
		this.dispatchEvent(new flash.events.Event("complete"));
	}
	,onInit: function() {
	}
	,getWidth: function() {
		var width = 640;
		if(width > 0) return width; else return flash.Lib.get_current().get_stage().get_stageWidth();
	}
	,getHeight: function() {
		var height = 480;
		if(height > 0) return height; else return flash.Lib.get_current().get_stage().get_stageHeight();
	}
	,getBackgroundColor: function() {
		return 3158064;
	}
	,__class__: NMEPreloader
});
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.deleteField = function(o,field) {
	if(!Reflect.hasField(o,field)) return false;
	delete(o[field]);
	return true;
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
flash.Lib = function() { }
$hxClasses["flash.Lib"] = flash.Lib;
flash.Lib.__name__ = ["flash","Lib"];
flash.Lib.getTimer = function() {
	return ~~(Date.now() - flash.Lib.qTimeStamp);
}
flash.Lib.getURL = function(url,target) {
	js.Browser.window.open(url.url,target);
}
flash.Lib.jsNode = function(o) {
	var r = js.Browser.document.createElement(o);
	r.style.position = "absolute";
	return r;
}
flash.Lib.jsDiv = function() {
	return flash.Lib.jsNode("div");
}
flash.Lib.jsCanvas = function() {
	return flash.Lib.jsNode("canvas");
}
flash.Lib.jsHelper = function() {
	if(flash.Lib.qHelper == null) {
		var o = flash.Lib.jsDiv();
		flash.Lib.get_stage().component.appendChild(o);
		o.style.visibility = "hidden";
		o.appendChild(flash.Lib.qHelper = flash.Lib.jsDiv());
	}
	return flash.Lib.qHelper;
}
flash.Lib.get_current = function() {
	if(flash.Lib.qCurrent == null) flash.Lib.get_stage().addChild(flash.Lib.qCurrent = new flash.display.MovieClip());
	return flash.Lib.qCurrent;
}
flash.Lib.get_stage = function() {
	if(flash.Lib.qStage == null) js.Browser.document.body.appendChild((flash.Lib.qStage = new flash.display.Stage()).component);
	return flash.Lib.qStage;
}
flash.Lib.requestAnimationFrame = function(handler) {
	window.reqAnimFrame(handler);
}
flash.Lib.schedule = function(m) {
	flash.Lib.schList[flash.Lib.schLength++] = m;
}
flash.Lib.rgba = function(color) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + ((color >> 24 & 255) / 255).toFixed(4) + ")";
}
flash.Lib.rgbf = function(color,alpha) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + alpha.toFixed(4) + ")";
}
flash.display.Bitmap = function(bitmapData,pixelSnapping,smoothing) {
	if(smoothing == null) smoothing = false;
	this.smoothing = false;
	flash.display.DisplayObject.call(this);
	this.set_bitmapData(bitmapData);
};
$hxClasses["flash.display.Bitmap"] = flash.display.Bitmap;
flash.display.Bitmap.__name__ = ["flash","display","Bitmap"];
flash.display.Bitmap.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Bitmap.__super__ = flash.display.DisplayObject;
flash.display.Bitmap.prototype = $extend(flash.display.DisplayObject.prototype,{
	drawToSurface: function(cnv,ctx,matrix,ctr,blendMode,clipRect,smoothing) {
		this.bitmapData.drawToSurface(cnv,ctx,matrix,ctr,blendMode,clipRect,smoothing);
	}
	,get_height: function() {
		return this.qHeight != null?this.qHeight:this.bitmapData != null?this.bitmapData.component.height:0;
	}
	,get_width: function() {
		return this.qWidth != null?this.qWidth:this.bitmapData != null?this.bitmapData.component.width:0;
	}
	,set_smoothing: function(v) {
		var o = this.bitmapData.qContext;
		o.imageSmoothingEnabled = o.oImageSmoothingEnabled = o.msImageSmoothingEnabled = o.webkitImageSmoothingEnabled = o.mozImageSmoothingEnabled = v;
		return v;
	}
	,set_bitmapData: function(v) {
		if(this.bitmapData != null) this.component.removeChild(this.bitmapData.component);
		if(v != null) this.component.appendChild(v.handle());
		return this.bitmapData = v;
	}
	,__class__: flash.display.Bitmap
});
flash.display.ImageDataLease = function() {
};
$hxClasses["flash.display.ImageDataLease"] = flash.display.ImageDataLease;
flash.display.ImageDataLease.__name__ = ["flash","display","ImageDataLease"];
flash.display.ImageDataLease.prototype = {
	clone: function() {
		var leaseClone = new flash.display.ImageDataLease();
		leaseClone.seed = this.seed;
		leaseClone.time = this.time;
		return leaseClone;
	}
	,set: function(s,t) {
		this.seed = s;
		this.time = t;
	}
	,__class__: flash.display.ImageDataLease
}
flash.display.BitmapData = function(inWidth,inHeight,inTransparent,inFillColor) {
	if(inTransparent == null) inTransparent = true;
	this.qSync = 1;
	this.qTransparent = inTransparent;
	this.qTick = 0;
	this.qTime = new Date().getTime();
	this.rect = new flash.geom.Rectangle(0,0,inWidth,inHeight);
	this.component = flash.Lib.jsCanvas();
	this.component.width = inWidth;
	this.component.height = inHeight;
	this.qContext = this.component.getContext("2d");
	flash.display.BitmapData.setSmoothing(this.qContext,true);
	this.qPixel = this.qContext.createImageData(1,1);
	if(inFillColor == null) inFillColor = -1;
	if(!inTransparent) inFillColor |= -16777216;
	if((inFillColor & -16777216) != 0) this.fillRect(this.rect,inFillColor);
};
$hxClasses["flash.display.BitmapData"] = flash.display.BitmapData;
flash.display.BitmapData.__name__ = ["flash","display","BitmapData"];
flash.display.BitmapData.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.BitmapData.setSmoothing = function(o,v) {
	o.imageSmoothingEnabled = o.oImageSmoothingEnabled = o.msImageSmoothingEnabled = o.webkitImageSmoothingEnabled = o.mozImageSmoothingEnabled = v;
}
flash.display.BitmapData.makeColor = function(color) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + ((color >> 24 & 255) / 255).toFixed(4) + ")";
}
flash.display.BitmapData.loadFromBytes = function(bytes,inRawAlpha,onload) {
	var bitmapData = new flash.display.BitmapData(0,0);
	bitmapData.nmeLoadFromBytes(bytes,inRawAlpha,onload);
	return bitmapData;
}
flash.display.BitmapData.nmeBase64Encode = function(bytes) {
	var blob = "";
	var codex = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	bytes.position = 0;
	while(bytes.position < bytes.length) {
		var by1 = 0, by2 = 0, by3 = 0;
		by1 = bytes.data.getUint8(bytes.position++);
		if(bytes.position < bytes.length) by2 = bytes.data.getUint8(bytes.position++);
		if(bytes.position < bytes.length) by3 = bytes.data.getUint8(bytes.position++);
		var by4 = 0, by5 = 0, by6 = 0, by7 = 0;
		by4 = by1 >> 2;
		by5 = (by1 & 3) << 4 | by2 >> 4;
		by6 = (by2 & 15) << 2 | by3 >> 6;
		by7 = by3 & 63;
		blob += codex.charAt(by4);
		blob += codex.charAt(by5);
		if(bytes.position < bytes.length) blob += codex.charAt(by6); else blob += "=";
		if(bytes.position < bytes.length) blob += codex.charAt(by7); else blob += "=";
	}
	return blob;
}
flash.display.BitmapData.nmeIsPNG = function(bytes) {
	bytes.position = 0;
	return bytes.data.getUint8(bytes.position++) == 137 && bytes.data.getUint8(bytes.position++) == 80 && bytes.data.getUint8(bytes.position++) == 78 && bytes.data.getUint8(bytes.position++) == 71 && bytes.data.getUint8(bytes.position++) == 13 && bytes.data.getUint8(bytes.position++) == 10 && bytes.data.getUint8(bytes.position++) == 26 && bytes.data.getUint8(bytes.position++) == 10;
}
flash.display.BitmapData.nmeIsJPG = function(bytes) {
	bytes.position = 0;
	return bytes.data.getUint8(bytes.position++) == 255 && bytes.data.getUint8(bytes.position++) == 216;
}
flash.display.BitmapData.prototype = {
	nmeLoadFromBytes: function(bytes,inRawAlpha,onload) {
		var _g = this;
		var type = "";
		if(flash.display.BitmapData.nmeIsPNG(bytes)) type = "image/png"; else if(flash.display.BitmapData.nmeIsJPG(bytes)) type = "image/jpeg"; else throw new flash.errors.IOError("BitmapData tried to read a PNG/JPG ByteArray, but found an invalid header.");
		var img = js.Browser.document.createElement("img");
		var canvas = this.component;
		var drawImage = function(_) {
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			if(inRawAlpha != null) {
				var pixels = ctx.getImageData(0,0,img.width,img.height);
				var _g1 = 0, _g2 = inRawAlpha.length;
				while(_g1 < _g2) {
					var i = _g1++;
					pixels.data[i * 4 + 3] = inRawAlpha.data.getUint8(inRawAlpha.position++);
				}
				ctx.putImageData(pixels,0,0);
			}
			_g.rect = new flash.geom.Rectangle(0,0,canvas.width,canvas.height);
			if(onload != null) onload(_g);
		};
		img.addEventListener("load",drawImage,false);
		img.src = "data:" + type + ";base64," + flash.display.BitmapData.nmeBase64Encode(bytes);
	}
	,syncData: function() {
		if(!((this.qSync & 3) != 1)) {
			this.qImageData = this.qContext.getImageData(0,0,this.component.width,this.component.height);
			this.qSync = this.qSync & -4;
		}
	}
	,syncCanvas: function() {
		if(!((this.qSync & 3) != 2)) {
			this.qContext.putImageData(this.qImageData,0,0);
			this.qSync = this.qSync & -4;
		}
	}
	,nmeLoadFromFile: function(inFilename,inLoader) {
		var _g = this;
		var image = js.Browser.document.createElement("img");
		if(inLoader != null) {
			var data = { image : image, texture : this.component, inLoader : inLoader, bitmapData : this};
			image.addEventListener("load",(function(f,a1) {
				return function(e) {
					return f(a1,e);
				};
			})($bind(this,this.jeashOnLoad),data),false);
			image.addEventListener("error",function(e) {
				if(!image.complete) _g.jeashOnLoad(data,e);
			},false);
		}
		image.src = inFilename;
	}
	,jeashOnLoad: function(data,e) {
		var canvas = data.texture;
		var width = data.image.width;
		var height = data.image.height;
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(data.image,0,0,width,height);
		data.bitmapData.width = width;
		data.bitmapData.height = height;
		data.bitmapData.rect = new flash.geom.Rectangle(0,0,width,height);
		if(data.inLoader != null) {
			var e1 = new flash.events.Event("complete");
			e1.set_target(data.inLoader);
			data.inLoader.dispatchEvent(e1);
		}
	}
	,applyFilter: function(sourceBitmapData,sourceRect,destPoint,filter) {
	}
	,copyChannel: function(o,q,p,sourceChannel,destChannel) {
		var x = ~~o.x, px = ~~p.x, y = ~~o.y, py = ~~p.y, w = ~~q.width, h = ~~q.height, sw = o.component.width, sh = o.component.height, tw = this.component.width, th = this.component.height, i, j, u, v, c, sc = sourceChannel, dc = destChannel;
		if(px < 0) {
			w += px;
			px = 0;
		}
		if(py < 0) {
			h += py;
			py = 0;
		}
		if(x < 0) {
			w += x;
			x = 0;
		}
		if(y < 0) {
			h += y;
			y = 0;
		}
		if(x + w > sw) w = sw - x;
		if(y + h > sh) h = sh - y;
		if(px + w > tw) w = tw - px;
		if(py + h > th) h = th - py;
		if(w <= 0 || h <= 0) return;
		if(sc == 8 && dc == 8) {
			var f = this.qContext.globalCompositeOperation, s = this.qContext.fillStyle;
			this.qContext.globalCompositeOperation = "darker";
			i = 0;
			while(i++ < 8) this.qContext.drawImage(this.component,px,py,w,h,px,py,w,h);
			this.qContext.globalCompositeOperation = "destination-over";
			this.qContext.fillStyle = "black";
			this.qContext.fillRect(x,y,w,h);
			this.qContext.globalCompositeOperation = "destination-atop";
			this.qContext.drawImage(o.handle(),x,y,w,h,px,py,w,h);
			this.qContext.globalCompositeOperation = f;
			this.qContext.fillStyle = s;
		} else {
			var wasCanvas = (this.qSync & 3) != 2, ds, dd;
			this.lock();
			dd = this.qImageData.data;
			o.lock();
			ds = o.qImageData.data;
			sc = sc == 8?3:sc == 4?2:sc == 2?1:sc == 1?0:-1;
			dc = dc == 8?3:dc == 4?2:dc == 2?1:dc == 1?0:-1;
			if(sc < 0 || dc < 0) return;
			j = py + h;
			v = y + h;
			while(--v >= y) {
				--j;
				c = w;
				i = (px + tw * j) * 4 + dc;
				u = (x + sw * v) * 4 + sc;
				while(c-- > 0) {
					dd[u] = ds[i];
					i += 4;
					u += 4;
				}
			}
			this.qSync |= 6;
			if(wasCanvas) this.unlock();
		}
	}
	,colorTransform: function(q,o) {
		var x = ~~q.x, y = ~~q.y, w = ~~q.width, h = ~~q.height, tw = this.component.width, th = this.component.height, f = this.qContext.globalCompositeOperation, a = this.qContext.globalAlpha;
		if(x < 0) {
			w += x;
			x = 0;
		}
		if(y < 0) {
			h += y;
			y = 0;
		}
		if(x + w > tw) w = tw - x;
		if(y + h > th) h = th - y;
		if(w <= 0 || h <= 0) return;
		if(o.isAlphaMultiplier()) {
			this.syncCanvas();
			this.qContext.globalCompositeOperation = "copy";
			this.qContext.globalAlpha *= o.alphaMultiplier;
			this.qContext.drawImage(this.component,x,y,w,h,x,y,w,h);
			this.qSync |= 5;
		} else if(o.isColorSetter()) {
			var s = this.qContext.fillStyle;
			if(o.alphaMultiplier != 0) {
				this.qContext.globalCompositeOperation = "source-in";
				this.qContext.fillStyle = "rgb(" + ~~o.redOffset + "," + ~~o.greenOffset + "," + ~~o.blueOffset + ")";
				this.qContext.fillRect(x,y,w,h);
				this.qContext.globalCompositeOperation = "copy";
				this.qContext.globalAlpha = o.alphaMultiplier;
				this.qContext.drawImage(this.component,x,y,w,h,x,y,w,h);
			} else {
				this.qContext.globalCompositeOperation = "copy";
				this.qContext.fillStyle = "rgba(" + ~~o.redOffset + "," + ~~o.greenOffset + "," + ~~o.blueOffset + "," + ~~o.alphaOffset + ")";
				this.qContext.fillRect(x,y,w,h);
			}
			this.qContext.fillStyle = s;
		} else {
			var wasCanvas = (this.qSync & 3) != 2;
			this.lock();
			var d = this.qImageData.data, c = tw * th * 4, i = c, v, rm = o.redMultiplier, gm = o.greenMultiplier, bm = o.blueMultiplier, am = o.alphaMultiplier, ro = o.redOffset, go = o.greenOffset, bo = o.blueOffset, ao = o.alphaOffset;
			if(x == 0 && y == 0 && w == tw && h == th) while((i -= 4) >= 0) {
				if((v = d[i + 3]) > 0) d[i + 3] = (v = v * am + ao) < 0?0:v > 255?255:~~v;
				d[i + 2] = (v = d[i + 2] * bm + bo) < 0?0:v > 255?255:~~v;
				d[i + 1] = (v = d[i + 1] * gm + go) < 0?0:v > 255?255:~~v;
				d[i] = (v = d[i] * rm + ro) < 0?0:v > 255?255:~~v;
			} else {
				var px, py = y - 1, pb = y + h, pr;
				while(++py < pb) {
					i = tw * py + x - 1 << 2;
					pr = i + w * 4;
					while((i += 4) < pr) {
						if((v = d[i + 3]) > 0) d[i + 3] = (v = v * am + ao) < 0?0:v > 255?255:~~v;
						d[i + 2] = (v = d[i + 2] * bm + bo) < 0?0:v > 255?255:~~v;
						d[i + 1] = (v = d[i + 1] * gm + go) < 0?0:v > 255?255:~~v;
						d[i] = (v = d[i] * rm + ro) < 0?0:v > 255?255:~~v;
					}
				}
			}
			this.qSync |= 6;
			if(wasCanvas) this.unlock();
		}
		this.qContext.globalCompositeOperation = f;
		this.qContext.globalAlpha = a;
	}
	,floodFill: function(fx,fy,fc) {
		var wasCanvas = (this.qSync & 3) == 1;
		this.lock();
		var q = [fx | fy << 16], c = 1, d = this.qImageData.data, zr, zg, zb, za, fr, fg, fb, fa, x, y, p, o = [], r, w = this.component.width, h = this.component.height;
		p = fy * this.component.width + fx << 4;
		zr = d[p];
		zg = d[p + 1];
		zb = d[p + 2];
		za = d[p + 3];
		fa = fc >>> 24;
		fr = fc >> 16 & 255;
		fg = fc >> 8 & 255;
		fb = fc & 255;
		y = -1;
		while(++y < h) {
			o.push(r = []);
			x = 0;
			while(x < w) {
				r.push(0);
				x += 32;
			}
		}
		while(c > 0) {
			p = q[--c];
			x = p & 65535;
			y = p >>> 16;
			if(x < 0 || y < 0 || x >= w || y >= h) continue;
			if((o[y][x >> 5] >> (x & 31) & 1) != 0) continue;
			o[y][x >> 5] |= 1 << (x & 31);
			p = y * this.component.width + x << 2;
			if(d[p] == zr && d[p + 1] == zg && d[p + 2] == zb && d[p + 3] == za) {
				d[p] = fr;
				d[p + 1] = fg;
				d[p + 2] = fb;
				d[p + 3] = fa;
				if((p = x + 1) < w && (o[y][p >> 5] >> (p & 31) & 1) == 0) q[c++] = y << 16 | p;
				if(x > 0 && (o[y][(p = x - 1) >> 5] >> (p & 31) & 1) == 0) q[c++] = y << 16 | p;
				if((p = y + 1) < h && (o[p][x >> 5] >> (x & 31) & 1) == 0) q[c++] = p << 16 | x;
				if(y > 0 && (o[p = y - 1][x >> 5] >> (x & 31) & 1) == 0) q[c++] = p << 16 | x;
			}
		}
		this.qSync |= 6;
		if(wasCanvas) this.unlock();
	}
	,getColorBoundsRect: function(mask,color,findColor) {
		if(findColor == null) findColor = true;
		this.syncData();
		var data = this.qImageData.data;
		var minX = this.component.width, minY = this.component.height, maxX = 0, maxY = 0, len = data.length, i, px, x, y;
		i = 0;
		while(i < len) {
			px = (this.qTransparent?data[i + 3] << 24:-16777216) | (data[i] & 255) << 16 | (data[i + 1] & 255) << 8 | data[i + 2] & 255;
			if(px == color == findColor) {
				x = Math.floor((i >> 2) % this.component.width);
				y = Math.floor((i >> 2) / this.component.width);
				if(x < minX) minX = x;
				if(x > maxX) maxX = x;
				if(y < minY) minY = y;
				if(y > maxY) maxY = y;
			}
			i += 4;
		}
		if(minX <= maxX && minY <= maxY) return new flash.geom.Rectangle(minX,minY,maxX - minX + 1,maxY - minY + 1);
		if(!findColor) return new flash.geom.Rectangle(0,0,this.component.width,this.component.height);
		return new flash.geom.Rectangle(0,0,0,0);
	}
	,setPixel32: function(x,y,color) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return;
		if((this.qSync & 3) != 2) {
			this.qPixel.data[0] = color >>> 16 & 255;
			this.qPixel.data[1] = color >>> 8 & 255;
			this.qPixel.data[2] = color & 255;
			this.qPixel.data[3] = color >>> 24 & 255;
			this.qContext.putImageData(this.qPixel,x,y);
			this.qSync |= 5;
		} else {
			var o = y * this.component.width + x << 2;
			this.qImageData.data[o] = color >>> 16 & 255;
			this.qImageData.data[o + 1] = color >>> 8 & 255;
			this.qImageData.data[o + 2] = color & 255;
			this.qImageData.data[o + 3] = color >>> 24 & 255;
			this.qSync |= 6;
		}
	}
	,setPixel: function(x,y,color) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return;
		if((this.qSync & 3) != 2) {
			this.qPixel.data[0] = color >>> 16 & 255;
			this.qPixel.data[1] = color >>> 8 & 255;
			this.qPixel.data[2] = color & 255;
			this.qPixel.data[3] = 255;
			this.qContext.putImageData(this.qPixel,x,y);
			this.qSync |= 5;
		} else {
			var o = y * this.component.width + x << 2;
			this.qImageData.data[o] = color >>> 16 & 255;
			this.qImageData.data[o + 1] = color >>> 8 & 255;
			this.qImageData.data[o + 2] = color & 255;
			this.qImageData.data[o + 3] = 255;
			this.qSync |= 6;
		}
	}
	,getPixel32: function(x,y) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return 0;
		if((this.qSync & 3) == 1) {
			var d = this.qContext.getImageData(x,y,1,1).data;
			return (this.qTransparent?d[3] << 24:-16777216) | d[0] << 16 | d[1] << 8 | d[2];
		} else {
			var o = y * this.component.width + x << 2;
			return (this.qTransparent?this.qImageData.data[o + 3] << 24:-16777216) | this.qImageData.data[o] << 16 | this.qImageData.data[o + 1] << 8 | this.qImageData.data[o + 2];
		}
	}
	,getPixel: function(x,y) {
		if(x < 0 || y < 0 || x >= this.component.width || y >= this.component.height) return 0;
		if((this.qSync & 3) == 1) {
			var d = this.qContext.getImageData(x,y,1,1).data;
			return d[0] << 16 | d[1] << 8 | d[2];
		} else {
			var o = y * this.component.width + x << 2;
			return this.qImageData.data[o] << 16 | this.qImageData.data[o + 1] << 8 | this.qImageData.data[o + 2];
		}
	}
	,unlock: function() {
		this.syncCanvas();
	}
	,lock: function() {
		this.syncData();
	}
	,draw: function(source,matrix,colorTransform,blendMode,clipRect,smoothing) {
		this.syncCanvas();
		var a = 0, f = 0;
		if(colorTransform != null) {
			a = colorTransform.alphaMultiplier;
			colorTransform.alphaMultiplier = 1;
			f = this.qContext.globalAlpha;
			this.qContext.globalAlpha *= a;
		}
		if(smoothing != null) flash.display.BitmapData.setSmoothing(this.qContext,smoothing);
		source.drawToSurface(this.handle(),this.qContext,matrix,colorTransform,blendMode,clipRect,null);
		if(colorTransform != null) {
			colorTransform.alphaMultiplier = a;
			this.qContext.globalAlpha = f;
		}
		this.qSync |= 5;
	}
	,copyPixels: function(sourceBitmapData,sourceRect,destPoint,alphaBitmapData,alphaPoint,mergeAlpha) {
		if(mergeAlpha == null) mergeAlpha = false;
		this.syncCanvas();
		if(alphaBitmapData != null) throw "alphaBitmapData is not supported yet.";
		var bit = sourceBitmapData.handle(), bw, bh, tw = this.component.width, th = this.component.height;
		if(bit == null || (bw = bit.width) <= 0 || (bh = bit.height) <= 0) return;
		var dx = ~~destPoint.x, dy = ~~destPoint.y, sx, sy, sw, sh;
		if(sourceRect != null) {
			sx = sourceRect.x;
			sy = sourceRect.y;
			sw = sourceRect.width;
			sh = sourceRect.height;
			if(sx < 0) {
				sw += sx;
				sx = 0;
			}
			if(sy < 0) {
				sh += sy;
				sy = 0;
			}
			if(sx + sw > bw) sw = bw - sx;
			if(sy + sh > bh) sh = bh - sy;
		} else {
			sx = sy = 0;
			sw = bw;
			sh = bh;
		}
		if(dx < 0) {
			sw += dx;
			sx -= dx;
			dx = 0;
		}
		if(dy < 0) {
			sh += dy;
			sy -= dy;
			dy = 0;
		}
		if(dx + sw > tw) sw = tw - dx;
		if(dy + sh > th) sh = th - dy;
		if(sw <= 0 || sh <= 0) return;
		if(this.qTransparent && !mergeAlpha) this.qContext.clearRect(dx,dy,sw,sh);
		this.qContext.drawImage(bit,sx,sy,sw,sh,dx,dy,sw,sh);
		this.qSync |= 5;
	}
	,drawToSurface: function(cnv,ctx,matrix,ctr,blendMode,clipRect,smoothing) {
		ctx.save();
		if(smoothing != null && ctx.imageSmoothingEnabled != smoothing) flash.display.BitmapData.setSmoothing(ctx,smoothing);
		if(matrix != null) {
			if(matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1) ctx.translate(matrix.tx,matrix.ty); else ctx.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
		}
		ctx.drawImage(this.handle(),0,0);
		ctx.restore();
	}
	,getTick: function() {
		return this.qTick;
	}
	,getTime: function() {
		return this.qTime;
	}
	,handle: function() {
		this.syncCanvas();
		if((this.qSync & 4) != 0) {
			this.qTick++;
			this.qTime = new Date().getTime();
			this.qSync &= -5;
		}
		return this.component;
	}
	,dispose: function() {
		this.component.width = this.component.height = 1;
		this.qImageData = null;
		this.qSync = 5;
	}
	,clone: function() {
		this.syncCanvas();
		var r = new flash.display.BitmapData(this.component.width,this.component.height,this.qTransparent,0);
		r.qContext.drawImage(this.component,0,0);
		r.qSync |= 5;
		return r;
	}
	,fillRect: function(area,color) {
		if(area == null || area.width <= 0 || area.height <= 0) return;
		if(area.equals(this.rect) && this.qTransparent && (color & -16777216) == 0) {
			this.component.width = this.component.width;
			return;
		}
		if(!this.qTransparent) color |= -16777216; else if((color & -16777216) != -16777216) this.qContext.clearRect(area.x,area.y,area.width,area.height);
		if((color & -16777216) != 0) {
			this.qContext.fillStyle = flash.display.BitmapData.makeColor(color);
			this.qContext.fillRect(area.x,area.y,area.width,area.height);
		}
		this.qSync |= 5;
	}
	,__class__: flash.display.BitmapData
}
flash.display.BitmapDataChannel = function() { }
$hxClasses["flash.display.BitmapDataChannel"] = flash.display.BitmapDataChannel;
flash.display.BitmapDataChannel.__name__ = ["flash","display","BitmapDataChannel"];
flash.display.BlendMode = $hxClasses["flash.display.BlendMode"] = { __ename__ : true, __constructs__ : ["ADD","ALPHA","DARKEN","DIFFERENCE","ERASE","HARDLIGHT","INVERT","LAYER","LIGHTEN","MULTIPLY","NORMAL","OVERLAY","SCREEN","SUBTRACT"] }
flash.display.BlendMode.ADD = ["ADD",0];
flash.display.BlendMode.ADD.toString = $estr;
flash.display.BlendMode.ADD.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.ALPHA = ["ALPHA",1];
flash.display.BlendMode.ALPHA.toString = $estr;
flash.display.BlendMode.ALPHA.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.DARKEN = ["DARKEN",2];
flash.display.BlendMode.DARKEN.toString = $estr;
flash.display.BlendMode.DARKEN.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.DIFFERENCE = ["DIFFERENCE",3];
flash.display.BlendMode.DIFFERENCE.toString = $estr;
flash.display.BlendMode.DIFFERENCE.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.ERASE = ["ERASE",4];
flash.display.BlendMode.ERASE.toString = $estr;
flash.display.BlendMode.ERASE.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.HARDLIGHT = ["HARDLIGHT",5];
flash.display.BlendMode.HARDLIGHT.toString = $estr;
flash.display.BlendMode.HARDLIGHT.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.INVERT = ["INVERT",6];
flash.display.BlendMode.INVERT.toString = $estr;
flash.display.BlendMode.INVERT.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.LAYER = ["LAYER",7];
flash.display.BlendMode.LAYER.toString = $estr;
flash.display.BlendMode.LAYER.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.LIGHTEN = ["LIGHTEN",8];
flash.display.BlendMode.LIGHTEN.toString = $estr;
flash.display.BlendMode.LIGHTEN.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.MULTIPLY = ["MULTIPLY",9];
flash.display.BlendMode.MULTIPLY.toString = $estr;
flash.display.BlendMode.MULTIPLY.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.NORMAL = ["NORMAL",10];
flash.display.BlendMode.NORMAL.toString = $estr;
flash.display.BlendMode.NORMAL.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.OVERLAY = ["OVERLAY",11];
flash.display.BlendMode.OVERLAY.toString = $estr;
flash.display.BlendMode.OVERLAY.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.SCREEN = ["SCREEN",12];
flash.display.BlendMode.SCREEN.toString = $estr;
flash.display.BlendMode.SCREEN.__enum__ = flash.display.BlendMode;
flash.display.BlendMode.SUBTRACT = ["SUBTRACT",13];
flash.display.BlendMode.SUBTRACT.toString = $estr;
flash.display.BlendMode.SUBTRACT.__enum__ = flash.display.BlendMode;
flash.display.Graphics = function() {
	this.rgPending = false;
	this.synced = true;
	this.component = flash.Lib.jsCanvas();
	this.context = this.component.getContext("2d");
	this.context.save();
	this.bounds = new flash.geom.Rectangle();
	this.resetBounds();
	this.rec = [];
	this.len = 0;
};
$hxClasses["flash.display.Graphics"] = flash.display.Graphics;
flash.display.Graphics.__name__ = ["flash","display","Graphics"];
flash.display.Graphics.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Graphics.prototype = {
	render: function(cnv,ctx) {
		var f = 0, p = -1, v, m = this._drawMatrix, n = 0, tex = null;
		if(m == null) this._drawMatrix = m = new flash.geom.Matrix();
		try {
			while(++p < this.len) {
				var _g = v = this.rec[p];
				switch(_g) {
				case 0:
					throw "__break__";
					break;
				case 1:
					if(n > 0) f = this._closePath(cnv,ctx,f,m,tex);
					ctx.lineWidth = v = this.rec[++p];
					if(v > 0) {
						f |= 2;
						ctx.strokeStyle = this.rec[++p];
					} else {
						f &= -3;
						ctx.strokeStyle = null;
					}
					break;
				case 2:case 3:
					if(n > 0) f = this._closePath(cnv,ctx,f,m,tex);
					f |= 1;
					if(v == 3) {
						tex = this.rec[++p].handle();
						var r = this.rec[++p];
						if(this.rec[++p]) {
							if(r) f |= 8; else f &= -9;
							m.a = this.rec[++p];
							m.b = this.rec[++p];
							m.c = this.rec[++p];
							m.d = this.rec[++p];
							m.tx = this.rec[++p];
							m.ty = this.rec[++p];
							f |= 4;
						} else {
							ctx.fillStyle = ctx.createPattern(tex,r?"repeat":"no-repeat");
							f &= -5;
						}
					} else {
						ctx.fillStyle = this.rec[++p];
						f &= -5;
					}
					n = 0;
					break;
				case 9:
					if(n > 0) {
						f = this._closePath(cnv,ctx,f,m,tex);
						n = 0;
					}
					break;
				case 10:
					ctx.moveTo(this.rec[++p],this.rec[++p]);
					n++;
					break;
				case 11:
					ctx.lineTo(this.rec[++p],this.rec[++p]);
					n++;
					break;
				case 12:
					ctx.quadraticCurveTo(this.rec[++p],this.rec[++p],this.rec[++p],this.rec[++p]);
					n++;
					break;
				case 13:
					var x = this.rec[++p], y = this.rec[++p], w = this.rec[++p], h = this.rec[++p];
					ctx.rect(x,y,w,h);
					n++;
					break;
				case 14:
					ctx.arc(this.rec[++p],this.rec[++p],this.rec[++p],0,Math.PI * 2,true);
					n++;
					break;
				case 15:
					var x = this.rec[++p], y = this.rec[++p], w = this.rec[++p], h = this.rec[++p], u = this.rec[++p], q = this.rec[++p];
					if(q == null || $bind(ctx,ctx.quadraticCurveTo) == null) {
						ctx.moveTo(x + u,y + h);
						ctx.arcTo(x + w - u,y + h - u,x + w,y + h - u,u);
						ctx.arcTo(x + w,y + u,x + w - u,y,u);
						ctx.arcTo(x + u,y,x,y + u,u);
						ctx.arcTo(x + u,y + h - u,x + u,y + h,u);
					} else {
						ctx.moveTo(x + u,y + h);
						ctx.lineTo(x + w - u,y + h);
						ctx.quadraticCurveTo(x + w,y + h,x + w,y + h - q);
						ctx.lineTo(x + w,y + q);
						ctx.quadraticCurveTo(x + w,y,x + w - u,y);
						ctx.lineTo(x + u,y);
						ctx.quadraticCurveTo(x,y,x,y + q);
						ctx.lineTo(x,y + h - q);
						ctx.quadraticCurveTo(x,y + h,x + u,y + h);
					}
					n++;
					break;
				case 16:
					var tex1 = this.rec[++p], d = tex1.handle(), fx = this.rec[++p], fs = (fx & 1) != 0, fr = (fx & 2) != 0, fc = (fx & 4) != 0, fa = (fx & 8) != 0, fm = (fx & 16) != 0, c = this.rec[++p] - 1, tx, ty, ox, oy, rx, ry, rw, rh;
					ctx.save();
					ctx.globalCompositeOperation = (fx & 65536) != 0?"lighter":"source-over";
					while(p < c) {
						tx = this.rec[++p];
						ty = this.rec[++p];
						ox = this.rec[++p];
						oy = this.rec[++p];
						rx = this.rec[++p];
						ry = this.rec[++p];
						rw = this.rec[++p];
						rh = this.rec[++p];
						ctx.save();
						if(fm) ctx.transform(this.rec[++p],this.rec[++p],this.rec[++p],this.rec[++p],tx,ty); else {
							ctx.translate(tx,ty);
							if(fs) ctx.scale(v = this.rec[++p],v);
							if(fr) ctx.rotate(this.rec[++p]);
						}
						if(fc) p += 3;
						if(fa) ctx.globalAlpha = this.rec[++p];
						ctx.drawImage(d,rx,ry,rw,rh,-ox,-oy,rw,rh);
						ctx.restore();
					}
					ctx.restore();
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(n > 0) f = this._closePath(cnv,ctx,f,m,tex);
	}
	,_closePath: function(cnv,ctx,f,m,texture) {
		ctx.closePath();
		if(f & 1) {
			if(f & 4) {
				ctx.save();
				ctx.transform(m.a,m.b,m.c,m.d,m.tx,m.ty);
				ctx.fillStyle = ctx.createPattern(texture,f & 8?"repeat":"no-repeat");
				ctx.fill();
				ctx.restore();
			} else ctx.fill();
		}
		if(f & 2) ctx.stroke();
		ctx.beginPath();
		return f;
	}
	,drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		ctx.save();
		if(mtx != null) ctx.transform(mtx.a,mtx.b,mtx.c,mtx.d,mtx.tx,mtx.ty);
		this.render(cnv,ctx);
		ctx.restore();
	}
	,rgba: function(c,a) {
		return "rgba(" + (c >> 16 & 255) + ", " + (c >> 8 & 255) + ", " + (c & 255) + ", " + a.toFixed(4) + ")";
	}
	,drawCircle: function(x,y,r) {
		this.rec[this.len++] = 14;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = r;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,drawRoundRect: function(x,y,w,h,r,q) {
		this.rec[this.len++] = 15;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = w;
		this.rec[this.len++] = h;
		this.rec[this.len++] = r;
		this.rec[this.len++] = q;
		this.grab(x,y,x + w,y + h);
	}
	,drawRect: function(x,y,w,h) {
		this.rec[this.len++] = 13;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		this.rec[this.len++] = w;
		this.rec[this.len++] = h;
		this.grab(x,y,x + w,y + h);
	}
	,curveTo: function(u,v,x,y) {
		this.rec[this.len++] = 12;
		this.rec[this.len++] = u;
		this.rec[this.len++] = v;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		var r = this.lineWidth;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,lineTo: function(x,y) {
		this.rec[this.len++] = 11;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		var r = this.lineWidth;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,moveTo: function(x,y) {
		this.rec[this.len++] = 10;
		this.rec[this.len++] = x;
		this.rec[this.len++] = y;
		var r = this.lineWidth;
		this.grab(x - r,y - r,x + r,y + r);
	}
	,endFill: function() {
		this.rec[this.len++] = 9;
		this.invalidate();
	}
	,beginBitmapFill: function(bitmap,m,repeat,smooth) {
		this.rec[this.len++] = 3;
		this.rec[this.len++] = bitmap;
		this.rec[this.len++] = repeat != null?repeat:true;
		if(this.rec[this.len++] = m != null) {
			this.rec[this.len++] = m.a;
			this.rec[this.len++] = m.b;
			this.rec[this.len++] = m.c;
			this.rec[this.len++] = m.d;
			this.rec[this.len++] = m.tx;
			this.rec[this.len++] = m.ty;
		}
	}
	,beginFill: function(c,a) {
		if(a == null) a = 1;
		if(c == null) c = 0;
		this.rec[this.len++] = 2;
		this.rec[this.len++] = flash.Lib.rgbf(c,a);
	}
	,lineStyle: function(w,c,a,nz,lsm) {
		if(a == null) a = 1;
		if(c == null) c = 0;
		this.rec[this.len++] = 1;
		this.rec[this.len++] = this.lineWidth = w != null && w > 0?w:0;
		if(w > 0) this.rec[this.len++] = flash.Lib.rgbf(c,a);
	}
	,clear: function() {
		var i = 0;
		while(i < this.len) this.rec[i++] = 0;
		this.len = 0;
		this.resetBounds();
		this.invalidate();
	}
	,invalidate: function() {
		if(this.synced) {
			this.synced = false;
			if(!this.rgPending && this.displayObject != null && this.displayObject.get_stage() != null) {
				flash.Lib.schedule($bind(this,this.regenerate));
				this.rgPending = true;
			}
		}
	}
	,grab: function(x,y,r,b) {
		var i;
		if(x < (i = this.bounds.x)) {
			i = i - x;
			this.bounds.x -= i;
			this.bounds.width += i;
		}
		if(y < (i = this.bounds.y)) {
			i = i - y;
			this.bounds.y -= i;
			this.bounds.height += i;
		}
		if(r > (i = this.bounds.get_right())) this.bounds.width += r - i;
		if(b > (i = this.bounds.get_bottom())) this.bounds.height += b - i;
		this.invalidate();
	}
	,resetBounds: function() {
		this.bounds.setVoid();
		this.invalidate();
	}
	,set_displayObject: function(v) {
		if(this.displayObject != v) {
			this.displayObject = v;
			if(!this.synced) flash.Lib.schedule($bind(this,this.regenerate));
		}
		return v;
	}
	,regenerate: function() {
		var o = this.component, s = this.component.style, q = this.context, b = this.bounds, bx = ~~(b.x - 2), by = ~~(b.y - 2), bw = Math.ceil(b.width + 4), bh = Math.ceil(b.height + 4);
		this.synced = true;
		this.rgPending = false;
		if(b.width <= 0 || b.height <= 0) {
			o.width = o.height = 1;
			s.top = s.left = "0";
			return;
		}
		if(this.compX != bx || this.compY != by) {
			s.left = bx + "px";
			s.top = by + "px";
		}
		if(bw != o.width || bh != o.height) {
			o.width = bw;
			o.height = bh;
		} else q.clearRect(0,0,o.width,o.height);
		q.save();
		q.translate(-bx,-by);
		this.render(o,q);
		q.restore();
	}
	,__class__: flash.display.Graphics
}
flash.display.Loader = function() {
	flash.display.Sprite.call(this);
	this.contentLoaderInfo = flash.display.LoaderInfo.create(this);
};
$hxClasses["flash.display.Loader"] = flash.display.Loader;
flash.display.Loader.__name__ = ["flash","display","Loader"];
flash.display.Loader.__super__ = flash.display.Sprite;
flash.display.Loader.prototype = $extend(flash.display.Sprite.prototype,{
	handleLoad: function(e) {
		e.set_currentTarget(this);
		this.contentLoaderInfo.removeEventListener("complete",$bind(this,this.handleLoad));
	}
	,loadBytes: function(buffer) {
		var _g = this;
		try {
			this.contentLoaderInfo.addEventListener("complete",$bind(this,this.handleLoad),false);
			flash.display.BitmapData.loadFromBytes(buffer,null,function(bmd) {
				_g.content = new flash.display.Bitmap(bmd);
				_g.contentLoaderInfo.content = _g.content;
				_g.addChild(_g.content);
				var evt = new flash.events.Event("complete");
				evt.set_currentTarget(_g);
				_g.contentLoaderInfo.dispatchEvent(evt);
			});
		} catch( e ) {
			console.log("Error " + Std.string(e));
			var evt = new flash.events.IOErrorEvent("ioError");
			evt.set_currentTarget(this);
			this.contentLoaderInfo.dispatchEvent(evt);
		}
	}
	,load: function(request,context) {
		var extension = "", i;
		var parts = request.url.split(".");
		if(parts.length > 0) extension = parts[parts.length - 1].toLowerCase();
		var transparent = true;
		this.contentLoaderInfo.url = request.url;
		this.contentLoaderInfo.contentType = (function($this) {
			var $r;
			switch(extension) {
			case "swf":
				$r = "application/x-shockwave-flash";
				break;
			case "jpg":case "jpeg":
				$r = (function($this) {
					var $r;
					transparent = false;
					$r = "image/jpeg";
					return $r;
				}($this));
				break;
			case "png":
				$r = "image/png";
				break;
			case "gif":
				$r = "image/gif";
				break;
			default:
				$r = (function($this) {
					var $r;
					throw "Unrecognized file " + request.url;
					return $r;
				}($this));
			}
			return $r;
		}(this));
		this.mImage = new flash.display.BitmapData(0,0,transparent);
		try {
			this.contentLoaderInfo.addEventListener("complete",$bind(this,this.handleLoad),false);
			this.mImage.nmeLoadFromFile(request.url,this.contentLoaderInfo);
			this.content = new flash.display.Bitmap(this.mImage);
			this.contentLoaderInfo.content = this.content;
			this.addChild(this.content);
		} catch( e ) {
			console.log("Error " + Std.string(e));
			var evt = new flash.events.IOErrorEvent("ioError");
			evt.set_currentTarget(this);
			this.contentLoaderInfo.dispatchEvent(evt);
			return;
		}
		if(this.mShape == null) {
			this.mShape = new flash.display.Shape();
			this.addChild(this.mShape);
		}
	}
	,__class__: flash.display.Loader
});
flash.display.LoaderInfo = function() {
	flash.events.EventDispatcher.call(this);
	this.bytesLoaded = this.bytesTotal = 0;
	this.childAllowsParent = true;
	this.parameters = { };
};
$hxClasses["flash.display.LoaderInfo"] = flash.display.LoaderInfo;
flash.display.LoaderInfo.__name__ = ["flash","display","LoaderInfo"];
flash.display.LoaderInfo.create = function(o) {
	var r = new flash.display.LoaderInfo();
	if(o != null) r.loader = o; else r.url = "";
	return r;
}
flash.display.LoaderInfo.__super__ = flash.events.EventDispatcher;
flash.display.LoaderInfo.prototype = $extend(flash.events.EventDispatcher.prototype,{
	__class__: flash.display.LoaderInfo
});
flash.display.MovieClip = function() {
	flash.display.Sprite.call(this);
	this.enabled = true;
	this.qIndex = this.qTotal = 0;
	this.loaderInfo = flash.display.LoaderInfo.create();
};
$hxClasses["flash.display.MovieClip"] = flash.display.MovieClip;
flash.display.MovieClip.__name__ = ["flash","display","MovieClip"];
flash.display.MovieClip.__super__ = flash.display.Sprite;
flash.display.MovieClip.prototype = $extend(flash.display.Sprite.prototype,{
	get_totalFrames: function() {
		return this.qTotal;
	}
	,get_framesLoaded: function() {
		return this.qTotal;
	}
	,get_currentFrame: function() {
		return this.qIndex;
	}
	,stop: function() {
	}
	,prevFrame: function() {
	}
	,play: function() {
	}
	,nextFrame: function() {
	}
	,gotoAndStop: function(v,o) {
	}
	,gotoAndPlay: function(v,o) {
	}
	,__class__: flash.display.MovieClip
});
flash.display.Shape = function() {
	(this.graphics = new flash.display.Graphics()).set_displayObject(this);
	this.component = this.graphics.component;
	flash.display.DisplayObject.call(this);
};
$hxClasses["flash.display.Shape"] = flash.display.Shape;
flash.display.Shape.__name__ = ["flash","display","Shape"];
flash.display.Shape.__interfaces__ = [flash.display.IBitmapDrawable];
flash.display.Shape.__super__ = flash.display.DisplayObject;
flash.display.Shape.prototype = $extend(flash.display.DisplayObject.prototype,{
	set_stage: function(v) {
		var z = this.get_stage() == null && v != null, r = flash.display.DisplayObject.prototype.set_stage.call(this,v);
		if(z) this.graphics.invalidate();
		return r;
	}
	,drawToSurface: function(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing) {
		this.graphics.drawToSurface(cnv,ctx,mtx,ctr,blendMode,clipRect,smoothing);
	}
	,__class__: flash.display.Shape
});
flash.display.Stage = function() {
	this.isTouchScreen = false;
	this.frameRate = 0;
	flash.display.DisplayObjectContainer.call(this);
	var s = this.component.style;
	s.position = "absolute";
	s.overflow = "hidden";
	s.width = s.height = "100%";
	this.qTimeStamp = flash.Lib.getTimer();
	flash.Lib.requestAnimationFrame($bind(this,this.onAnimationFrame));
	this.mousePos = new flash.geom.Point();
	var o = js.Browser.window;
	o.addEventListener("mousemove",$bind(this,this.onMouseMove));
	o.addEventListener("touchstart",$bind(this,this.onTouch));
	o.addEventListener("touchend",$bind(this,this.onTouch));
	o.addEventListener("touchmove",$bind(this,this.onTouch));
};
$hxClasses["flash.display.Stage"] = flash.display.Stage;
flash.display.Stage.__name__ = ["flash","display","Stage"];
flash.display.Stage.__super__ = flash.display.DisplayObjectContainer;
flash.display.Stage.prototype = $extend(flash.display.DisplayObjectContainer.prototype,{
	onAnimationFrame: function() {
		var t = flash.Lib.getTimer();
		var i = -1;
		while(++i < flash.Lib.schLength) {
			flash.Lib.schList[i]();
			flash.Lib.schList[i] = null;
		}
		flash.Lib.schLength = 0;
		if(this.frameRate <= 0 || t - this.qTimeStamp >= 1000 / this.frameRate) {
			this.qTimeStamp = t;
			var e = new flash.events.Event("enterFrame");
			this.broadcastEvent(e);
		}
		flash.Lib.requestAnimationFrame($bind(this,this.onAnimationFrame));
	}
	,get_stage: function() {
		return this;
	}
	,get_stageHeight: function() {
		return js.Browser.window.innerHeight;
	}
	,get_stageWidth: function() {
		return js.Browser.window.innerWidth;
	}
	,removeEventListener: function(type,listener,useCapture,priority,useWeakReference) {
		if(useWeakReference == null) useWeakReference = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o = this.component;
		this.component = window;
		flash.display.DisplayObjectContainer.prototype.removeEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
		this.component = o;
	}
	,addEventListener: function(type,listener,useCapture,priority,useWeakReference) {
		if(useWeakReference == null) useWeakReference = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
		var o = this.component;
		this.component = window;
		flash.display.DisplayObjectContainer.prototype.addEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
		this.component = o;
	}
	,onMouseMove: function(e) {
		if(!this.isTouchScreen) {
			this.mousePos.x = e.pageX;
			this.mousePos.y = e.pageY;
		}
	}
	,onTouch: function(e) {
		this.isTouchScreen = true;
		if(e.targetTouches.length > 0) {
			this.mousePos.x = e.targetTouches[0].pageX;
			this.mousePos.y = e.targetTouches[0].pageY;
		}
		e.preventDefault();
	}
	,__class__: flash.display.Stage
});
flash.display.StageAlign = $hxClasses["flash.display.StageAlign"] = { __ename__ : true, __constructs__ : ["TOP_RIGHT","TOP_LEFT","TOP","RIGHT","LEFT","BOTTOM_RIGHT","BOTTOM_LEFT","BOTTOM"] }
flash.display.StageAlign.TOP_RIGHT = ["TOP_RIGHT",0];
flash.display.StageAlign.TOP_RIGHT.toString = $estr;
flash.display.StageAlign.TOP_RIGHT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.TOP_LEFT = ["TOP_LEFT",1];
flash.display.StageAlign.TOP_LEFT.toString = $estr;
flash.display.StageAlign.TOP_LEFT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.TOP = ["TOP",2];
flash.display.StageAlign.TOP.toString = $estr;
flash.display.StageAlign.TOP.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.RIGHT = ["RIGHT",3];
flash.display.StageAlign.RIGHT.toString = $estr;
flash.display.StageAlign.RIGHT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.LEFT = ["LEFT",4];
flash.display.StageAlign.LEFT.toString = $estr;
flash.display.StageAlign.LEFT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.BOTTOM_RIGHT = ["BOTTOM_RIGHT",5];
flash.display.StageAlign.BOTTOM_RIGHT.toString = $estr;
flash.display.StageAlign.BOTTOM_RIGHT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.BOTTOM_LEFT = ["BOTTOM_LEFT",6];
flash.display.StageAlign.BOTTOM_LEFT.toString = $estr;
flash.display.StageAlign.BOTTOM_LEFT.__enum__ = flash.display.StageAlign;
flash.display.StageAlign.BOTTOM = ["BOTTOM",7];
flash.display.StageAlign.BOTTOM.toString = $estr;
flash.display.StageAlign.BOTTOM.__enum__ = flash.display.StageAlign;
flash.display.StageDisplayState = $hxClasses["flash.display.StageDisplayState"] = { __ename__ : true, __constructs__ : ["FULL_SCREEN","FULL_SCREEN_INTERACTIVE","NORMAL"] }
flash.display.StageDisplayState.FULL_SCREEN = ["FULL_SCREEN",0];
flash.display.StageDisplayState.FULL_SCREEN.toString = $estr;
flash.display.StageDisplayState.FULL_SCREEN.__enum__ = flash.display.StageDisplayState;
flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE = ["FULL_SCREEN_INTERACTIVE",1];
flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE.toString = $estr;
flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE.__enum__ = flash.display.StageDisplayState;
flash.display.StageDisplayState.NORMAL = ["NORMAL",2];
flash.display.StageDisplayState.NORMAL.toString = $estr;
flash.display.StageDisplayState.NORMAL.__enum__ = flash.display.StageDisplayState;
flash.display.StageScaleMode = $hxClasses["flash.display.StageScaleMode"] = { __ename__ : true, __constructs__ : ["SHOW_ALL","NO_SCALE","NO_BORDER","EXACT_FIT"] }
flash.display.StageScaleMode.SHOW_ALL = ["SHOW_ALL",0];
flash.display.StageScaleMode.SHOW_ALL.toString = $estr;
flash.display.StageScaleMode.SHOW_ALL.__enum__ = flash.display.StageScaleMode;
flash.display.StageScaleMode.NO_SCALE = ["NO_SCALE",1];
flash.display.StageScaleMode.NO_SCALE.toString = $estr;
flash.display.StageScaleMode.NO_SCALE.__enum__ = flash.display.StageScaleMode;
flash.display.StageScaleMode.NO_BORDER = ["NO_BORDER",2];
flash.display.StageScaleMode.NO_BORDER.toString = $estr;
flash.display.StageScaleMode.NO_BORDER.__enum__ = flash.display.StageScaleMode;
flash.display.StageScaleMode.EXACT_FIT = ["EXACT_FIT",3];
flash.display.StageScaleMode.EXACT_FIT.toString = $estr;
flash.display.StageScaleMode.EXACT_FIT.__enum__ = flash.display.StageScaleMode;
flash.errors = {}
flash.errors.Error = function(message,id) {
	if(id == null) id = 0;
	if(message == null) message = "";
	this.message = message;
	this.errorID = id;
};
$hxClasses["flash.errors.Error"] = flash.errors.Error;
flash.errors.Error.__name__ = ["flash","errors","Error"];
flash.errors.Error.prototype = {
	toString: function() {
		return this.message != null?this.message:"Error";
	}
	,getStackTrace: function() {
		return haxe.CallStack.toString(haxe.CallStack.exceptionStack());
	}
	,__class__: flash.errors.Error
}
flash.errors.IOError = function(message) {
	if(message == null) message = "";
	flash.errors.Error.call(this,message);
};
$hxClasses["flash.errors.IOError"] = flash.errors.IOError;
flash.errors.IOError.__name__ = ["flash","errors","IOError"];
flash.errors.IOError.__super__ = flash.errors.Error;
flash.errors.IOError.prototype = $extend(flash.errors.Error.prototype,{
	__class__: flash.errors.IOError
});
flash.events.Event = function(type,bubbles,cancelable) {
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	this.type = type;
	this.bubbles = bubbles;
	this.cancelable = cancelable;
};
$hxClasses["flash.events.Event"] = flash.events.Event;
flash.events.Event.__name__ = ["flash","events","Event"];
flash.events.Event.prototype = {
	clone: function() {
		return new flash.events.Event(this.type,this.bubbles,this.cancelable);
	}
	,isDefaultPrevented: function() {
		return this.defaultPrevented;
	}
	,set_currentTarget: function(v) {
		return this._current = v;
	}
	,get_currentTarget: function() {
		return this._current || this.currentTarget;
	}
	,set_target: function(v) {
		return this._target = v;
	}
	,get_target: function() {
		return this._target || this.target;
	}
	,__class__: flash.events.Event
}
flash.events.TextEvent = function(type,bubbles,cancelable,text) {
	if(text == null) text = "";
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.text = text;
};
$hxClasses["flash.events.TextEvent"] = flash.events.TextEvent;
flash.events.TextEvent.__name__ = ["flash","events","TextEvent"];
flash.events.TextEvent.__super__ = flash.events.Event;
flash.events.TextEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.TextEvent
});
flash.events.ErrorEvent = function(type,bubbles,cancelable,text) {
	flash.events.TextEvent.call(this,type,bubbles,cancelable);
	this.text = text;
};
$hxClasses["flash.events.ErrorEvent"] = flash.events.ErrorEvent;
flash.events.ErrorEvent.__name__ = ["flash","events","ErrorEvent"];
flash.events.ErrorEvent.__super__ = flash.events.TextEvent;
flash.events.ErrorEvent.prototype = $extend(flash.events.TextEvent.prototype,{
	__class__: flash.events.ErrorEvent
});
flash.events.HTTPStatusEvent = function(type,bubbles,cancelable,status) {
	if(status == null) status = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	this.status = status;
	flash.events.Event.call(this,type,bubbles,cancelable);
};
$hxClasses["flash.events.HTTPStatusEvent"] = flash.events.HTTPStatusEvent;
flash.events.HTTPStatusEvent.__name__ = ["flash","events","HTTPStatusEvent"];
flash.events.HTTPStatusEvent.__super__ = flash.events.Event;
flash.events.HTTPStatusEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.HTTPStatusEvent
});
flash.events.IOErrorEvent = function(type,bubbles,cancelable,inText) {
	if(inText == null) inText = "";
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.text = inText;
};
$hxClasses["flash.events.IOErrorEvent"] = flash.events.IOErrorEvent;
flash.events.IOErrorEvent.__name__ = ["flash","events","IOErrorEvent"];
flash.events.IOErrorEvent.__super__ = flash.events.Event;
flash.events.IOErrorEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.IOErrorEvent
});
flash.events.KeyboardEvent = function(type,bubbles,cancelable,charCodeValue,keyCodeValue) {
	if(keyCodeValue == null) keyCodeValue = 0;
	if(charCodeValue == null) charCodeValue = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = true;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.keyCode = keyCodeValue;
	this.charCode = charCodeValue;
};
$hxClasses["flash.events.KeyboardEvent"] = flash.events.KeyboardEvent;
flash.events.KeyboardEvent.__name__ = ["flash","events","KeyboardEvent"];
flash.events.KeyboardEvent.__super__ = flash.events.Event;
flash.events.KeyboardEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.KeyboardEvent
});
flash.events.MouseEvent = function(type,bubbles,cancelable,lx,ly,obj,ctrlKey,altKey,shiftKey,buttonDown,delta) {
	if(delta == null) delta = 0;
	if(buttonDown == null) buttonDown = false;
	if(shiftKey == null) shiftKey = false;
	if(altKey == null) altKey = false;
	if(ctrlKey == null) ctrlKey = false;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = true;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.ctrlKey = ctrlKey;
	this.altKey = altKey;
	this.shiftKey = shiftKey;
	this.relatedObject = obj;
	this.button = buttonDown?0:1;
	this.wheelDelta = delta;
};
$hxClasses["flash.events.MouseEvent"] = flash.events.MouseEvent;
flash.events.MouseEvent.__name__ = ["flash","events","MouseEvent"];
flash.events.MouseEvent.__super__ = flash.events.Event;
flash.events.MouseEvent.prototype = $extend(flash.events.Event.prototype,{
	updateAfterEvent: function() {
	}
	,get_localY: function() {
		return this.get_localPoint().y;
	}
	,get_localX: function() {
		return this.get_localPoint().x;
	}
	,get_localPoint: function() {
		var p = flash.events.MouseEvent.convPoint;
		if(p == null) flash.events.MouseEvent.convPoint = p = new flash.geom.Point();
		p.x = this.pageX;
		p.y = this.pageY;
		return this.relatedObject != null?this.relatedObject.globalToLocal(p,p):p;
	}
	,get_stageY: function() {
		return this.pageY;
	}
	,get_stageX: function() {
		return this.pageX;
	}
	,get_delta: function() {
		return this.wheelDelta;
	}
	,get_buttonDown: function() {
		return this.button == 0;
	}
	,__class__: flash.events.MouseEvent
});
flash.events.ProgressEvent = function(type,bubbles,cancelable,bytesLoaded,bytesTotal) {
	if(bytesTotal == null) bytesTotal = 0;
	if(bytesLoaded == null) bytesLoaded = 0;
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.Event.call(this,type,bubbles,cancelable);
	this.bytesLoaded = bytesLoaded;
	this.bytesTotal = bytesTotal;
};
$hxClasses["flash.events.ProgressEvent"] = flash.events.ProgressEvent;
flash.events.ProgressEvent.__name__ = ["flash","events","ProgressEvent"];
flash.events.ProgressEvent.__super__ = flash.events.Event;
flash.events.ProgressEvent.prototype = $extend(flash.events.Event.prototype,{
	__class__: flash.events.ProgressEvent
});
flash.events.SecurityErrorEvent = function(type,bubbles,cancelable,text) {
	if(text == null) text = "";
	if(cancelable == null) cancelable = false;
	if(bubbles == null) bubbles = false;
	flash.events.ErrorEvent.call(this,type,bubbles,cancelable);
	this.text = text;
};
$hxClasses["flash.events.SecurityErrorEvent"] = flash.events.SecurityErrorEvent;
flash.events.SecurityErrorEvent.__name__ = ["flash","events","SecurityErrorEvent"];
flash.events.SecurityErrorEvent.__super__ = flash.events.ErrorEvent;
flash.events.SecurityErrorEvent.prototype = $extend(flash.events.ErrorEvent.prototype,{
	__class__: flash.events.SecurityErrorEvent
});
flash.filters = {}
flash.filters.BitmapFilter = function(inType) {
	this._mType = inType;
};
$hxClasses["flash.filters.BitmapFilter"] = flash.filters.BitmapFilter;
flash.filters.BitmapFilter.__name__ = ["flash","filters","BitmapFilter"];
flash.filters.BitmapFilter.prototype = {
	nmeApplyFilter: function(surface,rect,refreshCache) {
		if(refreshCache == null) refreshCache = false;
	}
	,nmePreFilter: function(surface) {
	}
	,clone: function() {
		throw "Implement in subclass. BitmapFilter::clone";
		return null;
	}
	,__class__: flash.filters.BitmapFilter
}
flash.geom = {}
flash.geom.ColorTransform = function(r,g,b,a,ro,go,bo,ao) {
	if(ao == null) ao = 0;
	if(bo == null) bo = 0;
	if(go == null) go = 0;
	if(ro == null) ro = 0;
	if(a == null) a = 1;
	if(b == null) b = 1;
	if(g == null) g = 1;
	if(r == null) r = 1;
	this.redMultiplier = r;
	this.greenMultiplier = g;
	this.blueMultiplier = b;
	this.alphaMultiplier = a;
	this.redOffset = ro;
	this.greenOffset = go;
	this.blueOffset = bo;
	this.alphaOffset = ao;
};
$hxClasses["flash.geom.ColorTransform"] = flash.geom.ColorTransform;
flash.geom.ColorTransform.__name__ = ["flash","geom","ColorTransform"];
flash.geom.ColorTransform.prototype = {
	set_color: function(value) {
		this.redOffset = value >> 16 & 255;
		this.greenOffset = value >> 8 & 255;
		this.blueOffset = value & 255;
		this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 0;
		return this.get_color();
	}
	,get_color: function() {
		return (this.redOffset | 0) << 16 | (this.greenOffset | 0) << 8 | (this.blueOffset | 0);
	}
	,isAlphaMultiplier: function() {
		return this.redMultiplier == 1 && this.greenMultiplier == 1 && this.blueMultiplier == 1 && this.redOffset == 0 && this.greenOffset == 0 && this.blueOffset == 0 && this.alphaOffset == 0;
	}
	,isColorSetter: function() {
		return this.redMultiplier == 0 && this.greenMultiplier == 0 && this.blueMultiplier == 0 && (this.alphaMultiplier == 0 || this.alphaOffset == 0);
	}
	,concat: function(o) {
		this.redMultiplier += o.redMultiplier;
		this.greenMultiplier += o.greenMultiplier;
		this.blueMultiplier += o.blueMultiplier;
		this.alphaMultiplier += o.alphaMultiplier;
	}
	,__class__: flash.geom.ColorTransform
}
flash.geom.Matrix = function(a,b,c,d,tx,ty) {
	this.a = a == null?1:a;
	this.b = b == null?0:b;
	this.c = c == null?0:c;
	this.d = d == null?1:d;
	this.tx = tx == null?0:tx;
	this.ty = ty == null?0:ty;
};
$hxClasses["flash.geom.Matrix"] = flash.geom.Matrix;
flash.geom.Matrix.__name__ = ["flash","geom","Matrix"];
flash.geom.Matrix.prototype = {
	to3dString: function() {
		return "matrix3d(" + this.a + ", " + this.b + ", 0, 0, " + this.c + ", " + this.d + ", 0, 0, 0, 0, 1, 0, " + this.tx + ", " + this.ty + ", 0, 1)";
	}
	,toString: function() {
		return "matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
	}
	,transformPoint: function(o) {
		return new flash.geom.Point(o.x * this.a + o.y * this.c + this.tx,o.x * this.b + o.y * this.d + this.ty);
	}
	,concat: function(o) {
		var t;
		t = this.a * o.a + this.b * o.c;
		this.b = this.a * o.b + this.b * o.d;
		this.a = t;
		t = this.c * o.a + this.d * o.c;
		this.d = this.c * o.b + this.d * o.d;
		this.c = t;
		t = this.tx * o.a + this.ty * o.c + o.tx;
		this.ty = this.tx * o.b + this.ty * o.d + o.ty;
		this.tx = t;
	}
	,scale: function(x,y) {
		this.a *= x;
		this.b *= y;
		this.c *= x;
		this.d *= y;
		this.tx *= x;
		this.ty *= y;
	}
	,rotate: function(o) {
		var ox = Math.cos(o), oy = Math.sin(o), t;
		t = this.a * ox - this.b * oy;
		this.b = this.a * oy + this.b * ox;
		this.a = t;
		t = this.c * ox - this.d * oy;
		this.d = this.c * oy + this.d * ox;
		this.c = t;
		t = this.tx * ox - this.ty * oy;
		this.ty = this.tx * oy + this.ty * ox;
		this.tx = t;
	}
	,translate: function(x,y) {
		this.tx += x;
		this.ty += y;
	}
	,invert: function() {
		var t, n = this.a * this.d - this.b * this.c;
		if(n == 0) {
			this.a = this.b = this.c = this.d = 0;
			this.tx = -this.tx;
			this.ty = -this.ty;
		} else {
			n = 1 / n;
			t = this.d * n;
			this.d = this.a * n;
			this.a = t;
			this.b *= -n;
			this.c *= -n;
			t = -this.a * this.tx - this.c * this.ty;
			this.ty = -this.b * this.tx - this.d * this.ty;
			this.tx = t;
		}
	}
	,copy: function(s) {
		this.a = s.a;
		this.b = s.b;
		this.c = s.c;
		this.d = s.d;
		this.tx = s.tx;
		this.ty = s.ty;
	}
	,isIdentity: function() {
		return this.a == 1 && this.d == 1 && this.tx == 0 && this.ty == 0 && this.b == 0 && this.c == 0;
	}
	,identity: function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
	}
	,clone: function() {
		return new flash.geom.Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
	}
	,__class__: flash.geom.Matrix
}
flash.geom.Point = function(_x,_y) {
	this.x = _x == null?0:_x;
	this.y = _y == null?0:_y;
};
$hxClasses["flash.geom.Point"] = flash.geom.Point;
flash.geom.Point.__name__ = ["flash","geom","Point"];
flash.geom.Point.interpolate = function(a,b,f) {
	return new flash.geom.Point(a.x + f * (b.x - a.x),a.y + f * (b.y - a.y));
}
flash.geom.Point.polar = function(l,d) {
	return new flash.geom.Point(Math.cos(d) * l,Math.sin(d) * l);
}
flash.geom.Point.prototype = {
	subtract: function(o) {
		return new flash.geom.Point(this.x - o.x,this.y - o.y);
	}
	,add: function(o) {
		return new flash.geom.Point(this.x + o.x,this.y + o.y);
	}
	,offset: function(dx,dy) {
		this.x += dx;
		this.y += dy;
	}
	,normalize: function(l) {
		if(this.y == 0) this.x = this.x < 0?-l:l; else if(this.x == 0) this.y = this.y < 0?-l:l; else {
			var m = l / Math.sqrt(this.x * this.x + this.y * this.y);
			this.x *= m;
			this.y *= m;
		}
	}
	,toString: function() {
		return "point(" + this.x + ", " + this.y + ")";
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,equals: function(o) {
		return this.x == o.x && this.y == o.y;
	}
	,clone: function() {
		return new flash.geom.Point(this.x,this.y);
	}
	,__class__: flash.geom.Point
}
flash.geom.Rectangle = function(a,b,c,d) {
	if(d == null) d = 0;
	if(c == null) c = 0;
	if(b == null) b = 0;
	if(a == null) a = 0;
	this.x = a;
	this.y = b;
	this.width = c;
	this.height = d;
};
$hxClasses["flash.geom.Rectangle"] = flash.geom.Rectangle;
flash.geom.Rectangle.__name__ = ["flash","geom","Rectangle"];
flash.geom.Rectangle.prototype = {
	toString: function() {
		return "Rectangle(" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + ")";
	}
	,transform: function(m) {
		var v, l, t, r, b;
		r = l = m.a * this.x + m.c * this.y;
		b = t = m.b * this.x + m.d * this.y;
		v = m.a * (this.x + this.width) + m.c * this.y;
		if(v < l) l = v;
		if(v > r) r = v;
		v = m.b * (this.x + this.width) + m.d * this.y;
		if(v < t) t = v;
		if(v > b) b = v;
		v = m.a * this.x + m.c * (this.y + this.height);
		if(v < l) l = v;
		if(v > r) r = v;
		v = m.b * this.x + m.d * (this.y + this.height);
		if(v < t) t = v;
		if(v > b) b = v;
		v = m.a * (this.x + this.width) + m.c * (this.y + this.height);
		if(v < l) l = v;
		if(v > r) r = v;
		v = m.b * (this.x + this.width) + m.d * (this.y + this.height);
		if(v < t) t = v;
		if(v > b) b = v;
		this.x = l + m.tx;
		this.width = r - l;
		this.y = t + m.ty;
		this.height = b - t;
	}
	,offsetPoint: function(o) {
		this.x += o.x;
		this.y += o.y;
	}
	,offset: function(u,v) {
		this.x += u;
		this.y += v;
	}
	,inflatePoint: function(v) {
		this.inflate(v.x,v.y);
	}
	,inflate: function(u,v) {
		this.x -= u;
		this.y -= v;
		this.width += u * 2;
		this.height += v * 2;
	}
	,union: function(o) {
		var a, b, c, d;
		return new flash.geom.Rectangle((a = this.x) < (c = o.x)?a:c,(b = this.y) < (d = o.y)?b:d,(a += this.width) > (c += o.width)?a:c,(b += this.height) > (d += o.height)?b:d);
	}
	,join: function(o) {
		var v;
		if((v = o.x - this.x) < 0) {
			this.x += v;
			this.width -= v;
		}
		if((v = o.y - this.y) < 0) {
			this.y += v;
			this.height -= v;
		}
		if((v = o.x + o.width - (this.x + this.width)) > 0) this.width += v;
		if((v = o.y + o.height - (this.y + this.height)) > 0) this.height += v;
	}
	,intersects: function(o) {
		var x0, x1, y0, y1;
		return (x0 = this.x < (x0 = o.x)?x0:this.x) <= (x1 = this.x + this.width > (x1 = o.x + o.width)?x1:this.x + this.width)?false:(y0 = this.y < (y0 = o.y)?y0:this.y) <= (y1 = this.y + this.height > (y1 = o.y + o.height)?y1:this.y);
	}
	,intersection: function(o) {
		var x0, x1, y0, y1, a, b;
		return (x0 = (a = this.x) < (b = o.x)?b:a) <= (x1 = (a += this.width) > (b += o.width)?b:a) && (y0 = (a = this.y) < (b = o.y)?b:a) <= (y1 = (a += this.height) > (b += o.height)?b:a)?new flash.geom.Rectangle(x0,y0,x1 - x0,y1 - y0):new flash.geom.Rectangle();
	}
	,containsRect: function(o) {
		return o.width <= 0 || o.height <= 0?o.x > this.x && o.y > this.y && o.x + o.width < this.x + this.width && o.y + o.height < this.y + this.height:o.x >= this.x && o.y >= this.y && o.x + o.width <= this.x + this.width && o.y + o.height <= this.y + this.height;
	}
	,containsPoint: function(o) {
		return this.contains(o.x,o.y);
	}
	,contains: function(u,v) {
		return (u -= this.x) >= 0 && (v -= this.y) >= 0 && u < this.width && v < this.height;
	}
	,set_bottomRight: function(v) {
		this.width = v.x - this.x;
		this.height = v.y - this.y;
		return v.clone();
	}
	,get_bottomRight: function() {
		return new flash.geom.Point(this.x + this.width,this.y + this.height);
	}
	,set_topLeft: function(v) {
		this.width = v.x;
		this.height = v.y;
		return v.clone();
	}
	,get_topLeft: function() {
		return new flash.geom.Point(this.x,this.y);
	}
	,set_size: function(v) {
		this.width = v.x;
		this.height = v.y;
		return v.clone();
	}
	,get_size: function() {
		return new flash.geom.Point(this.width,this.height);
	}
	,set_bottom: function(v) {
		this.height = v - this.y;
		return v;
	}
	,get_bottom: function() {
		return this.y + this.height;
	}
	,set_right: function(v) {
		this.width = v - this.x;
		return v;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,set_top: function(v) {
		this.height -= v - this.y;
		return this.y = v;
	}
	,get_top: function() {
		return this.y;
	}
	,set_left: function(v) {
		this.width -= v - this.x;
		return this.x = v;
	}
	,get_left: function() {
		return this.x;
	}
	,setVoid: function() {
		this.width -= 2147483647 - this.x;
		this.x = 2147483647;
		this.width = -2147483648 - this.x;
		-2147483648;
		this.height -= 2147483647 - this.y;
		this.y = 2147483647;
		this.height = -2147483648 - this.y;
		-2147483648;
	}
	,setTo: function(a,b,c,d) {
		this.x = a;
		this.y = b;
		this.width = c;
		this.height = d;
	}
	,copyFrom: function(o) {
		this.x = o.x;
		this.y = o.y;
		this.width = o.width;
		this.height = o.height;
	}
	,setEmpty: function() {
		this.x = this.y = this.width = this.height = 0;
	}
	,isEmpty: function() {
		return this.width <= 0 || this.height <= 0;
	}
	,equals: function(o) {
		return this.x == o.x && this.y == o.y && this.width == o.width && this.height == o.height;
	}
	,clone: function() {
		return new flash.geom.Rectangle(this.x,this.y,this.width,this.height);
	}
	,__class__: flash.geom.Rectangle
}
flash.geom.Transform = function(displayObject) {
	if(displayObject == null) throw "Cannot create Transform with no DisplayObject.";
	this._displayObject = displayObject;
	this._matrix = new flash.geom.Matrix();
	this._fullMatrix = new flash.geom.Matrix();
	this.set_colorTransform(new flash.geom.ColorTransform());
};
$hxClasses["flash.geom.Transform"] = flash.geom.Transform;
flash.geom.Transform.__name__ = ["flash","geom","Transform"];
flash.geom.Transform.prototype = {
	get_pixelBounds: function() {
		return this._displayObject.getBounds(null);
	}
	,set_matrix: function(inValue) {
		this._matrix.copy(inValue);
		this._displayObject.syncMtx();
		return this._matrix;
	}
	,get_matrix: function() {
		return this._matrix.clone();
	}
	,get_concatenatedMatrix: function() {
		return this.nmeGetFullMatrix(this._matrix);
	}
	,set_colorTransform: function(inValue) {
		this.colorTransform = inValue;
		return inValue;
	}
	,nmeSetMatrix: function(inValue) {
		this._matrix.copy(inValue);
	}
	,nmeSetFullMatrix: function(inValue) {
		this._fullMatrix.copy(inValue);
		return this._fullMatrix;
	}
	,nmeGetFullMatrix: function(localMatrix) {
		var m;
		if(localMatrix != null) (m = new flash.geom.Matrix(localMatrix.a,localMatrix.b,localMatrix.c,localMatrix.d,localMatrix.tx,localMatrix.ty)).concat(this._fullMatrix); else m = this._fullMatrix.clone();
		return m;
	}
	,__class__: flash.geom.Transform
}
flash.media = {}
flash.media.Sound = function(stream,ctx) {
	flash.events.EventDispatcher.call(this);
	if(stream != null) this.load(stream,ctx);
};
$hxClasses["flash.media.Sound"] = flash.media.Sound;
flash.media.Sound.__name__ = ["flash","media","Sound"];
flash.media.Sound.canPlayType = function(o) {
	var f, v;
	o = o.toLowerCase();
	if(flash.media.Sound.canPlayMap != null) {
		if(flash.media.Sound.canPlayMap.exists(o)) return flash.media.Sound.canPlayMap.get(o);
	} else flash.media.Sound.canPlayMap = new haxe.ds.StringMap();
	f = flash.media.Sound.getFormatType(o);
	v = new Audio().canPlayType(f) != "no";
	flash.media.Sound.canPlayMap.set(o,v);
	return v;
}
flash.media.Sound.getFormatType = function(o) {
	return o == "mp3"?"audio/mpeg;":o == "ogg"?"audio/ogg; codecs=\"vorbis\"":null;
}
flash.media.Sound.__super__ = flash.events.EventDispatcher;
flash.media.Sound.prototype = $extend(flash.events.EventDispatcher.prototype,{
	get_length: function() {
		return this.component != null?this.component.duration * 1000:0;
	}
	,play: function(ofs,loops,stf) {
		if(loops == null) loops = 0;
		if(ofs == null) ofs = 0;
		var o, i;
		if(this.qCache.length == 0) {
			(o = new flash.media.SoundChannel()).init(this,this.component,loops);
			this.component = this.component.cloneNode(true);
		} else {
			o = this.qCache[0];
			var _g = 0, _g1 = this.qCache;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				if(v.get_position() == ofs) {
					o = v;
					break;
				}
			}
			HxOverrides.remove(this.qCache,o);
		}
		o.set_soundTransform(stf);
		try {
			o.play(ofs);
		} catch( e ) {
			var f = null;
			f = function(e1) {
				o.component.removeEventListener("canplaythrough",f);
				o.play(ofs);
			};
			o.addEventListener("canplaythrough",f);
		}
		return o;
	}
	,load: function(stream,ctx) {
		var s = stream.url;
		if(flash.media.Sound.library.exists(s)) {
			this.component = flash.media.Sound.library.get(s);
			flash.media.Sound.library.set(s,this.component.cloneNode(true));
		} else this.component = new Audio(s);
		this.qCache = [];
	}
	,close: function() {
		if(this.component != null) this.component = null; else throw new flash.errors.IOError("Attempt to close unexisting stream.");
	}
	,__class__: flash.media.Sound
});
flash.media.SoundChannel = function() {
	this._loops = 1;
	this._position = 0;
	this.active = false;
	this.rightPeak = 1;
	this.leftPeak = 1;
	flash.events.EventDispatcher.call(this);
};
$hxClasses["flash.media.SoundChannel"] = flash.media.SoundChannel;
flash.media.SoundChannel.__name__ = ["flash","media","SoundChannel"];
flash.media.SoundChannel.__super__ = flash.events.EventDispatcher;
flash.media.SoundChannel.prototype = $extend(flash.events.EventDispatcher.prototype,{
	onEnded: function(e) {
		if(this.active) {
			this._loops--;
			if(this._loops > 0) this.component.play(); else {
				this.stop();
				this.component.currentTime = 0;
				this.dispatchEvent(new flash.events.Event("soundComplete"));
			}
		}
	}
	,set_position: function(v) {
		var p = !this.component.paused;
		if(p) this.component.pause();
		this.component.currentTime = v / 1000;
		if(p) this.component.play();
		return v;
	}
	,get_position: function() {
		return this.component.currentTime * 1000;
	}
	,set_soundTransform: function(v) {
		this.soundTransform = v;
		this.component.volume = v != null?v.volume:1;
		return v;
	}
	,stop: function() {
		if(this.active) {
			this.active = false;
			this.component.pause();
			this.qSound.qCache.push(this);
		}
	}
	,play: function(p) {
		if(!this.active) {
			this.component.play();
			this.set_position(p);
			this.active = true;
		}
	}
	,init: function(q,v,loops) {
		if(loops == null) loops = 1;
		this.qSound = q;
		this.component = v;
		this._loops = loops;
		this.component.addEventListener("ended",$bind(this,this.onEnded));
	}
	,__class__: flash.media.SoundChannel
});
flash.media.SoundLoaderContext = function(bufferTime,checkPolicyFile) {
	if(checkPolicyFile == null) checkPolicyFile = false;
	if(bufferTime == null) bufferTime = 0;
	this.bufferTime = bufferTime;
	this.checkPolicyFile = checkPolicyFile;
};
$hxClasses["flash.media.SoundLoaderContext"] = flash.media.SoundLoaderContext;
flash.media.SoundLoaderContext.__name__ = ["flash","media","SoundLoaderContext"];
flash.media.SoundLoaderContext.prototype = {
	__class__: flash.media.SoundLoaderContext
}
flash.media.SoundTransform = function(vol,panning) {
	if(panning == null) panning = 0;
	if(vol == null) vol = 1;
	this.volume = vol;
	this.pan = panning;
};
$hxClasses["flash.media.SoundTransform"] = flash.media.SoundTransform;
flash.media.SoundTransform.__name__ = ["flash","media","SoundTransform"];
flash.media.SoundTransform.prototype = {
	__class__: flash.media.SoundTransform
}
flash.net = {}
flash.net.URLLoader = function(request) {
	flash.events.EventDispatcher.call(this);
	this.bytesLoaded = 0;
	this.bytesTotal = 0;
	this.set_dataFormat(flash.net.URLLoaderDataFormat.TEXT);
	if(request != null) this.load(request);
};
$hxClasses["flash.net.URLLoader"] = flash.net.URLLoader;
flash.net.URLLoader.__name__ = ["flash","net","URLLoader"];
flash.net.URLLoader.__super__ = flash.events.EventDispatcher;
flash.net.URLLoader.prototype = $extend(flash.events.EventDispatcher.prototype,{
	onStatus: function(status) {
		var e = new flash.events.HTTPStatusEvent("httpStatus",false,false,status);
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,onSecurityError: function(msg) {
		var evt = new flash.events.SecurityErrorEvent("securityError");
		evt.text = msg;
		evt.set_currentTarget(this);
		this.dispatchEvent(evt);
	}
	,onProgress: function(event) {
		var e = new flash.events.ProgressEvent("progress");
		e.set_currentTarget(this);
		e.bytesLoaded = event.loaded;
		e.bytesTotal = event.total;
		this.dispatchEvent(e);
	}
	,onOpen: function() {
		var e = new flash.events.Event("open");
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,onError: function(msg) {
		var e = new flash.events.IOErrorEvent("ioError");
		e.text = msg;
		e.set_currentTarget(this);
		this.dispatchEvent(e);
	}
	,onData: function(_) {
		var content = this.getData();
		switch(this.dataFormat) {
		case flash.net.URLLoaderDataFormat.BINARY:
			this.data = flash.utils.ByteArray.nmeOfBuffer(content);
			break;
		default:
			this.data = Std.string(content);
		}
		var evt = new flash.events.Event("complete");
		evt.set_currentTarget(this);
		this.dispatchEvent(evt);
	}
	,requestUrl: function(url,method,data,requestHeaders) {
		var xmlHttpRequest = new XMLHttpRequest();
		this.registerEvents(xmlHttpRequest);
		var uri = "";
		if(js.Boot.__instanceof(data,flash.utils.ByteArray)) {
			var data1 = data;
			switch(this.dataFormat) {
			case flash.net.URLLoaderDataFormat.BINARY:
				uri = data1.data.buffer;
				break;
			default:
				uri = data1.readUTFBytes(data1.length);
			}
		} else if(js.Boot.__instanceof(data,flash.net.URLVariables)) {
			var data1 = data;
			var _g = 0, _g1 = Reflect.fields(data1);
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(uri.length != 0) uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(Reflect.field(data1,p));
			}
		} else if(data != null) uri = data.toString();
		try {
			if(method == "GET" && uri != null && uri != "") {
				var question = url.split("?").length <= 1;
				xmlHttpRequest.open(method,url + (question?"?":"&") + Std.string(uri),true);
				uri = "";
			} else xmlHttpRequest.open(method,url,true);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		switch(this.dataFormat) {
		case flash.net.URLLoaderDataFormat.BINARY:
			xmlHttpRequest.responseType = "arraybuffer";
			break;
		default:
		}
		var _g = 0;
		while(_g < requestHeaders.length) {
			var header = requestHeaders[_g];
			++_g;
			xmlHttpRequest.setRequestHeader(header.name,header.value);
		}
		xmlHttpRequest.send(uri);
		this.onOpen();
		this.getData = function() {
			if(xmlHttpRequest.response != null) return xmlHttpRequest.response; else return xmlHttpRequest.responseText;
		};
	}
	,registerEvents: function(subject) {
		var self = this;
		if(typeof XMLHttpRequestProgressEvent != "undefined") subject.addEventListener("progress",$bind(this,this.onProgress),false);
		subject.onreadystatechange = function() {
			if(subject.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = subject.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) self.onStatus(s);
			if(s != null && s >= 200 && s < 400) self.onData(subject.response); else if(s == null) self.onError("Failed to connect or resolve host"); else if(s == 12029) self.onError("Failed to connect to host"); else if(s == 12007) self.onError("Unknown host"); else if(s == 0) {
				self.onError("Unable to make request (may be blocked due to cross-domain permissions)");
				self.onSecurityError("Unable to make request (may be blocked due to cross-domain permissions)");
			} else self.onError("Http Error #" + subject.status);
		};
	}
	,load: function(request) {
		this.requestUrl(request.url,request.method,request.data,request.formatRequestHeaders());
	}
	,getData: function() {
		return null;
	}
	,close: function() {
	}
	,set_dataFormat: function(inputVal) {
		if(inputVal == flash.net.URLLoaderDataFormat.BINARY && !Reflect.hasField(js.Browser.window,"ArrayBuffer")) this.dataFormat = flash.net.URLLoaderDataFormat.TEXT; else this.dataFormat = inputVal;
		return this.dataFormat;
	}
	,__class__: flash.net.URLLoader
});
flash.net.URLLoaderDataFormat = $hxClasses["flash.net.URLLoaderDataFormat"] = { __ename__ : true, __constructs__ : ["BINARY","TEXT","VARIABLES"] }
flash.net.URLLoaderDataFormat.BINARY = ["BINARY",0];
flash.net.URLLoaderDataFormat.BINARY.toString = $estr;
flash.net.URLLoaderDataFormat.BINARY.__enum__ = flash.net.URLLoaderDataFormat;
flash.net.URLLoaderDataFormat.TEXT = ["TEXT",1];
flash.net.URLLoaderDataFormat.TEXT.toString = $estr;
flash.net.URLLoaderDataFormat.TEXT.__enum__ = flash.net.URLLoaderDataFormat;
flash.net.URLLoaderDataFormat.VARIABLES = ["VARIABLES",2];
flash.net.URLLoaderDataFormat.VARIABLES.toString = $estr;
flash.net.URLLoaderDataFormat.VARIABLES.__enum__ = flash.net.URLLoaderDataFormat;
flash.net.URLRequest = function(inURL) {
	if(inURL != null) this.url = inURL;
	this.requestHeaders = [];
	this.method = "GET";
	this.contentType = null;
};
$hxClasses["flash.net.URLRequest"] = flash.net.URLRequest;
flash.net.URLRequest.__name__ = ["flash","net","URLRequest"];
flash.net.URLRequest.prototype = {
	formatRequestHeaders: function() {
		var res = this.requestHeaders;
		if(res == null) res = [];
		if(this.method == "GET" || this.data == null) return res;
		if(js.Boot.__instanceof(this.data,String) || js.Boot.__instanceof(this.data,flash.utils.ByteArray)) (res = res.slice()).push(new flash.net.URLRequestHeader("Content-Type",this.contentType != null?this.contentType:"application/x-www-form-urlencoded"));
		return res;
	}
	,__class__: flash.net.URLRequest
}
flash.net.URLRequestHeader = function(name,value) {
	if(value == null) value = "";
	if(name == null) name = "";
	this.name = name;
	this.value = value;
};
$hxClasses["flash.net.URLRequestHeader"] = flash.net.URLRequestHeader;
flash.net.URLRequestHeader.__name__ = ["flash","net","URLRequestHeader"];
flash.net.URLRequestHeader.prototype = {
	__class__: flash.net.URLRequestHeader
}
flash.net.URLRequestMethod = function() { }
$hxClasses["flash.net.URLRequestMethod"] = flash.net.URLRequestMethod;
flash.net.URLRequestMethod.__name__ = ["flash","net","URLRequestMethod"];
flash.net.URLVariables = function(inEncoded) {
	if(inEncoded != null) this.decode(inEncoded);
};
$hxClasses["flash.net.URLVariables"] = flash.net.URLVariables;
flash.net.URLVariables.__name__ = ["flash","net","URLVariables"];
flash.net.URLVariables.prototype = {
	toString: function() {
		var r = "", o = Reflect.fields(this), i = 0;
		var _g = 0;
		while(_g < o.length) {
			var f = o[_g];
			++_g;
			r += (i++ != 0?"&":"") + StringTools.urlEncode(f) + "=" + StringTools.urlEncode(Reflect.field(this,f));
		}
		return r;
	}
	,decode: function(inVars) {
		var fields = Reflect.fields(this);
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			Reflect.deleteField(this,f);
		}
		var fields1 = inVars.split(";").join("&").split("&");
		var _g = 0;
		while(_g < fields1.length) {
			var f = fields1[_g];
			++_g;
			var eq = f.indexOf("=");
			if(eq > 0) this[StringTools.urlDecode(HxOverrides.substr(f,0,eq))] = StringTools.urlDecode(HxOverrides.substr(f,eq + 1,null)); else if(eq != 0) this[StringTools.urlDecode(f)] = "";
		}
	}
	,__class__: flash.net.URLVariables
}
flash.ui = {}
flash.ui.Keyboard = function() { }
$hxClasses["flash.ui.Keyboard"] = flash.ui.Keyboard;
flash.ui.Keyboard.__name__ = ["flash","ui","Keyboard"];
flash.ui.Keyboard.isAccessible = function() {
	return false;
}
flash.utils = {}
flash.utils.ByteArray = function() {
	this.littleEndian = false;
	this.allocated = 0;
	this.position = 0;
	this.length = 0;
	this._nmeResizeBuffer(this.allocated);
};
$hxClasses["flash.utils.ByteArray"] = flash.utils.ByteArray;
flash.utils.ByteArray.__name__ = ["flash","utils","ByteArray"];
flash.utils.ByteArray.fromBytes = function(inBytes) {
	var r = new flash.utils.ByteArray();
	r.byteView = new Uint8Array(inBytes.b);
	r.set_length(r.byteView.length);
	r.allocated = r.length;
	return r;
}
flash.utils.ByteArray.nmeOfBuffer = function(buffer) {
	var r = new flash.utils.ByteArray();
	r.set_length(r.allocated = buffer.byteLength);
	r.data = new DataView(buffer);
	r.byteView = new Uint8Array(buffer);
	return r;
}
flash.utils.ByteArray.prototype = {
	set_length: function(value) {
		if(this.allocated < value) this._nmeResizeBuffer(this.allocated = Math.max(value,this.allocated * 2) | 0); else if(this.allocated > value) this._nmeResizeBuffer(this.allocated = value);
		return this.length = value;
	}
	,set_endian: function(endian) {
		this.littleEndian = endian == "littleEndian";
		return endian;
	}
	,get_endian: function() {
		return this.littleEndian?"littleEndian":"bigEndian";
	}
	,get_bytesAvailable: function() {
		return this.length - this.position;
	}
	,writeUTFBytes: function(value) {
		var _g1 = 0, _g = value.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = value.charCodeAt(i);
			if(c <= 127) this.writeByte(c); else if(c <= 2047) {
				this.writeByte(192 | c >> 6);
				this.writeByte(128 | c & 63);
			} else if(c <= 65535) {
				this.writeByte(224 | c >> 12);
				this.writeByte(128 | c >> 6 & 63);
				this.writeByte(128 | c & 63);
			} else {
				this.writeByte(240 | c >> 18);
				this.writeByte(128 | c >> 12 & 63);
				this.writeByte(128 | c >> 6 & 63);
				this.writeByte(128 | c & 63);
			}
		}
	}
	,writeUTF: function(value) {
		this.writeUnsignedShort(this._getUTFBytesCount(value));
		this.writeUTFBytes(value);
	}
	,writeUnsignedShort: function(value) {
		var l = this.position + 2;
		if(this.length < l) this.set_length(l);
		this.data.setUint16(this.position,value,this.littleEndian);
		this.position += 2;
	}
	,writeUnsignedInt: function(value) {
		var l = this.position + 4;
		if(this.length < l) this.set_length(l);
		this.data.setUint32(this.position,value,this.littleEndian);
		this.position += 4;
	}
	,writeShort: function(value) {
		var l = this.position + 2;
		if(this.length < l) this.set_length(l);
		this.data.setInt16(this.position,value,this.littleEndian);
		this.position += 2;
	}
	,writeInt: function(value) {
		var l = this.position + 4;
		if(this.length < l) this.set_length(l);
		this.data.setInt32(this.position,value,this.littleEndian);
		this.position += 4;
	}
	,writeFloat: function(x) {
		var l = this.position + 4;
		if(this.length < l) this.set_length(l);
		this.data.setFloat32(this.position,x,this.littleEndian);
		this.position += 4;
	}
	,writeDouble: function(x) {
		var l = this.position + 8;
		if(this.length < l) this.set_length(l);
		this.data.setFloat64(this.position,x,this.littleEndian);
		this.position += 8;
	}
	,writeBytes: function(bytes,offset,length) {
		if(offset < 0 || length < 0) throw new flash.errors.IOError("Write error - Out of bounds");
		var l = this.position + length;
		if(this.length < l) this.set_length(l);
		this.byteView.set(bytes.byteView.subarray(offset,offset + length),this.position);
		this.position += length;
	}
	,writeByte: function(v) {
		var l = this.position + 1;
		if(this.length < l) this.set_length(l);
		var data = this.data;
		data.setInt8(this.position,v);
		this.position += 1;
	}
	,writeBoolean: function(v) {
		this.writeByte(v?1:0);
	}
	,toString: function() {
		var o = this.position, r;
		this.position = 0;
		r = this.readUTFBytes(this.length);
		this.position = o;
		return r;
	}
	,readUTFBytes: function(len) {
		var r = "", max = this.position + len;
		while(this.position < max) {
			var c = this.data.getUint8(this.position++);
			if(c < 128) {
				if(c == 0) break;
				r += String.fromCharCode(c);
			} else if(c < 224) r += String.fromCharCode((c & 63) << 6 | this.data.getUint8(this.position++) & 127); else if(c < 240) {
				var c2 = this.data.getUint8(this.position++);
				r += String.fromCharCode((c & 31) << 12 | (c2 & 127) << 6 | this.data.getUint8(this.position++) & 127);
			} else {
				var c2 = this.data.getUint8(this.position++);
				var c3 = this.data.getUint8(this.position++);
				r += String.fromCharCode((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | this.data.getUint8(this.position++) & 127);
			}
		}
		return r;
	}
	,readUTF: function() {
		return this.readUTFBytes(this.readUnsignedShort());
	}
	,readUnsignedShort: function() {
		var r = this.data.getUint16(this.position,this.littleEndian);
		this.position += 2;
		return r;
	}
	,readUnsignedInt: function() {
		var uInt = this.data.getUint32(this.position,this.littleEndian);
		this.position += 4;
		return uInt;
	}
	,readUnsignedByte: function() {
		return this.data.getUint8(this.position++);
	}
	,readShort: function() {
		var r = this.data.getInt16(this.position,this.littleEndian);
		this.position += 2;
		return r;
	}
	,readInt: function() {
		var r = this.data.getInt32(this.position,this.littleEndian);
		this.position += 4;
		return r;
	}
	,readFullBytes: function(bytes,pos,len) {
		if(this.length < len) this.set_length(len);
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.data.setInt8(this.position++,bytes.b[i]);
		}
	}
	,readFloat: function() {
		var r = this.data.getFloat32(this.position,this.littleEndian);
		this.position += 4;
		return r;
	}
	,readDouble: function() {
		var r = this.data.getFloat64(this.position,this.littleEndian);
		this.position += 8;
		return r;
	}
	,readBytes: function(bytes,offset,length) {
		if(offset == null) offset = 0;
		if(length == null) length = this.length;
		if(offset < 0 || length < 0) throw new flash.errors.IOError("Read error - Out of bounds");
		var l = offset + length;
		if(bytes.length < l) bytes.set_length(l);
		bytes.byteView.set(this.byteView.subarray(this.position,this.position + length),offset);
		bytes.position = offset;
		this.position += length;
		if(bytes.position + length > bytes.length) bytes.set_length(bytes.position + length);
	}
	,readByte: function() {
		return this.data.getUint8(this.position++);
	}
	,readBoolean: function() {
		return this.data.getUint8(this.position++) != 0;
	}
	,nmeSet: function(p,v) {
		this.data.setUint8(p,v);
	}
	,nmeGetBuffer: function() {
		return this.data.buffer;
	}
	,nmeGet: function(pos) {
		return this.data.getUint8(pos);
	}
	,nmeFromBytes: function(inBytes) {
		this.byteView = new Uint8Array(inBytes.b);
		this.set_length(this.byteView.length);
		this.allocated = this.length;
	}
	,clear: function() {
		this.set_length(0);
	}
	,_nmeResizeBuffer: function(len) {
		var oldByteView = this.byteView;
		var newByteView = new Uint8Array(len);
		if(oldByteView != null) {
			if(oldByteView.length <= len) newByteView.set(oldByteView); else newByteView.set(oldByteView.subarray(0,len));
		}
		this.byteView = newByteView;
		this.data = new DataView(newByteView.buffer);
	}
	,_getUTFBytesCount: function(value) {
		var count = 0;
		var _g1 = 0, _g = value.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = value.charCodeAt(i);
			if(c <= 127) count += 1; else if(c <= 2047) count += 2; else if(c <= 65535) count += 3; else count += 4;
		}
		return count;
	}
	,__set: function(pos,v) {
		this.data.setUint8(pos,v);
	}
	,__get: function(pos) {
		return this.data.getUint8(pos);
	}
	,__class__: flash.utils.ByteArray
}
flash.utils.Endian = function() { }
$hxClasses["flash.utils.Endian"] = flash.utils.Endian;
flash.utils.Endian.__name__ = ["flash","utils","Endian"];
var haxe = {}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.CallStack = function() { }
$hxClasses["haxe.CallStack"] = haxe.CallStack;
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.exceptionStack = function() {
	return [];
}
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
}
haxe.CallStack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = $e[2];
		b.b += "module ";
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		b.b += Std.string(file);
		b.b += " line ";
		b.b += Std.string(line);
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += ".";
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += "local function #";
		b.b += Std.string(n);
		break;
	}
}
haxe.Resource = function() { }
$hxClasses["haxe.Resource"] = haxe.Resource;
haxe.Resource.__name__ = ["haxe","Resource"];
haxe.Resource.listNames = function() {
	var names = new Array();
	var _g = 0, _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		names.push(x.name);
	}
	return names;
}
haxe.ds = {}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	remove: function(key) {
		var id = key.__id__;
		if(!this.h.hasOwnProperty(id)) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function() { }
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.prototype = {
	__class__: haxe.io.Bytes
}
haxe.io.Eof = function() { }
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
flash.display.DisplayObject.remapTouch = new haxe.ds.StringMap();
flash.display.DisplayObject.remapTouch.set("mousedown","touchstart");
flash.display.DisplayObject.remapTouch.set("mousemove","touchmove");
flash.display.DisplayObject.remapTouch.set("mouseup","touchend");
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
flash.Lib.schList = [];
flash.Lib.schLength = 0;
window.reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(o) {
	window.setTimeout(o,700 / flash.Lib.frameRate,null);
};
(function() {
	var a = Event.prototype, b = flash.events.Event.prototype;
	a.clone = b.clone;
	a.isDefaultPrevented = b.isDefaultPrevented;
	a.get_target = b.get_target;
	a.set_target = b.set_target;
	a.get_currentTarget = b.get_currentTarget;
	a.set_currentTarget = b.set_currentTarget;
})();
(function() {
	var o = MouseEvent.prototype, q = flash.events.MouseEvent.prototype;
	o.get_buttonDown = q.get_buttonDown;
	o.get_delta = q.get_delta;
	o.get_stageX = q.get_stageX;
	o.get_stageY = q.get_stageY;
	o.get_localX = q.get_localX;
	o.get_localY = q.get_localY;
	o.get_localPoint = q.get_localPoint;
})();
haxe.Resource.content = [];
flash.Lib.qTimeStamp = Date.now() + 0;
flash.Lib.mouseX = 0;
flash.Lib.mouseY = 0;
flash.geom.Transform.DEG_TO_RAD = Math.PI / 180.0;
haxe.ds.ObjectMap.count = 0;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
ApplicationMain.main();
})();
