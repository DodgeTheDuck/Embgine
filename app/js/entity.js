class Entity {
    constructor(world) {
        this._world = world;
    }
    Logic() {
        if (this._controller)
            this._controller.Logic();
    }
    Draw() {
        if (this._controller)
            this._controller.Draw();
    }
}
class EntPlayer extends Entity {
    constructor(x, y, world) {
        super(world);
        this._body = new PHYS.RigidBody();
        this._body.SetHull(new PHYS.HullCircle(this._body, 4));
        this._body.SetPosition(new MATH.Vector2(x, y));
        this._world.RegisterBody(this._body);
        this._controller = new ConPlayer(this._body);
    }
    Logic() {
        super.Logic();
    }
    Draw() {
        super.Draw();
    }
}
class EntTest extends Entity {
    constructor(x, y, world) {
        super(world);
        this._body = new PHYS.RigidBody();
        this._body.SetHull(new PHYS.HullCircle(this._body, 4));
        this._body.SetPosition(new MATH.Vector2(x, y));
        this._world.RegisterBody(this._body);
    }
    Logic() {
        super.Logic();
        this._body.Impulse(0.0002, 0);
    }
    Draw() {
        super.Draw();
    }
}
//# sourceMappingURL=entity.js.map