/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function CallValue() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "callvalue";
    };

    // MEAG obtener el valor de _title
    this.getTitle = function() {
        return $L.tool_title_callvalue;
    };

    // Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
    this.getType = function() {
        return 1;
    };

    this.isAcceptedInitial = function(o) {
        return true;
    };

    this.isInstantTool = function() {
        return true;
    };

    this.createObj = function(zc, ev) {
        var obj = this.getC(0);
        obj.setPrecision(2);
        if ((obj.getCode() === "locus") || (obj.getCode() === "quadric")) {
            obj.compute();
        }
		
    };

    this.selectCreatePoint = function(zc, ev) {};

    this.preview = function(ev, zc) {};


}
