/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function NameMover() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "namemover";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_namemover;
    }

    // Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
    this.getType = function() {
        return 1;
    };

    this.isAcceptedInitial = function(o) {
        return true;
    };

    this.createObj = function(zc, ev) {
        //        console.log("createObj");
    };

    this.selectCreatePoint = function(zc, ev) {};

    this.preview = function(ev, zc) {
        var o = this.getC(0);
        // MEAG start
        o.nameMover(ev, zc);
        // MEAG end
        // original _code
        // var a = $U.angleH(o.getX() - zc.mouseX(ev), o.getY() - zc.mouseY(ev));
        // o.setNamePosition(a);
        // o.setShowName(true);
    };


}
