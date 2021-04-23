//************************************************
//*************** CIRCLE CONSTRUCTOR *************
//************************************************
function Circle3Constructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "circle3";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_circle3;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 3);
    };

    this.newObj = function(_zc, _C) {
        return new Circle3Object(_zc.getConstruction(), "_c", _C[0], _C[1], _C[2]);
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
				texto2= $L.tool_Circle3_help_2b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto2= $L.tool_Circle3_help_2c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto2= $L.tool_Circle3_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto2= $L.tool_Circle3_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto2= $L.tool_Circle3_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto2= $L.tool_Circle3_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto2= $L.tool_Circle3_help_2e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto2= $L.tool_Circle3_help_2f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto2= $L.tool_Circle3_help_2g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto2= $L.tool_Circle3_help_2h;
			}
			if (leng == 0) {
				texto2=$L.tool_Circle3_help_2a;
			}
			if (leng == 2) {
			texto2=$L.tool_Circle3_help_2_intersection;
			}
		}
		if (len=2) {
			if (leng == 1 && selection[0].isInstanceType("point")) {
				texto3= $L.tool_Circle3_help_3b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto3= $L.tool_Circle3_help_3c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto3= $L.tool_Circle3_help_3d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto3= $L.tool_Circle3_help_3d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto3= $L.tool_Circle3_help_3e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto3= $L.tool_Circle3_help_3e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto3= $L.tool_Circle3_help_3e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto3= $L.tool_Circle3_help_3f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto3= $L.tool_Circle3_help_3g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto3= $L.tool_Circle3_help_3h;
			}
			if (leng == 0) {
				texto3=$L.tool_Circle3_help_3a;
			}
			if (leng == 2) {
			texto3=$L.tool_Circle3_help_3_intersection;
			}
		}
		//fin MEAG
		var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        var c = this.getCList();
        var len = c.length;
        var r;
        ctx.beginPath();
        switch (len) {
            case 1:
                
				ctx.beginPath();
				r = $U.computeRay(this.getC(0).getX(), this.getC(0).getY(), zc.mouseX(ev), zc.mouseY(ev));
                ctx.arc(zc.mouseX(ev), zc.mouseY(ev), r, 0, Math.PI * 2, true);
				ctx.moveTo(this.getC(0).getX(), this.getC(0).getY());
				ctx.lineTo(zc.mouseX(ev), zc.mouseY(ev));
				
				ctx.closePath();
                break;
            case 2:
				ctx.beginPath();
                r = $U.computeRay(this.getC(0).getX(), this.getC(0).getY(), this.getC(1).getX(), this.getC(1).getY());
                if (this.isSelectCreatePoint) {
                    ctx.arc(this.getC(1).getX(), this.getC(1).getY(), r, 0, Math.PI * 2, true);
                    this.isSelectCreatePoint = false;
					
                } else {
                    ctx.arc(zc.mouseX(ev), zc.mouseY(ev), r, 0, Math.PI * 2, true);
                }
				
					ctx.moveTo(this.getC(0).getX(), this.getC(0).getY());
					ctx.lineTo(this.getC(1).getX(), this.getC(1).getY());
					ctx.closePath();
                break;
        }
        ctx.stroke();
		switch (len) {
            case 1:
               ctx.fillStyle=zc.prefs.color.hilite;
			   ctx.font = "16px Verdana";
				ctx.fillText($L.tool_Circle3_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
                
                break;
            case 2:
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "12px Verdana";
				ctx.fillText($L.tool_Circle3_help_1+this.getC(0).getName()+$L.tool_Circle3_help_1A+this.getC(1).getName()+texto3,zc.mouseX(ev)+40, zc.mouseY(ev));
                
                break;
        }
    };
}
