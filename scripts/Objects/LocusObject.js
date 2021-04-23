//************************************************
//***************** AREA OBJECT ******************
//************************************************


// Lugares de puntos, rectas y círculos:
function LocusObject(_construction, _name, _O, _ON) {
    var parentObject = $U.extend(this, new ConstructionObject(_construction, _name)); // Herencia
    $U.extend(this, new MoveableObject(_construction)); // Herencia

    var NB; // número de lados del polígono



    var O = _O; // Objeto que genera el lugar
    var ON = _ON; // Punto sobre objeto que crea el lugar
    var Ptab;
    //    var ON.getParentAt(0).initLocusArray(NB, (O.getCode() !== "point"));

    //    var Ptab = ON.getParentAt(0).initLocusArray(NB, (O.getCode() !== "point"));

    //    parentObject.setPrecision(7);
    //
    //    // Il s'agit ici du réglage du nombre de côté du polygone de lieu
    //    // -1 pour 1000, 1 pour 10, 2 pour 20,...
    //    var precTab=[1000,1000,20,50,100,200,500,1000,1500,2000,3000,4000,5000,5000,5000,5000,5000];
    //
    //    this.setPrecision = function(_prec) {
    //        var p=Math.round(1*_prec);
    //        parentObject.setPrecision(p);
    //        NB=precTab[p+1];
    //        Ptab = ON.getParentAt(0).initLocusArray(NB, (O.getCode() !== "point"));
    ////        this.compute();
    ////        console.log(p);
    //    };

    this.getPrecision = function() {
        return NB;
    };
    this.getRealPrecision = function() {
        return NB;
    };
    this.setPrecision = function(_prec) {
        _prec = parseInt(_prec);
        NB = (_prec === 0) ? 1000 : _prec; // Compatibilidad con los lugares antiguos
        if (NB > 500) {
            // Si no se trata de un lugar de punto y que el punto piloto
            // no está sobre una recta (sobre círculo o segmento),
            // se reduce el número de objetos con un factor 10 :
            if ((_O.getCode() !== "point") && (_ON.getParentAt(0).getCode() !== "line"))
                NB = NB / 50;
            if ((_O.getCode() !== "point") && (_ON.getParentAt(0).getCode() === "line"))
                NB = NB / 5;
        }

        Ptab = ON.getParentAt(0).initLocusArray(NB, (O.getCode() !== "point"));
        NB = Ptab.length;
        //        console.log("Ptab.length="+Ptab.length+" NB="+NB);
        //        this.compute();
    };

    this.setPrecision(1000);





    var depsChain = _construction.findDeps(O, ON); // Cadena de dependencia entre O y ON (excluidos)
    this.setParent(O, ON);
    this.setDefaults("locus");

    this.getAssociatedTools = function() {
        return "@callproperty,@calltrash,point";
    };

    this.isInstanceType = function(_c) {
        return (_c === "locus");
    };
    this.getCode = function() {
        return "locus";
    };
    this.getFamilyCode = function() {
        return "locus";
    };


    // ****************************************
    // **** Unicamente para las animaciones ****
    // ****************************************


    this.getAlphaBounds = function(anim) {
        var inc = 5 * Math.round(anim.direction * (anim.speed * anim.delay / 1000));
        return [0, Ptab.length - 1, inc]
    };

    this.getAnimationSpeedTab = function() {
        return [0, 20, 25, 50, 100, 200, 400, 500, 750, 1000];
    };

    this.getAnimationParams = function(x0, y0, x1, y1) {
        var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
        var fce = this.getAnimationSpeedTab();
        var f = Math.floor(d / (300 / fce.length));
        if (f >= fce.length) f = fce.length - 1;

        var xAB = (Ptab[0].x - x0),
            yAB = (Ptab[0].y - y0);
        var d2 = xAB * xAB + yAB * yAB,
            d1 = 0;
        var k = 0;
        for (var i = 1; i < NB; i++) {
            xAB = (Ptab[i].x - x0);
            yAB = (Ptab[i].y - y0);
            d1 = xAB * xAB + yAB * yAB;
            if ((d1 < d2) || isNaN(d2)) {
                k = i;
                d2 = d1;
            }
        }
        var xp = Ptab[k - 1].x;
        var yp = Ptab[k - 1].y;
        var ps = (xp - x0) * (x1 - x0) + (yp - y0) * (y1 - y0);
        var dir = (ps > 0) ? 1 : -1;
        var dop = Math.sqrt((xp - x0) * (xp - x0) + (yp - y0) * (yp - y0));
        var dom = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
        var cs = ps / (dop * dom);
        var aller_retour = (Math.abs(cs) < 0.707);
        var pcent = Math.round(100 * fce[f] / fce[fce.length - 1])+"%";

        return {
            message: aller_retour ? pcent + " \u21C4" : pcent + "",
            speed: fce[f],
            direction: dir,
            ar: aller_retour
        }
    }

    // ****************************************
    // ****************************************


    this.projectXY = function(_x, _y) {
        var xAB = (Ptab[0].x - _x),
            yAB = (Ptab[0].y - _y);
        var d2 = xAB * xAB + yAB * yAB,
            d1 = 0;
        var k = 0;
        for (var i = 1; i < NB; i++) {
            xAB = (Ptab[i].x - _x);
            yAB = (Ptab[i].y - _y);
            d1 = xAB * xAB + yAB * yAB;
            if ((d1 < d2) || isNaN(d2)) {
                k = i;
                d2 = d1;
            }
        }
        return [Ptab[k].x, Ptab[k].y];
    };

    this.project = function(p) {
        var coords = this.projectXY(p.getX(), p.getY());
        p.setXY(coords[0], coords[1]);
    };

    this.projectAlpha = function(p) {
        var k = p.getAlpha();
        if (k < 0)
            k = 0;
        if (k > (Ptab.length - 1))
            k = Ptab.length - 1;
        p.setXY(Ptab[k].x, Ptab[k].y);
    };

    this.setAlpha = function(p) {
        var xAB = 0,
            yAB = 0;
        for (var i = 0; i < NB; i++) {
            xAB = (Ptab[i].x - p.getX()), yAB = (Ptab[i].y - p.getY());
            if ((xAB === 0) && (yAB === 0)) {
                p.setAlpha(i);
                return;
            }
        }
    };

    // Para los objetos "locus". Inicializa el polígono a partir del dato
    // del número _nb de vértices deseados:
    this.initLocusArray = function(_nb) {
        var step = 1;
        var Ptab = []; // Lista de los vértices del polígono que representa el lugar
        // Inicialización de Ptab :
        for (var i = 0; i < NB; i++) {
            Ptab.push({
                "alpha": i,
                "x": 0,
                "y": 0,
                "x1": 0,
                "y1": 0,
                "r": 0
            });
        }
        return Ptab;
    };

    this.setLocusAlpha = function(p, a) {
        if (Ptab[a] !== undefined)
            p.setXY(Ptab[a].x, Ptab[a].y);
    };


    var mouseInsidePoints = function(ev) {
        var mx = this.mouseX(ev),
            my = this.mouseY(ev);
        for (var i = 0; i < NB; i++) {
            if ($U.isNearToPoint(Ptab[i].x, Ptab[i].y, mx, my, this.getOversize()))
                return true;
        }
        return false;
    };

    var mouseInsideLines = function(ev) {
        var mx = this.mouseX(ev),
            my = this.mouseY(ev);
        for (var i = 0; i < NB; i++) {
            if ($U.isNearToSegment(Ptab[i].x, Ptab[i].y, Ptab[i].x1, Ptab[i].y1, mx, my, this.getOversize()))
                return true;
        }
        return false;
    };





    // Recalcula la cadena de dependencia que lleva ON a O :
    var computeDeps = function() {
        for (var k = 0, len = depsChain.length; k < len; k++) {
            depsChain[k].compute();
        }
        O.compute();
    };

    var computePoints = function() {
        for (var i = 0; i < NB; i++) {
            ON.getParentAt(0).setLocusAlpha(ON, Ptab[i].alpha);
            computeDeps();
            Ptab[i].x = O.getX();
            Ptab[i].y = O.getY();
        }
        ON.compute(); // Restablece la posición original
        computeDeps();
    };

    var computeLines = function() {
        for (var i = 0; i < NB; i++) {
            ON.getParentAt(0).setLocusAlpha(ON, Ptab[i].alpha);
            computeDeps();
            Ptab[i].x = O.getXmin();
            Ptab[i].y = O.getYmin();
            Ptab[i].x1 = O.getXmax();
            Ptab[i].y1 = O.getYmax();
        }
        ON.compute(); // Restablece la posición original
        computeDeps();
    };

    var computeCircles = function() {
        for (var i = 0; i < NB; i++) {
            ON.getParentAt(0).setLocusAlpha(ON, Ptab[i].alpha);
            computeDeps();
            Ptab[i].x = O.getP1().getX();
            Ptab[i].y = O.getP1().getY();
            Ptab[i].r = O.getR();
        }
        ON.compute(); // Restablece la posición original
        computeDeps();
    };



    var paintObjectPoints = function(ctx) {
        ctx.beginPath();
        ctx.moveTo(Ptab[0].x, Ptab[0].y);
        for (var i = 1; i < NB; i++) {
            ctx.lineTo(Ptab[i].x, Ptab[i].y);
        }
        ctx.stroke();
        ctx.fill();
    };

    var paintObjectLines = function(ctx) {
        ctx.beginPath();
        ctx.moveTo(Ptab[0].x, Ptab[0].y);
        ctx.lineTo(Ptab[0].x1, Ptab[0].y1);
        for (var i = 1; i < NB; i++) {
            ctx.moveTo(Ptab[i].x, Ptab[i].y);
            ctx.lineTo(Ptab[i].x1, Ptab[i].y1);
        }
        ctx.stroke();

    };

    var paintObjectCircles = function(ctx) {
        ctx.beginPath();
        for (var i = 0; i < NB; i++) {
            ctx.moveTo(Ptab[i].x + Ptab[i].r, Ptab[i].y);
            ctx.arc(Ptab[i].x, Ptab[i].y, Ptab[i].r, 0, Math.PI * 2, false);

        }
        ctx.stroke();
    };


    // ***********************************************************
    // *****Inicialización de this.compute y de this.paintObject*******
    // ***********************************************************
    switch (O.getFamilyCode()) {
        case "point":
            this.compute = computePoints;
            this.paintObject = paintObjectPoints;
            this.mouseInside = mouseInsidePoints;
            break;
        case "line":
            this.compute = computeLines;
            this.paintObject = paintObjectLines;
            this.mouseInside = mouseInsideLines;
            break;
        case "circle":
            this.compute = computeCircles;
            this.paintObject = paintObjectCircles;
            this.mouseInside = mouseInsidePoints;
            break;
    }




    this.getSource = function(src) {
        src.geomWrite(false, this.getName(), "Locus", O.getVarName(), ON.getVarName());
    };

    // MEAG
    this.getTextCons = function() {
      return "";
    }
    // MEAG end

};
