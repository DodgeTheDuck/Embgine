
module PHYS {

    export abstract class Effector {

        public frameSpan: number;
        protected _entities: Entity[];

        constructor() {
            this._entities = [];
        };

        public abstract Do(): void;

    }

    export class EffectLocalForce extends Effector {
        
        private _position: M.Vector2;
        private _force: M.Vector2;

        constructor(entity: Entity, position: M.Vector2, force: M.Vector2) {
            super();
            this._entities.push(entity);
            this._force = force;
            this._position = position;
        }

        public Do(): void {
        
            let entity: Entity = this._entities[0];
            let body = entity.Component(CRigidBody);
            
            if(body) {                
                
                let com: M.Point = {x: 0, y: 0}
                let hull = entity.Component(CHull);
                
                let localAngle = Math.atan2(this._force.y, this._force.x) + entity.Component(CTransform).angle * Math.PI / 180;

                if(hull) {
                    com = hull.CoM;
                }
                
                let dx = this._position.x - com.x;
                let dy = this._position.y - com.y;

                let m = new M.Vector2(dx, dy).Magnitude();

                let ang = M.atan2(dy, dx);


                let lever = new M.Vector2(com.x + M.cos(ang) * m, com.y + M.sin(ang) * m );

                let t = lever.x * this._force.y - lever.y * this._force.x;
                let angle = M.atan2(this._force.y, this._force.x);
                body.AngularImpulse(t);
                body.LinearImpulse(this._force.Magnitude(), localAngle);

            }

        }

        public Draw(): void {
                    
            // let body: Body = this.bodies[0];
            // let hull: Hull = body.GetHull();
            // let com = hull.com;            
            // let dx = this._position.x - com.x;
            // let dy = this._position.y - com.y;
            // let m = new M.Vector2(dx, dy).Magnitude();
            // let ang = M.atan2(dy, dx);
            // let lever = new M.Vector2(com.x + M.cos(ang) * m, com.y + M.sin(ang) * m );

            // GFX.context.save()
            // GFX.context.beginPath();
            // GFX.context.strokeStyle = "green";
            // GFX.context.translate(body.GetPosition().x + com.x, body.GetPosition().y + com.y);
            // GFX.context.moveTo(0, 0);
            // GFX.context.lineTo(lever.x, lever.y);
            // GFX.context.stroke();
            // GFX.context.closePath();
            // GFX.context.restore();
            
        }

        public SetForce(force: M.Vector2): void {
            this._force = force;
        }

        public GetForce(): M.Vector2 {
            return this._force;
        }

    }

    // export class EffectSpring extends Effector {
    //     public k: number;
    //     constructor(bodyA: CRigidBody, bodyB: CRigidBody) {
    //         super();
    //         this.bodies.push(bodyA);
    //         this.bodies.push(bodyB);
    //         this.k = 0.02;
    //     }

    //     public Do(): void {
        
    //         let a: CRigidBody = this.bodies[0];
    //         let b: CRigidBody = this.bodies[1];

    //         let x = a.GetPosition().DistanceTo(b.GetPosition());
    //         let dPos: M.Vector2 = M.Vector2.Sub(b.GetPosition(), a.GetPosition());
            
    //         let d = 32;

    //         let dv: M.Vector2 = M.Vector2.Sub(b.GetVelocity(), a.GetVelocity());
    //         let angle: number = M.Vector2.Angle(b.GetPosition(), a.GetPosition());

    //         let F: number = -this.k * (x - d) * (M.Vector2.Normal(dPos).Magnitude()) * 0.7 ;            


    //             a.LinearImpulse( F , angle );
    //             b.LinearImpulse( F , angle - (Math.PI) );
    
    //     }

    // }

}
