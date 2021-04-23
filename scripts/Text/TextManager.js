/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function TextManager(_canvas) {
    var me = this;
    var canvas = _canvas;
    var txts = [];
	
    // var firstLoad = true;
    var textPanel = null;

	me.winputs= [];
    me.compute = function() {
        for (var i = 0, len = txts.length; i < len; i++) {
            txts[i].compute();
        }
    };

    me.refreshInputs = function() {
        for (var i = 0, len = txts.length; i < len; i++) {
            txts[i].refreshInputs();
        }
    };

    me.evaluateStrings = function(forceEvaluate) {
        for (var i = 0, len = txts.length; i < len; i++) {
            txts[i].evaluateString();
        }
    };

    me.executeScript = function(_t, _i) {
        if (_t > -1) {
            canvas.undoManager.beginAdd();
            txts[_t].exec(_i);
            canvas.undoManager.endAdd();
        }
    }

    me.getPosition = function(_t) {
        for (var i = 0, len = txts.length; i < len; i++) {
            if (txts[i] === _t)
                return i;
        }
        return txts.length;
    };

    // var loadKaTeX = function() {
    //     var parent = document.getElementsByTagName("head")[0];
    //     var lnk = document.createElement("link");
    //     lnk.rel = "stylesheet";
    //     lnk.href = $APP_PATH + "NotPacked/thirdParty/katex.min.css";
    //     //        lnk.href = "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.css";
    //     var script = document.createElement("script");
    //     script.type = "text/javascript";
    //     script.src = $APP_PATH + "NotPacked/thirdParty/katex.min.js";
    //     //        script.src = "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.js";
    //     script.onload = function() {
    //         me.evaluateStrings();
    //         //            script.id = "MathJax";
    //     }
    //     parent.appendChild(lnk);
    //     parent.appendChild(script);
    // }

    me.edit = function(mytxt) {
        for (var k = 0; k < txts.length; k++) {
            txts[k].noedit();
        };
        if (mytxt) {
            mytxt.doedit();
            if (textPanel)
                textPanel.edit(mytxt);
        }
    }

    me.deleteTeX = function(_tex) {
        for (var k = 0; k < txts.length; k++) {
            if (txts[k] === _tex) {
                txts.splice(k, 1);
                _tex.close();
                return
            }
        }
    };







    me.addName = function(_n) {
        if (textPanel)
            textPanel.addName(_n);
    };

    me.addTeXElement = function(_m, _l, _t, _w, _h, _stl) {
        $U.katexLoaded(me.evaluateStrings);
        // if (firstLoad) {
        //     loadKaTeX();
        //     firstLoad = false;
        // }
        var txt = new TextObject(canvas, _m, _l, _t, _w, _h);
        if (_stl !== undefined) {
            txt.setStyles(_stl);
        }
        txts.push(txt);
        txt.evaluateString();
        return txt;

    };

    // Pour le undoManager :
	// Para el undoManager:
    me.add = function(_tex) {
        var b = _tex.getBounds();
        return me.addTeXElement(_tex.getRawText(), b.left, b.top, b.width, b.height, _tex.getStyles());
    };

    // Uniquement pour l'ajout de textes en manuel :
	// Unicamente para añadir textos a mano:
    me.addText = function(_m, _l, _t, _w, _h, _stl) {
        canvas.undoManager.beginAdd();
        me.addTeXElement(_m, _l, _t, _w, _h, _stl).edit();
        canvas.undoManager.endAdd();
    };

    me.elements = function() {
        return txts;
    };

	me.winps= function(){
		return winputs;
	};

    me.getSource = function(hide_ctrl_panel,fixwidgets,fixdgscripts,disablezoom) {
        var t = "";
		var width=window.innerWidth;
		var height=window.innerHeight;
        for (var i = 0, len = txts.length; i < len; i++) {
            var b = txts[i].getBounds();
            var TX = txts[i].getText();
			var TOP=b.top;
			var LEFT=b.left;
			var w=b.width;
			var h=b.height;
			w=w/width;
			h=h/height;
			TOP=TOP/height;
			LEFT=LEFT/width;
			
            TX = TX.replace(/\"/g, "\\\"");
            TX = $U.native2ascii(TX.split("\n").join("\\n"));

            t += "Text(\"" + TX + "\",widthWindow()*" + LEFT + ",heightWindow()*" + TOP + ",widthWindow()*" + w + ",heightWindow()*" + h;
            t += (txts[i].getStyles()) ? ",\"" + txts[i].getStyles() + "\"" : "";
            t += ");\n";
        }
        if (t !== "") {
            t = "\n\n// Texts :\n" + t;
        }
		if (fixwidgets){t+='var bool=true;\n if ((!GetCanvas().hasOwnProperty("fix_widget"))||(GetCanvas()["fix_widget"]!==bool)) {\n objs=GetCanvas().textManager.elements();\n for (var i=0; i<objs.length ; i++) {\n	obj=objs[i]; \n	if (!GetCanvas().textManager.elements()) {\n obj["fix_utility_setStyle"]=obj["setStyle"];\n		obj["getBounds"]=function(){return{"left":parseInt(this.getStyle("left")),"top":parseInt(this.getStyle("top")),"width":parseInt(this.getStyle("width")),"height":parseInt(this.getStyle("height"))};}.bind(obj);\n}\n if (bool) {\n		obj["setStyle"]=function(_at,_par){if((_at!=="left")&&(_at!=="top")&&(_at!=="width")&&(_at!=="height")){obj.fix_utility_setStyle(_at,_par)}}\n}\n else {obj["setStyle"]=obj["fix_utility_setStyle"];\n}\n}\n};\n GetCanvas()["fix_widget"]=bool;\n';};
        return t;
    };

    me.clear = function() {
        for (var i = 0, len = txts.length; i < len; i++) {
            if (txts[i].getDocObject().parentNode !== null) {
                txts[i].getDocObject().parentNode.removeChild(txts[i].getDocObject());
            }
        }
        txts = [];
    }

    //abre el panel para editar propiedades
	me.showPanel = function() {
        if (!textPanel) {
            textPanel = new TextPanel(canvas);
        }
    };

    //cierra el panel para editar propiedades
	me.hidePanel = function() {
        if (textPanel) {
            me.edit(null);
            textPanel.close();
            textPanel = null;
        }
    };


}
