// Liste de points (reliés ou non) :
function ListObject(_construction, _name, _EXP) {
    $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
    $U.extend(this, new MoveableObject(_construction)); // Héritage


    var me = this;
    var Cn = _construction;
    var ORG3D = null;
    var pt3D = Cn.getInterpreter().getEX().EX_point3D; // Pour les points3D
    var EXP = _EXP; // Expression contenant la liste de points (ou points3D)
    var Ptab = []; // Tableau de points
    var arrow = null; // Flèches en bout de segments
    var colors = ["#ffffff", "#cccccc", "#c0c0c0", "#999999", "#666666", "#333333", "#000000", "#ffcccc", "#ff6666", "#ff0000", "#cc0000", "#990000", "#660000", "#330000", "#ffcc99", "#ff9966", "#ff9900", "#ff6600", "#cc6600", "#993300", "#663300", "#ffff99", "#ffff66", "#ffcc66", "#ffcc33", "#cc9933", "#996633", "#663333", "#ffffcc", "#ffff33", "#ffff00", "#ffcc00", "#999900", "#666600", "#333300", "#99ff99", "#66ff99", "#33ff33", "#33cc00", "#009900", "#006600", "#003300", "#99ffff", "#33ffff", "#66cccc", "#00cccc", "#339999", "#336666", "#003333", "#ccffff", "#66ffff", "#33ccff", "#3366ff", "#3333ff", "#000099", "#000066", "#ccccff", "#9999ff", "#6666cc", "#6633ff", "#6600cc", "#333399", "#330099", "#ffccff", "#ff99ff", "#cc66cc", "#cc33cc", "#993399", "#663366", "#330033"];
    var images = {};
    me.setArrow = function(_t) {
        arrow = (_t && (_t.length === 2) && (_t[0]) && (_t[1])) ? _t : null;
    }
    me.getArrow = function() {
        return arrow;
    }

    // me.setArrow(16,5);

    var pushImage = function(_url) {
        var cod = _url.substr(_url.length - 50);
        if (!images.hasOwnProperty(cod)) {
            var img = new Image();
            img.onload = function() {
                if (!images.hasOwnProperty(cod)) {
                    images[cod] = img;
                    Cn.getCanvas().paint()
                }
            };
            img.src = _url
        }
    }

    var getImage = function(_url) {
        var cod = _url.substr(_url.length - 50);
        if (images.hasOwnProperty(cod)) return images[cod];
        return null;
    }


    var initPtab = function() {
        // var lst = EXP.getValue();
        var lst = EXP.getE1().forcevalue();
        //         console.log(lst[0]);
        // console.log("initPtab : " + me.getName() + "  " + lst.length);
        Ptab.length = 0;

        var rr = me.getColor().getR();
        var gg = me.getColor().getG();
        var bb = me.getColor().getB();
        var ss = segSize;
        var ps = me.getRealsize();
        var ft = ["Arial", 30, "normal", "center"];
        var cn = 54;
        // var points = 0;
        var oldColStop = 0;

        if (!$U.isArray(lst))
            return;
        for (var i = 0, len = lst.length; i < len; i++) {
            if (!$U.isArray(lst[i])) {
                Ptab.length = 0;
                return;
            }
            if (lst[i].length === 2) {
                // Il s'agit d'un point 2D :
                var xx = Cn.coordsSystem.px(lst[i][0]);
                var yy = Cn.coordsSystem.py(lst[i][1]);
                // points++;
                Ptab.push({
                    x: xx,
                    y: yy,
                    tab: lst[i],
                    r: rr,
                    g: gg,
                    b: bb,
                    rgb: "rgb(" + rr + "," + gg + "," + bb + ")",
                    sz: ss, // segment size
                    pz: ps, // point size
                    fnt: ft
                });
            } else if (lst[i].length === 3) {
                if (isNaN(lst[i][0]) && isNaN(lst[i][1]) && isNaN(lst[i][2])) {
                    Ptab.push({
                        x: NaN,
                        y: NaN,
                        tab: lst[i],
                        r: rr,
                        g: gg,
                        b: bb,
                        rgb: "rgb(" + rr + "," + gg + "," + bb + ")",
                        sz: ss, // segment size
                        pz: ps, // point size
                        fnt: ft
                    });
                } else {
                    // Il s'agit d'un point 3D :
                    if (ORG3D === null) {
                        ORG3D = Cn.get3DOrigin(me);
                        if (ORG3D === null) {
                            // Aucune origine 3D n'est détectée (erreur) :
                            Ptab.length = 0;
                            return;
                        }
                    }

                    //                me.set3D(true);
                    var c2d = pt3D([Cn.coordsSystem.x(ORG3D.getX()), Cn.coordsSystem.y(ORG3D.getY())], lst[i]);
                    var xx = Cn.coordsSystem.px(c2d[0]);
                    var yy = Cn.coordsSystem.py(c2d[1]);
                    // points++;
                    Ptab.push({
                        x: xx,
                        y: yy,
                        tab: lst[i],
                        r: rr,
                        g: gg,
                        b: bb,
                        rgb: "rgb(" + rr + "," + gg + "," + bb + ")",
                        sz: ss, // segment size
                        pz: ps, // point size
                        fnt: ft
                    });
                }

            } else if (lst[i].length >= 4) {
                if (lst[i][0] === 0) {
                    // Un élément [0,r,g,b] signale un breakpoint de dégradé de couleur :
                    // console.log("*********** : Ptab.length=" + Ptab.length + "  oldColStop=" + oldColStop);
                    if (Ptab.length > oldColStop) {
                        var iR = (lst[i][1] - rr) / (Ptab.length - oldColStop);
                        var iG = (lst[i][2] - gg) / (Ptab.length - oldColStop);
                        var iB = (lst[i][3] - bb) / (Ptab.length - oldColStop);
                        for (var j = oldColStop + 1; j < Ptab.length; j++) {
                            var k = j - oldColStop;
                            var nr = Math.round(rr + k * iR);
                            var ng = Math.round(gg + k * iG);
                            var nb = Math.round(bb + k * iB);
                            Ptab[j].r = nr;
                            Ptab[j].g = ng;
                            Ptab[j].b = nb;
                            Ptab[j].rgb = "rgb(" + nr + "," + ng + "," + nb + ")";
                        }
                    }
                    rr = lst[i][1];
                    gg = lst[i][2];
                    bb = lst[i][3];
                    oldColStop = Ptab.length;
                } else if (lst[i][0] === 1) {
                    // Un élément [1,r,g,b] signale un breakpoint de changement de couleur :
                    // console.log("*********** : Ptab.length=" + Ptab.length + "  oldColStop=" + oldColStop);
                    rr = lst[i][1];
                    gg = lst[i][2];
                    bb = lst[i][3];
                } else if (lst[i][0] === 2) {
                    // Un élément [2,0,0,n] signale un breakpoint de changement de couleur
                    // numéroté n dans la palette 7x10
                    cn = (lst[i][3] - 1) % 70; // La couleur tortue commence à 1 et non pas à 0
                    var _rgb = $U.hexToRGB(colors[cn]);
                    rr = _rgb.r;
                    gg = _rgb.g;
                    bb = _rgb.b;
                } else if (lst[i][0] === 3) {
                    // Un élément [3,0,0,i] signale un incrément de couleur
                    // (cn+i) dans la palette 7x10
                    cn = (cn + lst[i][3]) % 70;
                    var _rgb = $U.hexToRGB(colors[cn]);
                    rr = _rgb.r;
                    gg = _rgb.g;
                    bb = _rgb.b;
                } else if (lst[i][0] === 4) {
                    // Un élément [4,0,0,op] signale l'ordre de remplir avec une opacité de op%
                    Ptab[Ptab.length - 1].fill = lst[i][3] / 100;

                } else if (lst[i][0] === 10) {
                    // Un élément [10,0,0,sz] signale un breakpoint de taille de crayon :
                    ss = lst[i][3];
                } else if (lst[i][0] === 11) {
                    // Un élément [11,0,0,inc] signale un incrément de taille de crayon :
                    ss += lst[i][3];
                } else if (lst[i][0] === 12) {
                    // Un élément [10,0,0,sz] signale un breakpoint de taille de crayon :
                    ps = lst[i][3];
                } else if (lst[i][0] === 13) {
                    // Un élément [11,0,0,inc] signale un incrément de taille de crayon :
                    ps += lst[i][3];
                } else if (lst[i][0] === 20) {
                    // Un élément [20,0,txt,U] signale l'ordre d'écrire txt dans la direction U :
                    Ptab[Ptab.length - 1].text = [lst[i][2], lst[i][3]];
                } else if (lst[i][0] === 21) {
                    // Un élément [21,0,0,tab] signale un changement de style d'écriture. tab
                    // représente un tableau à 4 éléments [font,size,face,align] :
                    ft = lst[i][3];
                } else if (lst[i][0] === 30) {
                    // Un élément [30,url,w,h,U] signale l'ordre d'afficher une image
                    // d'adresse url, de dimension (w,h), dans la direction U :
                    Ptab[Ptab.length - 1].image = { url: lst[i][1], w: lst[i][2], h: lst[i][3], z: lst[i][4], o: lst[i][5], dir: lst[i][6] };
                    pushImage(lst[i][1]);
                }
            } else {
                // Sinon il y a erreur dans l'expression:
                Ptab.length = 0;
                return;
            }
        }
        // console.log("*********");
        // for (var i = 0; i < Ptab.length; i++) {
        //     console.log("Ptab[" + i + "].r=" + Ptab[i].r);
        //     console.log("Ptab[" + i + "].g=" + Ptab[i].g);
        //     console.log("Ptab[" + i + "].b=" + Ptab[i].b);
        // }
    };
    initPtab();
    var fillStyle = this.prefs.color.point_free;
    var segSize = -1; // Taille des segments
    var shape = 0; // Apparence des points


    this.getEXP = function() {
        return EXP;
    }

    this.setSegmentsSize = function(val) {
        segSize = val;
    };
    this.getSegmentsSize = function() {
        return segSize;
    };

    this.setParent(EXP);
    this.setDefaults("list");

    this.getAssociatedTools = function() {
        return "@callproperty,@calltrash,@callcalc,@calllist,point";
    };

    this.isInstanceType = function(_c) {
        return (_c === "list");
    };
    this.getCode = function() {
        return "list";
    };
    this.getFamilyCode = function() {
        return "list";
    };
    this.setShape = function(_shape) {
        shape = _shape;
        switch (shape) {
            case 0:
                paintPoint = paintCircle;
                break;
            case 1:
                paintPoint = paintCross;
                break;
            case 2:
                paintPoint = paintDiamond;
                break;
            case 3:
                paintPoint = paintSquare;
                break;
        }
    };
    this.getShape = function() {
        return shape;
    };

    this.getPtNum = function(_i) {
        var k = 0;
        for (var i = 0; i < Ptab.length; i++) {
            if (!isNaN(Ptab[i].x) || !isNaN(Ptab[i].y)) k++;
            if (k === _i) return Ptab[i].tab;
        }
        return [NaN, NaN]
    };

    this.getPtLength = function(_i) {
        var k = 0;
        for (var i = 0; i < Ptab.length; i++) {
            if (!isNaN(Ptab[i].x) || !isNaN(Ptab[i].y)) k++;
        }
        return k
    };


    this.projectXY = function(x, y) {
        // console.log("Ptab="+Ptab);
        var p = Ptab[0];
        var x1 = p.x,
            y1 = p.y;
        var count = 0;
        var xmin = x1,
            ymin = y1,
            dmin = 1e20,
            cmin = 0;
        for (var i = 1, len = Ptab.length; i < len; i++) {
            p = Ptab[i];
            var x2 = p.x,
                y2 = p.y;
            var dx = x2 - x1,
                dy = y2 - y1;
            var r = dx * dx + dy * dy;
            if (r > 1e-5) {
                var h = dx * (x - x1) / r + dy * (y - y1) / r;
                if (h > 1) {
                    h = 1;
                } else if (h < 0) {
                    h = 0;
                }
                var xh = x1 + h * dx,
                    yh = y1 + h * dy;
                var dist2 = (x - xh) * (x - xh) + (y - yh) * (y - yh);
                if (dist2 < dmin) {
                    dmin = dist2;
                    xmin = xh;
                    ymin = yh;
                    cmin = count;

                }
            }
            count++;
            x1 = x2;
            y1 = y2;
        }

        return [xmin, ymin];
    };

    this.project = function(p) {
        //        console.log("project");
        var coords = this.projectXY(p.getX(), p.getY());
        p.setXY(coords[0], coords[1]);
    };
    this.projectAlpha = function(p) {

        if ((Ptab.length < 2) || (segSize === -1))
            return;
        var alp = p.getAlpha();
        var nb = alp[0];
        var k = alp[1];

        // S'il y a eu changement de nature du point sur, qui passe
        // d'un comportement continue à discret :
        if ((segSize === 0) && (k !== 0)) {
            this.setAlpha(p);
            alp = p.getAlpha();
            nb = alp[0];
            k = alp[1];
        }
        if (nb < 0)
            nb = 0;
        else if (nb > (Ptab.length - 1))
            nb = Ptab.length - 1;
        // console.log("nb=" + nb);
        if (segSize > 0)
            p.setXY(Ptab[nb].x + k * (Ptab[nb + 1].x - Ptab[nb].x), Ptab[nb].y + k * (Ptab[nb + 1].y - Ptab[nb].y));
        else
            p.setXY(Ptab[nb].x, Ptab[nb].y);
        // console.log("projectAlpha :" + Ptab[nb].x + "  " + Ptab[nb].y);
    };
    this.setAlpha = function(p) {
        if (Ptab.length < 2)
            return;
        var dmin = 1e20,
            nb = 0,
            k = 0;
        if (segSize > 0) {
            for (var i = 1, len = Ptab.length; i < len; i++) {
                var am = (Ptab[i - 1].x - p.getX()) * (Ptab[i - 1].x - p.getX()) + (Ptab[i - 1].y - p.getY()) * (Ptab[i - 1].y - p.getY());
                var mb = (Ptab[i].x - p.getX()) * (Ptab[i].x - p.getX()) + (Ptab[i].y - p.getY()) * (Ptab[i].y - p.getY());
                var ab = (Ptab[i].x - Ptab[i - 1].x) * (Ptab[i].x - Ptab[i - 1].x) + (Ptab[i].y - Ptab[i - 1].y) * (Ptab[i].y - Ptab[i - 1].y);
                var epsilon = Math.abs(Math.sqrt(ab) - Math.sqrt(am) - Math.sqrt(mb));
                if (epsilon < dmin) {
                    dmin = epsilon;
                    nb = i - 1;
                    k = Math.sqrt(am / ab);
                }
                p.setAlpha([nb, k]);
            }
        } else {
            for (var i = 0, len = Ptab.length; i < len; i++) {
                var d2 = (Ptab[i].x - p.getX()) * (Ptab[i].x - p.getX()) + (Ptab[i].y - p.getY()) * (Ptab[i].y - p.getY());
                if (d2 < dmin) {
                    dmin = d2;
                    k = i;
                }
            }
            p.setAlpha([k, 0]);
        }
    };


    // Pour les objets "locus". Initialise le polygone à partir de la donnée
    // du nombre _nb de sommets voulus :
    this.initLocusArray = function(_nb) {
        var PtsTab = []; // Liste des sommets du polygone représentant le lieu
        // Initialisation de Ptab :
        for (var i = 0; i < Ptab.length; i++) {
            PtsTab.push({
                "alpha": i,
                "x": 0,
                "y": 0,
                "x1": 0,
                "y1": 0,
                "r": 0
            });
        }
        return PtsTab;
    };

    this.setLocusAlpha = function(p, a) {
        if (Ptab[a] !== undefined)
            p.setXY(Ptab[a].x, Ptab[a].y);
    };

    this.mouseInside = function(ev) {
        var mx = this.mouseX(ev),
            my = this.mouseY(ev);
        if (Ptab.length > 0) {
            if ($U.isNearToPoint(Ptab[0].x, Ptab[0].y, mx, my, this.getOversize()))
                return true;
            for (var i = 1, len = Ptab.length; i < len; i++) {
                if ($U.isNearToPoint(Ptab[i].x, Ptab[i].y, mx, my, this.getOversize()))
                    return true;
                if ((segSize > 0) &&
                    ($U.isNearToSegment(Ptab[i - 1].x, Ptab[i - 1].y, Ptab[i].x, Ptab[i].y, mx, my, this.getOversize())))
                    return true;

            }
        }
        return false;
    };


    this.compute = function() {
        initPtab();
    };

    var paintCircle = function(i, ctx) {
        ctx.arc(Ptab[i].x, Ptab[i].y, Ptab[i].pz, 0, Math.PI * 2, true);
        // ctx.arc(Ptab[i].x, Ptab[i].y, me.getRealsize(), 0, Math.PI * 2, true);
    };
    var paintCross = function(i, ctx) {
        var sz = Ptab[i].pz * 0.9;
        ctx.moveTo(Ptab[i].x - sz, Ptab[i].y + sz);
        ctx.lineTo(Ptab[i].x + sz, Ptab[i].y - sz);
        ctx.moveTo(Ptab[i].x - sz, Ptab[i].y - sz);
        ctx.lineTo(Ptab[i].x + sz, Ptab[i].y + sz);
    };
    var paintSquare = function(i, ctx) {
        var sz = Ptab[i].pz * 1.8;
        ctx.rect(Ptab[i].x - sz / 2, Ptab[i].y - sz / 2, sz, sz);
    };
    var paintDiamond = function(i, ctx) {
        var sz = Ptab[i].pz * 1.3;
        ctx.moveTo(Ptab[i].x, Ptab[i].y - sz);
        ctx.lineTo(Ptab[i].x - sz, Ptab[i].y);
        ctx.lineTo(Ptab[i].x, Ptab[i].y + sz);
        ctx.lineTo(Ptab[i].x + sz, Ptab[i].y);
        ctx.lineTo(Ptab[i].x, Ptab[i].y - sz);
    };
    var paintArrow = function(x1, y1, x2, y2, ctx) {
        var rot = -Math.atan2(x2 - x1, y2 - y1);
        ctx.save();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.translate(x2, y2);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrow[1], -arrow[0]);
        ctx.lineTo(arrow[1], -arrow[0]);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };
    var preRenderTeXSlices = function(ctx, txt, size) {
        var texTab = txt.toString().split("$$");
        var datas = { width: 0, positions: [], boxes: [], texts: [] };
        // var pos = 0;
        for (var i = 0; i < texTab.length; i++) {
            if (i % 2 === 0) {
                // console.log(texTab[i]);
                // ctx.fillText(texTab[i], pos, 0);
                datas.positions.push(datas.width);
                datas.boxes.push(null);
                datas.texts.push(texTab[i]);
                datas.width += ctx.measureText(texTab[i]).width;

            } else {
                var box = katex.canvasBox(texTab[i], ctx, {
                    fontSize: size * 1.5
                });
                datas.positions.push(datas.width);
                datas.boxes.push(box);
                datas.texts.push(null);
                datas.width += box.width;
            }
        }
        return datas;
    };



    var paintText = function(_p, ctx) {
        if ($U.katexLoaded(Cn.getCanvas().paint, [ctx])) {
            var x0 = _p.x,
                y0 = _p.y,
                _t = _p.text[0],
                _u = _p.text[1],
                font = _p.fnt[0],
                size = _p.fnt[1],
                face = _p.fnt[2],
                align = _p.fnt[3];

            var rot = -Math.atan2(_u[1], _u[0]);

            ctx.save();
            ctx.font = face + " " + size + "px " + font;

            // L'alignement doit se traiter par le translate
            // placé plus bas :
            ctx.textAlign = "left";
            ctx.strokeStyle = _p.rgb;
            ctx.fillStyle = _p.rgb;
            var datas = preRenderTeXSlices(ctx, _t, size);
            var d = (align === "left") ? 0 : ((align === "right") ? datas.width : datas.width / 2);
            ctx.translate(x0 - d * Math.cos(rot), y0 - d * Math.sin(rot));
            ctx.rotate(rot);
            for (var i = 0; i < datas.boxes.length; i++) {
                if (datas.boxes[i]) {
                    datas.boxes[i].renderAt(datas.positions[i], 0);
                } else {
                    ctx.fillText(datas.texts[i], datas.positions[i], 0);
                }
            }
            ctx.restore();
        };

    };

    var paintImage = function(_p, ctx) {
        var x0 = _p.x,
            y0 = _p.y,
            _url = _p.image.url,
            _w = _p.image.w,
            _h = _p.image.h,
            _z = _p.image.z,
            _o = _p.image.o,
            _u = _p.image.dir;
        var img = getImage(_url);
        if (img) {
            var rot = -Math.atan2(_u[1], _u[0]);
            ctx.save();
            ctx.translate(x0, y0);
            ctx.rotate(rot);
            ctx.globalAlpha = _o;
            if (_w < 0) {
                _w = img.width;
                _h = img.height
            }
            _w *= _z;
            _h *= _z;
            ctx.drawImage(img, -_w / 2, -_h / 2, _w, _h);
            ctx.restore();
        };
    };




    var paintPoint = paintCircle;


    this.paintObject = function(ctx) {
        var hilite = (ctx.strokeStyle === this.prefs.color.hilite);
        if ((segSize > 0) && (Ptab.length > 0)) {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // remplissage des polygones :
            ctx.beginPath();
            ctx.lineWidth = segSize;
            ctx.moveTo(Ptab[0].x, Ptab[0].y);
            for (var aa = 1, len = Ptab.length; aa < len; aa++) {
                var p = Ptab[aa];
                if (isNaN(p.x) || isNaN(p.y) || (p.fill)) {
                    if (p.fill) {
                        ctx.fillStyle = "rgba(" + p.r + "," + p.g + "," + p.b + "," + p.fill + ")";
                        ctx.lineTo(p.x, p.y);
                        // console.log("******break******");
                        // console.log("aa=" + aa+";lineto(" + Cn.coordsSystem.x(p.x) + "," + Cn.coordsSystem.y(p.y)+")");
                        // console.log("*****************");
                        aa--
                    }
                    ctx.fill();
                    ctx.beginPath();
                    aa++
                    if (aa < len)
                        ctx.moveTo(p.x, p.y);
                    // console.log("aa=" + aa+";moveto(" + Cn.coordsSystem.x(p.x) + "," + Cn.coordsSystem.y(p.y)+")");
                } else {
                    ctx.lineTo(p.x, p.y);
                    // console.log("aa=" + aa+";lineto(" + Cn.coordsSystem.x(p.x) + "," + Cn.coordsSystem.y(p.y)+")");
                }
            }
            ctx.fill();

            // Dessin des segments :
            ctx.beginPath();
            ctx.lineWidth = segSize;
            if (hilite) {
                for (var i = 1, len = Ptab.length; i < len; i++) {
                    if (isNaN(Ptab[i].x) || isNaN(Ptab[i].y)) {
                        i++
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(Ptab[i - 1].x, Ptab[i - 1].y);
                        ctx.lineTo(Ptab[i].x, Ptab[i].y);
                        ctx.stroke();
                    }
                }
            } else {
                for (var i = 1, len = Ptab.length; i < len; i++) {
                    if (isNaN(Ptab[i].x) || isNaN(Ptab[i].y)) {
                        i++
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(Ptab[i - 1].x, Ptab[i - 1].y);
                        ctx.strokeStyle = Ptab[i - 1].rgb;
                        ctx.lineWidth = Ptab[i - 1].sz;
                        ctx.lineTo(Ptab[i].x, Ptab[i].y);
                        ctx.stroke();
                        if (arrow) paintArrow(Ptab[i - 1].x, Ptab[i - 1].y, Ptab[i].x, Ptab[i].y, ctx);
                    }
                }
            }
            ctx.lineCap = "butt";
            ctx.lineJoin = "miter";
        }

        // dessin des points :
        var opaque = (me.getOpacity() > 0);
        if (!opaque) ctx.fillStyle = fillStyle;
        ctx.lineWidth = me.prefs.size.pointborder;
        if (hilite) {
            for (var i = 0, len = Ptab.length; i < len; i++) {
                if (Ptab[i].pz > 1e-10) {
                    ctx.beginPath();
                    paintPoint(i, ctx);
                    ctx.fill();
                    ctx.stroke();
                }
            }
        } else {
            if (opaque) {
                var glob_alpha = ctx.globalAlpha;
                for (var i = 0, len = Ptab.length; i < len; i++) {
                    if (Ptab[i].pz > 1e-10) {
                        ctx.beginPath();
                        ctx.strokeStyle = Ptab[i].rgb;
                        ctx.fillStyle = Ptab[i].rgb;
                        ctx.globalAlpha = me.getOpacity();
                        paintPoint(i, ctx);
                        ctx.fill();
                        ctx.globalAlpha = glob_alpha;
                        ctx.stroke();
                    }
                    if (Ptab[i].text) paintText(Ptab[i], ctx);
                    if (Ptab[i].image) paintImage(Ptab[i], ctx);
                }
            } else {
                for (var i = 0, len = Ptab.length; i < len; i++) {
                    if (Ptab[i].pz > 1e-10) {
                        ctx.beginPath();
                        ctx.strokeStyle = Ptab[i].rgb;
                        paintPoint(i, ctx);
                        ctx.fill();
                        ctx.stroke();
                    }
                    if (Ptab[i].text) paintText(Ptab[i], ctx);
                    if (Ptab[i].image) paintImage(Ptab[i], ctx);
                }
            }

        }

    };

    this.getSource = function(src) {
        src.geomWrite(false, this.getName(), "List", EXP.getVarName());
    };

}
