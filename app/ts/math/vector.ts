
module M {

    export class Vector2 {

        public static Zero(): Vector2 {
            return new Vector2(0, 0);
        }

        public static Right(): Vector2 {
            return new Vector2(1, 0);
        }

        public static Up(): Vector2 {
            return new Vector2(0, 1);
        }

        public static Add(left: Vector2, right: Vector2 ): Vector2 {
            return new Vector2(left.x + right.x, left.y + right.y);
        }

        public static Sub(left: Vector2, right: Vector2 ): Vector2 {
            return new Vector2(left.x - right.x, left.y - right.y);
        }

        public static Mult(left: Vector2, right: Vector2 ): Vector2 {
            return new Vector2(left.x * right.x, left.y * right.y);
        }

        public static Divide(left: Vector2, right: any ): Vector2 {
            if( right.x != undefined && right.y != undefined ) {
                if( left.x === 0 || left.y === 0 || right.y === 0 || right.x === 0) {
                    return M.Vector2.Zero();
                } else {
                    return new Vector2(left.x / right.x, left.y / right.y);
                }
            } else {
                if( right === 0) {
                    return M.Vector2.Zero();
                } else {
                    return new Vector2(left.x / right, left.y / right);
                }
            }
        }

        public static Normal(left: Vector2): Vector2 {
            return Vector2.Divide( left, left.Magnitude());
        }

        public static Distance(a: Vector2, b: Vector2): number {
            return M.sqrt( M.pow(b.x - a.x, 2) + M.pow(b.y - a.y, 2) );
        }

        public static Angle(a: Vector2, b: Vector2): number {
            return M.atan2(b.y - a.y, b.x - a.x);
        }

        public static Dot(a, b): number {
            return a.x * b.x + a.y * b.y;
        };

        public x: number;
        public y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public Add(other: Vector2): void {
            this.x += other.x;
            this.y += other.y;
        }

        public Sub(other: Vector2): void {
            this.x -= other.x;
            this.y -= other.y;
        }

        public Mult(other: Vector2): void {
            this.x *= other.x;
            this.y *= other.y;
        }

        public MultScalar(other: number): this {
            this.x *= other;
            this.y *= other;
            return this;
        }

        public Zero(): void {
            this.x = 0;
            this.y = 0;
        }

        public Magnitude(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        public DistanceTo(other: Vector2): number {
            return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
        }

    }

}
