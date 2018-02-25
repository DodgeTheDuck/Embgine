
module PHYS {

    export interface IPhysicalProperties {
        damping: number;
    }
    
    export enum ECollisionDetectionMethod {
        DISCRETE,
        CONTINUOUS
    }    

    class WorldNode {
        public properties: IPhysicalProperties;
    }

    export class World {

        private _nodes: WorldNode[][];
        private _entities: Entity[];
        private _resolution: number;
        private _width: number;
        private _height: number;
        private _colDetectMethod: ECollisionDetectionMethod;

        private _effectors: Effector[];

        constructor(width: number, height: number, resolution: number) {
            this._nodes = [];
            this._width = width;
            this._height = height;
            this._resolution = resolution;
            this._entities = [];
            this._effectors = [];
            this._colDetectMethod = ECollisionDetectionMethod.DISCRETE; //TODO: dunno if i wanna have a default one.
        }

        public Init(): void {
            
        }

        public Logic(): void {            
            for( let entity of this._entities) {
                entity.Logic();
            }
            let collisionEvents: CollisionEvent[] = this._CollisionPrediction();
            this._CollisionResolve(collisionEvents);
            this._Simulate();
        }        

        public Draw(): void { 
            for( let entity of this._entities) {
                entity.Draw();
            }
        }

        public Node(x: number, y: number): WorldNode {
            return this._nodes[x][y];
        }

        public RegisterEntity(entity: Entity): void {
            this._entities.push(entity);            
        }

        public GetEntities(): Entity[] {
            return this._entities;
        }

        public SetCollisionDetectionMethod(method: ECollisionDetectionMethod) {
            this._colDetectMethod = method;
        }

        public AddEffector(effector: Effector): void {
            this._effectors.push(effector);
        }

        private _Simulate(): void {
            for( let effector of this._effectors) {
                effector.Do();
            }
            for( let entity of this._entities) {
                entity.Logic();
            }
            this._effectors = [];
        }

        private _CollisionPrediction(): CollisionEvent[] {
            let events: CollisionEvent[] = [];

            // for( let body of this._bodies) {
            //     let hull: Hull = body.GetHull();
            //     if( hull != null && body.GetVelocity().Magnitude() > 0 ) {
            //         for( let other of this._bodies) {
            //         if( other != body ) {                        
            //                 if( other.GetHull() != null) {
            //                     let event: CollisionEvent = null;

            //                     if( this._colDetectMethod === ECollisionDetectionMethod.CONTINUOUS) {
            //                         event = hull.Predict(other);
            //                     } else if( this._colDetectMethod === ECollisionDetectionMethod.DISCRETE) {
            //                         event = hull.TestIntersect(other);
            //                     }

            //                     if(event) events.push(event);
            //                 }
            //             }
            //         }
            //     }
            // }

            return events;

        }

        private _CollisionResolve(events: CollisionEvent[]): void {

            for(let event of events) {
                                
                // let angle = M.Vector2.Angle(event.contact, event.me.parent.GetPosition());

                // let bodyA = event.me.parent;
                // let bodyB = event.other.parent;

                // let newvxa = (bodyA.GetVelocity().x * (bodyA.GetMass() - bodyB.GetMass() ) + (2 * bodyB.GetMass() * bodyB.GetVelocity().x)) / (bodyA.GetMass() + bodyB.GetMass());
                // let newvya = (bodyA.GetVelocity().y * (bodyA.GetMass() - bodyB.GetMass() ) + (2 * bodyB.GetMass() * bodyB.GetVelocity().y)) / (bodyA.GetMass() + bodyB.GetMass());
                // let newvxb = (bodyB.GetVelocity().x * (bodyB.GetMass() - bodyA.GetMass() ) + (2 * bodyA.GetMass() * bodyA.GetVelocity().x)) / (bodyB.GetMass() + bodyA.GetMass());
                // let newvyb = (bodyB.GetVelocity().y * (bodyB.GetMass() - bodyA.GetMass() ) + (2 * bodyA.GetMass() * bodyA.GetVelocity().y)) / (bodyB.GetMass() + bodyA.GetMass());

                // bodyA.SetVelocity(new M.Vector2(newvxa, newvya));
                // bodyB.SetVelocity(new M.Vector2(newvxb, newvyb))

                let spring = new EffectSpring(event.me.parent, event.other.parent);
                spring.Do();

                break;

            }

        }

    }

}