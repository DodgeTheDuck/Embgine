
// TODO: How to seperate this file in a nicer way? Hmm.
// TODO: Sort out abstract vs non abstract functions
abstract class IComponent {

    private _components: IComponent[] = [];

    public Plug(component: IComponent): this {
        this._components.push(component);
        return this;
    }

    public Component<T extends IComponent>(t: new () => T): T {
        let temp: T = new t();
        for( let component of this._components) {
            if( component instanceof t) {
                return <T>component;
            }
        }
        return null;
    }

    public abstract Logic(): void;
    public abstract Draw(): void;

    public PreDraw(): void {

    }

    public PostDraw(): void {
        
    }

}

class CTransform extends IComponent {
    
    public position: M.Vector2;
    public angle: number;

    constructor() {
        super();
        this.position = M.Vector2.Zero();
        this.angle = 0;
    }

    public Logic(): void {

    }

    public Draw(): void {
        if( G.Engine.TestDebugFlags(G.Engine.DEBUG_DRAW_TRANSFORM)) {
            G.GFX.Color({r:255, g: 0, b: 0});
            G.GFX.DrawCircle(0, 0, 2);
            G.GFX.Color({r:0, g: 0, b: 255});
            G.GFX.DrawLine(0, 0, 8, 0);
        }
    }

}


abstract class CBody extends IComponent {        

    protected _vel: M.Vector2 = M.Vector2.Zero();
    protected _acc: M.Vector2 = M.Vector2.Zero();

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

        let transform = this.Component(CTransform);

        if(transform) {
            transform.position.Add(this._vel);
            transform.angle += this._angVel;
        }     
        
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
   
    public GetVelocity(): M.Vector2 {
        return this._vel;
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
    
}

class CPointMass extends CBody {

    protected _PreIntegrate(): void {
        let mass = 1.0;        
        this._vel.Add(new M.Vector2(this._acc.x / mass, this._acc.y / mass));
        this._angVel += this._angAccel;        
    }
    
    protected _PostIntegrate(): void {
        this._acc.Zero();
        this._angAccel = 0;
    }

    public Draw(): void {

    }

}

class CRigidBody extends CBody {

    protected _PreIntegrate(): void {

        let hull: CHull = this.Component(CHull);        

        let mass = 1.0;
        let moi = 1.0; 
        
        if(hull) {
            mass = hull.mass;
            moi = hull.MoI;
        }

        this._vel.Add(new M.Vector2(this._acc.x / mass, this._acc.y / mass));
        this._angVel += this._angAccel / moi;
        
    }
    
    protected _PostIntegrate(): void {
        // TODO: Move friction etc to world
        // this._vel.Mult(new M.Vector2(0.97, 0.97));
        // this._angVel *= 0.97;
        this._acc.Zero();
        this._angAccel = 0;
    }

    public Draw(): void {

    }

}

interface HullNodeMeta {
    mass: number
}

class CHull extends IComponent {

    private _nodes: PHYS.HullNode[];

    public MoI: number;
    public CoM: M.Point;
    public mass: number;

    constructor() {
        super();        
        this._nodes = [];
        this.mass = 0;
        this.MoI = 20;
        this.CoM = {x: 0, y: 0};
    }

    public Logic(): void {

    }

    public Draw(): void {
        
    }

    public GenerateNodes(shape: M.Shapes.IShape, nodeMetas: HullNodeMeta[]): this {
            
        switch(shape.type) {
            case M.Shapes.EShapeType.POLYGON: 
                let poly: M.Shapes.Polygon = <M.Shapes.Polygon>shape;
                let points = poly.GetPoints();
                for(let i = 0; i < points.length; i++) {
                    this._nodes.push({position: new M.Vector2(points[i].x, points[i].y), mass: nodeMetas[i].mass });
                }
                break;
        }

        this._calculateMass();
        this._calculateCoM();
        //this._calculateMoI();

        return this;
    }

    protected _calculateMass(): void {
        for(let i = 0; i < this._nodes.length; i++) {
            this.mass += this._nodes[i].mass;
        }        
    }

    protected _calculateCoM(): void {

        let xSum: number = 0;
        let ySum: number = 0;
        let massSum: number = 0;

        for(let i = 0; i < this._nodes.length; i++) {
            let node: PHYS.HullNode = this._nodes[i];
            xSum += node.mass * node.position.x;
            ySum += node.mass * node.position.y;
            massSum += node.mass;
        }

        this.CoM = {x: xSum / massSum, y: ySum / massSum};

    }

    protected _calculateMoI(): void {

        let I = 0;

        let high: M.Vector2 = M.Vector2.Zero();
        let low: M.Vector2 = M.Vector2.Zero();

        for(let i = 0; i < this._nodes.length; i++) {
            let nodeA = this._nodes[i];
            let nodeB = this._nodes[(i === this._nodes.length-1) ? 0 : i+1];

            let n: M.Vector2 = M.Vector2.Normal(M.Vector2.Mult(nodeB.position, nodeA.position));
            low.Add(n);

            let d: number = M.Vector2.Dot(nodeA.position, nodeA.position) + M.Vector2.Dot(nodeA.position, nodeB.position) + M.Vector2.Dot(nodeB.position, nodeB.position)
            n.MultScalar(d)
            high.Add(n);

        }

        let c = M.Vector2.Divide(high, low);

        this.MoI = ( 1.0 / 6.0 ) * c.Magnitude();

    }

}

class CController extends IComponent {

    private _controllers: IController[];    
    private _pawn: Entity; 

    constructor() {
        super();
        this._controllers = [];
    }

    public Logic(): void {
        for(let i = 0; i < this._controllers.length; i++ ) {
            this._controllers[i].Control(this._pawn);
        }
    }

    public Draw(): void {
        
    }

    public AddController(controller: IController): this {
        this._controllers.push(controller);
        return this;
    }

    public SetPawn(pawn: Entity) {
        this._pawn = pawn;
    }

}

class CRenderer extends IComponent {        

    private _shape: M.Shapes.IShape;

    public Logic(): void {

    }

    public Draw(): void {
        if(this._shape) {
            this._shape.Draw();
        }
    }

    
    public GetShape(): M.Shapes.IShape {                
        return this._shape;
    }

    public SetShape(shape: M.Shapes.IShape): this {        
        this._shape = shape;
        return this;
    }

}
