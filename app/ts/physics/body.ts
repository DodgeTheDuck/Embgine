module PHYS {

    export abstract class Body {
            
        protected _pos: M.Vector2 = M.Vector2.Zero();
        protected _vel: M.Vector2 = M.Vector2.Zero();
        protected _acc: M.Vector2 = M.Vector2.Zero();

        protected _ang: number = 0.0;
        protected _angVel: number = 0.0;
        protected _angAccel: number = 0.0;

        public Init(): void {
            
        }

        public Logic(): void {            
            this._PreIntegrate();
            this._Integrate();
            this._PostIntegrate();
        }

        
        protected abstract _PreIntegrate(): void;

        private _Integrate(): void {
            this._pos.Add(this._vel);            
            this._ang += this._angVel;
        }

        protected abstract _PostIntegrate(): void;

        public Draw(): void {

        }

        public LinearImpulse(force: number, angle: number): void {
            this._acc.x += Math.cos(angle) * force;
            this._acc.y += Math.sin(angle) * force;
        }

        public AngularImpulse(torque: number) {
            this._angAccel += torque;
        }
        public GetPosition(): M.Vector2 {
            return this._pos;
        }

        public GetVelocity(): M.Vector2 {
            return this._vel;
        }

        public SetPosition(pos: M.Vector2): void {
            this._pos = pos;
        }

        public SetVelocity(vel: M.Vector2): void {
            this._vel = vel;
        }

        public GetAngularAcceleration(): number {
            return this._angAccel;
        }

        public SetAngularAcceleration(aa: number): void {
            this._angAccel = aa;
        }

        private OnCollision(ce: CollisionEvent): void {
            //TODO: collision logic
        }        

        public SetAngle(angle: number): void {
            this._ang = angle;
        }

        public GetAngle(): number {
            return this._ang;
        }

        public GetCoM(): M.Vector2 {
            return M.Vector2.Zero();
        }

    }

    export class RigidBody extends Body {        

        private _hull: Hull;

        protected _PreIntegrate(): void {
            this._vel.Add(new M.Vector2(this._acc.x / this._hull.mass, this._acc.y / this._hull.mass));
            this._angVel += this._angAccel / this._hull.moi;
        }
        
        protected _PostIntegrate(): void {
            this._vel.Mult(new M.Vector2(0.97, 0.97));
            this._angVel *= 0.97;
            this._acc.Zero();
            this._angAccel = 0;
        }

        public GetHull<T extends Hull>(): T {
            return <T>this._hull;
        }

        public SetHull(hull: Hull): void {
            this._hull = hull;
        }
        
        public GetCoM(): M.Vector2 {
            return this._hull.com;
        }

        public Draw(): void {
            if( this._hull) {
                G.GFX.Save();
                G.GFX.Translate(this._pos.x, this._pos.y);
                G.GFX.Rotate(this._ang);
                this._hull.Draw();
                G.GFX.Restore();
            }
        }

    }

}