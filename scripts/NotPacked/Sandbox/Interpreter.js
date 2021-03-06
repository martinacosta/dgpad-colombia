function Interpreter(_win, _canvas) {
    var me = this;
    var $macros = null;
    var $macroFinals = null;
    var $macromode = false;
    var $const_num_precision = 100000000000000;
    var $num_precision = $const_num_precision;
    var $caller = null; // Objet qui appelle le script par bouton
    var namespace = {};
    var blockly_namespace = {}; // Globales Blockly


    me.W = _win;
    me.$U = _win.$U;
    me.$L = _win.$L;
    me.Z = _canvas;
    me.C = me.Z.getConstruction();
    me.E = document.createEvent("MouseEvent");
    me.E.initMouseEvent("mousemove", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    me.BLK_GLOB_TAB = function() {
        var list = [];
        for (var elt in blockly_namespace) {
            list.push(elt);
        }
        return list
    };
    me.BLK_GLOB_RENAME = function(_old, _new) {
        if (_old === "") {
            blockly_namespace[_new] = 0;
        } else if (blockly_namespace.hasOwnProperty(_old)) {
            blockly_namespace[_new] = blockly_namespace[_old];
            delete blockly_namespace[_old];
        }
    };
    me.BLK_GLOB_SRC = function() {
        if (Object.keys(blockly_namespace).length === 0) return "";
        var txt = "\n\n// Blockly Globals :\n";
        txt += "BLK_GLOB_SET(" + JSON.stringify(blockly_namespace) + ");\n";
        return txt;
    };
    me.BLK_GLOB_DELETE = function() {
        blockly_namespace = {};
    };
	
	

    var BLK_GLOB_SET = function(_s) {
        blockly_namespace = _s;
    };

    var $progressBar = null;
    var $initProgress = function(_src) {
        if (_src) {
            var i = _src.indexOf("// Geometry :");
            if (i !== -1) {
                var mcrs = _src.substring(0, i);
                var geom = _src.substring(i);
                var stls = "";

                var j = geom.indexOf("// Styles :");
                if (j !== -1) {
                    stls = geom.substring(j);
                    geom = geom.substring(0, j);
                }
                var lines = geom.match(/\n/g).length;
                // Si la parte geometr??a del source contiene menos de 300 l??neas
                // no se recorta el source, se reenv??a:
                if (lines < 300)
                    return {
                        header: _src,
                        lines: [],
                        num: 0
                    };
                // se recorta la parte geometr??a por paquetes de 10 l??neas:
                lines = geom.replace(/(([^\n]*\n){10})/g, "$1@@@@@@").split("@@@@@@");
                // Se a??aden los estilos:
                lines.push(stls);
                $progressBar = new me.W.progressBar(me.Z);
                return {
                    header: mcrs,
                    lines: lines,
                    num: 0
                };
            }
        }
        return {
            header: _src,
            lines: [],
            num: 0
        };
    };


    me.setCaller = function(_o) {
        $caller = _o;
    };

    me.removeMouseEvents = function() {
        var cTag = me.Z.getDocObject();
        cTag.removeEventListener('mousemove', me.Z.mouseMoved, false);
        cTag.removeEventListener('mousedown', me.Z.mousePressed, false);
        cTag.removeEventListener('mouseup', me.Z.mouseReleased, false);
    }

    me.addMouseEvents = function() {
        var cTag = me.Z.getDocObject();
        cTag.addEventListener('mousemove', me.Z.mouseMoved, false);
        cTag.addEventListener('mousedown', me.Z.mousePressed, false);
        cTag.addEventListener('mouseup', me.Z.mouseReleased, false);
    }


    me.Interpret = function(_s) {
        clearNameSpace();
        var code = $initProgress(_s);
        $macros = null;
        $num_precision = $const_num_precision;
        // Eval is evil ? :
        try {
            eval(code.header);
            if ($progressBar) {
                me.removeMouseEvents();
                var interval = setInterval(function() {
                    if (code.num === code.lines.length) {
                        clearInterval(interval);
                        $progressBar.hide();
                        $progressBar = null;
                        clearNameSpace();
                        me.addMouseEvents();
                        me.Z.setMode(1);
                        me.C.validate(me.E);
                        me.C.computeAll();
                        me.C.clearIndicated();
                        me.C.clearSelected();
                        me.Z.paint(me.E);
                        return;
                    }
                    eval(code.lines[code.num]);
                    $progressBar.move(code.num / code.lines.length);
                    code.num = code.num + 1;
                }, 1);
            }
            // Recuperaci??n eventual de macros:
            if ($macros) {
                for (var i in $macros) {
                    if ($macros.hasOwnProperty(i)) {
                        me.Z.macrosManager.addTool($macros[i].name, $macros[i].parameters, $macros[i].exec);
                    }
                }
            }
        } catch (err) {
            alert(err.message);
        }
        if (!$progressBar) {
            me.C.validate(me.E);
            me.C.computeAll();
            me.Z.paint(me.E);
            clearNameSpace();

        }
    };


    me.LoadPlugins = function(_plugins) {
        clearNameSpace();
        $macros = null;
        $num_precision = $const_num_precision;
        // Eval is evil ? :
        try {
            eval(_plugins);
            // Recuperaci??n eventual de plugins:
            if ($macros) {
                for (var i in $macros) {
                    if ($macros.hasOwnProperty(i)) {
                        me.Z.macrosManager.addPlugin($macros[i].name, $macros[i].parameters, $macros[i].exec);
                    }
                }
            }
        } catch (err) {
            alert(err.message);
        }
        clearNameSpace();
    };

    me.InterpretMacro = function(_s) {
        // console.log("source :"+_s);
        clearNameSpace();
        $macromode = true;
        $macroFinals = [];
        $num_precision = $const_num_precision;
        try {
            // antes de la evaluaci??n, se hace una copia de todos los par??metros
            // eventuales de la funci??n/macro. Necesita una b??squeda
            // regexp de los par??metros y la ubicaci??n de las afectaciones
            // en el interior del bloque funci??n. Esto sirve ??nicamente
            // para el parsevariable (ver methode me.p)

            var match = _s.match(/(myexecutefunc=)function.*\((.*)\).*{([\s\S]*)/m);

            // var match = _s.match(/([\s\S]*)function.*\((.*)\).*{([\s\S]*)/m);
            var s = match[1] + "function(" + match[2] + "){";
            var params = match[2].replace(/\s*/g, "").split(",");
            for (var i = 0, len = params.length; i < len; i++) {
                if (params[i] !== "") {
                    s += "\n$locvar_" + params[i] + "=" + params[i] + ";";
                }
            }
            s += match[3];
            // Eval is evil ? :
            // console.log(s);
            eval(s);
            for (var i = 0, len = $macroFinals.length; i < len; i++) {
                me.f($macroFinals[i]).setHidden(false);
            }
        } catch (err) {
            alert(err.message);
        }
        //        me.C.setDeps();
        $macromode = false;
        $macroFinals = null;
        me.C.validate(me.E);
        me.C.computeAll();
        me.Z.paint(me.E);
        clearNameSpace();
    };


    // Encuentra y devuelve el objeto llamado _s :
    me.f = function(_s) {
        return me.C.find(_s);
    };
	// Encuentra y devuelve la variable llamada _s:
    me.fv = function(_s) {
        return me.C.findVar(_s);
    };


    me.construct = function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    };

    // Crea un nuevo ConstructionObject, y devuelve su nombre:
    me.o = function() {

        var myobj = me.W[arguments[0]];
        var args = [me.C];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        var o = me.construct(myobj, args);
        if ($macromode)
            o.setHidden(2);
        //        me.Z.addObject(o);
        me.C.add(o);
        return o.getName();
    };

    // Prueba si el n??mero de argumentos de una funci??n es inferior al esperado:
    me.t = function(expectedArgsNumber) {
        return (me.t.caller.arguments.length < expectedArgsNumber);
    };

    // Cambia los argumentos de una funci??n a??adiendo un nombre gen??rico:
    me.a = function(code) {
        // Funci??n que llama:
        var myFunc = me.a.caller;
        var args = myFunc.arguments;
        // A??ade un nombre gen??rico al comienzo de los argumentos:
        Array.prototype.unshift.call(args, "_" + code);
        // Llama la funci??n con el n??mero correcto de argumentos:
        return myFunc.apply(this, args);
    };

    // a??ade los argumentos pasados al final de los argumentos de una funci??n que llama:
    me.b = function() {
        // Funci??n que llama:
        var myFunc = me.b.caller;
        var args = myFunc.arguments;
        for (var i = 0, len = arguments.length; i < len; i++) {
            Array.prototype.push.call(args, arguments[i]);
        }
        // Llama la funci??n con el n??mero correcto de argumentos:
        return myFunc.apply(this, args);
    };

    // parseVariable :
    me.p = function(s) {
        if (s.charAt(0) === "_") {
            var n = s.substring(1);
            if (window[n] === undefined) {
                return window["$locvar_" + n];
            } else {
                return window[n];
            }
        }
        return s;
    };

    var isStr = function(_x) {
        return (typeof _x === "string");
    };

    var GetCanvas = function() {
        return me.Z;
    };

    var GetMouseCoordinates = function() {
        return me.Z.getMouseCoords();
    };


    // Blockly part :

    var ALERT = function(_msg) {
        me.$U.alert(_msg)
    };

    var GLOBAL_SET = function(_var, _val) {
        blockly_namespace[_var] = _val;
    };

    var GLOBAL_GET = function(_var, _val) {
        return blockly_namespace[_var];
    };

    var GLOBAL_INC = function(_var, _val) {
        var v = (_val === undefined) ? 1 : _val;
        blockly_namespace[_var] = Math.plus(blockly_namespace[_var], v);
    };

    var SET_EXP = function(_e, _m) {
        var o = me.f(_e);
        o.setExpression(JSON.stringify(_m).replace(/null/g, "NaN").replace(/"/g, ""));
        // compute all childs except turtle exps and turtle lists :
        var lst = o.getChildList();
        for (var i = 0; i < lst.length; i++) {
            var nme = lst[i].getVarName();
            if (nme.indexOf("blk_turtle_") === -1) {
                lst[i].compute();
            }
        }
    };



    var BLK_STL = function(_n, _cmd, _tab) {
        var o = me.f(_n);
        o[_cmd].apply(o, _tab);
    };

    // UNIQUEMENT POUR LA TORTUE :

    var TURTLE_VARS = {
        U: [1, 0, 0],
        V: [0, 1, 0],
        W: [0, 0, 1],
        LAST: null,
        D3: false,
        PENUP: false,
        TAB: [],
        NAME: null
    };

    var TURTLE_INIT = function(_name, _pt) {
        var t = TURTLE_VARS;
        t.U = [1, 0, 0];
        t.V = [0, 1, 0];
        t.W = [0, 0, 1];
        t.LAST = _pt;
        t.D3 = (_pt.length === 3);
        t.PENUP = false;
        t.TAB = [
            [10, 0, 0, 1], // Tama??o del l??piz
            [12, 0, 0, 1e-13], // Tama??o de los puntos
            [2, 0, 0, 55], // Color seleccionado
            _pt
        ];
        t.NAME = _name;
        me.Z.blocklyManager.resetTurtle(t.NAME);
    };

    var TURTLE_RESULT = function() {
        TURTLE_VARS.NAME = null;
        return TURTLE_VARS.TAB;
    };

    var TURTLE_POS = function() {
        return TURTLE_VARS.LAST
    };

    var TURTLE_GET = function(_n, _i) {
        // Si se trata de una autorreferencia:
        if (_n === TURTLE_VARS.NAME) {
            var t = TURTLE_VARS.TAB;
            var k = 0;
            for (var i = 0; i < t.length; i++) {
                if ((t[i].length < 4) && (!isNaN(t[i][0])) && (!isNaN(t[i][1]))) k++;
                if (k === _i) return t[i];
            }
        } else {
            var o = me.f("blk_turtle_list_" + _n);
            return o.getPtNum(_i);
        }
    };

    var TURTLE_LENGTH = function(_n, _i) {
        var o = me.f("blk_turtle_list_" + _n);
        return o.getPtLength();
    };

    var TURTLE_RESET = function() {
        var t = TURTLE_VARS;
        t.U = [1, 0, 0];
        t.V = [0, 1, 0];
        t.W = [0, 0, 1];
        me.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
    };

    var TURTLE_PRINT = function(_t) {
        var t = TURTLE_VARS;
        _t = "" + _t;
        _t = _t.replace(/([0-9]+\.[0-9]+)/g, function(_a, _m) {
            var num = parseFloat(_m);
            num = Math.round(num * $num_precision) / $num_precision;
            return me.$L.number(num)
        });
        t.TAB.push([20, 0, _t, t.U]);
        t.TAB.push(t.LAST);
    };

    var TURTLE_PRINT_IMG = function(_url, _w, _h, _z, _o) {
        var t = TURTLE_VARS;
        _url = "" + _url;
        t.TAB.push([30, _url, _w, _h, _z*me.$U.escala, _o, t.U]);
        t.TAB.push(t.LAST);
    };

    var TURTLE_TEXT = function(_s) {
        return _s;
    }

    var TURTLE_FONT = function(_f, _s, _stl, _al) {
		if (typeof escala === 'undefined') var escala = 1
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([21, 0, 0, [_f, _s*me.$U.escala, _stl, _al]]);
        t.TAB.push(last);
    };

    var TURTLE_MV = function(_val, _px) {
        var value = (_px) ? Math.quotient(_val, me.C.coordsSystem.getUnit()) : _val;
        var t = TURTLE_VARS;
        var dir = t.U.slice();
        if (!t.D3) dir.pop();
        t.LAST = Math.plus(t.LAST, Math.times(value, dir));
        if (t.PENUP) t.TAB.push([NaN, NaN, NaN]);
        t.TAB.push(t.LAST);
        me.Z.blocklyManager.changeTurtlePT(t.NAME, t.LAST);
    };

    var TURTLE_TURN = function(_angle) {
        var c = Math.cos(_angle);
        var s = Math.sin(_angle);
        var t = TURTLE_VARS;
        var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
        var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
        t.U = up;
        t.V = vp;
        me.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
    };

    var TURTLE_ROTATE = function(_angle, _istop) {
        var c = Math.cos(_angle);
        var s = Math.sin(_angle);
        var t = TURTLE_VARS;
        if (_istop) {
            var up = [c * t.U[0] + s * t.W[0], c * t.U[1] + s * t.W[1], c * t.U[2] + s * t.W[2]];
            var wp = [c * t.W[0] - s * t.U[0], c * t.W[1] - s * t.U[1], c * t.W[2] - s * t.U[2]];
            t.U = up;
            t.W = wp;
        } else {
            var vp = [c * t.V[0] + s * t.W[0], c * t.V[1] + s * t.W[1], c * t.V[2] + s * t.W[2]];
            var wp = [c * t.W[0] - s * t.V[0], c * t.W[1] - s * t.V[1], c * t.W[2] - s * t.V[2]];
            t.V = vp;
            t.W = wp;
        };
        me.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
    };

    var TURTLE_UP = function(_isup) {
        TURTLE_VARS.PENUP = _isup;
    };

    var TURTLE_COLOUR = function(_n) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([2, 0, 0, _n]);
        t.TAB.push(last);
    };

	var TURTLE_COLOUR_RGB = function(_n) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_n);
        if (result) {
            t.TAB.push([1, parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]);
        } else {
            t.TAB.push([1, 0, 0, 0]);
        }
        t.TAB.push(last);
    };

    var TURTLE_COLOUR_INCREMENT = function(_w) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([3, 0, 0, _w]);
        t.TAB.push(last);
    };

    var TURTLE_FILL = function(_op) {
        var t = TURTLE_VARS;
        t.TAB.push([4, 0, 0, _op]);
    };

    var TURTLE_WIDTH = function(_w) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([10, 0, 0, _w]);
        t.TAB.push(last);
    };

    var TURTLE_POINTS_WIDTH = function(_w) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([12, 0, 0, _w]);
        t.TAB.push(last);
    };

    var TURTLE_WIDTH_INCREMENT = function(_w) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([11, 0, 0, _w]);
        t.TAB.push(last);
    };

    var TURTLE_POINTS_WIDTH_INCREMENT = function(_w) {
        var t = TURTLE_VARS;
        var last = t.TAB.pop();
        t.TAB.push([13, 0, 0, _w]);
        t.TAB.push(last);
    };

    var TURTLE_ROTATE_PT = function(_pt) {
        var c, s;
        var t = TURTLE_VARS;
        var last = t.LAST.slice();
        var p = Math.minus(_pt, last); // translation
        if (t.D3) {
            // Cambio de coordenadas:
            var pp = [p[0] * t.U[0] + p[1] * t.U[1] + p[2] * t.U[2], p[0] * t.V[0] + p[1] * t.V[1] + p[2] * t.V[2], p[0] * t.W[0] + p[1] * t.W[1] + p[2] * t.W[2]];
            var d1 = Math.sqrt(pp[0] * pp[0] + pp[1] * pp[1]);
            var d3D = Math.sqrt(pp[0] * pp[0] + pp[1] * pp[1] + pp[2] * pp[2]);
            // if (d1 > 1e-13) {
            //     c = pp[0] / d1; // cosinus
            //     s = pp[1] / d1; // sinus
            //     var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
            //     var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
            //     t.U = up;
            //     t.V = vp;
            // }
            if ((d3D > 1e-13) && (d1 > 1e-13)) {
                c = pp[0] / d1; // cosinus
                s = pp[1] / d1; // sinus
                var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
                var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
                t.U = up;
                t.V = vp;
                c = d1 / d3D;
                s = pp[2] / d3D;
                up = [c * t.U[0] + s * t.W[0], c * t.U[1] + s * t.W[1], c * t.U[2] + s * t.W[2]];
                var wp = [c * t.W[0] - s * t.U[0], c * t.W[1] - s * t.U[1], c * t.W[2] - s * t.U[2]];
                t.U = up;
                t.W = wp;
            }
        } else {
            // Cambio de coordenadas:
            var pp = [p[0] * t.U[0] + p[1] * t.U[1], p[0] * t.V[0] + p[1] * t.V[1]];
            var d1 = Math.sqrt(pp[0] * pp[0] + pp[1] * pp[1]);
            if (d1 > 1e-13) {
                c = pp[0] / d1; // cosinus
                s = pp[1] / d1; // sinus
                var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
                var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
                t.U = up;
                t.V = vp;
            }
        };
        me.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
    };

    var TURTLE_JOIN_PT = function(_pt) {
        TURTLE_ROTATE_PT(_pt);
        TURTLE_MV(Math.distance(TURTLE_VARS.LAST, _pt), false);
    };

    var SET_NUM_PRECISION = function(_n) {
        $num_precision = Math.pow(10, _n);
    };
	
	var TURTLE_INPUT = function (name, width, ftsize, tar) {
		
		var coords= TURTLE_POS();
		
		var abs=me.C.coordsSystem.px(coords[0]);
		var ord=me.C.coordsSystem.py(coords[1]);
		
		var txts= me.Z.textManager.elements();
		var winps=me.Z.textManager.winps();
		var exist=false;
		var widg= null;
		for (var i = 0, len = txts.length; i < len; i++) {
			
			var txt=txts[i].getText();
			
			if(txt.indexOf(name)>-1) {
				
				exist=true;
				widg=txts[i];
				
				break;
			}
			
		}
		
		if (exist) {
			widg.setText("<input target="+tar+" id="+name+ " style='width:"+width+"px;font-size:"+ftsize+"px'>");
			widg.setStyle("left",me.C.coordsSystem.px(TURTLE_POS()[0])+"px");
			widg.setStyle("top",me.C.coordsSystem.py(TURTLE_POS()[1])-(ftsize)+"px");
			
			//falta un comando para que se ejecute el cambio de setText
			
			
			
		}
			else {widg=Text("<input target="+tar+" id="+name+" style='width:"+width+"px;font-size:"+ftsize+"px'>",abs,ord,0,0,"");
			widg.setStyle("left",me.C.coordsSystem.px(TURTLE_POS()[0])+"px");
			widg.setStyle("top",me.C.coordsSystem.py(TURTLE_POS()[1])-(ftsize)+"px");
			me.Z.textManager.winputs.push(name); 
			};
			
	};
	
	
	
	// var WidgetInput = function (_name, width, height) {
		// var name=_name;
		// var coords= [300,500];
		
		// var txts= me.Z.textManager.elements();
		// var winps=me.Z.textManager.winputs();
		
		// var exist=false;
		// var widg= null;
		// var p1=Find("P1");
		// for (var i = 0, len = txts.length; i < len; i++) {
			// var b = txts[i].getBounds();
            // var TOP=b.top;
			// var LEFT=b.left;
			
			// if(coords[0]==TOP&&coords[1]==LEFT) {
				
				// exist=true;
				// widg=txts[i];
				// console.log(widg);
				// break;
			// }
			
		// }
		
		// if (exist) {
			// widg.setText("<input style='width:'"+width+"px';heigth:'"+height+"px'>");
			
		// }
			// else {widg=Text("<input style='width:'"+width+"px';heigth:'"+height+"px'>",500,300,10,10,"");
			// widg.setStyle("left",p1.getX()+"px");
			// widg.setStyle("top",p1.getY()+"px");
			// };
			
	// };
				
var EnsayoInput = function () {
		new InputText2(canvas.getConstruction(), "inp", canvas.getDocObject());
}
	
	var CreateCustomInput = function(name, fs, width, v, target) {
		var disp=v.replaceAll("(","").replaceAll(")","");
		var tar=target.replaceAll("(","").replaceAll(")","");
		var Zo = GetCanvas().getDocObject();
		var inputs = GetCanvas()['TURTLE_INPUTS'];
		
		if (!inputs) {
			GetCanvas()['TURTLE_INPUTS'] = {};
			inputs = GetCanvas()['TURTLE_INPUTS'];
		}
		input = inputs[name];
		if (!input) {
			console.log(disp+"disp");
			input = document.createElement('input');
			inputs[name] = input;
			if (GetExpressionValue(disp)==1) {
			input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: block; ";
			Zo.parentNode.appendChild(input);
			}
			else {
			console.log(disp+"disp2");	
			input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: none; ";
			Zo.parentNode.appendChild(input);
			}
			
		}
		else {
			if (GetExpressionValue(disp)==1){
				console.log(disp+"disp3");
			input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: block; "
			}
			else {
				
				input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: none; "
				
			}
			
			};
		Find(disp)
		input.onkeyup=function() {
			
			
			SetExpressionValue(tar,parseFloat(input.value));
			computeAll();
		};
        	
		
	};
	
	var CreateCustomInputNumber = function(name, min, max, step, fs, width, v, target) {
		disp=v.replaceAll("(","").replaceAll(")","");
		var Zo = GetCanvas().getDocObject();
		var inputs = GetCanvas()['TURTLE_INPUTS'];
		
		if (!inputs) {
			GetCanvas()['TURTLE_INPUTS'] = {};
			inputs = GetCanvas()['TURTLE_INPUTS'];
		}
		input = inputs[name];
		if (!input) {
			input = document.createElement('input');
			inputs[name] = input;
			input.type="number";
			input.min=min;
			input.max=max;
			input.step=step;
			if (GetExpressionValue(disp)==1) {
				input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: block; ";
				Zo.parentNode.appendChild(input);
			}
			else {
				input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: none; ";
				Zo.parentNode.appendChild(input);
			};

		}
		else {input.type="number";
			input.min=min;
			input.max=max;
			input.step=step;
			if (GetExpressionValue(disp)==1) {
				input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: block; "
				}
				
			else {
				input.style = "position:absolute; top:" + me.C.coordsSystem.py(TURTLE_POS()[1]) + "px; left:" + me.C.coordsSystem.px(TURTLE_POS()[0]) + "px; width: "+width+"px; font-size:"+fs+"px; display: none; "
				};
			
		
		input.onchange=function() {
			var e=target.replaceAll("(","").replaceAll(")","");
			console.log(e+"="+input.value);
			SetExpressionValue(e,parseFloat(input.value));
			computeAll();
		};
		}
        	
		
	}


    var SetDocEvalExpression = function(_n) {
        me.C.setDocEvalExpression(_n);
    }

    // M??todo obsoleto, mantenido para la compatibilidad de las figuras 3D
	// anteriores al 22 de noviembre de 2013:
    var Set3DConstruction = function(_b) {
        return me.C.set3DMode(_b);
    };

    var Set3D = function(_b) {
        me.C.set3D(_b);
    };

    var Text = function(_m, _l, _t, _w, _h, _stl) {
        me.Z.addText(_m, _l, _t, _w, _h, _stl);
    };

    var Input = function(_q, _i) {
        if (!_i)
            _i = "";
        return prompt(_q, _i);
    };

    var Print = function(_m) {
        if ($caller)
            $caller.print(JSON.stringify(_m));
        return null;
    };

    var Println = function(_m) {
        if ($caller)
            $caller.print(JSON.stringify(_m) + "\n");
        return null;
    };

    var GetExpressionValue = function(_e, _x, _y, _z, _t) {
        var o = me.f(_e);
        return (o ? JSON.parse(me.$U.parseArrayEnglish(o.getValue(_x, _y, _z, _t))) : NaN);
    };

    var SetExpressionValue = function(_e, _m) {
        var o = me.f(_e);
        o.setExp(JSON.stringify(_m).replace(/null/g, "NaN"));
    };

    var Find = function(_n) {
        var o = me.f(_n);
        return (o ? o : parent.document.getElementById(_n));
    };

    // MEAG start
    var InteractiveInput = function(_s,_f) {
      me.C.obtInteractivo = null;
      var v = me.C.elements();
      me.C.setMode(5);
      for (var i = 0, len = v.length; i < len; i++) {
        if (v[i].isInstanceType(_s) || _s === "") {
          v[i].setMacroMode(7);
        }
      }
      var killWait = setInterval(function() {
        if (me.C.obtInteractivo !== null) {
          clearInterval(killWait);
          _f(me.C.obtInteractivo);
          me.C.setMode(1);
          me.C.computeAll();
          me.Z.paint();
        }
      },100);
    }

    var getNameobjSelected = function() {
      return me.C.obtInteractivo;
    }

    var computeAll = function() {
      me.C.computeAll();
      me.Z.paint();
    }

    var widthWindow = function() {
      return me.C.coordsSystem.wWindow();
    }

    var heightWindow = function() {
      return me.C.coordsSystem.hWindow();
    }

    var windowcx = function() {
        return me.C.coordsSystem.x(me.C.getWidth() / 2);
    };

    var windowcy = function() {
        return me.C.coordsSystem.y(me.C.getHeight() / 2);
    };

    var windoww = function() {
        return me.C.coordsSystem.l(me.C.getWidth());
    };
    var windowh = function() {
        return me.C.coordsSystem.l(me.C.getHeight());
    };
//Restricciones
    var enableZoom = function(_b) { //funci??n para activar/desactivar el zoom
      me.Z.enableZoom(_b);
    }
	//Equivalente al interactiveInput de carmetal. Permite solicitar al usuario que seleccione un objeto determinado
	var selectObject = function(type, msg, callback) {
        alert(msg);
        InteractiveInput(type, callback);
    };

    //El par??metro de esta funci??n es una lista entre []; los valores en el array deben ser: "segment", "line", "ray", "midpoint", "symc", "perpbis", "anglebiss", "vector", "circle", "circle1", "circle3", "circle3pts", "arc3pts", "area", "angle", "fixedangle", "point", "parallel", "plumb", "syma", "midpoint", "perpbis", "locus", "@namemover", "@callproperty", "@calltrash", "@objectmover", "@anchor", "@noanchor", "@callcalc", "@blockly", "@pushpin", "@magnet", "@spring",
    var disabledTools = function(_a) {
      me.Z.disabledTools(_a);
    }
	
	var disableOneTool = function (tool) {
		pos = me.Z.gethideTools().indexOf(tool);
		disTools=me.Z.gethideTools()
		if (pos==-1) {
			disTools.push(tool);
			me.Z.disabledTools(disTools);
		}
	}
		
	var enableTool = function (tool){
		pos= me.Z.gethideTools().indexOf(tool);
		disTools=me.Z.gethideTools()
		if (pos>-1) {
			disTools.splice(pos, 1);
			me.Z.disabledTools(disTools);
		}
	}
	
	// funciones para desactivar/activar los botones de la barra de herramientas (ctrlPanel)
	// dependen de funciones en Canvas y ControlPanel
	// los par??metros de estas funciones son los nombres de los botones: arrow, hide,trash, macros, calc, tex, properties, history,
	// copy, name, grid, zoom, OtherTools, redo, undo...escribirlos entre comillas
	var disableButton = function(name){
		me.Z.disableButton(name);
	};
	
	var enableButton = function(name){
		me.Z.enableButton(name);
	};
	//mostrar/ocultar la barra de herramientas
	var showCtrlPanel = function (bool) {
		me.Z.ctrl_show2(bool);
	};
	//cambiar modo construir/mover
	var setMode = function(bool) {
		GetCanvas().setMode(bool);
	};
	
	var systemFont = function (val) {
		me.C.coordsSystem.setFontSize(val);
	};
	
	var axisWidth = function(val){
		me.C.coordsSystem.setAxisWidth(val);
	};
	
	var gridWidth = function (val){
		me.C.coordsSystem.setGridWidth(val);
	};
	
	var showGrid = function (bool) {
		me.C.coordsSystem.showGrid(bool);
	};
	
	var showOx = function (bool) {
		me.C.coordsSystem.showOx(bool);
	};
	
	var showOy = function (bool) {
		me.C.coordsSystem.showOy(bool);
	};
	
	var fixOx = function(bool){
		
		me.C.coordsSystem.setlockOx(bool);
	};
	
	var fixOy = function(bool){
		me.C.coordsSystem.setlockOy(bool);
	};
	
	var onlyPositive = function(bool){
		me.C.coordsSystem.setOnlyPos(bool);
	};
	
	var fixOxOy= function(bool){
		me.C.coordsSystem.setlockOx(bool);
		me.C.coordsSystem.setlockOy(bool);
	}
		
	var centerZoom=function(bool){
		me.C.coordsSystem.setCenterZoom(bool);
	};
	
	var deleteTrack=function(){
		me.C.zoom(0,0,2);
		me.C.zoom(0,0,1/2);
	}
		
    var AnimationObject = function(_o, _v, _d, _ar) {
        // _o es el objeto
        // _d es la direccion
        // _ar no se que es pero debe ser de tipo booleano
        me.C.addAnimation(_o, _v, _d, _ar);
        me.C.showAnimations(false)
        var el = me.C.getCtrlAnimation();
        el.stl("display","none");
    }

    var AnimationStop = function() {
    }

    var AnimationPause = function() {
        me.C.showAnimations(false)
    }

    var AnimationStart = function() {
        me.C.showAnimations(true)
    }

    // var getNameobjSelected = function() {
      // return me.C.obtInteractivo;
    // }

    // familias point, expression, line, circle, circle3pts3D, angle, area, fixedangle, list, locus, quadric
    var Anchor = function(_O, _P) {

      var o = me.f(_O);
      if (o.getFamilyCode() === "point" || o.getFamilyCode() === "expression") {
        if (typeof _P === "number" && _P === 0) {
          if (o.getParentLength() !== 0) {
            o.deleteAlpha();
			o.selectCreatePoint = function(zc, ev) {};
          }
        } else if (typeof _P === "string") {
          var xP = 0;
          var yP = 0;
          var p = me.f(_P);
          var code = p.getFamilyCode();
          var timer = null;
          var anclaje = function(o, p, xP, yP) {
            var newPt =  me.f(me.o("PointObject", "_P", xP, yP));
            newPt.addParent(p);
            p.project(newPt);
            p.setAlpha(newPt);
            p.setBoundaryMode(newPt);
            newPt.compute();
            var Alpha = newPt.getAlpha();
            o.attachTo(newPt);
            o.setAlpha(Alpha);
          };
          //
          if (code === "point") {
            o.attachTo(p);
            return;
          } else if (code === "line") {
            // probado con vector, segmento, linea, rayo,
            clearTimeout(timer);
            xP = (p.getP1().getX() + p.getP2().getX()) / 2;
            yP = (p.getP1().getY() + p.getP2().getY()) / 2;
          } else if (code === "circle") {
            //
          } else if (code === "circle3pts3D") {
            //
          } else if (code === "angle") {
            //
          } else if (code === "area") {
            //
          } else if (code === "fixedangle") {
            //
          }
          timer = setTimeout(anclaje(o, p, xP, yP), 20);
		  
        }
		o.computeChilds();
      }
    }
    // MEAG end
	
	var Unanchor = function (_O){
		var o = me.f(_O);
		o.deleteAlpha();};
		
	// var iman=function(punto1,punto2,exp) {
		// punto1 es el punto a imantar
		// punto2 es el objeto que atrae
		// exp es la fuerza de imantaci??n
		// p1=Find(punto1);
		// obj=Find(punto2);
		// p1.addMagnet(obj,exp);
	// }
	
	var imantar = function(_punto, _objeto, num) {
		punto=Find(_punto);
		objeto=Find(_objeto);
		if (punto.getMagnet(objeto)==undefined){punto.addMagnet(objeto,num)}
		else {var fuerza = punto.getMagnet(objeto); 
		fuerza[1] = num;}
	}

	
	var FixPointToPoint = function (_p1, _p2) {
		//_p1 es el punto que se fijar??
		//_p2 es la posici??n (punto) en el que se fijar?? _p1
		p1=Find(_p1);
		p2=Find(_p2);
		p1.setEXY("[x("+p2.getName()+"),y("+p2.getName()+")]");
		p1.compute();
		getCanvas().paint();
	}
	
	var FixPoint = function (_p1) {
		
		p1=Find(_p1);
		x=p1.getx();
		y=p1.gety();
		p1.setEXY("["+x+","+y+"]");
		p1.compute();
		getCanvas().paint();
	}
	
	var FreePoint = function (_p1) {
		p1=Find(_p1);
		x=p1.getX();
		y=p1.getY();
		p1.setEXY();
		p1.setXY(x+2,y+2);
	}
	
	

    var RefreshInputs = function() {
        me.Z.textManager.refreshInputs();
    };

    var Timer = function(_dlay) {
        return new me.$U.timers(_dlay)
    };

    var Coords = function(_n) {
        var o = me.f(_n);
        if (o.is3D()) {
            me.C.setcompute3D_filter(o.coords3D);
            me.C.computeAll();
            me.C.clearcompute3D_filter();
            return o.getOldcoords();
        } else {
            return o.coords2D();
        };
    };

    var Coordinate = function(_n, _i) {
        var o = me.f(_n);
        var coord;
        if (o.is3D()) {
            me.C.setcompute3D_filter(o.coords3D);
            me.C.computeAll();
            me.C.clearcompute3D_filter();
            coord = o.getOldcoords()[_i];
        } else {
            coord = o.coords2D()[_i];
        };
        return Math.round(coord * 1e13) / 1e13;
    };
	
	var setFontSize = function (_o, _n) {
		var o = me.f(_o);
		o.setFontSize(_n);
	}
	
	var Point = function(_n, _x, _y) {
        if (me.t(3))
            return me.a("P");
        if (isStr(_x))?? {
            var o = me.f(me.o("PointObject", _n, 0, 0));
            o.setEXY(_x);
            return o.getName();
        }
        var px = me.C.coordsSystem.px(_x);
        var py = me.C.coordsSystem.py(_y);
        return me.o("PointObject", _n, px, py);
    };

    var PointOn = function(_n, _a, _alpha) {
        if (me.t(3))
            return me.a("P");
        var on = me.f(_a);
        var o = me.f(me.o("PointObject", _n, 0, 0));
        o.addParent(on);
        o.setAlpha(_alpha);
        on.projectAlpha(o);
        o.setFillStyle();
        return o.getName();
    };

    // Attention danger ! je viens de supprimer ces deux
    // m??thode en esp??rant qu'elles n'ont jamais ??t?? utilis??es.
    // Le nom interf??rait avec le scope et appeler des objets
    // X ou Y pouvait provoquer des bloquages...

    //    var X = function(_P) {
    //        return me.C.coordsSystem.x(me.f(_P).getX());
    //    };
    //
    //    var Y = function(_P) {
    //        return me.C.coordsSystem.y(me.f(_P).getY());
    //    };

    var Move = function(_P, _x, _y) {
        var o = me.f(_P);
        if (isStr(_x))?? {
            o.setEXY(_x);
            //MEAG start
            setTimeout(function() {
                me.C.computeAll();
                me.Z.paint();
            }, 5)
			Find(_P).computeDrag();
            //MEAG end
            return;
        };
        o.setXY(me.C.coordsSystem.px(_x), me.C.coordsSystem.py(_y));
        setTimeout(function() {
            me.C.compute();
            me.Z.paint();
			
			
        }, 1);
		// Find(_P).computeDrag();
		// me.Z.textManager.evaluateStrings(); este comando actualiza los widgets
    };

    // var InteractiveInput = function(_m, _type) {
    //     throw {
    //         name: "System Error",
    //         level: "Show Stopper",
    //         message: "Error detected. Please contact the system administrator.",
    //         htmlMessage: "Error detected. Please contact the <a href=\"mailto:sysadmin@acme-widgets.com\">system administrator</a>.",
    //         toString: function() {
    //             return this.name + ": " + this.message;
    //         }
    //     };
    // };

	// var FixPoint = function(_p, _t) {
		// _p.setEXY("[x("+_t+"),y("+_t+")]")
	// };


    var OrderedIntersection = function(_n, _a, _b, _order, _away) {
        if (me.t(2))
            return me.a("P");
        if (me.t(3))
            return me.b(0);
        if (me.t(4))
            return me.a("P");
        var c1 = me.f(_a);
        var c2 = me.f(_b);
        var o = me.f(me.o("PointObject", _n, 0, 0));
        o.addParent(c1);
        o.addParent(c2);
        o.setOrder(_order);
        if (_away !== undefined)
            o.setAway(me.f(_away));
        o.setFillStyle();
        return o.getName();
    };

    var SetCoords = function(_x0, _y0, _u, _md3D, _ww, _wh) {
        me.C.coordsSystem.setCoords(_x0, _y0, _u, _md3D, _ww, _wh);
    };
	
	//para definir el sistema de coordenadas a partir de los valores min y max en los ejes
	var SetSystem = function (min_abs,max_abs,max_ord) {
	//min_abs es el minimo valor de las abscisas, max_abs es el m??ximo valor de las abscisas, max_ord es el m??ximo valor en las ordenadas	
		u=widthWindow()/Math.abs((max_abs-min_abs));
		
		x0=widthWindow()-(max_abs*u);
		y0=max_ord*u;
		me.C.coordsSystem.setCoords(x0, y0, u, false,widthWindow(), heightWindow());
	}
		

    var Circle = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("CircleObject", _n, A, B);
    };

    var Circle1 = function(_n, _a, _r) {
        if (me.t(3))
            return me.a("C");
        var A = me.f(_a);
        if (isStr(_r)) {
            var o = me.f(me.o("Circle1Object", _n, A, 0));
            o.setRX(_r);
            return o.getName();
        }
        var r = me.C.coordsSystem.lx(_r);
        return me.o("Circle1Object", _n, A, r);
    };

    var FixedAngle = function(_n, _a, _b, _ex, _trig) {
        if (me.t(5))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var o = me.f(me.o("FixedAngleObject", _n, A, B, _trig));
        o.setExp(_ex);
        return o.getName();
    };

    var Circle3 = function(_n, _a, _b, _m) {
        if (me.t(4))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var M = me.f(_m);
        return me.o("Circle3Object", _n, A, B, M);
    };

    var Circle3pts = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var C = me.f(_c);
        return me.o("Circle3ptsObject", _n, A, B, C);
    };

    var Circle3pts3D = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var C = me.f(_c);
        return me.o("Circle3ptsObject_3D", _n, A, B, C);
    };

    var Center = function(_n, _c) {
        if (me.t(2))
            return me.a("P");
        var C = me.f(_c);
        C.getP1().setName(_n);
        if ($macromode)
            C.getP1().setHidden(1);
        return C.getP1().getName();
    };
	
	var Center1 = function (_c) {
		var C = me.f(_c);
		return C.getP1().getName();
	}
		

    var Arc3pts = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var C = me.f(_c);
        return me.o("Arc3ptsObject", _n, A, B, C);
    };

    var Quadric = function(_n, _a, _b, _c, _d, _e) {
        if (me.t(6))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var C = me.f(_c);
        var D = me.f(_d);
        var E = me.f(_e);
        return me.o("QuadricObject", _n, A, B, C, D, E);
    };

    var Angle = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("C");
        var A = me.f(_a);
        var B = me.f(_b);
        var C = me.f(_c);
        return me.o("AngleObject", _n, A, B, C);
    };

    //    var Angle180 = function (_a, _o, _c) {
    //
    //
    //    };
    //
    //    var Angle360 = function (_a, _o, _c) {
    //        console.log("Angle360");
    //        var A = me.f(_a);
    //        var O = me.f(_o);
    //        var C = me.f(_c);
    //        var xOA = A.getX() - O.getX(), yOA = A.getY() - O.getY();
    //        var xOC = C.getX() - O.getX(), yOC = C.getY() - O.getY();
    //        var start = Math.angleH(xOA, yOA);
    //        var end = Math.angleH(xOC, yOC);
    //        return (end - start)
    //    };



    var X_axis = function(_n) {
        var n = me.o("OXObject", _n);
        me.C.coordsSystem.setOX(me.C.find(n));
        return n;
    };

    var Y_axis = function(_n) {
        var n = me.o("OYObject", _n);
        me.C.coordsSystem.setOY(me.C.find(n));
        return n;
    };

    var Line = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("L");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("TwoPointsLineObject", _n, A, B);
    };

    var Ray = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("R");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("RayObject", _n, A, B);
    };

    var Segment = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("S");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("SegmentObject", _n, A, B);
    };

    var Vector = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("V");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("VectorObject", _n, A, B);
    };

    var First = function(_n, _s) {
        if (me.t(2))
            return me.a("P");
        var S = me.f(_s);
        return S.getP1().getName();
    };

    var Second = function(_n, _s) {
        if (me.t(2))
            return me.a("P");
        var S = me.f(_s);
        return S.getP2().getName();
    };

    var DefinitionPoint = function(_n, _s, _i) {
        if (me.t(3))
            return me.a("P");
        var S = me.f(_s);
        return S.getPt(_i).getName();
    };

    var Parallel = function(_n, _l, _p) {
        if (me.t(3))
            return me.a("Par");
        var L = me.f(_l);
        var P = me.f(_p);
        return me.o("ParallelLineObject", _n, L, P);
    };

    var Perpendicular = function(_n, _l, _p) {
        if (me.t(3))
            return me.a("Perp");
        var L = me.f(_l);
        var P = me.f(_p);
        return me.o("PlumbObject", _n, L, P);
    };

    var MidPoint = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("M");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("MidPointObject", _n, A, B);
    };

    var Symmetry = function(_n, _a, _ob) {
        if (me.t(3))
            return me.a("M");
        var A = me.f(_a);
        // var B = me.f(_b);
		var Ob = me.f(_ob);
		if (Ob.getCode()=="arc3pts")
			return me.o("SymcArcObject",_n,A,Ob);
		else if (Ob.isInstanceType("circle"))
			return me.o("SymcCircleObject",_n,A,Ob);
		else if (Ob.getCode()=="vector")
			return me.o("SymcVectorObject",_n,A,Ob);
		else if (Ob.isInstanceType("segment"))
			return me.o("SymcSegmentObject",_n,A,Ob);
		else if (Ob.isInstanceType("ray"))
			return me.o("SymcRayObject",_n,A,Ob);
		else if (Ob.isInstanceType("point"))
			return me.o("SymcPointObject",_n,A,Ob);
		else if (Ob.isInstanceType("line"))
			return me.o("SymcLineObject",_n,A,Ob);
		else if (Ob.isInstanceType("area"))
			return me.o("SymcAreaObject", _n, A, Ob);
        return me.o("SymcObject", _n, A, Ob);
    };

    var Reflection = function(_n, _l, _ob) {
		if (me.t(3))
            return me.a("M");
        var L = me.f(_l);
        var Ob = me.f(_ob);
		if (Ob.getCode()=="arc3pts")
			return me.o("SymaArcObject",_n,L,Ob);
		else if (Ob.isInstanceType("circle"))
			return me.o("SymaCircleObject",_n,L,Ob);
		else if (Ob.getCode()=="vector")
			return me.o("SymaVectorObject",_n,L,Ob);
		else if (Ob.isInstanceType("segment"))
			return me.o("SymaSegmentObject",_n,L,Ob);
		else if (Ob.isInstanceType("ray"))
			return me.o("SymaRayObject",_n,L,Ob);
		else if (Ob.isInstanceType("point"))
			return me.o("SymaPointObject",_n,L,Ob);
		else if (Ob.isInstanceType("line"))
			return me.o("SymaLineObject",_n,L,Ob);
		else if (Ob.isInstanceType("area"))
			return me.o("SymaAreaObject", _n, L, Ob);
    };

    var PerpendicularBisector = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("L");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("PerpBisectorObject", _n, A, B);
    };

    var AngleBisector = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("L");
        var A = me.f(_a);
        var B = me.f(_b);
        var C = me.f(_c);
        return me.o("AngleBisectorObject", _n, A, B, C);
    };

    var Polygon = function(_n, _pts) {
        if (me.t(2))
            return me.a("A");
        //        console.log(_pts);
        var pts = _pts.split(",");
        for (var i = 0; i < pts.length; i++) {
            //            console.log((me.p(pts[i])));
            pts[i] = me.f(me.p(pts[i]));
        }
        pts.push(pts[0]);
        return me.o("AreaObject", _n, pts);
    };

    var Locus = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("Locus");
        var A = me.f(_a);
        var B = me.f(_b);
        return me.o("LocusObject", _n, A, B);
    };

    var Curvus = function(_n, _a, _b, _t) {
        if (me.t(4))
            return me.a("f");
        return me.o("CurvusObject", _n, _a, _b, _t);
    };

    var CartesianFunction = function(_n, _a, _b, _t) {
        if (me.t(4))
            return me.a("f");
        return me.o("CurvusObject", _n, _a, _b, _t);
    };

    var ParametricFunction = function(_n, _a, _b, _t1, _t2) {
        if (me.t(5))
            return me.a("f");
        return me.o("CurvusObject", _n, _a, _b, _t1, _t2);
    };

    var BlocklyButton = function(_n, _m, _x, _y) {
        if (me.t(4))
            return me.a("blk_btn");
        var px = me.C.coordsSystem.px(_x);
        var py = me.C.coordsSystem.py(_y);
        return me.o("BlocklyButtonObject", _n, _m, px, py);
    };

    var Expression = function(_n, _t, _min, _max, _e, _x, _y) {
        if (me.t(5))
            return me.a("E");
        var px = me.C.coordsSystem.px(_x);
        var py = me.C.coordsSystem.py(_y);
        return me.o("ExpressionObject", _n, _t, _min, _max, _e, px, py);
    };

    //JDIAZ 04/11
    var Translation = function(_n, _a, _b) {
        if (me.t(3))
            return me.a("Trans");
        var v = me.f(_a);
        var Ob = me.f(_b);
		if (Ob.getCode()=="arc3pts")
			return me.o("TransArcObject",_n,v,Ob);
		else if (Ob.isInstanceType("circle"))
			return me.o("TransCircleObject",_n,v,Ob);
		else if (Ob.getCode()=="vector")
			return me.o("TransVectorObject",_n,v,Ob);
		else if (Ob.isInstanceType("segment"))
			return me.o("TransSegmentObject",_n,v,Ob);
		else if (Ob.isInstanceType("ray"))
			return me.o("TransRayObject",_n,v,Ob);
		else if (Ob.isInstanceType("point"))
			return me.o("TransPointObject",_n,v,Ob);
		else if (Ob.isInstanceType("line"))
			return me.o("TransLineObject",_n,v,Ob);
		else if (Ob.isInstanceType("area"))
			return me.o("TransAreaObject", _n, v, Ob);
        // return me.o("TranslationObject", _n, A, B);
    };

    var Rotation = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("Rotation");
        var A = me.f(_a);
        var Ob = me.f(_b);
        var C = me.f(_c);
		if (Ob.getCode()=="arc3pts")
			return me.o("RotationArcObject",_n,A, Ob, C);
		else if (Ob.isInstanceType("circle"))
			return me.o("RotationCircleObject",_n, A, Ob, C);
		else if (Ob.getCode()=="vector")
			return me.o("RotationVectorObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("segment"))
			return me.o("RotationSegmentObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("ray"))
			return me.o("RotationRayObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("point"))
			return me.o("RotationPointObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("line"))
			return me.o("RotationLineObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("area"))
			return me.o("RotationAreaObject", _n, A, Ob, C);
        return me.o("RotationObject", _n, A, Ob, C);
    };
    
    var Homothety = function(_n, _a, _b, _c) {
        if (me.t(4))
            return me.a("Homothety");
        var A = me.f(_a);
        var Ob = me.f(_b);
        var C = me.f(_c);
		if (Ob.getCode()=="arc3pts")
			return me.o("HomoArcObject",_n,A, Ob, C);
		else if (Ob.isInstanceType("circle"))
			return me.o("HomoCircleObject",_n, A, Ob, C);
		else if (Ob.getCode()=="vector")
			return me.o("HomoVectorObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("segment"))
			return me.o("HomoSegmentObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("ray"))
			return me.o("HomoRayObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("point"))
			return me.o("HomoPointObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("line"))
			return me.o("HomoLineObject",_n, A, Ob, C);
		else if (Ob.isInstanceType("area"))
			return me.o("HomoAreaObject", _n, A, Ob, C);
        return me.o("HomoObject", _n, A, Ob, C);
    };

    var _near = true;
    var Intersect = function(_n, _o1, _o2) {
        if (me.t(3))
            return me.a("Intersect");
        var o1 = me.f(_o1);
        var o2 = me.f(_o2);
        
        if (o1.isInstanceType("line") && o2.isInstanceType("line"))
            return me.o("LineIntersectionObject", _n, o1, o2);
        else {
            _near = !_near;
            return me.o("IntersectionObject", _n, o1, o2, _near);
        }
        
    }
    //JDIAZ end
    
    var ExpressionOn = function(_n, _t, _min, _max, _e, _a, _alpha) {
        if (me.t(5))
            return me.a("E");
        var on = me.f(_a);
        var ex = me.f(me.o("ExpressionObject", _n, _t, _min, _max, _e, 0, 0));
        ex.attachTo(on);
        ex.setAlpha(_alpha);
        on.projectAlpha(ex);
        return ex.getName();
    };

    var List = function(_n, _exp) {
        if (me.t(2))
            return me.a("List");
        var _E = me.f(_exp);
        return me.o("ListObject", _n, _E);
    };

    var parseBoolean = function(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }

    var BLK = function(_n, _s) {
        var o = me.f(_n);
        // console.log(_s);
        o.blocks.setSource(_s);
    }
	
	
	
    var STL = function(_n, _s) {
        
		var o = me.f(_n);
        _s = _s.split(";");
        for (var i = 0, len = _s.length; i < len; i++) {
            var e = _s[i].split(":");
            e[1] = me.p(e[1]);
            switch (e[0]) {
					
					
                case "c": // Color
                    o.setColor(e[1]);
                    break;
                case "h": // Hidden
                    o.setHidden(e[1]);
                    break;
                case "o": // Opacity
                    o.setOpacity(parseFloat(e[1]));
                    break;
                case "s": // Size
                    o.setSize(parseFloat(e[1]*me.$U.escala));
                    break;
                case "sn": // Show name
                    o.setShowName(e[1]);
                    break;
                case "f": // Font size
                    o.setFontSize(Math.round(parseInt(e[1]*me.$U.escala)));
                    break;
                case "l": // Layer
                    o.setLayer(Math.round(parseInt(e[1])));
                    break;
                case "p": // Precisi??n num??rica
				o.setPrecision(e[1]);
                    break;
                case "sp": // Forma de los puntos
                    o.setShape(parseInt(e[1]));
                    break;
                case "i": // Incremento
                    o.setIncrement(parseFloat(e[1]));
                    break;
                case "sb": // Sobre el borde de un pol??gono
                    o.setOnBoundary(e[1]);
                    break;
                case "dh": // Punteado
                    o.setDash(parseBoolean(e[1]));
                    break;
                case "nmi": // No Mouse Inside (Inerte)
                    o.setNoMouseInside(parseBoolean(e[1]));
                    break;
                case "np": // Posici??n del nombre de los objetos
                    o.setNamePosition(e[1]);
                    break;
                case "am": // Angle mode : 360?? or not
                    o.set360(parseBoolean(e[1]));
                    break;
                case "tk": // Traza del objeto
                    if (e[1]) {
                        setTimeout(function() {
                            me.Z.trackManager.add(o, true);
                        }, 1);
                    }
                    break;
                case "fl": // Objeto flotante
                    if (e[1]) {
                        o.setFloat(true);
                        o.free = function() {
                            return false;
                        }
                    }
                    break;
                case "cPT": // Punto de un cursor expresi??n
                    var stls = me.$U.base64_decode(e[1]);
                    STL(o.getcPTName(), stls);
                    break;
                case "cL": // longitud de un cursor expresi??n
                    o.setCursorLength(parseInt(e[1])*me.$U.escala);
                    break;
                case "sg": // With segments (for list objects)
                    o.setSegmentsSize(e[1]);
                    break;
                case "mg": // Magnetismo de los objetos
                    var t = eval("[" + e[1] + "]");
                    for (var k = 0; k < t.length; k++) {
                        t[k][0] = me.C.find(t[k][0]);
                    };
                    o.setMagnets(t);
                    break;
                case "an": // Animaciones
                    var t = eval("[" + e[1] + "]");
                    me.C.addAnimation(o, t[0][0], t[0][1], t[0][2]);
                    break;
                case "ar": // Flechas para las listas
                    o.setArrow(JSON.parse(e[1]));
                    break;
                case "arc": // Radio de arco para los ??ngulos 
                    o.setArcRay(JSON.parse(e[1]));
                    break;
                case "dp": // Dependencia de los objetos
                    var t = e[1].substring(1, e[1].length - 1).split(",");
                    for (var k = 0; k < t.length; k++) {
                        try {
                            t[k] = eval(t[k]);
                            t[k] = me.C.find(t[k]);
                        } catch (e) {
                            try {
                                t[k] = eval("$locvar_" + t[k]);
                                t[k] = me.C.find(t[k]);
                            } catch (e) {
                                console.log("Polygon dependance error !")
                            }
                        }
                    }
                    o.setDragPoints(t);
                    break;
            }
        }
    };


    var SetGeneralStyle = function(_s) {
        _s = _s.split(";");
        for (var i = 0, len = _s.length; i < len; i++) {
            var e = _s[i].split(":");
            switch (e[0]) {
                case "background-color":
                    me.Z.setBackground(e[1]);
                    break;
                case "degree":
                    me.C.setDEG(e[1] === "true");
                    break;
                case "dragmoveable":
                    me.C.setDragOnlyMoveable(e[1] === "true");
                    break;
            }
        }
    };


    var SetCoordsStyle = function(_s) {
        _s = _s.split(";");
        var cs = me.C.coordsSystem;
        for (var i = 0, len = _s.length; i < len; i++) {
            var e = _s[i].split(":");
            switch (e[0]) {
                case "is3D": // Obsol??te
                    me.C.set3DMode(e[1] === "true");
                    break;
                case "3Dmode":
                    me.C.set3D(e[1] === "true");
                    break;
                case "isAxis":
                    cs.showCS(e[1] === "true");
                    break;
                case "isGrid":
                    cs.showGrid(e[1] === "true");
                    break;
                case "isOx":
                    cs.showOx(e[1] === "true");
                    break;
                case "isOy":
                    cs.showOy(e[1] === "true");
                    break;
                case "isLockOx":
                    cs.setlockOx(e[1] === "true");
                    break;
                case "isLockOy":
                    cs.setlockOy(e[1] === "true");
                    break;
                case "centerZoom":
                    cs.setCenterZoom(e[1] === "true");
                    break;
                case "onlyPositive":
                    cs.setOnlyPos(e[1] === "true");
                    break;
                case "color":
                    cs.setColor(e[1]);
                    break;
                case "fontSize":
                    cs.setFontSize(parseInt(e[1])*me.$U.escala);
                    break;
                case "axisWidth":
                    cs.setAxisWidth(parseFloat(e[1])*me.$U.escala);
                    break;
                case "gridWidth":
                    cs.setGridWidth(parseFloat(e[1])*me.$U.escala);
                    break;
            }
        }
    };


    /********************************************************************************
     ********************************************************************************
     * ***********************          EXPRESSIONS            **********************
     ********************************************************************************
     ********************************************************************************
     */


    var EX = {}; // Expressions
    var EXPS = []; // Tabla de almacenamiento de los objetos implicados en las expresiones elementales

    me.CreateFunctionFromExpression = function(_s, _v) {
        //        if (_s === "") _s = "NaN";
        var t = _s.split(";");
        t[t.length - 1] = "return (" + t[t.length - 1] + ");";
        var s = t.join(";");
        var f = null;
        // Si f devuelve "undefined" es porque hay un error de
        // referencia: por ejemplo x(A) donde A no existe en la
        // figura. En todos los otros casos de error, f devuelve NaN.
        try {
            f = eval('(function(' + _v + '){try{with(Math){with(EX){' + s + '}}}catch(e){return undefined;}})');
            //            f = eval('(function(' + _v + '){try{with(Math){with(EX){' + s + '}}}catch(e){return undefined;}})');
        } catch (e) {
            f = eval('(function(){return NaN})');
        }
        return f;
    };










    var pushEXP = function(_o) {
        var i = EXPS.indexOf(_o);
        if (i === -1) {
            EXPS.push(_o);
            return (EXPS.length - 1);
        }
        return i;
    };

    var getEXP = function(_i) {
        return EXPS[_i];
    };

    me.getEXPS = function() {
        return EXPS;
    }

    var isValidParenthesis = function(_s) {
        var parentheses = 0;
        var crochets = 0;
        var REGsequence = [];
        for (var i = 0, len = _s.length; i < len; i++) {
            if (_s.charAt(i) === "(")
                parentheses++;
            if (_s.charAt(i) === "[")
                crochets++;
            else {
                if (_s.charAt(i) === ")") {
                    parentheses--;
                    REGsequence.push(/(\([^\(\)]*\))/);
                }
                if (_s.charAt(i) === "]") {
                    crochets--;
                    REGsequence.push(/(\[[^\[\]]*\])/);
                }
            }
            if ((parentheses < 0) || (crochets < 0))
                return null;
        }
        if ((parentheses === 0) && (crochets === 0))
            return REGsequence;
        return null;
    };


    var transformOpposite = function(_st) {
        //        if (!isValidParenthesis(_st)) return _st;
        //        var allExp = _st.split(";");
        //        var _s = allExp[allExp.length - 1];


        _st = _st.replace(/\-([\d\.]+)/g, function(m, _d1) {
            return "+(-" + _d1 + ")";
        });
        return _st;
    }






    var operatorReplace = function(_st) {
        var regs = isValidParenthesis(_st);
        if (regs) {

            // Remplaza signos  "-" por "0-"
            // delante de ciertos caracteres especiales:
            _st = _st.replace(/^\s*-/g, "0-");
            _st = _st.replace(/\(\s*-/g, "(0-");
            _st = _st.replace(/\[\s*-/g, "[0-");
            _st = _st.replace(/,\s*-/g, ",0-");
            _st = _st.replace(/\?\s*-/g, "?0-");
            _st = _st.replace(/:\s*-/g, ":0-");

            var tab = [];
            var mask = "___mainMask___";

            for (var i = 0; i < regs.length; i++) {
                _st = _st.replace(regs[i], function(m, t) {
                    tab.push(t);
                    return (mask + (tab.length - 1));
                });
            }

            // Lo que queda de la cadena se pune en mask para inicializar
            // el replace recursivo:
            tab.push(_st);
            _st = mask + (tab.length - 1);

            var tabOp = [];
            var maskOp = "___joker_replaceOp___";

            // Todas las exrpesiones en tab comienzan y terminan
            // con par??ntesis, pero sin par??ntesis interiores.
            // As?? es posible aplicar reglas de prioridad simples
            // (los recorridos regex se hacen de izquierda a derecha!) :
            for (var i = 0, len = tab.length; i < len; i++) {
                tab[i] = replaceOp(tab[i], "\\^", tabOp, maskOp);
                tab[i] = replaceOp(tab[i], "\\*|\\/", tabOp, maskOp);
                tab[i] = replaceOp(tab[i], "\\+|\\-", tabOp, maskOp);
                while (tab[i].indexOf(maskOp) > -1) {
                    // Se remplaza el joker por su valor, y al
                    // mismo tiempo se remplaza el caret por la funci??n pow :
                    tab[i] = tab[i].replace(new RegExp(maskOp + "(\\d+)", "g"), function(m, d) {
                        return tabOp[d];
                    });
                }
                // console.log("***tab[" + i + "]=" + tab[i]);
            }

            while (_st.indexOf(mask) > -1) {
                // On remplace le joker par sa vraie valeur, et dans le
                // m??me temps on remplace l'op??rateur par la fonction correspondante :
				// Se remplaza el joker por su verdadero valor, y al mismo tiempo
				// se remplaza el operador por la funci??n correspondiente:
                _st = _st.replace(new RegExp(mask + "(\\d+)", "g"), function(m, d) {
                    return tab[d];
                });
            }
            return _st;
        }
    };

    var replaceOp = function(_s, _op, _atom, _mask) {
        var ops = {
            "^": "power",
            "*": "times",
            "/": "quotient",
            "+": "plus",
            "-": "minus"
        };
        var s0 = "";
        var s1 = _s;
        while ((s0 !== s1)) {
            s0 = s1;
            s1 = s1.replace(new RegExp("([a-zA-Z0-9_.]*)(" + _op + ")([a-zA-Z0-9_.]*)", ""), function(_m, _d1, _o, _d2) {
                _atom.push(ops[_o] + "(" + _d1 + "," + _d2 + ")");
                return (_mask + (_atom.length - 1));
            });
        }
        return s1;
    };

    var addTimesSymbol = function(_s) {
        // PI tiene valor: \u03C0
        _s = _s.replace(/Angle360/g, "Angle360_"); // avoid conflict with 3(x+2) rule
        _s = _s.replace(/Angle180/g, "Angle180_"); // avoid conflict with 3(x+2) rule

        _s = _s.replace(/(^|[^A-Za-z])(\d+|\u03C0+)\s*([A-Za-z]+|\u03C0+)/g, "$1$2*$3"); // Du type 2x -> 2*x
        _s = _s.replace(/\)\s*\(/g, ")*("); // Du type (x+1)(x+2) -> (x+1)*(x+2)
        _s = _s.replace(/(\d+|\u03C0)\s*\(/g, "$1*("); // Du type 3(x+2) -> 3*(x+2)
        _s = _s.replace(/\)\s*([A-Za-z]+)/g, ")*$1"); // Du type (x+2)sin(a) -> (x+2)*sin(a)
        _s = _s.replace(/\b([xyzt]{1})([xyzt]{1})\b/g, "$1*$2"); // Du type xy -> x*y

        _s = _s.replace(/Angle180_/g, "Angle180");
        _s = _s.replace(/Angle360_/g, "Angle360");
        return _s;
    };

    var functionReplace = function(_s) {
        var tabExpr = [];
        var maskExpr = "___EXPR___";
        var tabTrtl = [];
        var maskTrtl = "___TRTL___";
        if (!isValidParenthesis(_s))
            return _s;


        // Los textos de tortuga no deben idgerirse en el interpreter
        // se ponen a un lado para restituirlos despu??s.
        // _s = _s.replace(/(TURTLE_TEXT\('[^']+'\))/g, function(m, _n) {
        _s = _s.replace(/(TURTLE_TEXT\('(\\'|[^'])*'\))/g, function(m, _n, _p) {
            tabTrtl.push(_n);
            return (maskTrtl + (tabTrtl.length - 1));
        });

        // Remplaza expresiones sin variable : E1 -> ___EXPR___n
        // y pone el contenido en memoria tabExpr[n]="funcValue(E1)()"
        // _s = _s.replace(/\b(\w+)\b([^\(]|$)/g, function(m, _n, _e) {
        // console.log("before : " + _s);
        _s = _s.replace(/([????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????-?????-???a-zA-Z0-9_]+)([^\(]|$)/g, function(m, _n, _e) {
            var o = (window[_n] === undefined) ? me.fv(window["$locvar_" + _n]) : me.fv(window[_n]);
            if (o === undefined)
                o = me.fv(_n);
            if (o === undefined)
                return (_n + _e);
            //            console.log("trouv?? !!!");
            //            if ((o === undefined) || (o.getCode() !== "expression")) return (_n + _e);
            if ("." === _e.charAt(0))
                tabExpr.push("getObj(" + _n + ")");
            else
                tabExpr.push("funcValue(" + _n + ")__()");
            return (maskExpr + (tabExpr.length - 1) + _e);
        });
        // console.log("after : " + _s);

        // Remplacement des fonctions d'une variable : f1(<param>) -> funcValue(f1)(<param>)
        // Voir explications dans caretReplace :
        var tabFunc = [];
        var maskFunc = "___FUNC___";
        while (_s.indexOf("(") > -1) {
            _s = _s.replace(/(\([^\(\)]*\))/g, function(m, t) {
                tabFunc.push(t);
                return (maskFunc + (tabFunc.length - 1));
            });
        }
        tabFunc.push(_s);
        _s = maskFunc + (tabFunc.length - 1);
        while (_s.indexOf(maskFunc) > -1) {
            _s = _s.replace(new RegExp("(\\w+)" + maskFunc + "(\\d+)", "g"), function(m, _n, _d) {
                var o = (window[_n] === undefined) ? me.fv(window["$locvar_" + _n]) : me.fv(window[_n]);
                if (o === undefined)
                    o = me.fv(_n);
                if (o === undefined)
                    return _n + maskFunc + _d;
                //                if ((o === undefined) || ((o.getCode() !== "function") && (o.getCode() !== "expression"))) return _n + maskFunc + _d;
                return "funcValue(" + _n + ")__" + maskFunc + _d;
            });
            _s = _s.replace(new RegExp(maskFunc + "(\\d+)", "g"), function(m, _d) {
                return tabFunc[_d];
            });
        }

        // R??tablissement des expressions sans variable : ___EXPR___n -> funcValue(E1)()
        _s = _s.replace(new RegExp(maskExpr + "(\\d+)", "g"), function(m, _d) {
            return tabExpr[_d];
        });
        // R??tablissement des textes de tortue
        _s = _s.replace(new RegExp(maskTrtl + "(\\d+)", "g"), function(m, _d) {
            return tabTrtl[_d];
        });
        return _s;
    };

    // parseExpression dans le contexte de cette window :
    var pe = function(_o, _n) {
        
        _n = _n.replace(/\s/g, "");

        if ((_o.getName) && (_o.getName() === _n)) {
            
            return pushEXP(_o);
        } else {
            var o = (window[_n] === undefined) ? me.fv(window["$locvar_" + _n]) : me.fv(window[_n]);
            if (o === undefined)
                o = me.fv(_n);
            if (o === undefined)
                return _n;
            if ((_o) && (_o.getParent) && (_o.getParent().indexOf(o) === -1)) {
                _o.addParent(o);
                
            }
            return pushEXP(o);
        }
    };

    var EXinit = function(_c) {
        var _n = EX[_c].length; // nombre de param??tres de la fonction N??mero de par??metros de la funci??n
        var c = _c.split("_")[1];
        var r = "\\b" + c + "\\b\\(([^\\)]*)";
        for (var i = 1; i < _n; i++) {
            r += ",([^\\)]*)";
        }
        r += "\\)";
        var rg = new RegExp(r, "g");
        return function(_o, _s) {
            return _s.replace(rg, function(m) {
                var res = _c + "(" + pe(_o, arguments[1]);
                for (var i = 2; i < (_n + 1); i++) {
                    res += "," + pe(_o, arguments[i]);
                }
                res += ")";
                return res;
            });
        };
    };


    me.ExpressionInit = function(_o, _s) {

        // ******* REPARACION : no comprendo por qu?? algunos EX_funcValue(5)
        // quedan en el source usuario de algunas expresiones (derivadas)
        // se limpia todo eso para remplazar por el nombre actual
        _s = _s.replace(/(EX_funcValue\((\d+)\))/g, function(m, g1, g2) {
            var ex = EXPS[parseInt(g2)];
            return ex.getName();
        });


        var s = _s;
        
        // Sauvegarde des toutes les parties texte de l'expression :
		// Guarda todas las partes texto de la expresi??n:
        var txts = [];
        var maskTxts = "___TEXTES___";
        var stt = s;
        var s2 = s.replace(/(\"[^\"]*\")/g, function(m, t) {
            txts.push(t);
            return (maskTxts + (txts.length - 1));
        });


        
        s2 = functionReplace(s2);
        
        s2 = EXinit("EX_funcValue")(_o, s2);

        s2 = EXinit("EX_getObj")(_o, s2);
        // Remplacement des fonctions personnelles x,y,etc...
        // par une notation interne EX_x,EX_y,etc... :
		// Remplazo de las funciones personales x, y, etc...
		// por una notaci??n interna EX_x,EX_y,etc... :
        for (var f in EX) {
            var myF = f.split("_")[1];
            s2 = s2.replace(new RegExp("(\\W|^)\\s*" + myF + "\\s*\\(", "g"), "$1" + f + "(");
        }

        // s3 contient une forme interm??diaire de l'expression. Il s'agit d'une chaine du type
        // "EX_y(EX_funcValue(0)__())+x^2" lorsque l'utilisateur a entr?? "y(P1)+x^2".
        // Cette chaine correspond au param??tre "pseudo" de l'objet renvoy??, qui sera
        // utilis?? pour d??livrer le source de l'expression :
		// s3 contiene una forma intermedia de la expresi??n. Se trata de una cadena de tipo
		// "EX_y (EX_funcValue(0)__())+x^2" cuando el usuario escribe "y(P1)+x^2".
		// utilizado para liberar el source de la expresi??n:
        var s3 = s2.replace(new RegExp(maskTxts + "(\\d+)", "g"), function(m, _d) {
            return txts[_d];
        });

        if (isValidParenthesis(s2)) {
            // On ne touche que la derni??re partie de la suite
            // d'instruction (apr??s le dernier ";") :
			// Solo se modifica la ??ltima parte de la siguiente
			// instrucci??n (despu??s del ??ltimo ";"):
            var allExp = s2.split(";");
            var _s2 = allExp[allExp.length - 1];


            _s2 = addTimesSymbol(_s2);
            _s2 = _s2.replace(/\u03C0/g, "PI");
            _s2 = _s2.replace(/\bi\b/g, "[0,1]");

            _s2 = operatorReplace(_s2);

            allExp[allExp.length - 1] = _s2;
            s2 = allExp.join(";");
        }

        // n??cessaire pour r??tablir le code functionReplace qui ??vite
        // la multiplication entre les parenth??ses d'un calcul d'image :
		// necesario para restablecer el c??digo functionReplace que evita
		// la multiplicaci??n entre los par??ntesis de un c??lculo de imagen:
        s2 = s2.replace(/\)__\(/g, ")(");


        // Remplacement des ".dx." , ".dy." etc... par ".dx()." , ".dy()." etc...
        var reg = new RegExp("\\.d([xyzt]{1})\\.");
        while (reg.test(s2))
            s2 = s2.replace(reg, ".d$1().");
        s2 = s2.replace(/\.d([xyzt]{1})\s*$/, ".d$1()");


        // Restitution de tous les textes :
		// Restituci??n de todos los textos:
        s2 = s2.replace(new RegExp(maskTxts + "(\\d+)", "g"), function(m, _d) {
            return txts[_d];
        });

        // S'il y a une instruction TURTLE_GET dans le code de l'expression,
        // on fait en sorte que l'objet _o d??pende de la liste :
		// Si hay una instrucci??n TURTLE_GET en el c??digo de la expresi??n,
		// se hace que el objeto _o dependa de la lista:
        var dep = s2.replace(/TURTLE_GET\(\"([^\"]+)\"/g, function(m, _d) {
            var o = me.f("blk_turtle_list_" + _d);
            if ((o) && (_o.getVarName) && (_o.getVarName() != ("blk_turtle_exp_" + _d))) {
                if ((_o) && (_o.getParent) && (_o.getParent().indexOf(o) === -1)) {
                    _o.addParent(o);
                }
            }
            return "";
        });

        // idem pour TURTLE_LENGTH :
        dep = s2.replace(/TURTLE_LENGTH\(\"([^\"]+)\"/g, function(m, _d) {
            var o = me.f("blk_turtle_list_" + _d);
            if ((o) && (_o.getVarName) && (_o.getVarName() != ("blk_turtle_exp_" + _d))) {
                if ((_o) && (_o.getParent) && (_o.getParent().indexOf(o) === -1)) {
                    _o.addParent(o);
                }
            }
            return "";
        });

        // idem pour Coordinate :
        dep = s2.replace(/Coordinate\(\"([^\"]+)\"/g, function(m, _d) {
            var o = me.f(_d);
            if ((o) && (_o.getVarName) && (_o.getVarName() != (_d))) {
                if ((_o) && (_o.getParent) && (_o.getParent().indexOf(o) === -1)) {
                    _o.addParent(o);
                }
            }
            return "";
        });



        // if ((s2 !== "") && ((isValidParenthesis(s2)))) {
        //     console.log("***user result = " + s);
        //     console.log("pseudo result = " + s3);
        //     console.log("main result = " + s2);
        //     console.log("name : " + _o.getName());
        // }


        return {
            user: s,
            pseudo: s3,
            js: s2,
            jsbackup: s2
        };
    };



    // Renvoie le source de l'expression. Principalement,
    // il s'agit de remplacer la repr??sentation num??rique
    // interne par le nom actuel des objets.
	// Devuelve el source de la expresi??n. Principalmente,
	// se trata de remplazar la representaci??n num??rica
	// interna por el nombre actual de los objestos.
    me.ExpressionSrc = function(_s) {
        var s = _s;
        while (s.indexOf("EX_funcValue") !== -1) {
            s = s.replace(/EX_funcValue\((\d+)\)__\(([^\)]*)\)/, function(_m, _d1, _d2) {
                var _n = EXPS[_d1].getVarName();
                if (_d2 !== "")
                    _n += "(" + _d2 + ")";
                return _n;
            });
        }
        while (s.indexOf("EX_getObj") !== -1) {
            s = s.replace(/EX_getObj\((\d+)\)./, function(_m, _d1) {
                var _n = EXPS[_d1].getVarName() + ".";
                return _n;
            });
        }
        s = s.replace(/EX_/g, "");
        s = s.replace(/\"/g, "\\\"");
        return s;
    };

    var isArray = function(_a) {
        return (Object.prototype.toString.call(_a) === '[object Array]');
    };


    Math.test = function(_test, _valtrue, _valfalse) {
        if (_test)
            return _valtrue;
        else
            return _valfalse;
    };

    Math.IF = function(_test, _valtrue, _valfalse) {
        if (_test)
            return _valtrue;
        else
            return _valfalse;
    };


    // Renvoie l'angle que forme un vecteur (x;y) avec l'horizontale
    // dans l'intervalle [0;2??[ orient?? dans le sens trigo :
	// Devuelve el ??ngulo que forma un vector (x,y) con la horizontal
	// en el intervalo [0;2??[ orientado en el sentido trigo:
    Math.angleH = function(x, y) {
        if (y < 0)
            return 2 * Math.PI - Math.atan2(-y, x);
        else
            return -Math.atan2(-y, x);
    };

    Math.crossProduct = function(_a, _b) {
        if ((isArray(_a)) && (_a.length === 3) && (isArray(_b)) && (_b.length === 3)) {
            return [_a[1] * _b[2] - _a[2] * _b[1], _a[2] * _b[0] - _a[0] * _b[2], _a[0] * _b[1] - _a[1] * _b[0]];
        }
        return NaN;
    };

    Math.unitVector = function(_a) {
        if (isArray(_a)) {
            var _n = 0;
            var res = [];
            for (var i = 0; i < _a.length; i++) {
                _n += _a[i] * _a[i];
            }
            _n = Math.sqrt(_n);
            for (var i = 0; i < _a.length; i++) {
                res.push(_a[i] / _n);
            }
            return res;
        }
        return NaN;
    };

    Math.distance = function(_a, _b) {
        if ((isArray(_a)) && (isArray(_b)) && (_a.length === _b.length)) {
            var d = 0;
            for (var i = 0; i < _a.length; i++) {
                d += (_a[i] - _b[i]) * (_a[i] - _b[i]);
            }
            return Math.sqrt(d);
        }
        return NaN;
    };



    Math.gcd = function(a, b) {
        if ((!isNaN(a)) && (!isNaN(b)))
            return ((b == 0) ? a : Math.gcd(b, a % b));
        return NaN;
    };


    Math.csqrt = function(a) {
        if (!isNaN(a)) {
            if (a < 0)
                return Math.csqrt([a, 0]);
            else
                return Math.sqrt(a);
        } else if ((isArray(a)) && (a.length === 2)) {
            var res = [];
            // Determination de l'argument g??n??rique :
			// Determinaci??n del argumento gen??rico:
            var arg = Math.angleH(a[0], a[1]) / 2;
            // Determination du module g??n??rique :
			// Determinaci??n del m??dulo gen??rico:
            var mod = Math.pow(Math.sqrt((a[0] * a[0]) + (a[1] * a[1])), 1 / 2);
            res.push([mod * Math.cos(arg), mod * Math.sin(arg)]);
            res.push([mod * Math.cos(arg + Math.simplePI), mod * Math.sin(arg + Math.simplePI)]);
            return res;
        }
        return NaN;
    };

    Math.power = function(a, b) {
        if ((!isNaN(a)) && (!isNaN(b)))
            return Math.pow(a, b);
        // Si a est un complexe et b un nombre :
		// Si a es un complejo y b un n??mero
        if ((!isNaN(b)) && (isArray(a)) && (a.length === 2)) {
            var invb = (b === 0) ? 0 : (Math.round(1e12 / b) * 1e-12);
            
            // S'il s'agit d'une racine b-i??me :
			// Si se trata de una ra??z b-??sima:
            if ((invb > 1) && (Math.round(invb) === invb)) {
                var res = [];
                // Determination de l'argument g??n??rique :
                var arg = Math.angleH(a[0], a[1]) * b;
                // Determination du module g??n??rique :
                var mod = Math.pow(Math.sqrt((a[0] * a[0]) + (a[1] * a[1])), b);
                var inc = Math.doublePI * b;
                for (var k = 0; k < invb; k++) {
                    res.push([mod * Math.cos(arg + k * inc), mod * Math.sin(arg + k * inc)]);
                }
                return res;
            } else {
                // Determination de l'argument du resultat :
				// Determinaci??n del argumento del resultado:
                var arg = Math.angleH(a[0], a[1]) * b;
                // Determination du module du resultat :
				// Determinaci??n del m??dulo del resultado:
                var mod = Math.pow(Math.sqrt((a[0] * a[0]) + (a[1] * a[1])), b);
                return [mod * Math.cos(arg), mod * Math.sin(arg)];
            }

        }
        return NaN;
    };

    Math.plus = function(_a, _b) {
        if ((!isNaN(_a)) && (!isNaN(_b)))
            return _a + _b;
        var a = (!isNaN(_a)) ? [_a, 0] : _a;
        var b = (!isNaN(_b)) ? [_b, 0] : _b;
        if ((isArray(a)) && (isArray(b)) && (a.length === b.length)) {
            var t = [];
            for (var i = 0, len = a.length; i < len; i++) {
                t.push(Math.plus(a[i], b[i]));
            }
            return t;
        }
        if (isStr(_a) || (isStr(_b)))
            return (_a + _b); // Concat??nation de chaine
        return NaN;
    };


    Math.minus = function(_a, _b) {
        if ((!isNaN(_a)) && (!isNaN(_b)))
            return _a - _b;
        var a = (!isNaN(_a)) ? [_a, 0] : _a;
        var b = (!isNaN(_b)) ? [_b, 0] : _b;
        if ((isArray(a)) && (isArray(b)) && (a.length === b.length)) {
            var t = [];
            for (var i = 0, len = a.length; i < len; i++) {
                t.push(Math.minus(a[i], b[i]));
            }
            return t;
        }
        return NaN;
    };
    Math.times = function(a, b) {
        if ((!isNaN(a)) && (!isNaN(b)))
            return a * b;
        // Si les deux sont des complexes :
		// Si los dos son complejos:
        if ((isArray(a)) && (isArray(b)) && (a.length === b.length) && (a.length === 2)) {
            return ([a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]);
        }
        if ((!isNaN(a)) && (isArray(b))) {
            var t = [];
            for (var i = 0, len = b.length; i < len; i++) {
                t.push(Math.times(a, b[i]));
            }
            return t;
        }
        if ((!isNaN(b)) && (isArray(a))) {
            var t = [];
            for (var i = 0, len = a.length; i < len; i++) {
                t.push(Math.times(b, a[i]));
            }
            return t;
        }
        return NaN;
    };
    Math.quotient = function(a, b) {
        if ((!isNaN(a)) && (!isNaN(b)))
            return a / b;
        // Si les deux sont des complexes :
		// Si los dos con complejos:
        if ((isArray(a)) && (isArray(b)) && (a.length === b.length) && (a.length === 2)) {
            return ([(a[0] * b[0] + a[1] * b[1]) / (b[0] * b[0] + b[1] * b[1]), (a[1] * b[0] - a[0] * b[1]) / (b[0] * b[0] + b[1] * b[1])]);
        }
        if ((!isNaN(b)) && (isArray(a))) {
            var t = [];
            for (var i = 0, len = a.length; i < len; i++) {
                t.push(Math.quotient(a[i], b));

            }
            return t;
        }
        // Si a est un nombre et b un complexe :
		// Si a es un n??mero y b un complejo:
        if ((!isNaN(a)) && (isArray(b)) && (b.length === 2)) {
            return Math.quotient([a, 0], b);
        }
        return NaN;
    };

    Math.mod = function(_a) {
        var a = (!isNaN(_a)) ? [_a, 0] : _a;
        // Si a est un complexe :
		// Si a es un complejo:
        if ((isArray(a)) && (a.length === 2)) {
            return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
        }
        return NaN;
    };

    Math.conj = function(_a) {
        var a = (!isNaN(_a)) ? [_a, 0] : _a;
        // Si a est un complexe :
		// Si a es un complejo:
        if ((isArray(a)) && (a.length === 2)) {
            return ([a[0], -a[1]]);
        }
        return NaN;
    };

    Math.arg = function(_a) {
        var a = (!isNaN(_a)) ? [_a, 0] : _a;
        // Si a est un complexe :
		// Si a es un complejo:
        if ((isArray(a)) && (a.length === 2)) {
            return (Math.angleH(a[0], a[1]));
        }
        return NaN;
    };




    Math.Angle360 = function(_a, _o, _c) {
        var xOA = _a[0] - _o[0],
            yOA = _a[1] - _o[1];
        var xOC = _c[0] - _o[0],
            yOC = _c[1] - _o[1];
        var start = Math.angleH(xOA, yOA);
        var end = Math.angleH(xOC, yOC);
        var a = end - start;
        a = a - Math.floor(a / Math.doublePI) * Math.doublePI;
        return (a)
    };

    // Math.Angle180 = function(_a, _o, _c) {
    //     console.log("Math.Angle180");
    //     var a = Math.Angle360(_a, _o, _c);
    //     return ((a < Math.simplePI) ? a : Math.doublePI - a)
    // };


    Math.Angle180 = function(_a, _b, _c) {
        if ((isArray(_a)) && (isArray(_b)) && (isArray(_c)) && (_a.length === _b.length) && (_a.length === _c.length)) {
            var u = Math.minus(_a, _b);
            var v = Math.minus(_c, _b);
            var ps = 0,
                n1 = 0,
                n2 = 0;
            for (var i = 0; i < u.length; i++) {
                ps += u[i] * v[i];
                n1 += u[i] * u[i];
                n2 += v[i] * v[i];
            }
            var a = ps / (Math.sqrt(n1) * Math.sqrt(n2));
            if (Math.abs(a - 1) < 1e-13) return 0;
            else if (Math.abs(a + 1) < 1e-13) return Math.simplePI;
            return Math.acos(a);
        }
        return NaN;
    };

    // Math.Angle360 = function(_a, _b, _c) {
    //     if ((isArray(_a)) && (isArray(_b)) && (isArray(_c)) && (_a.length === _b.length) && (_a.length === _c.length)) {
    //         var u = Math.minus(_a, _b);
    //         var v = Math.minus(_c, _b);
    //         var ps = 0,
    //             n1 = 0,
    //             n2 = 0;
    //         for (var i = 0; i < u.length; i++) {
    //             ps += u[i] * v[i];
    //             n1 += u[i] * u[i];
    //             n2 += v[i] * v[i];
    //         }
    //         var a = ps / (Math.sqrt(n1) * Math.sqrt(n2));

    //         if (Math.abs(a - 1) < 1e-13) a=1;
    //         else if (Math.abs(a + 1) < 1e-13) a=-1;

    //         a=Math.acos(a);
    //         var zpv=u[0]*v[1]-u[1]*v[0];
    //         if (Math.abs(zpv) < 1e-11) zpv=0;

    //         console.log(zpv);

    //         if (zpv<0) a=Math.doublePI-a;


    //         return a;
    //     }
    //     return NaN;
    // };






    Math.deg_coeff = Math.PI / 180;
    Math.rcos = Math.cos;
    Math.rsin = Math.sin;
    Math.rtan = Math.tan;
    Math.racos = Math.acos;
    Math.rasin = Math.asin;
    Math.ratan = Math.atan;
    Math.rangleH = Math.angleH;
    Math.doublePI = 2 * Math.PI;
    Math.simplePI = Math.PI;
    Math.coef3D = 0.015;

    me.setDegreeMode = function(_d) {
        if (_d) {
            Math.cos = function(_a) {
                return Math.rcos(_a * Math.deg_coeff);
            };
            Math.sin = function(_a) {
                return Math.rsin(_a * Math.deg_coeff);
            };
            Math.tan = function(_a) {
                return Math.rtan(_a * Math.deg_coeff);
            };
            Math.acos = function(_a) {
                return (Math.racos(_a) / Math.deg_coeff);
            };
            Math.asin = function(_a) {
                return (Math.rasin(_a) / Math.deg_coeff);
            };
            Math.atan = function(_a) {
                return (Math.ratan(_a) / Math.deg_coeff);
            };
            Math.angleH = function(x, y) {
                if (y < 0)
                    return (2 * Math.PI - Math.atan2(-y, x)) * 180 / Math.PI;
                else
                    return (-Math.atan2(-y, x)) * 180 / Math.PI;
            };
            Math.doublePI = 360;
            Math.simplePI = 180;
            Math.coef3D = 0.859436693;
        } else {
            Math.cos = Math.rcos;
            Math.sin = Math.rsin;
            Math.tan = Math.rtan;
            Math.acos = Math.racos;
            Math.asin = Math.rasin;
            Math.atan = Math.ratan;
            Math.angleH = Math.rangleH;
            Math.doublePI = 2 * Math.PI;
            Math.simplePI = Math.PI;
            Math.coef3D = 0.015;
        }
    };

    me.setDegreeMode(me.C.isDEG());



    // Ici, attention aux noms des fonctions : apr??s le underscore, le nom
    // de la fonction telle que le tape l'utilisateur (et tel qu'il est ??crit
    // dans le source, et avant, c'est "EX".
	// Aqu??, cuidado con los nombres de las funciones: despu??s de la raya al piso, el nombre
	// de la funci??n tal como la escribe el usuario (y tal como se escribe 
	// en el source, y antes, es "EX".

    // Distance entre deux points : Distancia entre dos puntos
    EX.EX_d = function(_a, _b) {
		var twoPoints=isArray(_a)&&_a.length <=3&&isArray(_b)&&_b.length <=3;
		var LinePoint=isArray(_a)&&_a.length ===4&&isArray(_b)&&_b.length <=3;
		var PointLine=isArray(_a)&&_a.length <=3&&isArray(_b)&&_b.length ===4;
        if (twoPoints) {
            if ((_a.length === 2) && (_b.length === 2))
                return Math.sqrt((_b[0] - _a[0]) * (_b[0] - _a[0]) + (_b[1] - _a[1]) * (_b[1] - _a[1]));
            else if ((_a.length === 3) && (_b.length === 3))
                return Math.sqrt((_b[0] - _a[0]) * (_b[0] - _a[0]) + (_b[1] - _a[1]) * (_b[1] - _a[1]) + (_b[2] - _a[2]) * (_b[2] - _a[2]));
        }
		
		if (LinePoint){
			var xA = _a[2];
			var yA = _a[3];
			var DX = _a[0];
			var DY = _a[1];
			
			var AB2 = DX * DX + DY * DY;
			var ABMA = DX * (xA - _b[0]) - DY * (yA - _b[1]);
			proj = [xA - (DX * ABMA) / AB2, yA + (DY * ABMA) / AB2];
			return Math.sqrt((_b[0] - proj[0]) * (_b[0] - proj[0]) + (_b[1] - proj[1]) * (_b[1] - proj[1]));
					
		}
		if (PointLine){
			var xA = _b[2];
			var yA = _b[3];
			var DX = _b[0];
			var DY = _b[1];
			
			var AB2 = DX * DX + DY * DY;
			var ABMA = DX * (xA - _a[0]) - DY * (yA - _a[1]);
			proj = [xA - (DX * ABMA) / AB2, yA + (DY * ABMA) / AB2];
			return Math.sqrt((_a[0] - proj[0]) * (_a[0] - proj[0]) + (_a[1] - proj[1]) * (_a[1] - proj[1]));
			}
			
		
        return NaN;
    };

    // Abscisse d'un point : Abscisa de un punto:
    EX.EX_x = function(_a) {
        if ((isArray(_a)) && (_a.length > 0))
            return _a[0];
        return NaN;
    };

    // Ordonn??e d'un point : Ordenada de un punto:
    EX.EX_y = function(_a) {
        if ((isArray(_a)) && (_a.length > 1))
            return _a[1];
        return NaN;
    };

	// ancho de la ventana (en unidades)
    EX.EX_windoww = function() {
        return me.C.coordsSystem.l(me.C.getWidth());
    };
	// alto de la ventan (en unidades)
    EX.EX_windowh = function() {
        return me.C.coordsSystem.l(me.C.getHeight());
    };
    // abscisa del centro de la ventana
	EX.EX_windowcx = function() {
        return me.C.coordsSystem.x(me.C.getWidth() / 2);
    };
    // ordeanada del centro de la ventana
	EX.EX_windowcy = function() {
        return me.C.coordsSystem.y(me.C.getHeight() / 2);
    };
    // cantidad de pixeles en una unidad
	EX.EX_pixel = function() {
        return me.C.coordsSystem.getUnit();
    };

    var COORDS_X0 = me.C.coordsSystem.getX0;
    var COORDS_Y0 = me.C.coordsSystem.getY0;

    EX.EX_phi = function() {
        return COORDS_X0() * Math.coef3D;
    };
    EX.EX_theta = function() {
        return COORDS_Y0() * Math.coef3D;
    };

    // para restringir el giro vertical del espacio
	EX.EX_restrictPhi = function(_t) {
        if (_t.length === 2)
            me.C.coordsSystem.restrictPhi([_t[0] / 0.015 + 0.000001, _t[1] / 0.015 - 0.000001]);
        else
            me.C.coordsSystem.restrictPhi([]);
        me.C.coordsSystem.translate(0, 0, true); // mise en coh??rence de l'origine du rep??re
        return _t;
    };
    // para restringir el giro horizontal del espacio
	EX.EX_restrictTheta = function(_t) {
        if (_t.length === 2)
            me.C.coordsSystem.restrictTheta([_t[0] / 0.015 + 0.000001, _t[1] / 0.015 - 0.000001]);
        else
            me.C.coordsSystem.restrictTheta([]);
        me.C.coordsSystem.translate(0, 0, true); // mise en coh??rence de l'origine du rep??re
        return _t;
    };
    EX.EX_point3D = function(_o, _v) {
        var fi = EX.EX_phi();
        var th = EX.EX_theta();
        var cfi = Math.cos(fi),
            sfi = Math.sin(fi);
        var cth = Math.cos(th),
            sth = Math.sin(th);
        return [_o[0] + _v[0] * (sfi) + _v[1] * (cfi), _o[1] + _v[0] * (-cfi * sth) + _v[1] * (sfi * sth) + _v[2] * (cth)];
    };


    //    EX.EX_windoww=9;

    // Uniquement ?? usage interne. L'utilisateur ??crit f3(2), et
    // l'interpr??teur transforme en EX_funcValue(f3)(2) :
    EX.EX_funcValue = function(_e) {
        return EXPS[_e].getValue;
    };

    EX.EX_getObj = function(_e) {
        return EXPS[_e];
    };

    me.getEX = function() {
        return EX;
    };

    me.getMath = function() {
        return Math;
    };


    // Copie le namespace de cette iframe onload (voir canvas) :
	// Copia el namespace de este iframe onload (ver canvas):
    me.copyNameSpace = function() {
        for (var key in window) {
            namespace[key] = key;
        }
    };


    var clearNameSpace = function() {
        for (var key in window) {
            if (!namespace.hasOwnProperty(key)) {
                delete window[key];
            }
        }
    };

me.getParentAt = function(_i) {
        return parentList[_i];
}
}
