/* ***********************************************
Drag helper
*********************************************/
var dragHelper = {

    // -------------------------------------------------------------

    global: {
        prevX: 0,
        prevY: 0,
        ismousedown: false,
        pointsToMove: 'all',
        startingIndex: 0
    },

    // -------------------------------------------------------------

    mousedown: function (e) {

        // -------------------------------------------------------------

        if (isControlKeyPressed) {
            copy();
            paste();
            isControlKeyPressed = false;
        }

        // -------------------------------------------------------------

        var dHelper = dragHelper,
            g = dHelper.global;

        var x = e.pageX - canvas.offsetLeft,
            y = e.pageY - canvas.offsetTop;

        g.prevX = x;
        g.prevY = y;

        g.pointsToMove = 'all';

        if (points.length) {
            var p = points[points.length - 1],
                point = p[1];

            if (p[0] === 'line') {

                if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'head';
                }

                if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = 'tail';
                }
            }

            if (p[0] === 'rect') {

                if (dHelper.isPointInPath(x, y, point[0] + point[2], point[1] + point[3])) {
                    g.pointsToMove = 'stretch';
                }
            }

            if (p[0] === 'quadratic') {

                if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'starting-points';
                }

                if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = 'control-points';
                }

                if (dHelper.isPointInPath(x, y, point[4], point[5])) {
                    g.pointsToMove = 'ending-points';
                }
            }

            if (p[0] === 'bezier') {

                if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'starting-points';
                }

                if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = '1st-control-points';
                }

                if (dHelper.isPointInPath(x, y, point[4], point[5])) {
                    g.pointsToMove = '2nd-control-points';
                }

                if (dHelper.isPointInPath(x, y, point[6], point[7])) {
                    g.pointsToMove = 'ending-points';
                }
            }
        }

        g.ismousedown = true;
    },

    // -------------------------------------------------------------

    mouseup: function () {
        var g = this.global;

        if (is.isDragLastPath) {
            tempContext.clearRect(0, 0, innerWidth, innerHeight);
            context.clearRect(0, 0, innerWidth, innerHeight);
            this.end();
        }

        g.ismousedown = false;
    },

    // -------------------------------------------------------------

    mousemove: function (e) {
        var x = e.pageX - canvas.offsetLeft,
            y = e.pageY - canvas.offsetTop,
            g = this.global;

        drawHelper.redraw();

        if (g.ismousedown) {
            this.dragShape(x, y);
        }

        if (is.isDragLastPath) this.init();
    },

    // -------------------------------------------------------------

    init: function () {
        if (!points.length) return;

        var p = points[points.length - 1],
            point = p[1],
            g = this.global;

        if (g.ismousedown) tempContext.fillStyle = 'rgba(255,85 ,154,.9)';
        else tempContext.fillStyle = 'rgba(255,85 ,154,.4)';

        if (p[0] === 'quadratic') {

            tempContext.beginPath();

            tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);
            tempContext.arc(point[4], point[5], 10, Math.PI * 2, 0, !1);

            tempContext.fill();
        }

        if (p[0] === 'bezier') {

            tempContext.beginPath();

            tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);
            tempContext.arc(point[4], point[5], 10, Math.PI * 2, 0, !1);
            tempContext.arc(point[6], point[7], 10, Math.PI * 2, 0, !1);

            tempContext.fill();
        }

        if (p[0] === 'line') {

            tempContext.beginPath();

            tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);

            tempContext.fill();
        }
        
        if (p[0] === 'text') {
            tempContext.font = "15px Verdana";
            tempContext.fillText(point[0], point[1], point[2]);
        }

        if (p[0] === 'rect') {

            tempContext.beginPath();
            tempContext.arc(point[0] + point[2], point[1] + point[3], 10, Math.PI * 2, 0, !1);
            tempContext.fill();
        }
    },

    // -------------------------------------------------------------

    isPointInPath: function (x, y, first, second) {
        return x > first - 10 && x < first + 10
            && y > second - 10 && y < second + 10;
    },

    // -------------------------------------------------------------

    getPoint: function (point, prev, otherPoint) {
        if (point > prev) point = otherPoint + (point - prev);
        else point = otherPoint - (prev - point);

        return point;
    },

    // -------------------------------------------------------------

    dragShape: function (x, y) {
        if (!this.global.ismousedown) return;

        tempContext.clearRect(0, 0, innerWidth, innerHeight);

        if (is.isDragLastPath) {
            this.dragLastPath(x, y);
        }

        if (is.isDragAllPaths) {
            this.dragAllPaths(x, y);
        }

        var g = this.global;

        g.prevX = x;
        g.prevY = y;
    },

    // -------------------------------------------------------------

    end: function () {
        if (!points.length) return;

        tempContext.clearRect(0, 0, innerWidth, innerHeight);

        var point = points[points.length - 1];
        drawHelper[point[0]](context, point[1], point[2]);
    },

    // -------------------------------------------------------------

    dragAllPaths: function (x, y) {
        var g = this.global,
            prevX = g.prevX,
            prevY = g.prevY, p, point,
            length = points.length,
            getPoint = this.getPoint,
            i = g.startingIndex;

        for (i; i < length; i++) {
            p = points[i];
            point = p[1];

            if (p[0] === 'line') {
                points[i] = [p[0], [
                    getPoint(x, prevX, point[0]),
                    getPoint(y, prevY, point[1]),
                    getPoint(x, prevX, point[2]),
                    getPoint(y, prevY, point[3])
                ], p[2]];

            }
            
            if (p[0] === 'text') {
                points[i] = [p[0], [
                    point[0],
                    getPoint(x, prevX, point[1]),
                    getPoint(y, prevY, point[2])
                ], p[2]];
            }

            if (p[0] === 'arc') {
                points[i] = [p[0], [
                    getPoint(x, prevX, point[0]),
                    getPoint(y, prevY, point[1]),
                    point[2],
                    point[3],
                    point[4]
                ], p[2]];
            }

            if (p[0] === 'rect') {
                points[i] = [p[0], [
                    getPoint(x, prevX, point[0]),
                    getPoint(y, prevY, point[1]),
                    point[2],
                    point[3]
                ], p[2]];
            }

            if (p[0] === 'quadratic') {
                points[i] = [p[0], [
                    getPoint(x, prevX, point[0]),
                    getPoint(y, prevY, point[1]),
                    getPoint(x, prevX, point[2]),
                    getPoint(y, prevY, point[3]),
                    getPoint(x, prevX, point[4]),
                    getPoint(y, prevY, point[5])
                ], p[2]];
            }

            if (p[0] === 'bezier') {
                points[i] = [p[0], [
                    getPoint(x, prevX, point[0]),
                    getPoint(y, prevY, point[1]),
                    getPoint(x, prevX, point[2]),
                    getPoint(y, prevY, point[3]),
                    getPoint(x, prevX, point[4]),
                    getPoint(y, prevY, point[5]),
                    getPoint(x, prevX, point[6]),
                    getPoint(y, prevY, point[7])
                ], p[2]];
            }
        }
    },

    // -------------------------------------------------------------

    dragLastPath: function (x, y) {
        var g = this.global,
            prevX = g.prevX,
            prevY = g.prevY,
            p = points[points.length - 1],
            point = p[1],
            getPoint = this.getPoint,
            isMoveAllPoints = g.pointsToMove === 'all';

        if (p[0] === 'line') {

            if (g.pointsToMove === 'head' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'tail' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }
        
        if (p[0] === 'text') {

            if (g.pointsToMove === 'head' || isMoveAllPoints) {
                point[1] = getPoint(x, prevX, point[1]);
                point[2] = getPoint(y, prevY, point[2]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'arc') {
            point[0] = getPoint(x, prevX, point[0]);
            point[1] = getPoint(y, prevY, point[1]);

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'rect') {

            if (isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'stretch') {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'quadratic') {

            if (g.pointsToMove === 'starting-points' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'control-points' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            if (g.pointsToMove === 'ending-points' || isMoveAllPoints) {
                point[4] = getPoint(x, prevX, point[4]);
                point[5] = getPoint(y, prevY, point[5]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'bezier') {

            if (g.pointsToMove === 'starting-points' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === '1st-control-points' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            if (g.pointsToMove === '2nd-control-points' || isMoveAllPoints) {
                point[4] = getPoint(x, prevX, point[4]);
                point[5] = getPoint(y, prevY, point[5]);
            }

            if (g.pointsToMove === 'ending-points' || isMoveAllPoints) {
                point[6] = getPoint(x, prevX, point[6]);
                point[7] = getPoint(y, prevY, point[7]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }
    }

    // -------------------------------------------------------------

};
// -------------------------------------------------------------