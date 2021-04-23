/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function RemoveValue() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "removevalue";
    };

    // JDIAZ obtener el valor de _title
    this.getTitle = function() {
        return $L.tool_title_removevalue;
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
        obj.setPrecision(-1);
        if ((obj.getCode() === "locus") || (obj.getCode() === "quadric")) {
            obj.compute();
        }
    };

    this.selectCreatePoint = function(zc, ev) {};

    this.preview = function(ev, zc) {};


}