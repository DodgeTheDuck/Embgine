var M;
(function (M) {
    function sqrt(n) {
        return Math.sqrt(n);
    }
    M.sqrt = sqrt;
    function pow(n, e) {
        return Math.pow(n, e);
    }
    M.pow = pow;
    function atan2(y, x) {
        return Math.atan2(y, x);
    }
    M.atan2 = atan2;
    function cos(n) {
        return Math.cos(n);
    }
    M.cos = cos;
    function sin(n) {
        return Math.sin(n);
    }
    M.sin = sin;
    class Vector2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        static Zero() {
            return new Vector2(0, 0);
        }
        static Add(left, right) {
            return new Vector2(left.x + right.x, left.y + right.y);
        }
        static Sub(left, right) {
            return new Vector2(left.x - right.x, left.y - right.y);
        }
        static Mult(left, right) {
            return new Vector2(left.x * right.x, left.y * right.y);
        }
        static Divide(left, right) {
            if (right.x != undefined && right.y != undefined) {
                if (left.x === 0 || left.y === 0 || right.y === 0 || right.x === 0) {
                    return M.Vector2.Zero();
                }
                else {
                    return new Vector2(left.x / right.x, left.y / right.y);
                }
            }
            else {
                if (right === 0) {
                    return M.Vector2.Zero();
                }
                else {
                    return new Vector2(left.x / right, left.y / right);
                }
            }
        }
        static Normal(left) {
            return Vector2.Divide(left, left.Magnitude());
        }
        static Distance(a, b) {
            return M.sqrt(M.pow(b.x - a.x, 2) + M.pow(b.y - a.y, 2));
        }
        static Angle(a, b) {
            return M.atan2(b.y - a.y, b.x - a.x);
        }
        static Dot(a, b) {
            return a.x * b.x + a.y * b.y;
        }
        ;
        Add(other) {
            this.x += other.x;
            this.y += other.y;
        }
        Sub(other) {
            this.x -= other.x;
            this.y -= other.y;
        }
        Mult(other) {
            this.x *= other.x;
            this.y *= other.y;
        }
        MultScalar(other) {
            this.x *= other;
            this.y *= other;
        }
        Zero() {
            this.x = 0;
            this.y = 0;
        }
        Magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        DistanceTo(other) {
            return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
        }
    }
    M.Vector2 = Vector2;
})(M || (M = {}));
//# sourceMappingURL=math.js.map