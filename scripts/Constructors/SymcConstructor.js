//************************************************
//*************** MIDPOINT CONSTRUCTOR ***********
//************************************************
function SymcConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "symc";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_symc;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    };

    this.newObj = function(_zc, _C) {
		if (_C[1].getCode()=="arc3pts") {
            return new SymcArcObject(_zc.getConstruction(), "_ar", _C[0], _C[1]);
		        }
		else if (_C[1].isInstanceType("circle")) {
            return new SymcCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
        }
		else if (_C[1].getCode()=="vector") {
			return new SymcVectorObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
		}
		else if (_C[1].isInstanceType("segment")) {
            return new SymcSegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("ray")) {
            return new SymcRayObject(_zc.getConstruction(), "_sr", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("point")) {
            return new SymcPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("area")) {
            return new SymcAreaObject(_zc.getConstruction(), "_Pol", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("line")) {
            return new SymcLineObject(_zc.getConstruction(), "_r", _C[0], _C[1]);
        }
		else {
			return new SymcPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
        
    };
	
	
	this.selectCreatePoint = function(zc, ev) {
        this.isSelectCreatePoint = true;
        var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var len = selection.length;
        if (len > 0) {
            this.addC(selection[0]);
        }  
			else {var o = new PointObject(zc.getConstruction(), "_P", zc.mouseX(ev), zc.mouseY(ev));
        zc.addObject(o);
		this.addC(o);
		cn.getFrame().getTextCons(o);
		};
    };

    this.preview = function(ev, zc) {
		//MEAG añadido para reconocer un punto seleccionado y cambiar el mensaje
		var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var len = selection.length;
		var texto2 = $L.tool_segment_help_2;
		var ctx = zc.getContext();
        if (len > 0 && selection[0].isInstanceType("point")) {
			texto2= $L.tool_Syma_help_1b;
			var x = 2 * this.getC(0).getX() - selection[0].getX();
			var y = 2 * this.getC(0).getY() - selection[0].getY();
			var ctx = zc.getContext();
			var size = zc.prefs.size.point;
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
		}
		else if (len > 0 && selection[0].getCode()=="vector") {
			texto2= $L.tool_Syma_help_1g;
			
			
			var x2 = 2 * this.getC(0).getX() - selection[0].getXmin();
			var y2 = 2 * this.getC(0).getY() - selection[0].getYmin();
			var x1 = 2 * this.getC(0).getX() - selection[0].getXmax();
			var y1 = 2 * this.getC(0).getY() - selection[0].getYmax();
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.lineCap = 'butt';
			var headlen = zc.prefs.size.vectorhead;
			var angle = Math.atan2(y2 - y1, x2 - x1);
			var c1 = Math.cos(angle - Math.PI / 8);
			var s1 = Math.sin(angle - Math.PI / 8);
			ctx.beginPath();
			ctx.moveTo(x2, y2);
			ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
			ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 8), y2 - headlen * Math.sin(angle + Math.PI / 8));
			ctx.lineTo(x2, y2);
			ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
			ctx.fillStyle = ctx.strokeStyle;
			ctx.stroke();
		}
		else if (len > 0 && selection[0].getCode()=="segment") {
			texto2= $L.tool_Syma_help_1c;
			var x1 = 2 * this.getC(0).getX() - selection[0].getXmin();
			var y1 = 2 * this.getC(0).getY() - selection[0].getYmin();
			var x2 = 2 * this.getC(0).getX() - selection[0].getXmax();
			var y2 = 2 * this.getC(0).getY() - selection[0].getYmax();
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.closePath();
			ctx.stroke();
		}
		else if (len > 0 && (selection[0].getCode()=="line"||selection[0].getCode()=="plumb"||selection[0].getCode()=="parallel")) {
			texto2= $L.tool_Syma_help_1d;
			pun1=[selection[0].getP1().getX(), selection[0].getP1().getY()];
			var dx = selection[0].getNDY();
			var dy = selection[0].getNDX();
			sympun1x=2 * this.getC(0).getX() - pun1[0];
			sympun1y=2 * this.getC(0).getY() - pun1[1];
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			$U.drawPartialLine(ctx, sympun1x-dy, sympun1y-dx, sympun1x + dy, sympun1y + dx, true, true);
			ctx.stroke();
		}
		else if (len > 0 && selection[0].getCode()=="arc3pts") {
			texto2= $L.tool_Syma_help_1h;
			
			var pun1=[selection[0].getA().getX(), selection[0].getA().getY()];
			var pun2=[selection[0].getB().getX(), selection[0].getB().getY()];
			var pun3=[selection[0].getC().getX(), selection[0].getC().getY()];
			var sympun1x=2 * this.getC(0).getX() - pun1[0];
			var sympun1y=2 * this.getC(0).getX() - pun1[1];
			var sympun2x=2 * this.getC(0).getX() - pun2[0];
			var sympun2y=2 * this.getC(0).getX() - pun2[1];
			var sympun3x=2 * this.getC(0).getX() - pun3[0];
			var sympun3y=2 * this.getC(0).getX() - pun3[1];
			var t = $U.computeArcParams(sympun1x, sympun1y, sympun2x, sympun2y, sympun3x, sympun3y);
                    xM = t.centerX;
					
                    yM = t.centerY;
					
                    fromA = t.startAngle;
                    toA = t.endAngle;
                    trig = t.Trigo;
                    var r = $U.computeRay(t.centerX, t.centerY, sympun1x, sympun1y);
					ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			ctx.arc(xM, yM, r, -fromA, -toA, trig);
			ctx.stroke();
			}
		else if (len > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_Syma_help_1e;
			
			var pun1=[selection[0].getP1().getX(), selection[0].getP1().getY()];
			var pun2=[selection[0].getP2().getX(), selection[0].getP2().getY()];
			var sympun1x=2 * this.getC(0).getX() - pun1[0];
			var sympun1y=2 * this.getC(0).getY() - pun1[1];
			var sympun2x=2 * this.getC(0).getX() - pun2[0];
			var sympun2y=2 * this.getC(0).getY() - pun2[1];
			
			ctx.lineWidth = zc.prefs.size.line;
			ctx.strokeStyle = zc.prefs.color.hilite;
			$U.drawPartialLine(ctx, sympun1x, sympun1y, sympun2x, sympun2y, false, true);
			ctx.stroke();
		}
		else if (len > 0 && selection[0].isInstanceType("circle")) {
			texto2= $L.tool_Syma_help_1f;
			var cent=[selection[0].getP1().getX(), selection[0].getP1().getY()]
			
				x1=2 * this.getC(0).getX() - cent[0];
				y1=2 * this.getC(0).getY() - cent[1];
			var R=selection[0].getR();
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			ctx.arc(x1, y1, R, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
		}
		
		else if (len > 0 && selection[0].getCode()=="area") {
			texto2= $L.tool_Syma_help_1i;
			var col = new Color();
			col.set(zc.prefs.color.area);
			col.setOpacity(zc.prefs.opacity.area);
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.fillStyle = col.getRGBA();
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			
			var Puntos=selection[0].getPtab();
			
			  var len = Puntos.length;
			  
			  ctx.moveTo(2 * this.getC(0).getX() - Puntos[0].getX(),2 * this.getC(0).getY() -Puntos[0].getY());
			  for (var i = 1; i < len; i++) {
				ctx.lineTo(2 * this.getC(0).getX() -Puntos[i].getX(),2 * this.getC(0).getY() -Puntos[i].getY());
			  }
			  ctx.lineTo(2 * this.getC(0).getX() - Puntos[0].getX(),2 * this.getC(0).getY() -Puntos[0].getY());
			  ctx.closePath();
			  ctx.fill();
		}
		
		else if (len == 0) {
			texto2=$L.tool_Syma_help_1a;
			var x = 2 * this.getC(0).getX() - zc.mouseX(ev);
			var y = 2 * this.getC(0).getY() - zc.mouseY(ev);
			var ctx = zc.getContext();
			var size = zc.prefs.size.point;
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();
		}
		
		//fin MEAG
        
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }
        
		
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText(texto2+this.getC(0).getName()+"?",zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
    };
}
