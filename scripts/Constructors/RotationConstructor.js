//************************************************
//************** ROTATION CONSTRUCTOR ************
//************************************************
function RotationConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "rot";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_rotate;
    }

    this.getInitials = function() {
        return ["point,expression"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 3);
    };

    this.newObj = function(_zc, _C) {
		if (_C[1].getCode()=="arc3pts") {
            return new RotationArcObject(_zc.getConstruction(), "_ar", _C[0], _C[1], _C[2]);
		
        }
		else if (_C[1].isInstanceType("circle")) {
			return new RotationCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1], _C[2]);
		}
		else if (_C[1].getCode()=="vector") {
			return new RotationVectorObject(_zc.getConstruction(), "_v", _C[0], _C[1], _C[2]);
		}
		else if (_C[1].isInstanceType("segment")) {
			return new RotationSegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1], _C[2]);
		}
		else if (_C[1].isInstanceType("ray")) {
			return new RotationRayObject(_zc.getConstruction(), "_sr", _C[0], _C[1], _C[2]);
		}
		else if (_C[1].isInstanceType("point")) {
			return new RotationPointObject(_zc.getConstruction(), "_P", _C[0], _C[1], _C[2]);
		}
		else if (_C[1].isInstanceType("area")) {
			return new RotationAreaObject(_zc.getConstruction(), "_pol", _C[0], _C[1], _C[2]);
		}
		else if (_C[1].isInstanceType("line")) {
			return new RotationLineObject(_zc.getConstruction(), "_r", _C[0], _C[1], _C[2]);
		}
		else {
			return new RotationPointObject(_zc.getConstruction(), "_P", _C[0], _C[1], _C[2]);
		};	
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
       //MEAG añadido para cambiar el mensaje
		 var cn = zc.getConstruction();
         var selection = cn.getIndicated();
         var leng = selection.length;
		 var c = this.getCList();
		 var len = c.length;
		 var size = zc.prefs.size.point;
		 var x;
        var y;
        var x_temp;
        var y_temp;
        var rad;
		 var ctx = zc.getContext();
		  rad = -c[0].getValue() / 180 * Math.PI;
		texto2=$L.tool_Rotation_help_2a;
		texto3=$L.tool_Rotation_help_3a;
		 if (len==1){
			 if (leng == 1 && selection[0].isInstanceType("point")) {
				 texto2= $L.tool_Rotation_help_2b;
			 }
			 else if (leng == 1 && selection[0].getCode()=="segment") {
				 texto2= $L.tool_Rotation_help_2c;
			 }
			 else if (leng == 1 && selection[0].getCode()=="line") {
				 texto2= $L.tool_Rotation_help_2d;
			 }
			
			 else if (leng == 1 && selection[0].getCode()=="ray") {
				 texto2= $L.tool_Rotation_help_2e;
			 }
			else if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto2= $L.tool_Rotation_help_2h;
			}
			else  if (leng == 1 && selection[0].isInstanceType("circle")) {
				 texto2= $L.tool_Rotation_help_2f;
			 }
			 else if (leng == 1 && selection[0].getCode()=="vector") {
				 texto2= $L.tool_Rotation_help_2g;
			 }
			else if (leng == 1 && selection[0].getCode()=="area") {
				 texto2= $L.tool_Rotation_help_2i;
			 }
			 else if (leng == 0) {
				 texto2=$L.tool_Rotation_help_2a;
			 }
			 else if (leng == 2) {
			 texto2=$L.tool_Rotation_help_2_intersection;
			}
		 }
		 if (len==2) {
		 
			 if (leng == 1 && selection[0].isInstanceType("point")) {
				 texto3= $L.tool_Rotation_help_3b;
				 
				 if (c[1].isInstanceType("point")) {
					
					x_temp = c[1].getX() - selection[0].getX() ;
					y_temp = c[1].getY() - selection[0].getY();
					x = x_temp * Math.cos(rad) - y_temp * Math.sin(rad) + selection[0].getX();
					y = x_temp * Math.sin(rad) + y_temp * Math.cos(rad) + selection[0].getY();
					ctx.beginPath();
					ctx.arc(x, y, size, 0, Math.PI * 2, true);
					ctx.fill();
					ctx.closePath();
					ctx.stroke();
				}
				else if (c[1].getCode()=="vector") {
					
					x1_temp = c[1].getXmin() - selection[0].getX() ;
					y1_temp = c[1].getYmin() - selection[0].getY();
					x2 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
					y2 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
					x2_temp = c[1].getXmax() - selection[0].getX() ;
					y2_temp = c[1].getYmax() - selection[0].getY();
					x1 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + selection[0].getX();
					y1 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + selection[0].getY();
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
				else if (c[1].isInstanceType("segment")) {
					x1_temp = c[1].getXmin() - selection[0].getX() ;
					y1_temp = c[1].getYmin() - selection[0].getY();
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
					x2_temp = c[1].getXmax() - selection[0].getX() ;
					y2_temp = c[1].getYmax() - selection[0].getY();
					x2 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + selection[0].getX();
					y2 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + selection[0].getY();
					
					
				
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.pointborder;
					ctx.beginPath();
					ctx.moveTo(x1,y1);
					ctx.lineTo(x2,y2);
					
					ctx.closePath();
					ctx.stroke();
				}
				else if (c[1].isInstanceType("line")||c[1].getCode()=="plumb"||c[1].getCode()=="parallel"){
					x_temp = c[1].getP1().getX() - selection[0].getX() ;
					y_temp = c[1].getP1().getY() - selection[0].getY();
					x = x_temp * Math.cos(rad) - y_temp * Math.sin(rad) + selection[0].getX();
					y = x_temp * Math.sin(rad) + y_temp * Math.cos(rad) + selection[0].getY();
					
					var x1 = c[1].getNDX();
					var y1 = -c[1].getNDY();
					
					dx = x1 * Math.cos(-rad) - y1 * Math.sin(-rad) ;
					dy = x1 * Math.sin(-rad) + y1 * Math.cos(-rad) ;
					
					
					
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.line;
					$U.drawPartialLine(ctx, x, y, x - dx, y + dy, true, true);
					ctx.stroke();
					
				}
				else if (c[1].isInstanceType("ray")) {
					
					x1_temp = c[1].getXmin() - selection[0].getX() ;
					y1_temp = c[1].getYmin() - selection[0].getY();
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
					x2_temp = c[1].getXmax() - selection[0].getX() ;
					y2_temp = c[1].getYmax() - selection[0].getY();
					x2 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + selection[0].getX();
					y2 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + selection[0].getY();
					ctx.lineWidth = zc.prefs.size.line;
					ctx.strokeStyle = zc.prefs.color.hilite;
					$U.drawPartialLine(ctx, x1, y1, x2, y2, false, true);
					ctx.stroke();
		
				}
				else if (c[1].getCode()=="arc3pts") {
					
					x1_temp = c[1].getA().getX() - selection[0].getX() ;
					y1_temp = c[1].getA().getY() - selection[0].getY();
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
					x2_temp = c[1].getB().getX() - selection[0].getX() ;
					y2_temp = c[1].getB().getY() - selection[0].getY();
					x2 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + selection[0].getX();
					y2 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + selection[0].getY();
					x3_temp = c[1].getC().getX() - selection[0].getX() ;
					y3_temp = c[1].getC().getY() - selection[0].getY();
					x3 = x3_temp * Math.cos(rad) - y3_temp * Math.sin(rad) + selection[0].getX();
					y3 = x3_temp * Math.sin(rad) + y3_temp * Math.cos(rad) + selection[0].getY();
					
					var t = $U.computeArcParams(x1, y1, x2, y2, x3, y3);
					xM = t.centerX;
							
					yM = t.centerY;
							
					fromA = t.startAngle;
					toA = t.endAngle;
					trig = t.Trigo;
					var r = $U.computeRay(t.centerX, t.centerY, x1, y1);
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.line;
					ctx.beginPath();
					ctx.arc(xM, yM, r, -fromA, -toA, trig);
					ctx.stroke();
								
					
					}
				else if (c[1].isInstanceType("circle")) {
					
					var cent=[c[1].getP1().getX(), c[1].getP1().getY()];
					x1_temp = c[1].getP1().getX() - selection[0].getX() ;
					y1_temp = c[1].getP1().getY() - selection[0].getY();
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
					
					var R=c[1].getR();
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.line;
					ctx.beginPath();
					ctx.arc(x1, y1, R, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.stroke();
					
				
				}
						else if (c[1].getCode()=="area") {
							
							var col = new Color();
							col.set(zc.prefs.color.area);
							col.setOpacity(zc.prefs.opacity.area);
							ctx.strokeStyle = zc.prefs.color.hilite;
							ctx.fillStyle = col.getRGBA();
							ctx.lineWidth = zc.prefs.size.line;
							ctx.beginPath();
							
							var Puntos=c[1].getPtab();
							
							  var len = Puntos.length;
							  x1_temp = Puntos[0].getX() - selection[0].getX() ;
								y1_temp = Puntos[0].getY() - selection[0].getY();
								x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
								y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
							  ctx.moveTo(x1,y1);
							  for (var i = 1; i < len; i++) {
								 xi_temp = Puntos[i].getX() - selection[0].getX() ;
								yi_temp = Puntos[i].getY() - selection[0].getY();
								xi = xi_temp * Math.cos(rad) - yi_temp * Math.sin(rad) + selection[0].getX();
								yi = xi_temp * Math.sin(rad) + yi_temp * Math.cos(rad) + selection[0].getY(); 
								ctx.lineTo(xi,yi);
							  }
							  x1_temp = Puntos[0].getX() - selection[0].getX() ;
								y1_temp = Puntos[0].getY() - selection[0].getY();
								x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + selection[0].getX();
								y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + selection[0].getY();
							  ctx.lineTo(x1,y1);
							  ctx.closePath();
							  ctx.fill();
						}
				
			 }
			 
			 else if (leng == 0) {
				 texto3=$L.tool_Rotation_help_3a;
				 if (this.getC(1).isInstanceType("point")) {
					 rad = -this.getC(0).getValue() / 180 * Math.PI;
					x_temp = this.getC(1).getX() - zc.mouseX(ev);
					y_temp = this.getC(1).getY() - zc.mouseY(ev);
					x = x_temp * Math.cos(rad) - y_temp * Math.sin(rad) + zc.mouseX(ev);
					y = x_temp * Math.sin(rad) + y_temp * Math.cos(rad) + zc.mouseY(ev);
					ctx.beginPath();
					ctx.arc(x, y, size, 0, Math.PI * 2, true);
					ctx.fill();
					ctx.closePath();
					ctx.stroke();
				}
				else if (c[1].getCode()=="vector") {
					
					x1_temp = c[1].getXmin() - zc.mouseX(ev) ;
					y1_temp = c[1].getYmin() - zc.mouseY(ev);
					x2 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
					y2 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
					x2_temp = c[1].getXmax() - zc.mouseX(ev) ;
					y2_temp = c[1].getYmax() - zc.mouseY(ev);
					x1 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + zc.mouseX(ev);
					y1 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + zc.mouseY(ev);
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
				else if (c[1].isInstanceType("segment")) {
					x1_temp = c[1].getXmin() - zc.mouseX(ev) ;
					y1_temp = c[1].getYmin() - zc.mouseY(ev);
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
					x2_temp = c[1].getXmax() - zc.mouseX(ev) ;
					y2_temp = c[1].getYmax() - zc.mouseY(ev);
					x2 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + zc.mouseX(ev);
					y2 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + zc.mouseY(ev);
					
					
				
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.pointborder;
					ctx.beginPath();
					ctx.moveTo(x1,y1);
					ctx.lineTo(x2,y2);
					ctx.closePath();
					ctx.stroke();
				}
				else if (c[1].isInstanceType("line")||c[1].getCode()=="plumb"||c[1].getCode()=="parallel"){
					x_temp = c[1].getP1().getX() - zc.mouseX(ev) ;
					y_temp = c[1].getP1().getY() - zc.mouseY(ev);
					x = x_temp * Math.cos(rad) - y_temp * Math.sin(rad) + zc.mouseX(ev);
					y = x_temp * Math.sin(rad) + y_temp * Math.cos(rad) + zc.mouseY(ev);
					
					var x1 = c[1].getNDX();
					var y1 = -c[1].getNDY();
					
					dx = x1 * Math.cos(-rad) - y1 * Math.sin(-rad) ;
					dy = x1 * Math.sin(-rad) + y1 * Math.cos(-rad) ;
					
					
					
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.line;
					$U.drawPartialLine(ctx, x, y, x - dx, y + dy, true, true);
					ctx.stroke();
					
				}
				else if (c[1].isInstanceType("ray")) {
					
					x1_temp = c[1].getXmin() - zc.mouseX(ev) ;
					y1_temp = c[1].getYmin() - zc.mouseY(ev);
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
					x2_temp = c[1].getXmax() - zc.mouseX(ev) ;
					y2_temp = c[1].getYmax() - zc.mouseY(ev);
					x2 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + zc.mouseX(ev);
					y2 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + zc.mouseY(ev);
					ctx.lineWidth = zc.prefs.size.line;
					ctx.strokeStyle = zc.prefs.color.hilite;
					$U.drawPartialLine(ctx, x1, y1, x2, y2, false, true);
					ctx.stroke();
		
				}
				else if (c[1].getCode()=="arc3pts") {
					
					x1_temp = c[1].getA().getX() - zc.mouseX(ev) ;
					y1_temp = c[1].getA().getY() - zc.mouseY(ev);
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
					x2_temp = c[1].getB().getX() - zc.mouseX(ev) ;
					y2_temp = c[1].getB().getY() - zc.mouseY(ev);
					x2 = x2_temp * Math.cos(rad) - y2_temp * Math.sin(rad) + zc.mouseX(ev);
					y2 = x2_temp * Math.sin(rad) + y2_temp * Math.cos(rad) + zc.mouseY(ev);
					x3_temp = c[1].getC().getX() - zc.mouseX(ev) ;
					y3_temp = c[1].getC().getY() - zc.mouseY(ev);
					x3 = x3_temp * Math.cos(rad) - y3_temp * Math.sin(rad) + zc.mouseX(ev);
					y3 = x3_temp * Math.sin(rad) + y3_temp * Math.cos(rad) + zc.mouseY(ev);
					
					var t = $U.computeArcParams(x1, y1, x2, y2, x3, y3);
							xM = t.centerX;
							
							yM = t.centerY;
							
							fromA = t.startAngle;
							toA = t.endAngle;
							trig = t.Trigo;
							var r = $U.computeRay(t.centerX, t.centerY, x1, y1);
							ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.line;
					ctx.beginPath();
					ctx.arc(xM, yM, r, -fromA, -toA, trig);
					ctx.stroke();
								
					
					}
				else if (c[1].isInstanceType("circle")) {
					
					var cent=[c[1].getP1().getX(), c[1].getP1().getY()];
					x1_temp = c[1].getP1().getX() - zc.mouseX(ev) ;
					y1_temp = c[1].getP1().getY() - zc.mouseY(ev);
					x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
					y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
					
					var R=c[1].getR();
					ctx.strokeStyle = zc.prefs.color.hilite;
					ctx.lineWidth = zc.prefs.size.line;
					ctx.beginPath();
					ctx.arc(x1, y1, R, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.stroke();
					
				
				}
				else if (c[1].getCode()=="area") {
							
							var col = new Color();
							col.set(zc.prefs.color.area);
							col.setOpacity(zc.prefs.opacity.area);
							ctx.strokeStyle = zc.prefs.color.hilite;
							ctx.fillStyle = col.getRGBA();
							ctx.lineWidth = zc.prefs.size.line;
							ctx.beginPath();
							
							var Puntos=c[1].getPtab();
							
							  var len = Puntos.length;
							  x1_temp = Puntos[0].getX() - zc.mouseX(ev) ;
								y1_temp = Puntos[0].getY() - zc.mouseY(ev);
								x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
								y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
							  ctx.moveTo(x1,y1);
							  for (var i = 1; i < len; i++) {
								 xi_temp = Puntos[i].getX() - zc.mouseX(ev) ;
								yi_temp = Puntos[i].getY() - zc.mouseY(ev);
								xi = xi_temp * Math.cos(rad) - yi_temp * Math.sin(rad) + zc.mouseX(ev);
								yi = xi_temp * Math.sin(rad) + yi_temp * Math.cos(rad) + zc.mouseY(ev); 
								ctx.lineTo(xi,yi);
							  }
							  x1_temp = Puntos[0].getX() - zc.mouseX(ev) ;
								y1_temp = Puntos[0].getY() - zc.mouseY(ev);
								x1 = x1_temp * Math.cos(rad) - y1_temp * Math.sin(rad) + zc.mouseX(ev);
								y1 = x1_temp * Math.sin(rad) + y1_temp * Math.cos(rad) + zc.mouseY(ev);
							    ctx.lineTo(x1,y1);
							  ctx.closePath();
							  ctx.fill();
						}
				
			 }
		 
			 else if (leng == 2) {
			 texto3=$L.tool_Rotation_help_3_intersection;
			 }
		 }
		 
		//MEAG
        
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }

        
        
        
       
        // ctx.strokeStyle = zc.prefs.color.hilite;
        // ctx.lineWidth = zc.prefs.size.pointborder;
        // ctx.beginPath();
        // ctx.arc(x, y, size, 0, Math.PI * 2, true);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        switch (len){
            case 1:
                ctx.fillStyle=zc.prefs.color.hilite;
		        ctx.font = "16px Verdana";
		        ctx.fillText($L.tool_Rotation_help_1+c[0].getValue()+"° " +texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
                
                break;
            case 2:
                ctx.fillStyle=zc.prefs.color.hilite;
                ctx.font = "16px Verdana";
                ctx.fillText($L.tool_Rotation_help_1+c[0].getValue()+"° " + c[1].getName() + texto3, zc.mouseX(ev)+40, zc.mouseY(ev));
            
            break;
        };
    }
}
