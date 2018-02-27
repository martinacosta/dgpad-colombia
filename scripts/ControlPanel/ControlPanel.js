/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function ControlPanel(_canvas) {
    var me = this;
    var canvas = _canvas;
    var SCALE = (canvas.getDocObject().clientWidth<810)? Math.round(100*canvas.getDocObject().clientWidth/810)/100:1;
    $U.extend(this, new HorizontalBorderPanel(canvas, canvas.prefs.controlpanel.size*SCALE, false));

    me.addDownEvent(function() {});
    me.setStyle("background", canvas.prefs.controlpanel.color);
    me.setStyle("border-top", "1px solid hsla(0,0%,0%,.1)");
    me.setStyle("border-radius", "0px");
    me.show();


    var left = 10 * SCALE;
    var size = 30 * SCALE;
    var margintop = 5 * SCALE;
    var right = me.getBounds().width - left - size;
    var hspace = 15 * SCALE;
    var smallhspace = 5 * SCALE;
    var copyDlog = null;
    var historyDlog = null;

    var addBtnLeft = function(_code, _sel, _group, _proc, _title) {
        var btn = new ControlButton(me, left, margintop, size, size, "NotPacked/images/controls/" + _code + ".png", _sel, _group, _proc, _title); //MEAG agrego parametro title
        left += size;
        return btn;
    };
    var addSpaceLeft = function(h) {
        left += h;
    };
    var addSepLeft = function() {
        var btn = new ControlButton(me, left, margintop, size, size, "NotPacked/images/controls/sep.png", true, null, null);
        left += size;
    };
    var addNullLeft = function() {
        var btn = new ControlButton(me, left, margintop, 0, size, "NotPacked/images/controls/sep.png", true, null, null);
    };
    var addBtnRight = function(_code, _sel, _group, _proc, _title) {
        var btn = new ControlButton(me, right, margintop, size, size, "NotPacked/images/controls/" + _code + ".png", _sel, _group, _proc, _title); //MEAG agrego parametro title
        right -= size;
        return btn;
    };
    var addSpaceRight = function(h) {
        right -= h;
    };

    var modeGroup = new BtnGroup();

    var checkMode = function(_i) {
        if (canvas.getMode() === _i) {
            modeGroup.deselect();
            canvas.setMode(0);
            canvas.paint();
            return true;
        } else
            return false;
    };

    var arrowMode = function() {
        //        if (checkMode(1))
        //        arrowBtn.select();
        if (checkMode(1))
            return;
        canvas.setMode(1);
        canvas.paint();
    };
    var fingerMode = function() {
        //        fingerBtn.select();
        if (checkMode(7))
            return;
        canvas.setMode(7);
        canvas.paint();
    };
    var hideMode = function() {
        if (checkMode(2))
            return;
        canvas.setMode(2);
        canvas.paint();
    };
    var trashMode = function() {
        if (checkMode(3))
            return;
        canvas.setMode(3);
        canvas.paint();
    };
    var macroMode = function() {
        if (checkMode(4))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(4);
        canvas.paint();
    };
    var calcMode = function() {
        if (checkMode(8))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(8);
        canvas.paint();
    };
    var texMode = function() {
        if (checkMode(10))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(10);
        canvas.paint();
    };
    var propsMode = function() {
        if (checkMode(6))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(6);
        canvas.paint();
    };

    var undoProc = function() {
        canvas.undoManager.undo();
        canvas.refreshKeyboard();
    };
    var redoProc = function() {
        canvas.undoManager.redo();
        canvas.refreshKeyboard();
    };



    var nameProc = function() {
        if (canvas.namesManager.isVisible()) {
            canvas.namesManager.hide();
            nameBtn.deselect();
        } else {
            canvas.namesManager.show();
            nameBtn.select();
        }
    };

    var historyProc = function() {
        if (historyDlog) {
            historyDlog.close();
            historyDlog = null;
            historyBtn.deselect();
        } else {
            if (!canvas.getConstruction().isConsultOrArrowMode()) {
                arrowBtn.select();
                arrowMode();
            }
            if (copyDlog)
                exportProc();
            historyDlog = new HistoryPanel(canvas, historyProc);
            historyBtn.select();
        }
    }

    var gridProc = function() {
        if (canvas.isCS()) {
            canvas.showCS(false);
            gridBtn.deselect();
        } else {
            canvas.showCS(true);
            gridBtn.select();
        }
    };

    //MEAG componer el zoom
    var zoomProc = function() {
      var Cn = canvas.getCn();
      var width = canvas.getWidth();
      var height = canvas.getHeight();
      var _zoom = Cn.coordsSystem.isCenterZoom() ? true : false;
      Cn.coordsSystem.setCenterZoom(true);
      Cn.zoom(width / 2, height / 2, 40/Cn.coordsSystem.getUnit());
      Cn.computeAll();
      canvas.paint();
      Cn.coordsSystem.setCenterZoom(_zoom);
    };

    var exportProc = function() {
        if (copyDlog) {
            copyDlog.close();
            copyDlog = null;
            copyBtn.deselect();
        } else {
            if (historyDlog)
                historyProc();
            if (!canvas.getConstruction().isConsultOrArrowMode()) {
                arrowBtn.select();
                arrowMode();
            }
            copyDlog = new ExportPanel(canvas, exportProc);
            copyBtn.select();
        }
    };


    var downloadProc = function() {
      console.log(filestack.version);
      const apikey = 'Apcx13KffRBSNtSzza1toz';
      const client = filestack.init(apikey);

        // filepicker.pick({
        //         extensions: ['.txt', '.dgp'],
        //         // mimetype: 'text/plain',
        //         openTo: $U.getFilePickerDefaultBox()
        //     },
        //     function(FPFile) {
        //         filepicker.read(FPFile, function(data) {
        //             canvas.OpenFile("", $U.utf8_decode(data));
        //             if ($FPICKERFRAME !== null) {
        //                 $FPICKERFRAME.close();
        //                 $FPICKERFRAME = null;
        //             }
        //         });
        //     });
        client.pick({
                accept: ['.txt', '.dgp'],
                // mimetype: 'text/plain',
                //openTo: $U.getFilePickerDefaultBox(),
                //onOpen: $U.getFilePickerDefaultBox(),
            }).then((res) => {
              canvas.OpenFile("", $U.utf8_decode(data));
              console.log(res.filesUploaded);
            });
    };

    var uploadProc = function() {
        if (canvas.getConstruction().isEmpty())
            return;
        var source = canvas.macrosManager.getSource() + canvas.getConstruction().getSource() + canvas.textManager.getSource();



        filepicker.exportFile(
            "http://dgpad.net/scripts/NotPacked/thirdParty/temp.txt", {
                suggestedFilename: "",
                extension: ".dgp",
                services: ['DROPBOX', 'GOOGLE_DRIVE', 'BOX', 'SKYDRIVE', 'EVERNOTE', 'FTP', 'WEBDAV'],
                openTo: $U.getFilePickerDefaultBox()
            },
            function(InkBlob) {
                // console.log(InkBlob.url);
                filepicker.write(
                    InkBlob,
                    source, {
                        base64decode: false,
                        mimetype: 'text/plain'
                    },
                    // $U.base64_encode(source), {
                    //     base64decode: true,
                    //     mimetype: 'text/plain'
                    // },
                    function(InkBlob) {
                        if ($FPICKERFRAME !== null) {
                            $FPICKERFRAME.close();
                            $FPICKERFRAME = null;
                        }
                    },
                    function(FPError) {
                        console.log(FPError.toString());
                    }
                );
            },
            function(FPError) {
                console.log(FPError.toString());
            }
        );

        //        filepicker.store(
        //                $U.base64_encode(source),
        //                {
        //                    base64decode: true,
        //                    mimetype: 'text/plain'
        //                },
        //        function(InkBlob) {
        //            filepicker.exportFile(
        //                    InkBlob,
        //                    {suggestedFilename:"",extension: ".txt",openTo: $U.getFilePickerDefaultBox()},
        //            function(InkBlob) {
        //                if ($FPICKERFRAME !== null) {
        //                    $FPICKERFRAME.close();
        //                    $FPICKERFRAME = null;
        //                }
        //            },
        //                    function(FPError) {
        //                        console.log(FPError.toString());
        //                    }
        //            );
        //        },
        //                function(FPError) {
        //                    console.log(FPError.toString());
        //                }
        //        );
    };



    var arrowBtn = addBtnLeft("arrow", true, modeGroup, arrowMode, $L.button_title_arrow);
    addSpaceLeft(hspace);
//    var fingerBtn = addBtnLeft("finger", false, modeGroup, fingerMode, $L.button_title_finger);
//    addSpaceLeft(hspace);
    var gommeBtn = addBtnLeft("hide", false, modeGroup, hideMode, $L.button_title_gomme);
    addSpaceLeft(hspace);
    var trashBtn = addBtnLeft("trash", false, modeGroup, trashMode, $L.button_title_trash);
    addSpaceLeft(hspace);
    var macrosBtn = addBtnLeft("macros", false, modeGroup, macroMode, $L.button_title_macros);
    addSpaceLeft(hspace);
    var calcBtn = addBtnLeft("calc", false, modeGroup, calcMode, $L.button_title_calc);
    addSpaceLeft(hspace);
    if (!$U.isMobile.mobilePhone()) {
        var texBtn = addBtnLeft("tex", false, modeGroup, texMode, $L.button_title_tex);
        addSpaceLeft(hspace);
    }
    var propBtn = addBtnLeft("properties", false, modeGroup, propsMode, $L.button_title_properties);
    addSpaceLeft(smallhspace);
    addSepLeft();
    addSpaceLeft(smallhspace);
    var historyBtn = addBtnLeft("history", false, null, historyProc, $L.button_title_history);
    addSpaceLeft(hspace);
    if (!$U.isMobile.mobilePhone()) {
        var copyBtn = addBtnLeft("copy", false, null, exportProc, $L.button_title_copy);
        addSpaceLeft(hspace);
    }

    // MEAG start -- retira botones
    // addBtnLeft("download", false, null, downloadProc, $L.button_title_download);
    // addSpaceLeft(hspace);
    // addBtnLeft("upload", false, null, uploadProc, $L.button_title_upload);
    // MEAG end
    // addSpaceLeft(smallhspace);
    addSepLeft();
    addSpaceLeft(smallhspace);
    var nameBtn = addBtnLeft("name", false, null, nameProc, $L.button_title_name);
    addSpaceLeft(hspace);
    var gridBtn = addBtnLeft("grid", false, null, gridProc, $L.button_title_grid);
    addSpaceLeft(hspace);
    //MEAG
    var zoomBtn = addBtnLeft("zoom", false, null, zoomProc, $L.button_title_zoom);
    addSpaceLeft(hspace);
    var redoBtn = addBtnRight("redo", true, null, redoProc, $L.button_title_redo);
    addSpaceRight(hspace);
    var undoBtn = addBtnRight("undo", true, null, undoProc, $L.button_title_undo);

    //    this.selectBtn = function(_mode) {
    //        switch (_mode) {
    //            case 1:
    //                arrowBtn.select();
    //                break;
    //            case 2:
    //                gommeBtn.select();
    //                break;
    //            case 3:
    //                trashBtn.select();
    //                break;
    //            case 4:
    //                macrosBtn.select();
    //                break;
    //            case 5:
    //                macrosBtn.select();
    //                break;
    //            case 6:
    //                propBtn.select();
    //                break;
    //        }
    //    }

    this.selectPropBtn = function() {
        propBtn.select();
        propsMode();
    };
    this.selectCalcBtn = function() {
        calcBtn.select();
        calcMode();
    };
    this.setUndoBtn = function(_active) {
        undoBtn.setActive(_active);
    };
    this.setRedoBtn = function(_active) {
        redoBtn.setActive(_active);
    };
    this.selectArrowBtn = function() {
        arrowBtn.select();
        arrowMode();
    };
    this.forceArrowBtn = function() {
        arrowBtn.select();
        canvas.setMode(1);
        canvas.paint();
    };
    this.deselectPointer = function() {
        arrowBtn.deselect();
    };
    this.deselectAll = function() {
        modeGroup.deselect();
    };
    this.selectNameBtn = function(_b) {
        if (_b) nameBtn.select()
        else nameBtn.deselect();
    };


}


function FilePickerDIV(_c) {
    var me = this;
    var canvas = _c;
    var ParentDOM = _c.getDocObject().parentNode;
    var FPDiv = document.createElement("div");
    FPDiv.setAttribute('width', canvas.getBounds().width);
    FPDiv.setAttribute('height', canvas.getBounds().height);
    FPDiv.style.position = "absolute";
    FPDiv.style.left = (canvas.getBounds().left) + "px";
    FPDiv.style.top = (canvas.getBounds().top) + "px";
    FPDiv.style.width = (canvas.getBounds().width) + "px";
    FPDiv.style.height = (canvas.getBounds().height) + "px";
    FPDiv.style.backgroundColor = "rgba(0,0,0,0.75)";

    var FPsize = {
        width: 820,
        height: 520
    };
    var FPFrame = document.createElement("iframe");
    FPFrame.setAttribute("ID", "FP_" + canvas.getID());
    FPFrame.setAttribute('width', FPsize.width);
    FPFrame.setAttribute('height', FPsize.height);
    FPFrame.setAttribute('frameborder', 0);
    FPFrame.setAttribute('marginheight', 0);
    FPFrame.setAttribute('marginwidth', 0);
    FPFrame.style.position = "absolute";
    FPFrame.style.left = (canvas.getBounds().width - FPsize.width) / 2 + "px";
    FPFrame.style.top = (canvas.getBounds().height - FPsize.height) / 2 + "px";
    FPFrame.style.width = FPsize.width + "px";
    FPFrame.style.height = FPsize.height + "px";
    FPFrame.style.overflow = "hidden";

    var FPClose = document.createElement("img");
    FPClose.style.position = "absolute";
    FPClose.style.margin = "0px";
    FPClose.style.padding = "0px";
    FPClose.setAttribute('src', $APP_PATH + "NotPacked/images/dialog/closebox.svg");
    FPClose.style.left = ((canvas.getBounds().width + FPsize.width) / 2 - 10) + "px";
    FPClose.style.top = ((canvas.getBounds().height - FPsize.height) / 2 - 20) + "px";
    FPClose.style.width = "30px";
    FPClose.style.height = "30px";
    FPClose.addEventListener('click', function(ev) {
        ParentDOM.removeChild(FPDiv);
    });

    FPDiv.appendChild(FPFrame);
    FPDiv.appendChild(FPClose);

    me.div = function() {
        return FPDiv;
    };

    me.id = function() {
        return ("FP_" + canvas.getID());
    };

    me.frame = function() {
        return FPFrame;
    };

    me.show = function() {
        ParentDOM.appendChild(FPDiv);
    };

    me.close = function() {
        ParentDOM.removeChild(FPDiv);
    };

}


function windowOpenIFrame(url) {
    var me = this;
    var FPDiv = document.createElement("div");
    FPDiv.setAttribute('width', window.innerWidth);
    FPDiv.setAttribute('height', window.innerHeight);
    FPDiv.style.position = "absolute";
    FPDiv.style.left = "0px";
    FPDiv.style.top = "0px";

    FPDiv.style.width = window.innerWidth + "px";
    FPDiv.style.height = window.innerHeight + "px";

    FPDiv.style.backgroundColor = "rgba(0,0,0,0.75)";

    var FPsize = {
        width: window.innerWidth - 50,
        height: window.innerHeight - 50
    };
    var FPFrame = document.createElement("iframe");
    //    FPFrame.setAttribute("ID", "FP_" + canvas.getID());
    FPFrame.setAttribute('width', FPsize.width);
    FPFrame.setAttribute('height', FPsize.height);
    FPFrame.setAttribute('frameborder', 0);
    FPFrame.setAttribute('marginheight', 0);
    FPFrame.setAttribute('marginwidth', 0);
    FPFrame.style.position = "absolute";
    FPFrame.style.left = (window.innerWidth - FPsize.width) / 2 + "px";
    FPFrame.style.top = (window.innerHeight - FPsize.height) / 2 + "px";
    FPFrame.style.width = FPsize.width + "px";
    FPFrame.style.height = FPsize.height + "px";
    FPFrame.style.overflow = "scroll";
    FPFrame.addEventListener('message', function(ev) {
        //        console.log("couosuuujrljsr");
    }, false);

    var FPClose = document.createElement("img");
    FPClose.style.position = "absolute";
    FPClose.style.margin = "0px";
    FPClose.style.padding = "0px";
    FPClose.setAttribute('src', $APP_PATH + "NotPacked/images/dialog/closebox.svg");
    FPClose.style.left = ((window.innerWidth + FPsize.width) / 2 - 10) + "px";
    FPClose.style.top = ((window.innerHeight - FPsize.height) / 2 - 20) + "px";
    FPClose.style.width = "30px";
    FPClose.style.height = "30px";
    FPClose.addEventListener('click', function(ev) {
        document.body.removeChild(FPDiv);
    });

    FPDiv.appendChild(FPFrame);
    FPDiv.appendChild(FPClose);

    me.div = function() {
        return FPDiv;
    };

    me.frame = function() {
        return FPFrame;
    };

    me.show = function() {
        document.body.appendChild(FPDiv);
    };

    me.close = function() {
        document.body.removeChild(FPDiv);
    };

    me.reload = function() {
        FPFrame.contentDocument.location.reload(true);
    };

    me.show();
    FPFrame.src = url;

}
