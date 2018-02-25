
abstract class IComponent {

    private _components: IComponent[] = [];

    public Plug(component: IComponent): IComponent {
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

}

class CTransform extends IComponent {
    
    public position: M.Vector2;

    constructor() {
        super();
        this.position = M.Vector2.Zero();
    }

    public Logic(): void {

    }

    public Draw(): void {
        G.GFX.Color({r:255, g: 0, b: 0});
        G.GFX.DrawCircle(0, 0, 2);
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
        }     
        //this._ang += this._angVel;
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

    public GetCoM(): M.Vector2 {
        return M.Vector2.Zero();
    }

}

class CRigidBody extends CBody {

    //private _hull: Hull;

    protected _PreIntegrate(): void {

        let hull = null//this.Component(CHull)

        let mass = 1.0;
        let moi = 1.0;    

        this._vel.Add(new M.Vector2(this._acc.x / mass, this._acc.y / mass));
        this._angVel += this._angAccel / moi;
        
    }
    
    protected _PostIntegrate(): void {
        this._vel.Mult(new M.Vector2(0.97, 0.97));
        this._angVel *= 0.97;
        this._acc.Zero();
        this._angAccel = 0;
    }

    // public GetHull<T extends Hull>(): T {
    //     return <T>this._hull;
    // }

    // public SetHull(hull: Hull): void {
    //     this._hull = hull;
    // }
    
    // public GetCoM(): M.Vector2 {
    //     return this._hull.com;
    // }

    public Draw(): void {

    }


}

class CController extends IComponent {

    public controller: IController;

    public Logic(): void {
        this.controller.Control(this.Component(CRigidBody))
    }

    public Draw(): void {
        
    }

}

class CRenderer extends IComponent {        

    public Logic(): void {

    }

    public Draw(): void {

        G.GFX.Color({r:0, g: 0, b: 0});
        G.GFX.DrawRect({x:-8, y: -8, w:16, h:16});

    }

}
