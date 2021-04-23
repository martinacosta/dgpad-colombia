function EraserManager(_canvas) {
    var me = this;
    var canvas = _canvas;
    var panel = null;

    me.filters = {
        "global": true
    };


    me.refreshDisplay = function() {
        var t = canvas.getConstruction().elements();
        var m = me.filters.global ? 2 : 1;
        for (var i = 0, len = t.length; i < len; i++) {
            t[i].setMode(m);
        }
        canvas.paint();
    }

    //JDIAZ 12/05
    // On a cliqué sur l'icône Gomme :
    var button;
    me.showPanel = function() {
        if (!panel) {
            var t;

            panel = new EraserPanel(canvas, me);
            t = panel.getOwnerBounds();
            panel.setBounds(t.right / 2 - 125, t.top, 250, 35);
            button = new ShowAll(canvas, me);
            panel.show();
            button.show();
            setTimeout(function() {
                me.refreshDisplay();
            }, 1);
        }
    };

    me.hidePanel = function() {
        if (panel) {
            panel.close();
            panel = null;
            button.hide();
        }
    };
    //JDIAZ end


}
