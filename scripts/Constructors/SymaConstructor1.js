//************************************************
//*************** Sym Ax CONSTRUCTOR ***********
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
        return ["line"];
    };

    this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    };

    this.newObj = function(_zc, _C) {
        return new SymaObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
    };

    this.preview = function(ev, zc) {
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
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText($L.tool_Syma_help_1+this.getC(0).getName(),zc.mouseX(ev)+40, zc.mouseY(ev));
    };
}
