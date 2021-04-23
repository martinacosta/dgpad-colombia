//************************************************
//*************** Axial Symmetry CONSTRUCTOR ***********
//************************************************
function SymaConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "syma";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_syma;
    }

    this.getInitials = function() {
        return ["line,circle, point, segment, ray, area, vector,arc"];
    };
	
	this.getFinals = function() {
		return ["point", "segment", "line", "circle", "area","ray"];
	}

    this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    };

	this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 2);
    };

    this.newObj = function(_zc, _C) {
		
		if (_C[1].getCode()=="arc3pts") {
            return new SymaArcObject(_zc.getConstruction(), "_ar", _C[0], _C[1]);
		
        }
		else if (_C[1].isInstanceType("circle")) {
            return new SymaCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
        }
		else if (_C[1].getCode()=="vector") {
            return new SymaVectorObject(_zc.getConstruction(), "_v", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("segment")) {
            return new SymaSegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("ray")) {
            return new SymaRayObject(_zc.getConstruction(), "_sr", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("point")) {
            return new SymaPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("area")) {
            return new SymaAreaObject(_zc.getConstruction(), "_Pol", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("line")) {
            return new SymaLineObject(_zc.getConstruction(), "_r", _C[0], _C[1]);
        }
		else {
			return new SymaPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
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
        
		var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var len = selection.length;
		var texto2 = $L.tool_segment_help_2;
		var ctx = zc.getContext();
        if (len > 0 && selection[0].isInstanceType("point")) {
			texto2= $L.tool_Syma_help_1b;
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			var coords = this.getC(0).reflectXY(selection[0].getX(), selection[0].getY());
			var size = zc.prefs.size.point;
			ctx.beginPath();
			ctx.arc(coords[0], coords[1], size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();
		
		}
		else if (len > 0 && selection[0].getCode()=="segment") {
			texto2= $L.tool_Syma_help_1c;
			var coords1 = this.getC(0).reflectXY(selection[0].getXmin(), selection[0].getYmin());
			var coords2 = this.getC(0).reflectXY(selection[0].getXmax(), selection[0].getYmax());
			
		
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			ctx.beginPath();
			ctx.moveTo(coords1[0],coords1[1]);
			ctx.lineTo(coords2[0],coords2[1]);
			ctx.closePath();
			ctx.stroke();
			
		
		}
		else if (len > 0 && (selection[0].getCode()=="line"||selection[0].getCode()=="plumb"||selection[0].getCode()=="parallel")) {
			texto2= $L.tool_Syma_help_1d;
			pun1=[selection[0].getP1().getX(), selection[0].getP1().getY()];
			
			var x1 = this.getC(0).getNDY();
			var y1 = this.getC(0).getNDX();
			var x2 = selection[0].getNDY();
			
			var y2 = selection[0].getNDX();
			
			var x3= 2*((x1*x1*x2+x1*y1*y2)/(x1*x1+y1*y1))-x2;
			var y3= 2*((x1*y1*x2+y1*y1*y2)/(x1*x1+y1*y1))-y2;
			var refpun1=this.getC(0).reflectXY(pun1[0],pun1[1]);
			var refpun1x= refpun1[0];
			var refpun1y= refpun1[1];
			var ctx = zc.getContext();
			var dx = x3;
			var dy = y3;
			// var dx = 1;
			// var dy = 2;
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			$U.drawPartialLine(ctx, refpun1x-dy, refpun1y-dx, refpun1x + dy, refpun1y + dx, true, true);
			ctx.stroke();
		
		}
		else if (len > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_Syma_help_1e;
			var ctx = zc.getContext();
			var pun1=[selection[0].getP1().getX(), selection[0].getP1().getY()];
			var pun2=[selection[0].getP2().getX(), selection[0].getP2().getY()];
			var refpun1=this.getC(0).reflectXY(pun1[0],pun1[1]);
			var refpun2=this.getC(0).reflectXY(pun2[0],pun2[1]);
			ctx.lineWidth = zc.prefs.size.line;
			ctx.strokeStyle = zc.prefs.color.hilite;
			$U.drawPartialLine(ctx, refpun1[0], refpun1[1], refpun2[0], refpun2[1], false, true);
			ctx.stroke();
		
		}
		else if (len > 0 && selection[0].getCode()=="arc3pts") {
			texto2= $L.tool_Syma_help_1h;
			var ctx = zc.getContext();
			var pun1=[selection[0].getA().getX(), selection[0].getA().getY()];
			var pun2=[selection[0].getB().getX(), selection[0].getB().getY()];
			var pun3=[selection[0].getC().getX(), selection[0].getC().getY()];
			var refpun1=this.getC(0).reflectXY(pun1[0],pun1[1]);
			var refpun2=this.getC(0).reflectXY(pun2[0],pun2[1]);
			var refpun3=this.getC(0).reflectXY(pun3[0],pun3[1]);
			var t = $U.computeArcParams(refpun1[0], refpun1[1], refpun2[0], refpun2[1], refpun3[0], refpun3[1]);
                    xM = t.centerX;
					
                    yM = t.centerY;
					
                    fromA = t.startAngle;
                    toA = t.endAngle;
                    trig = t.Trigo;
                    var r = $U.computeRay(t.centerX, t.centerY, refpun1[0], refpun1[1]);
					ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.arc(xM, yM, r, -fromA, -toA, trig);
        ctx.stroke();
					
		
		}
		else if (len > 0 && selection[0].isInstanceType("circle")) {
			texto2= $L.tool_Syma_help_1f;
			var ctx = zc.getContext();
			var cent=[selection[0].getP1().getX(), selection[0].getP1().getY()]
			var center=this.getC(0).reflectXY(cent[0],cent[1]);
				x1=center[0];
				y1=center[1];
			var R=selection[0].getR();
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			ctx.arc(x1, y1, R, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
			
		
		}
		else if (len > 0 && selection[0].getCode()=="vector") {
			texto2= $L.tool_Syma_help_1g;
			var ctx = zc.getContext();
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			var coords1 = this.getC(0).reflectXY(selection[0].getXmin(), selection[0].getYmin());
			var coords2 = this.getC(0).reflectXY(selection[0].getXmax(), selection[0].getYmax());
			var x1 = coords2[0],
				y1 = coords2[1];
			var x2 = coords1[0],
				y2 = coords1[1];
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
			  
			  ctx.moveTo(this.getC(0).reflectXY(Puntos[0].getX(),Puntos[0].getY())[0],this.getC(0).reflectXY(Puntos[0].getX(),Puntos[0].getY())[1]);
			  for (var i = 1; i < len; i++) {
				ctx.lineTo(this.getC(0).reflectXY(Puntos[i].getX(),Puntos[i].getY())[0],this.getC(0).reflectXY(Puntos[i].getX(),Puntos[i].getY())[1]);
			  }
			  ctx.lineTo(this.getC(0).reflectXY(Puntos[0].getX(),Puntos[0].getY())[0],this.getC(0).reflectXY(Puntos[0].getX(),Puntos[0].getY())[1]);
			  ctx.closePath();
			  ctx.fill();
		}
		else if (len == 0) {
			texto2=$L.tool_Syma_help_1a;
			
		
		var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }
        var coords = this.getC(0).reflectXY(zc.mouseX(ev), zc.mouseY(ev));
        var ctx = zc.getContext();
		
		ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.beginPath();
		ctx.arc(coords[0], coords[1], size, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
		}
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText(texto2+this.getC(0).getName()+"?",zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getP1().getX()+20,this.getC(0).getP1().getY());
		
		
    };
}
