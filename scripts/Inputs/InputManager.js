/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function InputManager(_canvas) {
    var me = this;
    var canvas = _canvas;
    var inps = [];
	
    // var firstLoad = true;
    var inpPanel = null;

	// me.winputs= [];
    // me.compute = function() {
        // for (var i = 0, len = inps.length; i < len; i++) {
            // inps[i].compute();
        // }
    // };

    // me.refreshInputs = function() {
        // for (var i = 0, len = inps.length; i < len; i++) {
            // inps[i].refreshInputs();
        // }
    // };

    // me.evaluateStrings = function(forceEvaluate) {
        // for (var i = 0, len = inps.length; i < len; i++) {
            // inps[i].evaluateString();
        // }
    // };

    // me.executeScript = function(_t, _i) {
        // if (_t > -1) {
            // canvas.undoManager.beginAdd();
            // inps[_t].exec(_i);
            // canvas.undoManager.endAdd();
        // }
    // }

    me.getPosition = function(_t) {
        for (var i = 0, len = inps.length; i < len; i++) {
            if (inps[i] === _t)
                return i;
        }
        return inps.length;
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

    me.edit = function(myinp) {
        for (var k = 0; k < inps.length; k++) {
            inps[k].noedit();
        };
        if (myinp) {
            myinp.doedit();
            if (inpPanel)
                inpPanel.edit(myinp);
        }
    }

    me.deleteInp = function(_inp) {
        for (var k = 0; k < inps.length; k++) {
            if (inps[k] === _inp) {
                inps.splice(k, 1);
                _inp.close();
                return
            }
        }
    };







    me.addName = function(_n) {
        if (inpPanel)
            inpPanel.addName(_n);
    };

    // me.addInpElement = function(_m, _l, _t, _w, _h, _stl) {
        // $U.katexLoaded(me.evaluateStrings);
        // if (firstLoad) {
            // loadKaTeX();
            // firstLoad = false;
        // }
        // var txt = new TextObject(canvas, _m, _l, _t, _w, _h);
        // if (_stl !== undefined) {
            // txt.setStyles(_stl);
        // }
        // inps.push(txt);
        // txt.evaluateString();
        // return txt;

    // };

    // Pour le undoManager :
    me.add = function(_inp) {
        var b = _inp.getBounds();
        return me.addInpElement(_inp.getRawText(), b.left, b.top, b.width, b.height, _inp.getStyles());???
    };

    // Uniquement pour l'ajout de textes en manuel :
    // me.addText = function(_m, _l, _t, _w, _h, _stl) {
        // canvas.undoManager.beginAdd();
        // me.addTeXElement(_m, _l, _t, _w, _h, _stl).edit();
        // canvas.undoManager.endAdd();
    // };

    me.elements = function() {
        return inps;
    };

	me.winps= function(){
		return winputs;
	};

    me.getSource = function(hide_ctrl_panel,fixwidgets,fixdgscripts,disablezoom) { //es necesario modificar
        var t = "";
		var width=window.innerWidth;
		var height=window.innerHeight;
        for (var i = 0, len = inps.length; i < len; i++) {
            var b = inps[i].getBounds();
            var TX = inps[i].getText();
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
            t += (inps[i].getStyles()) ? ",\"" + inps[i].getStyles() + "\"" : "";
            t += ");\n";
        }
        if (t !== "") {
            t = "\n\n// Texts :\n" + t;
        }
		if (fixwidgets){t+='var bool=true;\n if ((!GetCanvas().hasOwnProperty("fix_widget"))||(GetCanvas()["fix_widget"]!==bool)) {\n objs=GetCanvas().textManager.elements();\n for (var i=0; i<objs.length ; i++) {\n	obj=objs[i]; \n	if (!GetCanvas().textManager.elements()) {\n obj["fix_utility_setStyle"]=obj["setStyle"];\n		obj["getBounds"]=function(){return{"left":parseInt(this.getStyle("left")),"top":parseInt(this.getStyle("top")),"width":parseInt(this.getStyle("width")),"height":parseInt(this.getStyle("height"))};}.bind(obj);\n}\n if (bool) {\n		obj["setStyle"]=function(_at,_par){if((_at!=="left")&&(_at!=="top")&&(_at!=="width")&&(_at!=="height")){obj.fix_utility_setStyle(_at,_par)}}\n}\n else {obj["setStyle"]=obj["fix_utility_setStyle"];\n}\n}\n};\n GetCanvas()["fix_widget"]=bool;\n';};
        return t;
    };

    me.clear = function() {
        for (var i = 0, len = inps.length; i < len; i++) {
            if (inps[i].getDocObject().parentNode !== null) {
                inps[i].getDocObject().parentNode.removeChild(inps[i].getDocObject());
            }
        }
        inps = [];
    }

    me.showPanel = function() {
        if (!inpPanel) {
            inpPanel = new inpPanel(canvas);
        }
    };

    me.hidePanel = function() {
        if (inpPanel) {
            me.edit(null);
            inpPanel.close();
            inpPanel = null;
        }
    };


}
