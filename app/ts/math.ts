
module MATH {

    export class Vector2 {

        public static Zero(): Vector2 {
            return new Vector2(0, 0);
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

        public static Divide(left: Vector2, right: Vector2 ): Vector2 {
            if( left.x === 0 || left.y === 0 || right.y === 0 || right.x === 0) {
                return MATH.Vector2.Zero();
            } else {
                return new Vector2(left.x / right.x, left.y / right.y);
            }
        }

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
