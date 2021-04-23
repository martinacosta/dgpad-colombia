//************************************************
//***************** ARC CONSTRUCTOR **************
//************************************************
function Arc3ptsConstructor() {
    $U.extend(this, new ObjectConstructor()); //Herencia

    this.getCode = function() {
        return "arc3pts";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_arc3pts;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 3);
    };

    this.newObj = function(_zc, _C) {
        var no = new Arc3ptsObject(_zc.getConstruction(), "_ar", _C[0], _C[1], _C[2]);
        no.getM().setHidden(true);
        return no;
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
				texto2= $L.tool_Arc_help_2b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto2= $L.tool_Arc_help_2c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto2= $L.tool_Arc_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto2= $L.tool_Arc_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto2= $L.tool_Arc_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto2= $L.tool_Arc_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto2= $L.tool_Arc_help_2e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto2= $L.tool_Arc_help_2f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto2= $L.tool_Arc_help_2g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto2= $L.tool_Arc_help_2h;
			}
			if (leng == 0) {
				texto2=$L.tool_Arc_help_2a;
			}
			if (leng == 2) {
			texto2=$L.tool_Arc_help_2_intersection;
		}
		}
		if (len=2) {
			if (leng == 1 && selection[0].isInstanceType("point")) {
				texto3= $L.tool_Arc_help_3b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto3= $L.tool_Arc_help_3c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto3= $L.tool_Arc_help_3d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto3= $L.tool_Arc_help_3d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto3= $L.tool_Arc_help_3e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto3= $L.tool_Arc_help_3e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto3= $L.tool_Arc_help_3e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto3= $L.tool_Arc_help_3f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto3= $L.tool_Arc_help_3g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto3= $L.tool_Arc_help_3h;
			}
			if (leng == 0) {
				texto3=$L.tool_Arc_help_3a;
			}
			if (leng == 2) {
			texto3=$L.tool_Arc_help_3_intersection;
			}
		}
		//fin MEAG
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        var c = this.getCList();
        var len = c.length;
        var xM = r = 0;
        var yM = 0;
        var fromA, toA, trig = true;
        switch (len) {
            case 1:
                xM = (c[0].getX() + zc.mouseX(ev)) / 2;
                yM = (c[0].getY() + zc.mouseY(ev)) / 2;
                r = $U.computeRay(xM, yM, c[0].getX(), c[0].getY());
                fromA = $U.angleH(zc.mouseX(ev) - xM, zc.mouseY(ev) - yM);
                toA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
                break;
            case 2:
                if (this.isSelectCreatePoint) {
                    xM = (c[0].getX() + c[1].getX()) / 2;
                    yM = (c[0].getY() + c[1].getY()) / 2;
                    r = $U.computeRay(xM, yM, c[0].getX(), c[0].getY());
                    fromA = $U.angleH(c[1].getX() - xM, c[1].getY() - yM);
                    toA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
                    this.isSelectCreatePoint = false;
                } else {
                    var t = $U.computeArcParams(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(ev), zc.mouseY(ev));
                    xM = t.centerX;
                    yM = t.centerY;
                    fromA = t.startAngle;
                    toA = t.endAngle;
                    trig = t.Trigo;
                    var r = $U.computeRay(t.centerX, t.centerY, c[0].getX(), c[0].getY());
                }
                break;
        }
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.arc(xM, yM, r, -fromA, -toA, trig);
        ctx.stroke();
		switch (len) {
            case 1:
               ctx.fillStyle=zc.prefs.color.hilite;
			   ctx.font = "16px Verdana";
				ctx.fillText($L.tool_Arc_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
                ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
                break;
            case 2:
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "16px Verdana";
				ctx.fillText($L.tool_Arc_help_1+this.getC(0).getName()+", "+this.getC(1).getName()+texto3,zc.mouseX(ev)+40, zc.mouseY(ev));
                ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
				ctx.fillText(this.getC(1).getName(),this.getC(1).getX()+20,this.getC(1).getY());
                break;

		};
    };
}
