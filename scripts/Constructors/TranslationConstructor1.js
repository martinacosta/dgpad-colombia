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

    this.newObj = function(_zc, _C) {
        return new TranslationObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
    };

    this.preview = function(ev, zc) {
        var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }
        var c = this.getCList();
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.fillStyle=zc.prefs.color.hilite;
        ctx.font = "16px Verdana";
        if (this.getC(0).isInstanceType("line"))
        {
            var x = zc.mouseX(ev) + c[0].getParent()[1].getX() - c[0].getParent()[0].getX();
            var y = zc.mouseY(ev) + + c[0].getParent()[1].getY() - c[0].getParent()[0].getY();
            //var x =  zc.mouseX(ev)+this.getParents(1).getX()-this.getParents(0).getX();
            //var y = zc.mouseY(ev)+this.getParents(1).getY()-this.getParents(0).getY();
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle=zc.prefs.color.hilite;
            ctx.font = "16px Verdana";
                
            ctx.fillText("Traslación de ? (seleccione un punto) por el vector "+this.getC(0).getName(),zc.mouseX(ev), zc.mouseY(ev));
        }
        else
            ctx.fillText("Traslación de ? (seleccione un vector) por el punto "+this.getC(0).getName(),zc.mouseX(ev), zc.mouseY(ev));
    };
}
