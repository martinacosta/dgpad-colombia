/*
To change this template, choose Tools | Templates
and open the template in the editor.
*/

function FrameText(_construction) {
  var me = this;
  var Cn = _construction;
  var M = [];
  var frame2 = null;

  me.getList = function() {
    return M;
  }

  me.ifObject = function(_name) {
    if (typeof _name === "string") {
      for (var i = 0, len = M.length; i < len; i++) {
        if (M[i].name === _name) {
          return true;
        }
      }
      return false;
    }
  }

  me.getTextCons = function(_obj) {
    if (typeof _obj === "object") {
      var tC = _obj.getTextCons();
      if (typeof tC === 'object') {
        M.push({
          "name": _obj.getName(),
          "texto": tC.texto,
          "parents": tC.parents
        });
      }
    }
    me.draw();
  };

  me.removeTextCons = function(_obj) {
    for (var i = 0, len = M.length; i < len; i++) {
      if (M[i].name == _obj.getName()) {
        break;
      }
    }
    M.splice(i, 1);
    me.draw();
  };

  me.fixTextCons = function(_old, _new) {
    for (var i = 0, len = M.length; i < len; i++) {
      var id = "",
        V = Cn.getListObject();
      if (M[i].name == _old || M[i].parents.indexOf(_old) >= 0) {

        if (M[i].name == _old) {
          M[i].name = _new;
          id = _old;
        }

        for (var k = 0, lov = V.length; k < lov; k++) {
          var name = V[k].getName();
          if (V[k].getName() == M[i].name) {
            var tC = V[k].getTextCons();
            M[i].name = name;
            M[i].texto = tC.texto;
            M[i].parents = tC.parents
            break;
          }
        }
      }
    }
    me.draw();
  };

  me.updateTextCons = function(_obj) {
    for (var i = 0, len = M.length; i < len; i++) {
      if (M[i].name == _obj.getName()) {
        var tC = _obj.getTextCons();
        if (typeof tC === 'object') {
          M[i].texto = tC.texto;
          M[i].parents = tC.parents;
          break;
        }
      }
    }
    me.draw();
  };

  me.removeAll = function() {
    M = [];
  };

  me.draw = function() {
    if (frame2) {
      contenido = "";
      for (var k = 0, len = M.length; k < len; k++) {
        contenido = contenido + "<li id=" + M[k].name + ">" + M[k].texto + "</li>";
      }
      frame2.setText(contenido);
    }
  };

  var exportProc = function() {
    if (frame2) {
      frame2.close();
    }
  };

  me.cleanFrame = function() {
    if (frame2) {
      frame2.setText("");
    }
  };

  me.drawFrame = function(_canvas, x, y) {
    if (!frame2) {
      frame2 = new FrameWrapper(_canvas, x, y);
    } else {
      // $U.alert($L.Frame_InstanceOn);
	  me.cleanFrame;
	  me.draw;
	  frame2 = new FrameWrapper(_canvas, x, y);
    }
  };

}
