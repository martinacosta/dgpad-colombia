//************************************************
//*************** Translation CONSTRUCTOR ***********
//************************************************
function TranslationConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "trans";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_trans;
    }

    this.getInitials = function() {
        return ["line", "point"];
    };

    this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    };
	
	this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 2);
    };

    this.newObj = function(_zc, _C) {
		
		if (_C[1].getCode()=="arc3pts") {
            return new TransArcObject(_zc.getConstruction(), "_ar", _C[0], _C[1]);
		
        }
		else if (_C[1].isInstanceType("circle")) {
            return new TransCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
        }
		else if (_C[1].getCode()=="vector") {
            return new TransVectorObject(_zc.getConstruction(), "_v", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("segment")) {
            return new TransSegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("ray")) {
            return new TransRayObject(_zc.getConstruction(), "_sr", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("point")) {
            return new TransPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("area")) {
            return new TransAreaObject(_zc.getConstruction(), "_Pol", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("line")) {
            return new TransLineObject(_zc.getConstruction(), "_r", _C[0], _C[1]);
        }
		else {
			return new TransPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
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
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
		 var size = zc.prefs.size.point;
        if (len > 0 && selection[0].isInstanceType("point")) {
			texto2= $L.tool_Trans_help_1b;
			var x1=(this.getC(0).getXmin()-this.getC(0).getXmax())+selection[0].getX();
			var y1=(this.getC(0).getYmin()-this.getC(0).getYmax())+selection[0].getY();
			var size = zc.prefs.size.point;
			ctx.beginPath();
			ctx.arc(x1, y1, size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();
		}
		else if (len > 0 && selection[0].getCode()=="segment") {
			texto2= $L.tool_Trans_help_1c;
			var x1=(this.getC(0).getXmin()-this.getC(0).getXmax())+selection[0].getXmin();
			var y1=(this.getC(0).getYmin()-this.getC(0).getYmax())+selection[0].getYmin();
			var x2=(this.getC(0).getXmin()-this.getC(0).getXmax())+selection[0].getXmax();
			var y2=(this.getC(0).getYmin()-this.getC(0).getYmax())+selection[0].getYmax();
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.closePath();
			ctx.stroke();
		}
		else if (len > 0 && selection[0].getCode()=="vector") {
			texto2= $L.tool_Trans_help_1g;
			var x2=(this.getC(0).getXmin()-this.getC(0).getXmax())+selection[0].getXmin();
			var y2=(this.getC(0).getYmin()-this.getC(0).getYmax())+selection[0].getYmin();
			var x1=(this.getC(0).getXmin()-this.getC(0).getXmax())+selection[0].getXmax();
			var y1=(this.getC(0).getYmin()-this.getC(0).getYmax())+selection[0].getYmax();
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
		else if (len > 0 && (selection[0].getCode()=="line"||selection[0].getCode()=="plumb"||selection[0].getCode()=="parallel")) {
			texto2= $L.tool_Trans_help_1d;
			pun1=[selection[0].getP1().getX(), selection[0].getP1().getY()];
			var dx = selection[0].getNDY();
			var dy = selection[0].getNDX();
			transpun1x=(this.getC(0).getXmin()-this.getC(0).getXmax())+ pun1[0];
			transpun1y=(this.getC(0).getYmin()-this.getC(0).getYmax())+ pun1[1];
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			$U.drawPartialLine(ctx, transpun1x-dy, transpun1y-dx, transpun1x + dy, transpun1y + dx, true, true);
			ctx.stroke();
		}
		else if (len > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_Trans_help_1e;
			var pun1=[selection[0].getP1().getX(), selection[0].getP1().getY()];
			var pun2=[selection[0].getP2().getX(), selection[0].getP2().getY()];
			transpun1x=(this.getC(0).getXmin()-this.getC(0).getXmax())+ pun1[0];
			transpun1y=(this.getC(0).getYmin()-this.getC(0).getYmax())+ pun1[1];
			transpun2x=(this.getC(0).getXmin()-this.getC(0).getXmax())+ pun2[0];
			transpun2y=(this.getC(0).getYmin()-this.getC(0).getYmax())+ pun2[1];
			
			ctx.lineWidth = zc.prefs.size.line;
			ctx.strokeStyle = zc.prefs.color.hilite;
			$U.drawPartialLine(ctx, transpun1x, transpun1y, transpun2x, transpun2y, false, true);
			ctx.stroke();
		}
		else if (len > 0 && selection[0].getCode()=="arc3pts") {
			texto2= $L.tool_Trans_help_1h;
			var pun1=[selection[0].getA().getX(), selection[0].getA().getY()];
			var pun2=[selection[0].getB().getX(), selection[0].getB().getY()];
			var pun3=[selection[0].getC().getX(), selection[0].getC().getY()];
			var transpun1x=(this.getC(0).getXmin()-this.getC(0).getXmax())+ pun1[0];
			var transpun1y=(this.getC(0).getYmin()-this.getC(0).getYmax())+ pun1[1];
			var transpun2x=(this.getC(0).getXmin()-this.getC(0).getXmax())+ pun2[0];
			var transpun2y=(this.getC(0).getYmin()-this.getC(0).getYmax())+ pun2[1];
			var transpun3x=(this.getC(0).getXmin()-this.getC(0).getXmax())+ pun3[0];
			var transpun3y=(this.getC(0).getYmin()-this.getC(0).getYmax())+ pun3[1];
			var t = $U.computeArcParams(transpun1x, transpun1y, transpun2x, transpun2y, transpun3x, transpun3y);
                    xM = t.centerX;
					
                    yM = t.centerY;
					
                    fromA = t.startAngle;
                    toA = t.endAngle;
                    trig = t.Trigo;
                    var r = $U.computeRay(t.centerX, t.centerY, transpun1x, transpun1y);
					ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			ctx.arc(xM, yM, r, -fromA, -toA, trig);
			ctx.stroke();
		}
		else if (len > 0 && selection[0].isInstanceType("circle")) {
			texto2= $L.tool_Trans_help_1f;
			var cent=[selection[0].getP1().getX(), selection[0].getP1().getY()]
			
				x1=this.getC(0).getXmin()-this.getC(0).getXmax()+  cent[0];
				y1=this.getC(0).getYmin()-this.getC(0).getYmax()+ cent[1];
			var R=selection[0].getR();
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			ctx.arc(x1, y1, R, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
		}
		
		
		else if (len > 0 && selection[0].getCode()=="area") {
			texto2= $L.tool_Trans_help_1i;
			var col = new Color();
			col.set(zc.prefs.color.area);
			col.setOpacity(zc.prefs.opacity.area);
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.fillStyle = col.getRGBA();
			ctx.lineWidth = zc.prefs.size.line;
			ctx.beginPath();
			
			var Puntos=selection[0].getPtab();
			
			  var len = Puntos.length;
			  
			  ctx.moveTo(this.getC(0).getXmin()-this.getC(0).getXmax()+ Puntos[0].getX(),this.getC(0).getYmin()-this.getC(0).getYmax()+Puntos[0].getY());
			  for (var i = 1; i < len; i++) {
				ctx.lineTo(this.getC(0).getXmin()-this.getC(0).getXmax()+Puntos[i].getX(),this.getC(0).getYmin()-this.getC(0).getYmax()+Puntos[i].getY());
			  }
			  ctx.lineTo(this.getC(0).getXmin()-this.getC(0).getXmax()+ Puntos[0].getX(),this.getC(0).getYmin()-this.getC(0).getYmax()+Puntos[0].getY());
			  ctx.closePath();
			  ctx.fill();
		}
		else if (len == 0) {
			texto2=$L.tool_Trans_help_1a;
			var x1=(this.getC(0).getXmin()-this.getC(0).getXmax())+zc.mouseX(ev);
			var y1=(this.getC(0).getYmin()-this.getC(0).getYmax())+zc.mouseY(ev);
			var size = zc.prefs.size.point;
			ctx.beginPath();
			ctx.arc(x1, y1, size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();
		}
		
		//fin MEAG
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        
        
		
			
			
        
            ctx.fillStyle=zc.prefs.color.hilite;
            ctx.font = "16px Verdana";
			ctx.fillText(texto2+this.getC(0).getName()+"?",zc.mouseX(ev), zc.mouseY(ev));
			ctx.fillText(this.getC(0).getName(),(this.getC(0).getXmin()+this.getC(0).getXmax())/2+20,(this.getC(0).getYmin()+this.getC(0).getYmax())/2);
    };
}
