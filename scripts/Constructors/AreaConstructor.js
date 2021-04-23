//************************************************
//**************** AREA CONSTRUCTOR **************
//************************************************
function AreaConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage
    var col = new Color();

    this.getCode = function() {
        return "area";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_area;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        var len = c.length;
        if ((len > 1) && (c[0] === c[len - 1])) {
            return true;
        }
        return false;
    };



    this.newObj = function(_zc, _C) {
        var a = new AreaObject(_zc.getConstruction(), "_pol", _C);
        a.setOpacity(_zc.prefs.opacity.area);
        return (a);
    };

    this.preview = function(ev, zc) {
		
        var ctx = zc.getContext();
        ctx.font = "16px Verdana";
		ctx.fillStyle=zc.prefs.color.hilite;
		col.set(zc.prefs.color.area);
        col.setOpacity(zc.prefs.opacity.area);
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.fillStyle = col.getRGBA();
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var leng = selection.length;
		var c = this.getCList();
        var len = c.length;
	var text = $L.tool_area_help;
	
		var texto2=$L.tool_area_help_2a;
        ctx.moveTo(this.getC(0).getX(), this.getC(0).getY());
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
		text = text + this.getC(0).getName();
		ctx.fillText(text,zc.mouseX(ev), zc.mouseY(ev));
		if (leng > 0 && selection[0].isInstanceType("point")) {
			texto2= $L.tool_area_help_2b;
		}
		if (leng > 0 && selection[0].getCode()=="segment") {
			texto2= $L.tool_area_help_2c;
		}
		if (leng > 0 && selection[0].getCode()=="line") {
			texto2= $L.tool_area_help_2d;
		}
		if (leng > 0 && selection[0].getCode()=="perpbis") {
			texto2= $L.tool_area_help_2d;
		}
		if (leng > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_area_help_2e;
		}
		if (leng > 0 && selection[0].getCode()=="anglebiss") {
			texto2= $L.tool_area_help_2e;
		}
		if (leng > 0 && selection[0].getCode()=="fixedangle") {
			texto2= $L.tool_area_help_2e;
		}
		if (leng > 0 && selection[0].isInstanceType("circle")) {
			texto2= $L.tool_area_help_2f;
		}
		if (leng > 0 && selection[0].getCode()=="vector") {
			texto2= $L.tool_area_help_2g;
		}
		if (leng > 0 && selection[0].getCode()=="arc3pts") {
			texto2= $L.tool_area_help_2h;
		}
		if (leng == 0) {
			texto2=$L.tool_area_help_2a;
		}
		if (leng == 2) {
			texto2=$L.tool_area_help_2_intersection;
		}
        for (var i = 1; i < len; i++) {
			
            ctx.lineTo(this.getC(i).getX(), this.getC(i).getY());
			text = text + ", "+this.getC(i).getName();
			
			ctx.fillText(text,zc.mouseX(ev), zc.mouseY(ev));
			ctx.fillText(texto2,zc.mouseX(ev), zc.mouseY(ev)+20);
			ctx.fillText(this.getC(i).getName(),this.getC(i).getX()+20,this.getC(i).getY());
        }
        ctx.lineTo(zc.mouseX(ev), zc.mouseY(ev));
        ctx.stroke();
        ctx.fill();
    };
}
