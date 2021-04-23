//************************************************
//*****************INTERSECTION OBJECT ***********
//************************************************
function IntersectionObject(_construction, _name, _O1, _O2, _near) {
    $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
    
    var _near = _near;
    var o1 = _O1;
    var o2 = _O2;
    var Cn = _construction;

    this.setParent(o1, o2);
    this.setParent(o1, o2, this);
    this.setFillStyle(2);
    this.forceFillStyle(2);

    this.getCode = function() {
      return "circle_int";
    };
  
    this.isMoveable = function() {
      return false;
    };

    this.circle_intersection = function() {
        // Determine Circle/Circle intersection :
        var xC1 = o1.getP1().getX(),
        yC1 = o1.getP1().getY();

        var xC2 = o2.getP1().getX(),
        yC2 = o2.getP1().getY();

        var dx = xC2 - xC1,
        dy = yC2 - yC1;
        var r = Math.sqrt(dx * dx + dy * dy);
        var r1 = o1.getR(),
        r2 = o2.getR();
        if (r > (r1 + r2)) {
            this.setXY(NaN, NaN);
            return;
        }
        if (r === 0) {}
        var l = (r * r + r1 * r1 - r2 * r2) / (2 * r);
        dx /= r;
        dy /= r;
        var x = xC1 + l * dx,
        y = yC1 + l * dy;
        var h = r1 * r1 - l * l;
        if (h < 0) {
            this.setXY(NaN, NaN);
            //p2.setXY(NaN, NaN);
            return;
        }
        h = Math.sqrt(h);
        if (_near == true)
            this.setXY(x - h * dy, y + h * dx);
        else
            this.setXY(x + h * dy, y - h * dx);
        o1.checkIfValid(this)
        o2.checkIfValid(this)
    };

    this.line_intersection = function(o1, o2) {
        NDY = o1.getNDY();
        NDX = o1.getNDX();

        var x = o2.getP1().getX(),
        y = o2.getP1().getY();
        var r = o2.getR();
        var d = (x - o1.getP1().getX()) * NDY - (y - o1.getP1().getY()) * NDX;

        // Si el círculo y la recta son tangentes:
        if (Math.abs(r - Math.abs(d)) < 1e-12) {
            var c = o1.projectXY(x, y);
            this.setXY(c[0], c[1]);
            return;
        }

        x -= d * NDY;
        y += d * NDX;
        var h = r * r - d * d;
        var _xmax, _ymax, _xmin, _xmin;
        _xmax = Math.max(o1.getXmax(), o1.getXmin());
        _xmin = Math.min(o1.getXmax(), o1.getXmin());
        _ymax = Math.max(o1.getYmax(), o1.getYmin());
        _ymin = Math.min(o1.getYmax(), o1.getYmin());

        if (h >= 0) {
            h = Math.sqrt(h);
            var hDX = h * NDX,
            hDY = h * NDY;
            if (_near == true) {
                if (x - hDX < _xmin || x -hDX > _xmax || y - hDY < _ymin || y -hDY > _ymax)
                    this.setXY(NaN, NaN);
                else
                    this.setXY(x - hDX, y - hDY);
            }
            else {
                if (x + hDX < _xmin || x + hDX > _xmax || y + hDY < _ymin || y + hDY > _ymax)
                    this.setXY(NaN, NaN);
                else
                    this.setXY(x + hDX, y + hDY);
            }
        } else {
            this.setXY(NaN, NaN);
        }
        o1.checkIfValid(this)
        o2.checkIfValid(this)
    };

    this.compute = function() {
        if (o1.isInstanceType("line")) {
            this.line_intersection(o1, o2);
        }
        else if (o2.isInstanceType("line")) {
            this.line_intersection(o2, o1);
        }
        else {
            this.circle_intersection();
        }
        if (!Cn.getFrame().ifObject(this.getName())) {
            Cn.getFrame().getTextCons(this);
          }
    };
  
    this.getSource = function(src) {
      if (this.execMacroSource(src)) return;
      src.geomWrite(false, this.getName(), "Intersect", o1.getVarName(), o2.getVarName());
    };
  
    // MEAG start
    this.getTextCons = function() {
      if (this.getParentLength()) {
        texto = "";
        texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName();
        parents = [o1.getVarName(), o2.getVarName()];
        return {
          "texto": texto,
          "parents": parents
        };
      }
    }
  };