
class Entity {

    protected _body: PHYS.Body;
    protected _world: PHYS.World;
    protected _controller: Controller;

    constructor(world: PHYS.World ) {
        this._world = world;
    }

    public Logic(): void {
        if( this._controller) this._controller.Logic();
    }

    public Draw(): void {
        if( this._controller) this._controller.Draw();
    }

}

class EntPlayer extends Entity {

    constructor(x: number, y: number, world: PHYS.World ) {
        super(world);
        this._body = new PHYS.RigidBody();
        this._body.SetHull(new PHYS.HullCircle(this._body, 4));
        this._body.SetPosition(new MATH.Vector2(x, y));
        this._world.RegisterBody(this._body);
        this._controller = new ConPlayer(this._body);
    }

    public Logic(): void {
        super.Logic();
    }

    public Draw(): void {
        super.Draw();
    }

}

class EntTest extends Entity {
    
        constructor(x: number, y: number, world: PHYS.World ) {
            super(world);
            this._body = new PHYS.RigidBody();
            this._body.SetHull(new PHYS.HullCircle(this._body, 4));
            this._body.SetPosition(new MATH.Vector2(x, y));
            this._world.RegisterBody(this._body);
        }
    
        public Logic(): void {
            super.Logic();
            this._body.Impulse(0.0002, 0);
        }
    
        public Draw(): void {
            super.Draw();
        }
    
    }