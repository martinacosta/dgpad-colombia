function ExportPanel(_canvas, _closeProc) {
    var me = this;
    var canvas = _canvas;
    var www = 450;
    var hhh = 300;
    var hidectrlpanel = false;
	var fixwidgets=false;
	var disablezoom=false;
	var fixdgscripts=false;
	var local=false;
	var version=false;
    var sel = -1;
    var btns = null;
    $U.extend(this, new CenterPanel(canvas, www, hhh));
    var JSZipReady = false;

    me.show();

    var close = function() {
        _closeProc();
        canvas.setNoMouseEvent(true);
    };

    var setText = function(_t) {
        textarea.setAttr("innerHTML", _t);
    };

    var setComment = function(_t) {
        comment.setAttr("innerHTML", _t);
    };

    var typeCallback = function(_val) {
        sel = _val;
        switch (_val) {
            case 0:
                setText(getSRC());
                var lnk = ($iOS_APPLICATION) ? "data-txt:" : "data:text/plain;base64,";
                lnk += $U.base64_encode(canvas.getSource(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version));
                setComment($L.export_sourcecomment + '<br><br><a download="DGPad_file.txt" href="' + lnk + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_source_download + '</b></a>');
				dgversion.setDisplay("none");
				localversion.setDisplay("none");
                break;
            case 1:
                setText(getHTMLJS());
                setComment($L.export_htmljscomment);
				dgversion.setDisplay("inline");
				localversion.setDisplay("inline");
                break;
            case 2:
                setText(getHTML());
                setComment($L.export_htmlcomment);
				dgversion.setDisplay("inline");
				localversion.setDisplay("inline");
                break;
            case 3:
                setText(getPAGE());
				var lnk = ($iOS_APPLICATION) ? "data-html:" : "data:text/plain;base64,";
				lnk += $U.base64_encode(getPAGE());
				setComment($L.export_htmlstandalonecomment1 + '<br><br><a download="DGPad_file.html" href="' + lnk + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_htmlstandalonecomment + '</b></a>');
                // setComment($L.export_htmlstandalonecomment);
				dgversion.setDisplay("inline");
				localversion.setDisplay("inline");
                break;
            case 4:
                var svgsrc = canvas.exportSVG();
                var lnk = ($iOS_APPLICATION) ? "data-svg:" : "data:image/svg+xml,";
                lnk += ($iOS_APPLICATION) ? $U.base64_encode(svgsrc) : encodeURIComponent(svgsrc);
                setText(svgsrc);
                setComment($L.export_svgimage + '<br><br><a download="DgpadSvgImage.svg" href="' + lnk + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_svgimage2 + '</b></a>');
                break;
            case 5:
                canvas.loadZipPackage(iBookStuff);
                break;
        }
        if (!Object.touchpad)
            textarea.getDocObject().select();
    };

    var iBookStuff = function() {
        setText("");
        canvas.getiBookPlugin(hidectrlpanel, "", function(_c) {
            var url = window.URL.createObjectURL(_c);
            setComment($L.export_ibook + '<br><br><a download="iBookPlugin.zip" href="' + url + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_ibook2 + '</b></a>');
        });
    };

    var getHTML = function() {
        return canvas.getHTML(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
    };

    var getHTMLJS = function() {
        return canvas.getHTMLJS(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
    };
	
	var getHTMLJS1 = function() {
        return canvas.getHTMLJS1(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
    };

    var getSRC = function() {
        var s = canvas.getSource(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
        return s;
    };

    var getPAGE = function() {
		
        var s = '<!DOCTYPE html>\n';
        // s += '<html style="margin:0;padding:0;width:100%;height:100%;display: table">\n';
        s += '<head>\n';
        s += '<title></title>\n';
        s += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
		s += '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no" />';
        // s += '</head>\n';
		s += '<script>';
		
        s += '$MENU = false; \n';
		s += '$BACK_COLOR = "#3A3A3A"; \n';
		s += 'var $ = function(e) { return document.getElementById(e) };\n';
		s += 'var $CURRENT, $SAVEDATAS = null;\n';
		s += 'var $WIDTH = 0,\n';
		s += '$HEIGHT = 0; \n';
		s += 'var $MESSAGE = "";\n';
		s += 'var resize = function() {\n';
		s += 'var frame = $("frame");\n';
		s += 'frame.width = 0;\n';
		s += 'frame.height = 0;\n';
		s += 'var mh = ($MENU) ? 60 : 0;\n';
		s += 'var ww = window.parent.innerWidth;\n';
		s += 'var wh = window.parent.innerHeight;\n';
		s += 'scale = Math.min(ww / $WIDTH, (wh - mh) / $HEIGHT);\n';
		s += 'frame.style.left = (ww - $WIDTH * scale) / 2 + "px";\n';
		s += '$("navigation").style["width"] = ww + "px";\n';
		s += 'frame.width = $WIDTH;\n';
		s += 'frame.height = $HEIGHT;\n';
		s += 'frame.style["transform-origin"] = "0 0";\n';
		s += 'frame.style["transform"] = "scale(" + scale + ")";\n';
		s += 'var modal_download_dialog = $("modal_download_content");\n';
		s += 'modal_download_dialog.style["left"] = (($WIDTH * scale - 40) / 4) + "px";\n';
		s += 'modal_download_dialog.style["top"] = "10px";\n';
		s += 'modal_download_dialog.style["width"] = (($WIDTH * scale - 40) / 2) + "px";\n';
		s += 'setTimeout(function() { askToFrame("repaint") }, 500);\n';
		
		s += '}\n';
		
		s += 'var showDownload = function(_link, _filename) {\n';
		s += 'var link = $("download_link");\n';
		s += 'link.href = _link;\n';
		s += 'link.download = _filename;\n';
		s += 'link.innerHTML = "Haga clic aquí para descargar el archivo " + _filename;\n';
		s += 'var modal = $("modal_download");\n';
		s += 'modal.style.display = "block";\n';
		s += 'link.onclick = link.ontouchstart = function() {\n';
		s += 'setTimeout(function() { modal.style.display = "none" }, 500);\n';
		s += '}\n';
		s += '}\n';
		s += 'var askToFrame = function(_m) {\n';
		s += '$MESSAGE = _m;\n';
		s += 'var frame = $("frame");\n';
		s += 'frame.contentWindow.postMessage(_m, "*");\n';
		s += '}\n';
		s += 'var receiveMessage = function(e) {\n';
		s += 'var datas = e.data;\n';
		s += 'if (datas === "figure_loaded") {\n';
		s += 'askToFrame("get_Original_Dims");\n';
		s += '} else {\n';
		s += 'switch ($MESSAGE) {\n';
		s += 'case "get_SVG":\n';
		s += 'showDownload("data:image/svg+xml," + encodeURIComponent(datas), $URL[$CURRENT][1].split(".")[0] + ".svg")\n';
		s += 'break;\n';
		s += 'case "get_PNG":\n';
		s += 'showDownload(datas, $URL[$CURRENT][1].split(".")[0] + ".png");\n';
		s += 'break;\n';
		s += 'case "get_Source":\n';
		s += 'showDownload("data:application/octet-stream," + encodeURIComponent(datas), $URL[$CURRENT][1])\n';
		s += 'break;\n';
		s += '                case "get_Original_Dims":\n';
		s += '      $WIDTH = parseInt(datas[0]);\n';
		s += '      $HEIGHT = parseInt(datas[1]);\n';
		s += '      resize();\n';
		s += '      break;\n';
		s += '      }\n';
		s += '      }\n';
		s += '   }\n';
		s += '   var getCSSRule = function(ruleName) {\n';
		s += '   ruleName = ruleName.toLowerCase();\n';
		s += '   var result = null;\n';
		s += '   var find = Array.prototype.find;\n';
		s += '   find.call(document.styleSheets, styleSheet => {\n';
		s += '   result = find.call(styleSheet.cssRules, cssRule => {\n';
		s += '   return cssRule instanceof CSSStyleRule &&\n';
		s += '   cssRule.selectorText.toLowerCase() == ruleName;\n';
		s += '   });\n';
		s += '   return result != null;\n';
		s += '   });\n';
		s += '   return result;\n';
		s += '  }\n';
		s += ' var shadeBlend = function(p, c0, c1) {\n';
		s += ' var n = p < 0 ? p * -1 : p,\n';
		s += ' u = Math.round,\n';
		s += ' w = parseInt;\n';
		s += ' if (c0.length > 7) {\n';
		s += '     var f = c0.split(","),\n';
		s += '     t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","),\n';
		s += '     R = w(f[0].slice(4)),\n';
		s += '     G = w(f[1]),\n';
		s += '     B = w(f[2]);\n';
		s += '     return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"\n';
		s += '     } else {\n';
		s += '     var f = w(c0.slice(1), 16),\n';
		s += '     t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16),\n';
		s += '     R1 = f >> 16,\n';
		s += '     G1 = f >> 8 & 0x00FF,\n';
		s += '     B1 = f & 0x0000FF;\n';
		s += '     return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)\n';
		s += '     }\n';
		s += '    }\n';
		s += '   var init = function() {\n';
		s += '   var menus = $("navigation");\n';
		s += '   getCSSRule("body").style["background-color"] = $BACK_COLOR;\n';
		s += '   if ($MENU) {\n';
		s += '       getCSSRule(".dropbtn").style["background-color"] = $BACK_COLOR;\n';
		s += '       getCSSRule(".dropdown:hover .dropbtn").style["background-color"] = shadeBlend(-0.2, $BACK_COLOR);\n';
		s += '       getCSSRule(".dropdown-content").style["background-color"] = $BACK_COLOR;\n';
		s += '       getCSSRule(".dropdown-content a:hover").style["background-color"] = shadeBlend(-0.2, $BACK_COLOR);\n';
		s += '   if ($URL.length === 1) {\n';
		s += '       var file_menu = $("file_menu");\n';
		s += '       file_menu.style["background-color"] = $BACK_COLOR;\n';
		s += '       file_menu.style.display = "none";\n';
		s += '      } else {\n';
		s += '      var items = $("file_items");\n';
		s += '      var inner = "";\n';
		s += '      for (var i = 0; i < $URL.length; i++) {\n';
		s += '          inner += "<a style='
		s += "'"
		s += 'cursor:pointer'
		s += "'"
		s += '	onclick='
		s += "'"
		s += 'new_frame_src('
		s += "'"
		s += '+ i + '
		s += "'"
		s += ')>"\n';
		s += '          inner += $URL[i][0];\n';
		s += '          inner += "</a>"\n';
		s += '          }\n';
		s += '         items.innerHTML = inner;\n';
		s += '         }\n';
		s += '       } else {\n';
		s += '       menus.style.display = "none";\n';
		s += '      }\n';
		s += '      var modal_close = $("modal_close");\n';
		s += '      modal_close.onclick = modal_close.ontouchstart = function() {\n';
		s += '      var modal = $("modal_download");\n';
		s += '      modal.style.display = "none";\n';
		s += '      }\n';
		s += '     window.onclick = window.ontouchstart = function(event) {\n';
		s += '     var modal = $("modal_download");\n';
		s += '     if (event.target == modal) {\n';
		s += '     modal.style.display = "none";\n';
		s += '     }\n';
		s += '    }\n';
		s += '    window.onblur = function() {\n';
		s += '    var modal = $("modal_download");\n';
		s += '    modal.style.display = "none";\n';
		s += '    }\n';
		s += '    window.onresize = resize;\n';
		s += '   window.addEventListener("orientationchange", resize);\n';
		s += '   window.addEventListener("message", receiveMessage);\n';
		s += '   new_frame_src(0);\n';
		s += '   }\n';
		s += '</script>\n';
		s += '<style>\n';
		s += '@import url(https://fonts.googleapis.com/css?family=Open+Sans);\n';
		s += '@import url(https://fonts.googleapis.com/css?family=Bree+Serif);\n';
		s += 'body {\n';
		s += 'font-family: "Open Sans", sans-serif;\n';
		s += 'width: 100%;\n';
		s += 'height: 100%;\n';
		s += 'margin: 0;\n';
		s += 'padding: 0;\n';
		s += 'overflow: hidden;\n';
		s += 'background-color: rgba(0, 0, 0, 0)\n';
		s += '}\n';
		s += '.navbtns_wrapper {\n';
		s += 'position: relative;\n';
		s += 'float: right;\n';
		s += '/*background-color: red;*/\n';
		s += 'text-align: right;\n';
		s += 'color: white;\n';
		s += '}\n';
		s += '.navbtns_wrapper a {\n';
		s += 'cursor: pointer;\n';
		s += 'padding: 16px;\n';
		s += 'font-size: 16px;\n';
		s += 'text-decoration: none;\n';
		s += 'display: inline-block;\n';
		s += '}\n';
		s += '.dropbtn {\n';
		s += 'font-family: "Open Sans", sans-serif;\n';
		s += 'background-color: #4CAF50;\n';
		s += 'color: white;\n';
		s += 'padding: 16px;\n';
		s += 'font-size: 16px;\n';
		s += 'border: none;\n';
		s += 'cursor: pointer;\n';
		s += '}\n';
		s += '.dropdown {\n';
		s += 'position: relative;\n';
		s += 'display: inline-block;\n';
		s += '}\n';
		s += '.dropdown-content {\n';
		s += 'display: none;\n';
		s += 'position: absolute;\n';
		s += 'background-color: #f9f9f9;\n';
		s += 'min-width: 160px;\n';
		s += 'box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n';
		s += 'z-index: 4;\n';
		s += '}\n';
		s += '.dropdown-content a {\n';
		s += 'color: white;\n';
		s += 'padding: 12px 16px;\n';
		s += 'text-decoration: none;\n';
		s += 'display: block;\n';
		s += '}\n';
		s += '.dropdown-content a:hover {\n';
		s += 'background-color: #f1f1f1\n';
		s += '}\n';
		s += '.dropdown:hover .dropdown-content {\n';
		s += 'display: block;\n';
		s += '}\n';
		s += '.dropdown:hover .dropbtn {\n';
		s += 'background-color: #3e8e41;\n';
		s += '}\n';
		s += '.modal {\n';
		s += 'display: none;\n';
		s += 'position: fixed;\n';
		s += 'z-index: 5;\n';
		s += 'left: 0;\n';
		s += 'top: 0;\n';
		s += 'margin: 0;\n';
        s += 'width: 100%;\n';
        s += 'height: 100%;\n';
        s += 'overflow: auto;\n';
        s += 'background-color: rgb(0, 0, 0);\n';
        s += 'background-color: rgba(0, 0, 0, 0.4);\n';
        s += 'color: #333333;\n';
		s += '}\n';

		s += '.modal-content {\n';
		s += '	position: absolute;\n';
		s += '	background-color: #fefefe;\n';
		s += '	left: 0px;\n';
		s += '	padding: 20px;\n';
		s += '	border: 1px solid #888;\n';
		s += '	width: 50px;\n';
		s += '	text-align: center;\n';
		s += '}\n';

		s += '.close {\n';
		s += '	color: #aaaaaa;\n';
		s += '	float: right;\n';
		s += '	font-size: 28px;\n';
		s += '	font-weight: bold;\n';
		s += '}\n';

		s += '.close:hover,\n';
		s += '.close:focus {\n';
		s += '	color: #000;\n';
		s += '	text-decoration: none;\n';
		s += '	cursor: pointer;\n';
		s += '}\n';
		s += '</style>\n';
		s += '</head>\n';

		s += '<body onload="init()">\n';
		s += '	<div id="navigation">\n';
		s += '		<div id="file_menu" class="dropdown">\n';
		s += '			<button class="dropbtn">Archivos</button>\n';
		s += '			<div id="file_items" class="dropdown-content">\n';
		s += '			</div>\n';
		s += '		</div>\n';
		s += '		<div class="dropdown">\n';
		s += '			<button class="dropbtn">Exportar</button>\n';
		s += '			<div id="export_menu" class="dropdown-content">\n';
		s += '				<a style="cursor:pointer" onclick="askToFrame("get_PNG")">PNG</a>\n';
		s += '				<a style="cursor:pointer" onclick="askToFrame("get_SVG")">SVG</a>\n';
		s += '				<a style="cursor:pointer" onclick="askToFrame("get_Source")">Figura DGPad</a>\n';
		s += '			</div>\n';
		s += '		</div>\n';
		s += '		<div class="navbtns_wrapper"><span id="file_name"></span><a id="prev" onclick="previous_frame_src()">&#9664;&#xFE0E;</a><a id="next" onclick="next_frame_src()">&#9654;&#xFE0E;</a></div>\n';
		s += '	</div>\n';
		s += '	<div id="modal_download" class="modal">\n';
		s += '		<div id="modal_download_content" class="modal-content">\n';
		s += '			<span id="modal_close" class="close">&times;</span>\n';
		s += '			<p><a id="download_link" style="color:#333333" href="#" download="">Haga Clic aquí para descargar su archivo</a></p>\n';
		s += '		</div>\n';
		s += '	</div>\n';
		s += '<form action=';
		if (local) { 
			if (version) { 
			s += '"http://localhost:8080/profesores"';}
			else {
		s += '"http://localhost:8080/estudiantes"';}}
		else {if (version) {
					s += '"https://dgpad-colombia.uis.edu.co/profesores"';
			} else {
		s += '"https://dgpad-colombia.uis.edu.co/estudiantes"';}}
		s += 'target="frame"  method="post">\n';
        s += '<input type="hidden" name="file_content" value=';
		s += '"';
		s += getHTMLJS1(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version) ;
		s += '"';
		s += '>\n';
		
        s += '<iframe id="frame" name="frame"';
		s += 'style="display: block; position: relative; left: 0px; top: 0px;z-index:1;overflow:hidden;margin:0;padding:0;border:none"';
        s += 'src="https://dgpad-colombia.uis.edu.co/estudiantes/empty.html" scrolling="no" frameborder="no"';
        s += 'onload="if (!this.parentNode.num) {this.parentNode.submit();this.parentNode.num=true}">\n';
        s += '</iframe>\n';
		s += '</body>\n';

		s += '</html>\n';
       
        return s;
    };

    new CloseBox(me, close);


    var textarea_wrapper = new GUIElement(me, "div");
    textarea_wrapper.setStyles("position:absolute;background-color:rgba(0,0,0,1);left:10px;top:140px;right:10px;bottom:10px;resize:none;overflow:hidden");

    var textarea = new GUIElement(me, "textarea");
    textarea.setStyles("width:100%;height:100%;margin:0;border:0;wrap:on");
    textarea_wrapper.addContent(textarea);
    me.addContent(textarea_wrapper);

    btns = new ImageGroup(me.getDocObject(), 10, 10, www - 20, 40, $APP_PATH + "NotPacked/images/dialog/bgOff.svg", $APP_PATH + "NotPacked/images/dialog/bgOn.svg", typeCallback);
    btns.setImageSize(36);
    btns.setHspace(3);
    btns.addImage($APP_PATH + "NotPacked/images/dialog/download.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/htmljs.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/html.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/safari.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/svg.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/ibook.svg");

    var comment = new GUIElement(me, "div");
    comment.setStyles("position:absolute;background-color:#FEFEFE;font-size:12px;font-family:Helvetica, Arial, sans-serif;color:#252525;border: 1px solid #b4b4b4;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:5px;border-radius:10px");
    comment.setBounds(10, 80, www - 20, 55);
    setComment($L.export_standardcomment);
    me.addContent(comment);

    var addtoolsCBACK = function(_v) {
        hidectrlpanel = _v;
        typeCallback(sel);
    };

    var cbshowCS = new Checkbox(me.getDocObject(), 250, 5, 200, 30, hidectrlpanel, $L.export_istools, addtoolsCBACK);
    cbshowCS.setTextColor("#000000");
	
	var fixwidCBACK = function(_v) {
        fixwidgets = _v;
        typeCallback(sel);
    };
	
	var fixWid = new Checkbox(me.getDocObject(), 250, 27, 200, 30, fixwidgets, $L.export_fixWid, fixwidCBACK);
    fixWid.setTextColor("#000000");

	var fixdgsCBACK = function(_v) {
        fixdgscripts = _v;
        typeCallback(sel);
    };
	
	var fixDGscr = new Checkbox(me.getDocObject(), 10, 50, 200, 30, fixdgscripts, $L.export_fixDGs, fixdgsCBACK);
    fixDGscr.setTextColor("#000000");
	
	var diszoomCBACK = function(_v) {
        disablezoom = _v;
        typeCallback(sel);
    };
	
	var disZoom = new Checkbox(me.getDocObject(), 145, 50, 200, 30, disablezoom, $L.export_disZoom, diszoomCBACK);
    disZoom.setTextColor("#000000");
	
	var localCBACK = function(_v) {
        local = _v;
        typeCallback(sel);
    };
	
	var localversion = new Checkbox(me.getDocObject(), 270, 50, 80, 30, local, $L.export_local, localCBACK);
    localversion.setTextColor("#0000CD");
	
	var versionCBACK = function(_v) {
        version = _v;
        typeCallback(sel);
    };
	
	var dgversion = new Checkbox(me.getDocObject(), 340, 50, 200, 30, version, $L.export_version, versionCBACK);
   dgversion.setTextColor("#0000CD");
   dgversion.setDisplay("none");
	
    setTimeout(function() {
        btns.select(0);
        typeCallback(0);
    }, 0);


}
