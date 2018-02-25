module PHYS {

    export enum EHullType {
        NONE,
        CIRCLE,
        POLYGON
    }

    export interface HullNode {
        position: M.Vector2;        
        mass: number;
    }

    export abstract class Hull {             

        public onCollision: collisionCallback;
        public type: EHullType;
        public parent: Body;

        public nodes: HullNode[];

        public com: M.Vector2;
        public moi: number = 0;
        public mass: number = 0;

        constructor(parent: Body) {
            this.parent = parent;
            this.nodes = [];
            this.com = new M.Vector2(0, 0);
        }

        protected abstract _Build(): void 
        protected abstract _calculateMass(): void;
        protected abstract _calculateCoM(): void;
        protected abstract _calculateMoI(): void;

        public Logic(): void {

        }

        public Draw(): void {

            for( let i = 0; i < this.nodes.length; i++ ) {

                let p: M.Vector2 = this.nodes[i].position;

                G.GFX.context.beginPath();                
                G.GFX.context.arc(p.x, p.y, 2, 0, 360);
                G.GFX.context.stroke();
                G.GFX.context.closePath();

            }
            

            G.GFX.context.beginPath();             
            G.GFX.context.moveTo(this.nodes[0].position.x, this.nodes[0].position.y );
            for( let i = 1; i < this.nodes.length; i++ ) {
                let p: M.Vector2 = this.nodes[i].position;
                G.GFX.context.lineTo(p.x, p.y);                
            }
            G.GFX.context.lineTo(this.nodes[0].position.x, this.nodes[0].position.y );
            G.GFX.context.stroke();
            G.GFX.context.closePath();
            
            G.GFX.context.beginPath();                
            G.GFX.context.strokeStyle = "red";
            G.GFX.context.arc(this.com.x, this.com.y, 0.5, 0, 360);
            G.GFX.context.stroke();
            G.GFX.context.strokeStyle = "black";
            G.GFX.context.closePath();

        }

        // public abstract Predict(other: Body)
        // public abstract TestIntersect(other: Body)

    }

    export class HullPolygon extends Hull {

        public radius: number;
        

        constructor(parent: Body, nodes: HullNode[]) {
            super(parent);
            super.type = EHullType.POLYGON;
            super.nodes = nodes;
            this._calculateCoM();
            this._calculateMoI();
            this._calculateMass();
        }

        protected _Build(): void {

        }

        protected _calculateMass(): void {
            for(let i = 0; i < this.nodes.length; i++) {
                this.mass += this.nodes[i].mass;
            }
        }

        protected _calculateCoM(): void {

            let xSum: number = 0;
            let ySum: number = 0;
            let massSum: number = 0;

            for(let i = 0; i < this.nodes.length; i++) {
                let node: HullNode = this.nodes[i];
                xSum += node.mass * node.position.x;
                ySum += node.mass * node.position.y;
                massSum += node.mass;
            }

            this.com.x = xSum / massSum;
            this.com.y = ySum / massSum;

            console.log(this.com);

        }

        protected _calculateMoI(): void {

            let I = 0;

            let high: M.Vector2 = M.Vector2.Zero();
            let low: M.Vector2 = M.Vector2.Zero();

            for(let i = 0; i < this.nodes.length; i++) {
                let nodeA = this.nodes[i];
                let nodeB = this.nodes[(i === this.nodes.length-1) ? 0 : i+1];

                let n: M.Vector2 = M.Vector2.Normal(M.Vector2.Mult(nodeB.position, nodeA.position));
                low.Add(n);

                let d: number = M.Vector2.Dot(nodeA.position, nodeA.position) + M.Vector2.Dot(nodeA.position, nodeB.position) + M.Vector2.Dot(nodeB.position, nodeB.position)
                n.MultScalar(d)
                high.Add(n);

            }

            let c = M.Vector2.Divide(high, low);

            this.moi = ( 1.0 / 6.0 ) * c.Magnitude();

        }

        public Logic(): void {

        }

        public Draw(): void {
            super.Draw();
        }    

        
        // public Predict(other: PHYS.Body) : CollisionEvent  {
        //     return Ray.CastSingle(this.parent.GetPosition(), this.parent.GetVelocity(), other)
        // }

        // public TestIntersect(other: PHYS.Body) : CollisionEvent {            
        //     return null;
        // }

    }

    export class HullCircle extends Hull {

        public radius: number;
        

        constructor(parent: Body, radius: number) {
            super(parent);
            super.type = EHullType.CIRCLE;
            this.radius = radius;
            this._Build();
        }

        protected _Build(): void {

            let step = (Math.PI * 2) / 16;
            for(let i = 0; i < 16; i++) {
                let node: HullNode = {
                    position: new M.Vector2(M.cos(step*i) * this.radius, M.sin(step*i) * this.radius),
                    mass: 1.0
                }
                this.nodes.push(node);
            }

        }

        protected _calculateMass(): void {
            for(let i = 0; i < this.nodes.length; i++) {
                this.mass += this.nodes[i].mass;
            }
        }

        protected _calculateCoM(): void {
            this.com = M.Vector2.Zero();
        }

        
        protected _calculateMoI(): void {

        }

        public Logic(): void {

        }

        public Draw(): void {

        }    



        // public Predict(other: PHYS.Body) : CollisionEvent  {
        //     return Ray.CastSingle(this.parent.GetPosition(), this.parent.GetVelocity(), other)
        // }

        // public TestIntersect(other: PHYS.Body) : CollisionEvent {            
        //     if( other.GetHull<Hull>().type === EHullType.CIRCLE) {
        //         return this._TestCircle(other);
        //     }
        // }

        // private _TestCircle(other: PHYS.Body): CollisionEvent {
        //     let event: CollisionEvent = null;

        //     let distance = M.Vector2.Distance(this.parent.GetPosition(), other.GetPosition());

        //     if( distance <= this.radius + other.GetHull<HullCircle>().radius) {

        //         let dx = other.GetPosition().x - this.parent.GetPosition().x;
        //         let dy = other.GetPosition().y - this.parent.GetPosition().y;

        //         let angle = M.atan2(dy, dx);

        //         let cx = this.parent.GetPosition().x + M.cos(angle) * this.radius;
        //         let cy = this.parent.GetPosition().y + M.sin(angle) * this.radius;

        //         let sepDist = this.radius + other.GetHull<HullCircle>().radius;
        //         let dot = M.Vector2.Dot(this.parent.GetPosition(), other.GetPosition());
        //         let v: M.Vector2 = new M.Vector2(this.parent.GetVelocity().x * dot, this.parent.GetVelocity().y * dot);

        //         M.Vector2.Mult

        //         event = {
        //             normal: new M.Vector2(dx, dy),
        //             contact: new M.Vector2(cx, cy),
        //             seperationDistance: sepDist,
        //             v: v,
        //             me: this,
        //             other: other.GetHull(),
        //         }
                
        //     }

        //     return event;
        // }

    }

}