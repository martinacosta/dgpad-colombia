//JDIAZ 12/05
function ShowAll(_canvas, _man) {
    var me = this;
    var canvas = _canvas;
    var tmargin = 40;
    var w = 250;
    var h = 35;

    var btn = new Button(canvas);
    //    btn.setBounds((canvas.getWidth() - w) / 2, tmargin, w, h);
    btn.setText($L.show_all);
    btn.setStyles("line-height:30px;vertical-align: middle;outline: none;cursor: pointer;text-align: center;text-decoration: none;font: 14px Arial, Helvetica, sans-serif;-webkit-border-radius: .5em;-moz-border-radius: .5em;border-radius: .5em;color: #252525;border: 2px solid #b4b4b4;background-color: rgba(230,230,230,0.9)");


    var exe = function(ev) {
        var Cn;
        var elements;

        Cn = canvas.getConstruction();
        elements = Cn.elements();
        for (var i = 0; i < elements.length; i++) {
			if (elements[i].isHidden()==1){elements[i].setHidden(0)};
        }
        //canvas.saveToLocalStorage();
        //canvas.getDocObject().style.visibility = "visible";
        canvas.paint();
    }
    btn.addDownEvent(exe);

    me.showAll = function() {
        exe()
    }

    me.show = function() {
        btn.setBounds((canvas.getWidth() - w) / 2, tmargin, w, h);
        canvas.getDocObject().parentNode.appendChild(btn.getDocObject());
    };

    me.hide = function() {
        if (btn.getDocObject().parentNode) {
            canvas.getDocObject().parentNode.removeChild(btn.getDocObject());
        }
    };


}
//JDIAZ end