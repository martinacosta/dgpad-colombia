function FrameWrapper(_canvas, _l, _t) {
  var me = this;
  var canvas = _canvas;
  var _w = 250;
  var _h = 350;
  var hidectrlpanel = true;
  var sel = -1;
  var JSZipReady = false;
  $U.extend(this, new GUIElement(_canvas.getDocObject(), "div"));

  me.show = function() {
    canvas.getDocObject().parentNode.appendChild(me.getDocObject());
  };

  me.setPosition("absolute");


  me.setBounds(_l, _t, _w, _h);

  var close = function() {
    canvas.getDocObject().parentNode.removeChild(me.getDocObject());
    canvas.setNoMouseEvent(true);
  };

  var closebox = new CloseBox(me, close);
  closebox.setStyle("z-index", "3");

  var header = new GUIElement(me, "div");
  header.setStyles("position:absolute;background-color:rgba(56,56,56,1);left:0px;top:0px;right:0px;text-align:center;border-radius:15px 0 0 0;cursor:move;height:25px");
  var titulo = new Label(me);
  titulo.setText($L.frame_cons_title);
  titulo.setStyles("color:#EEEEEE;font-family:Helvetica, Arial, sans-serif;font-size:" + (13 * $SCALE) + "px;margin: 0 auto;position:relative;padding:5px 0");
  header.addContent(titulo);
  me.addContent(header);

  var footer = new GUIElement(me, "div");
  footer.setStyles("position:absolute;left:10px;bottom:10px;right:10px;text-align:center;height:25px");
  var mensaje = new Label(me);
  mensaje.setText($L.frame_cons_footer);
  mensaje.setStyles("color:#000;font-family:Helvetica,Arial,sans-serif;font-size:" + (11 * $SCALE) + "px;position:relative;padding:5px 0;font-style:italic");
  footer.addContent(mensaje);
  me.addContent(footer);

  var xx = 0,
    yy = 0;

  var dragmove = function(ev) {
    _l += (ev.pageX - xx);
    _t += (ev.pageY - yy);
    me.setStyle("left", _l + "px");
    me.setStyle("top", _t + "px");
    xx = ev.pageX;
    yy = ev.pageY;
  }

  var dragdown = function(ev) {
    //        me.removeContent(editBox);
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

  //MEAG esto hace al contenedor arrastable
  header.addDownEvent(dragdown);


  var wrapper = new GUIElement(me, "div");
  wrapper.setStyles("position:absolute;background-color:rgba(180,200,245,0.8);left:0px;top:25px;right:0px;bottom:0px;overflow:hidden;border-radius:0 0 15px 15px;padding:10px 10px 30px 10px;overflow:auto");
  wrapper.setAttr("id", "ConsText");
  me.addContent(wrapper);

  me.setText = function(txt) {
    wrapper.getDocObject().innerHTML = txt;
  };

  var growbox = new GUIElement(_canvas, "div");
  growbox.setAbsolute();
  growbox.setStyles("width:30px;height:30px;right:0px;bottom:0px;cursor:se-resize");
  me.addContent(growbox);

  var sizemove = function(ev) {
    _w += (ev.pageX - xx);
    _h += (ev.pageY - yy);
    me.setStyle("width", _w + "px");
    me.setStyle("height", _h + "px");
    // container.setStyle("width", (_w - 20) + "px");
    // container.setStyle("height", (_h - 20) + "px");
    xx = ev.pageX;
    yy = ev.pageY;
    if (closebox)
      closebox.setStyle("left", (_w - 15) + "px");
  }

  var sizedown = function(ev) {
    xx = ev.pageX;
    yy = ev.pageY;
    window.addEventListener('touchmove', sizemove, false);
    window.addEventListener('touchend', sizeup, false);
    window.addEventListener('mousemove', sizemove, false);
    window.addEventListener('mouseup', sizeup, false);
  }

  var sizeup = function(ev) {
    window.removeEventListener('touchmove', sizemove, false);
    window.removeEventListener('touchend', sizeup, false);
    window.removeEventListener('mousemove', sizemove, false);
    window.removeEventListener('mouseup', sizeup, false);
  }

  growbox.addDownEvent(sizedown);
  me.show();

  var Select = function(ev) {
    var temp = document.createElement("textarea");
    temp.value = wrapper.getDocObject().innerHTML.replace(/<\/(li|p|div)>/g, '\n').replace(/<.+>/g, '');
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    $U.alert($L.frame_copypaste);
  }

  wrapper.addDblClickEvent(Select);

}
