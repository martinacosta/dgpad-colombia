function TextPanel(_canvas) {
    var me = this;
    var canvas = _canvas;
    $U.extend(this, new VerticalBorderPanel(canvas, 240, false));
    me.setBounds(me.getBounds().left + 15, -5, 0, 0); // Le fond n'est pas affiché
    me.show();

    var props = new props_textPanel(canvas, me);
    // Une ineptie necessaire parce que sinon le clavier virtuel
    // de l'ipad change la position du panneau de propriété :
    if (Object.touchpad) {
        window.scrollTo(0, 0);
    }
	
	var xx = 0,
		yy = 0,
	
        _l = me.getBounds().left,
        _t = me.getBounds().top;

  var dragmove = function(ev) {
	  if (Math.abs(ev.pageY-_t)<40){
		_l += (ev.pageX - xx);
		_t += (ev.pageY - yy);
		me.setStyle("left", _l + "px");
		me.setStyle("top", _t + "px");
		xx = ev.pageX;
		yy = ev.pageY;
	  }
  }

  var dragdown = function(ev) {
           // me.removeContent(editBox);
		xx = ev.pageX;
		yy = ev.pageY;
		window.addEventListener('touchmove', dragmove, false);
		window.addEventListener('touchend', dragup, false);
		window.addEventListener('mousemove', dragmove, false);
		window.addEventListener('mouseup', dragup, false);
  }

  var dragup = function(ev) {
    window.removeEventListener('touchmove', dragmove, false);
    window.removeEventListener('touchend', dragup, false);
    window.removeEventListener('mousemove', dragmove, false);
    window.removeEventListener('mouseup', dragup, false);
  }
  
  me.getDocObject().addEventListener('touchstart', dragdown, false);
    me.getDocObject().addEventListener('mousedown', dragdown, false);

    props.show();

    me.addInpObject = function() {
        var r = Math.round(Math.random() * 128);
        var g = Math.round(Math.random() * 128);
        var b = Math.round(Math.random() * 128);
        var op = Math.round((0.1 + Math.random() / 3) * 100) / 100;
               // var stl = "c:rgba(" + r + "," + g + "," + b + "," + op + ")";
               // console.log(stl);
        var stl = "c:" + props.getRGBAColor();
               // stl += ";s:6";
               // stl += ";r:50";
        stl += ";s:" + props.getBorderSize();
        stl += ";r:" + props.getBorderRadius();
        stl += ";p:" + props.getPrecision();
		stl += ";f:50";
		stl += ";t:16";
		stl += ";fp:false";
		stl += ";ft:false";
		canvas.InputManager.addInput(.....)
        // canvas.textManager.addText($L.props_text_example, 70, 10, 500, 65, stl);
    };

    me.edit = function(myObj) {
        props.edit(myObj)
    };

    me.addName = function(_n) {
        props.addName(_n);
    };

}


function props_inputPanel(_canvas, _owner) {
    var me = this;
    $U.extend(this, new Panel(_owner.getDocObject()));
    var currentObj = null;
    me.setAttr("className", "props_TeX_DIV");
    me.transition("translate_x", 0.2, 200);

    var ch = 10;
    var sh = 35;
    var t1 = new Label(me);
    t1.setText($L.props_input_message);
    t1.setStyles("color:#252525;font-style: italic; font-size: 30");
    t1.setBounds(10, ch, 200, 20);
    me.addContent(t1);
    ch += 50;

    me.addName = function(_n) {
        if (currentObj)
            currentObj.addName(_n);
    };
    me.edit = function(myObj) {
        var n = myObj && (currentObj !== myObj);
        currentObj = myObj;
        cp.setHEX(myObj.getColor());
        op.setValue(myObj.getOpacity());
        sz.setValue(myObj.getBorderSize());
        rd.setValue(myObj.getBorderRadius());
        pr.setValue(myObj.getNumPrec());
		fs.setValue(myObj.getWidgetFont());
		fp.setValue(myObj.getFixPosition());
		ft.setValue(myObj.getFixSize());
        if (n)
            myObj.setEditFocus();

    };


    var COLORcallback = function(val) {
        if (currentObj)
            currentObj.setColor(val);
    };

    var OPcallback = function(val) {
        if (currentObj)
            currentObj.setOpacity(val);
    };

    var SZcallback = function(val) {
        if (currentObj)
            currentObj.setBorderSize(val);
    };

    var RDcallback = function(val) {
        if (currentObj)
            currentObj.setBorderRadius(val);
    };

    var PRcallback = function(val) {
        if (currentObj)
            currentObj.setNumPrec(val);
    };
	
	var FScallback = function(val) {
        
		if (currentObj)
            currentObj.setWidgetFont(val);
    };
	
	var FPcallback = function(bool) {
        
		if (currentObj)
            currentObj.setFixPosition(bool);
		
    };
	
	var FTcallback = function(bool) {
        
		if (currentObj)
            currentObj.setFixSize(bool);
		
    };

    var addBtnCallBack = function() {
        // _owner.addTeXObject();
    };

    me.getRGBAColor = function() {
        var col = new Color();
        col.set(cp.getHEX());
        col.setOpacity(op.getValue());
        return col.getRGBA();
    };
    me.getBorderSize = function() {
        return (sz.getValue());
    };
    me.getBorderRadius = function() {
        return (rd.getValue());
    };
    me.getPrecision = function() {
        return (pr.getValue());
    };
	
	me.getWidgetFont = function() {
		return (fs.getValue());
	};
	
	me.getFixPosition = function() {
		return (fp.getValue());
	};
		
	me.getFixSize = function() {
		return (ft.getValue());	
	};

    var setSlider = function(_sl, _t, _p) {
        _sl.setValueWidth(40);
        _sl.setTextColor("#252525");
        _sl.setBackgroundColor("rgba(0,0,0,0)");
        _sl.setLabel(_t, 80);
        _sl.setValuePrecision(_p);
		
    }

    var cp = new ColorPicker(me.getDocObject(), 10, ch, 200, 200);
    cp.setHEXcallback(COLORcallback);
    var cl = new Color();
    cl.set("rgba(59,79,115,0.18)");
    cp.setRGB(cl.getR(), cl.getG(), cl.getB());
    ch += 210;

    //opacidad
	var op = new slider(me.getDocObject(), 10, ch, 200, sh, 0, 1, cl.getOpacity(), OPcallback);
    setSlider(op, $L.props_text_opacity, 0.01);
    ch += sh;

    //tamaño
	var sz = new slider(me.getDocObject(), 10, ch, 200, sh, 0, 30, 3, SZcallback);
    setSlider(sz, $L.props_text_size, 0.5);
    ch += sh;

    //radio
	var rd = new slider(me.getDocObject(), 10, ch, 200, sh, 0, 200, 15, RDcallback);
    setSlider(rd, $L.props_text_radius, 0.5);
    ch += sh;

    //precision
	var pr = new slider(me.getDocObject(), 10, ch, 200, sh, 0, 13, 4, PRcallback);
    setSlider(pr, $L.props_text_precision, 1);
    ch += sh;
	
	//tamaño fuente
	var fs = new slider(me.getDocObject(), 10, ch, 200, sh, 5, 40, 3, FScallback);
    setSlider(fs, $L.props_text_widgetFont, 1);
    ch += sh;

	//fijar posición
	var fp =  new Checkbox(me.getDocObject(), 10, ch, 200, 30, false, $L.props_text_fixPosition, FPcallback);
    
    ch += 30;

	//fijar tamaño
	var ft =  new Checkbox(me.getDocObject(), 10, ch, 200, 30, false, $L.props_text_fixSize, FTcallback);
    //faltan otras propiedades de los input: number o text, min, max, step....
    ch += 30;

    ch += 10;
    var add = new Button(me);
    add.setBounds(10, ch, 200, 25);
    add.setText($L.props_text_add);
    add.setCallBack(addBtnCallBack);
    me.addContent(add);
}
