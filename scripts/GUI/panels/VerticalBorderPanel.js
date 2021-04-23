/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function VerticalBorderPanel(_canvas, _w, _isLeft) {
    $U.extend(this, new Panel(_canvas.getDocObject()));
    var me = this;
    var canvas = _canvas;
    var width = _w;
    var isLeft = _isLeft;
    me.setAttr("className", "verticalPanel");
    me.transition("translate_x", 0.2, (isLeft) ? -width : width);
    //    me.transition("translate_y", 0.2, (isLeft) ? -width : width);

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

    this.show = function() {
        //        document.body.parentNode.appendChild(me.getDocObject());
        canvas.getDocObject().parentNode.appendChild(me.getDocObject());
        me.applyTransitionIN();
    };

    this.close = function() {
        me.applyTransitionOUT();
        setTimeout(function() {
            //            document.body.parentNode.removeChild(me.getDocObject());
            canvas.getDocObject().parentNode.removeChild(me.getDocObject());
        }, 300);
    };

    me.init = function() {
        var t = me.getOwnerBounds();
        if (isLeft) {
            me.setBounds(t.left + 10, t.top + 10, width, t.height - 20 - canvas.prefs.controlpanel.size);
        } else {
            me.setBounds(t.left + t.width - width - 10, t.top + 10, width, t.height - 20 - canvas.prefs.controlpanel.size);
        }
    };

    me.init();
}
