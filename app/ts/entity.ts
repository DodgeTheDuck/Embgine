
class Entity {

    protected _body: PHYS.RigidBody;

    private _components: IComponent[];

    constructor() {
        this._components = [];
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

    public HasComponent<T extends IComponent>(t: new () => T): boolean {
        let temp: T = new t();
        for( let component of this._components) {
            if( component instanceof t) {
                return true
            }
        }
        return false;
    }

    public AddComponent<T extends IComponent>(t: new () => T): T {
        let c = new t();
        this._components.push(c);
        return c;
    }

    public Logic(): void {
        for( let component of this._components) {
            component.Logic();
        }
    }

    public Draw(): void {
        let transform = this.Component(CTransform);
        G.GFX.Save();
        if(transform) {
            G.GFX.Translate(transform.position.x, transform.position.y);
        }   
        for( let component of this._components) {
            component.Draw();
        }
        G.GFX.Restore();
    }

    public GetBody(): PHYS.RigidBody {
        return this._body;
    }

}

class Mob extends Entity {

    protected _controller: Controller;
    protected _sprite: G.GFX.Sprite;

    public Logic(): void {
        if( this._controller) this._controller.Logic();
        super.Logic();
    }

    public Draw(): void {
        if( this._sprite ) {
            G.GFX.Translate(this._body.GetPosition().x, this._body.GetPosition().y);
            this._sprite.Draw();
            G.GFX.Translate(-this._body.GetPosition().x, -this._body.GetPosition().y);
        }
        if( this._controller) this._controller.Draw();        
        super.Draw();
    }

}