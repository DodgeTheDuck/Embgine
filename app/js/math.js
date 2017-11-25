var MATH;
(function (MATH) {
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
            if (left.x === 0 || left.y === 0 || right.y === 0 || right.x === 0) {
                return MATH.Vector2.Zero();
            }
            else {
                return new Vector2(left.x / right.x, left.y / right.y);
            }
        }
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
    MATH.Vector2 = Vector2;
})(MATH || (MATH = {}));
//# sourceMappingURL=math.js.map