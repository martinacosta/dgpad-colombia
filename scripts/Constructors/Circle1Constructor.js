//************************************************
//*************** CIRCLE CONSTRUCTOR *************
//************************************************
function Circle1Constructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage
    var R = 0;

    this.getCode = function() {
        return "circle1";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_circle1;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.selectCreatePoint = function(zc, ev) {};

    this.newObj = function(_zc, _C) {
		//JDIAZ 10/28
        var r = R / _zc.getConstruction().coordsSystem.getUnit();
        r = Math.round(r * 2) / 2;
        R = r *  _zc.getConstruction().coordsSystem.getUnit();
        //JDIAZ end
        return new Circle1Object(_zc.getConstruction(), "_c", _C[0], R);
    };

    this.preview = function(ev, zc) {
        var ctx = zc.getContext();
        R = $U.computeRay(this.getC(0).getX(), this.getC(0).getY(), zc.mouseX(ev), zc.mouseY(ev));
        //JDIAZ 10/28
        R = Math.round(R * 2) / 2;
        //JDIAZ end
		ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.arc(this.getC(0).getX(), this.getC(0).getY(), R, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
		ctx.fillStyle=zc.prefs.color.hilite;
        ctx.font = "16px Verdana";
        //JDIAZ begin
        radius = this.getC(0).getCn().coordsSystem.l(R);
        //JDIAZ 1028
        radius = Math.round(radius * 2) / 2;
        ctx.fillText($L.tool_Circle1_help_1+this.getC(0).getName() + $L.tool_Circle1_help_2 + radius,zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
        //JDIAZ end
		//ctx.fillText($L.tool_Circle1_help_1+this.getC(0).getName()+$L.tool_Circle1_help_2,zc.mouseX(ev)+40, zc.mouseY(ev));
        
    };
}
