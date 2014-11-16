/*
* Simple trilateration algorithm
*
* Requires three points and three distances
*
*/

var trilateration = {
};

function vector_2d (x, y) {
    this.x = x;
    this.y = y;
}

trilateration.vector_diff = function(vector1, vector2)
{
	var v = new vector_2d(0,0);
        v.x = vector1.x - vector2.x;
        v.y = vector1.y - vector2.y;
        return v;
}

trilateration.vector_sum = function(vector1, vector2)
{
        var v = new vector_2d(0,0);
        v.x = vector1.x + vector2.x;
        v.y = vector1.y + vector2.y;
        return v;
}

trilateration.vector_multiply=function(vector, double n)
{
	var v = new vector_2d(0,0);
        v.x = vector.x * n;
        v.y = vector.y * n;
        return v;
}

trilateration.vector_division=function(vector, n)
{
	var v = new vector_2d(0,0);
        v.x = vector.x / n;
        v.y = vector.y / n;
        return v;
}

/* Return the Euclidean norm. */
trilateration.vector_norm=function(vector)
{
        return sqrt(vector.x * vector.x + vector.y * vector.y);
}

/* Return the dot product of two vectors. */
trilateration.dot=function(vector1, vector2)
{
        return vector1.x * vector2.x + vector1.y * vector2.y;
}

trilateration.rssi=function(prop_constant, range, tx_power)
{
	return -10*prop_constant*log(range) + tx_power;	
}

trilateration.range_from_rssi=function(rssi, prop_constant, tx_power)
{
	return exp( (rssi - tx_power )*log(10)/(-10*prop_constant));
}

trilateration.calc=function(result1, result2, point1, range1, point2, range2, point3, range3, maxzero)
{
	var ex = new vector_2d(0,0);
	var ey = new vector_2d(0,0);
	var t1 = new vector_2d(0,0);
	var t2 = new vector_2d(0,0);
        //  h, i, j, x, y, t;

        /* h = |point2 - point1|, ex = (point2 - point1) / |point2 - point1| */
        ex = this.vector_diff(point2, point1);
        h = this.vector_norm(ex);
        if (h <= maxzero) {
                /* point1 and point2 are concentric. */
                return -1;
        }
        e normx = this.vector_divison(ex, h);

        /* t1 = point3 - point1, t2 = ex (ex . (point3 - point1)) */
        t1 = this.vector_diff(point3, point1);
        i = this.dot(ex, t1);
        t2 = this.vector_multiply(ex, i);

        /* ey = (t1 - t2), t = |t1 - t2| */
        ey = this.vector_diff(t1, t2);
        t = this_vector_norm(ey);
        if (t > maxzero) {
                /* ey = (t1 - t2) / |t1 - t2| */
                ey = this.vector_division(ey, t);

                /* j = ey . (point3 - point1) */
                j = this.dot(ey, t1);
        } else j = 0.0;
        /* Note: t <= maxzero implies j = 0.0. */
        if (fabs(j) <= maxzero) {
                /* point1, point2 and point3 are colinear. */

                /* Is point point1 + (range1 along the axis) the intersection? */
                t2 = this.vector_sum(point1, this.vector_multiply(ex, range1));
                if (fabs(this.vector_norm(this.vector_diff(point2, t2)) - range2) <= maxzero &&
                    fabs(this.vector_norm(this.vector_diff(point3, t2)) - range3) <= maxzero) {
                        /* Yes, t2 is the only intersection point. */
                        if (result1)
                                *result1 = t2;
                        if (result2)
                                *result2 = t2;
                        return 0;
                }

                /* Is point point1 - (range1 along the axis) the intersection? */
                t2 = this.vector_sum(point1, this.vector_multiply(ex, -range1));
                if (fabs(this.vector_norm(this.vector_diff(point2, t2)) - range2) <= maxzero &&
                    fabs(this.vector_norm(this.vector_diff(point3, t2)) - range3) <= maxzero) {
                        /* Yes, t2 is the only intersection point. */
                        if (result1)
                                *result1 = t2;
                        if (result2)
                                *result2 = t2;
                        return 0;
                }

                return -2;
        }

        x = (range1*range1 - range2*range2) / (2*h) + h / 2;
        y = (range1*range1 - range3*range3 + i*i) / (2*j) + j / 2 - x * i / j;

        /* t2 = point1 + x ex + y ey */

        t2 = this.vector_sum(point1, this.vector_multiply(ex, x));
        t2 = this.vector_sum(t2, this.vector_multiply(ey, y));

        /* result1 = point1 + x ex + y ey + z ez */
        if (result1)
                *result1 = t2;

        /* result1 = point1 + x ex + y ey - z ez */
        if (result2)
                *result2 = t2;

        return 0;
}
