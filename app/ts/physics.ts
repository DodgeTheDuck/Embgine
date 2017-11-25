
module PHYS {

    interface CollisionEvent {
        me: Hull;
        other: Hull;
        contact: MATH.Vector2;
        normal: MATH.Vector2;
        force: number;
    }    

    export class Ray {

        public from: MATH.Vector2;
        public direction: MATH.Vector2;
        public world: World;
        public hasIntersected: boolean;

        private static rays: Ray[] = [];
        
        public static CastAll(from: MATH.Vector2, dir: MATH.Vector2, world: World) : Array<CollisionEvent> {

            let me = new Ray();
            me.direction = dir;
            me.from = from;
            me.world = world;
            Ray.rays.push(me);
            let events: CollisionEvent[] = [];

            for( let body of world.GetBodies() ) {
                let event: CollisionEvent = null;
                let hull = body.GetHull<Hull>();
                switch(hull.type) {
                    case EHullType.NONE: {
                        break;
                    }
                    case EHullType.CIRCLE: {
                        event = Ray.CastForCircle(me, body.GetPosition().x, body.GetPosition().y, body.GetHull<HullCircle>().radius);
                        break;
                    }
                }
                if( event != null) events.push(event);
            }
            return events;
        }

        public static CastSingle(from: MATH.Vector2, dir: MATH.Vector2, other: Body) : CollisionEvent {
            
            let me = new Ray();
            me.direction = dir;
            me.from = from;
            Ray.rays.push(me);

            let event: CollisionEvent;
            let hull = other.GetHull<Hull>();
            switch(hull.type) {
                case EHullType.NONE: {
                    break;
                }
                case EHullType.CIRCLE: {
                    event = Ray.CastForCircle(me, other.GetPosition().x, other.GetPosition().y, other.GetHull<HullCircle>().radius);
                    break;
                }
            }
        
            return event;
        }
    

        public static Draw(): void {

            for( let ray of Ray.rays ) {
                           
                let theta = Math.atan2(ray.direction.y, ray.direction.x);
                
                GFX.context.strokeStyle = (ray.hasIntersected) ? "green" : "blue";
                GFX.context.lineWidth = 0.5;

                GFX.context.beginPath();
                GFX.context.moveTo(ray.from.x - Math.cos(theta) * 1000, ray.from.y - Math.sin(theta) * 1000);
                GFX.context.lineTo(ray.from.x + Math.cos(theta) * 1000, ray.from.y + Math.sin(theta) * 1000);
                GFX.context.stroke();
                GFX.context.closePath();
            
            }

            Ray.rays = [];

        } 

        private static CastForCircle(ray: Ray, cx: number, cy: number, r: number) : CollisionEvent {

            let event: CollisionEvent = null;

            let x0 = ray.from.x - cx;
            let y0 = ray.from.y - cy;

            let x1 = x0 + ray.direction.x;
            let y1 = y0 + ray.direction.y;

            let dx = x1 - x0;
            let dy = y1 - y0;
            let dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
            let D = x0 * y1 - x1 * y0;
                
            let discriminant = Math.pow(r, 2) * Math.pow(dr, 2) - Math.pow(D, 2);

            if( discriminant >= 0) {                

                ray.hasIntersected = true;

                let sign = ( dy < 0 ) ? -1 : 1;
                       
                let x = ( D * dy - sign * dx * Math.sqrt(r * r * dr * dr - D * D) ) / (dr * dr);
                let y = (-D * dx - dy * Math.sqrt(r * r * dr * dr - D * D) ) / (dr * dr);

                let nx = x - cx;
                let ny = y - cy;

                event = {
                    normal: new MATH.Vector2(nx, ny),
                    contact: new MATH.Vector2(x, y),
                    force: 0,
                    me: null,
                    other: null,
                }
                
            } 
            return event;

        }

        

    }

    class Effector {
        public frameSpan: number;

        constructor() {

        };
    }

    export class EffectSpring extends Effector {
        constructor() {
            super();
        }
    }

    export type collisionCallback = (ce: CollisionEvent) => void;

    export interface IPhysicalProperties {
        damping: number;
    }

    class WorldNode {
        public properties: IPhysicalProperties;
    }

    export class World {

        private _nodes: WorldNode[][];
        private _bodies: Body[];
        private _resolution: number;
        private _width: number;
        private _height: number;

        constructor(width: number, height: number, resolution: number) {
            this._nodes = [];
            this._width = width;
            this._height = height;
            this._resolution = resolution;
            this._bodies = [];
        }

        public Init(): void {
            
        }

        public Logic(): void {

            let collisionEvents: CollisionEvent[] = this._CollisionPrediction();
            this._CollisionResolve(collisionEvents);

            this._Simulate();
        }        

        public Draw(): void { 
            for( let body of this._bodies) {
                body.Draw();
            }
            PHYS.Ray.Draw();
        }

        public Node(x: number, y: number): WorldNode {
            return this._nodes[x][y];
        }

        public RegisterBody(body: Body): void {
            this._bodies.push(body);
        }

        public GetBodies(): Body[] {
            return this._bodies;
        }

        private _Simulate(): void {
            for( let body of this._bodies) {
                body.Logic();
            }
        }

        private _CollisionPrediction(): CollisionEvent[] {
            let events: CollisionEvent[] = [];

            for( let body of this._bodies) {
                let hull: Hull = body.GetHull();
                if( hull != null && body.GetVelocity().Magnitude() > 0 ) {
                    for( let other of this._bodies) {
                    if( other != body ) {                        
                            if( other.GetHull() != null) {
                                let event: CollisionEvent = hull.Predict(other);
                                if(event) events.push(event);
                            }
                        }
                    }
                }
            }

            return events;

        }

        private _CollisionResolve(events: CollisionEvent[]): void {

            if( events.length > 0) {
                
            }

        }

    }

    export class Body {
        
        private _pos: MATH.Vector2 = MATH.Vector2.Zero();
        private _vel: MATH.Vector2 = MATH.Vector2.Zero();
        private _acc: MATH.Vector2 = MATH.Vector2.Zero();
        private _mass: number = 1;        

        private _world: World;
        private _hull: Hull;

        public Init(): void {
            this._hull.onCollision = this.OnCollision;
        }

        public Logic(): void {

            this._vel.Add(this._acc);
            this._pos.Add(this._vel);
            this._vel.Mult(new MATH.Vector2(0.97, 0.97));
            this._acc.Zero();

        }

        public Draw(): void {

            GFX.Save();
            GFX.Translate(this._pos.x, this._pos.y);
            GFX.context.beginPath();
            GFX.context.arc(0, 0, 4, 0, Math.PI * 2);            
            GFX.context.stroke();
            GFX.context.closePath();
            GFX.Restore();

        }

        public Impulse(force: number, angle: number): void {
            this._acc.x += Math.cos(angle) * force;
            this._acc.y += Math.sin(angle) * force;
        }

        public GetPosition(): MATH.Vector2 {
            return this._pos;
        }

        public GetVelocity(): MATH.Vector2 {
            return this._vel;
        }

        public SetPosition(pos: MATH.Vector2): void {
            this._pos = pos;
        }

        public SetWorld(world: World): void {
            this._world = world;
        }

        private OnCollision(ce: CollisionEvent): void {
            //TODO: collision logic
        }        

        public GetHull<T extends Hull>(): T {
            return <T>this._hull;
        }

        public SetHull(hull: Hull): void {
            this._hull = hull;
        }

    }

    export class RigidBody extends Body {        
        //TODO: create rigidbody 
    }

    export enum EHullType {
        NONE,
        CIRCLE
    }

    abstract class Hull {             

        public onCollision: collisionCallback;
        public type: EHullType;
        public parent: Body;

        constructor(parent: Body) {
            this.parent = parent;
        }

        public Logic(): void {

        }

        public Draw(): void {

        }

        public abstract Predict(other: PHYS.Body)

    }

    export class HullCircle extends Hull {

        public radius: number;
        

        constructor(parent: Body, radius: number) {
            super(parent);
            super.type = EHullType.CIRCLE;
            this.radius = radius;
        }

        public Logic(): void {

        }

        public Draw(): void {

        }    



        public Predict(other: PHYS.Body) : CollisionEvent  {
            return Ray.CastSingle(this.parent.GetPosition(), this.parent.GetVelocity(), other)
        }

    }

}