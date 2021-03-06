function FixedAngleConstructor() {
    var superobject = $U.extend(this, new ObjectConstructor()); //Héritage
    var AOC = 0;
    var AOC180 = 0;
    var trig = true;

    this.getCode = function() {
        return "fixedangle";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_fixedangle;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 3);
    };

    this.newObj = function(_zc, _C) {
        this.selectCreatePoint = superobject.selectCreatePoint;
        var angle = (_zc.getConstruction().isDEG()) ? Math.round(AOC180 * 180 / Math.PI) : AOC180;
        var obj = new FixedAngleObject(_zc.getConstruction(), "_A", _C[0], _C[1], trig);
        obj.setExp(angle);
        return (obj);
    };

    this.preview = function(ev, zc) {
		//MEAG añadido para reconocer un punto seleccionado y cambiar el mensaje
		var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var leng = selection.length;
		var c = this.getCList();
		var len = c.length;
		if (len==1){
			if (leng == 1 && selection[0].isInstanceType("point")) {
				texto2= $L.tool_FixedAngle_help_2b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto2= $L.tool_FixedAngle_help_2c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto2= $L.tool_FixedAngle_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto2= $L.tool_FixedAngle_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto2= $L.tool_FixedAngle_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto2= $L.tool_FixedAngle_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto2= $L.tool_FixedAngle_help_2e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto2= $L.tool_FixedAngle_help_2f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto2= $L.tool_FixedAngle_help_2g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto2= $L.tool_FixedAngle_help_2h;
			}
			if (leng == 0) {
				texto2=$L.tool_FixedAngle_help_2a;
			}
			if (leng == 2) {
			texto2=$L.tool_FixedAngle_help_2_intersection;
		}
		}
		
		//fin MEAG
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        var c = this.getCList();
        var len = c.length;
        var xM = yM = 0;
        var xA = yA = NaN;
        var fromA, toA = true;
        switch (len) {
            case 1:
                xM = zc.mouseX(ev);
                yM = zc.mouseY(ev);
                fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
                fromA = fromA - Math.PI / 6;
                toA = fromA + Math.PI / 3;
                trig = true;
				ctx.beginPath();
				ctx.moveTo(c[0].getX(), c[0].getY());
				ctx.lineTo(zc.mouseX(ev), zc.mouseY(ev));
				ctx.stroke();
				ctx.closePath();
                break;
            case 2:
                if (this.isSelectCreatePoint) {
                    //                    console.log("yes");
                    xM = c[1].getX();
                    yM = c[1].getY();
                    fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
                    fromA = fromA - Math.PI / 6;
                    toA = fromA + Math.PI / 3;
                    this.isSelectCreatePoint = false;
                    this.selectCreatePoint = function() {
                        this.getCList().push(new VirtualPointObject(0, 0))
                    };
                } else {
                    //                    console.log("no");
                    xM = c[1].getX();
                    yM = c[1].getY();
                    xA = zc.mouseX(ev);
                    yA = zc.mouseY(ev);
                    var t = $U.computeAngleParams(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(ev), zc.mouseY(ev));
                    fromA = t.startAngle;
                    toA = t.endAngle;
                    trig = t.Trigo;
                    var coef = Math.PI / 180;
                    AOC = Math.round(t.AOC / coef) * coef;
                    AOC180 = Math.round(t.AOC180 / coef) * coef;
                }
				ctx.beginPath();
				ctx.moveTo(c[0].getX(), c[0].getY());
				ctx.lineTo(c[1].getX(), c[1].getY());
				ctx.stroke();
				ctx.closePath();
                break;
        }
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.fixedangle;
        if (!isNaN(xA)) {
            var t = $U.computeBorderPoints(xM, yM, xA - xM, yA - yM, zc.getWidth(), zc.getHeight());
            ctx.beginPath();
            ctx.moveTo(xM, yM);
            ctx.lineTo(t[2], t[3]);
            ctx.stroke();
            ctx.closePath();
            ctx.save();

            var b = Math.sqrt((xM - xA) * (xM - xA) + (yM - yA) * (yM - yA));
            var a = Math.sqrt((xM - c[0].getX()) * (xM - c[0].getX()) + (yM - c[0].getY()) * (yM - c[0].getY()));
            var k = b / (a + b);
            var x = xA + k * (c[0].getX() - xA) - xM;
            var y = yA + k * (c[0].getY() - yA) - yM;
            var a = Math.atan2(y, x);
            var r = 30 + zc.prefs.fontmargin;
            ctx.textAlign = "left";
            var display = AOC180;
            display = display * 180 / Math.PI;
            display = Math.round(display);
            if (display > 180)
                a += Math.PI;

            if ((a < -$U.halfPI) || (a > $U.halfPI)) {
                a += Math.PI;
                r = -r;
                ctx.textAlign = "right";
            }
            ctx.strokeStyle = zc.prefs.color.fixedangle;
            ctx.fillStyle = ctx.strokeStyle;
            ctx.translate(xM, yM);
            ctx.rotate(a);

            ctx.fillText($L.number(display) + "°", r, 18 / 2);
            ctx.restore();
        }
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = ctx.lineWidth * 3;
        ctx.beginPath();
        ctx.arc(xM, yM, 30, -fromA, -toA, trig);
        ctx.stroke();
		switch (len) {
            case 1:
               ctx.fillStyle=zc.prefs.color.hilite;
			   ctx.font = "16px Verdana";
				ctx.fillText($L.tool_FixedAngle_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
                ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
                break;
            case 2:
				var display = AOC180;
				display = display * 180 / Math.PI;
				display = Math.round(display);
				if (display > 180)
                a += Math.PI;
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "16px Verdana";
				ctx.fillText($L.tool_FixedAngle_help_1+this.getC(0).getName()+", "+$L.tool_FixedAngle_help_2+this.getC(1).getName()+$L.tool_FixedAngle_help_3+$L.number(display)+"°",zc.mouseX(ev)+40, zc.mouseY(ev));
                ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
				ctx.fillText(this.getC(1).getName(),this.getC(1).getX()+20,this.getC(1).getY());
                break;
		};
    };
}
