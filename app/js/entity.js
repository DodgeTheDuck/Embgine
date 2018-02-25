class Entity {
    constructor() {
        this._components = [];
    }
    Component(t) {
        let temp = new t();
        for (let component of this._components) {
            if (component instanceof t) {
                return component;
            }
        }
        return null;
    }
    HasComponent(t) {
        let temp = new t();
        for (let component of this._components) {
            if (component instanceof t) {
                return true;
            }
        }
        return false;
    }
    AddComponent(t) {
        let c = new t();
        this._components.push(c);
        return c;
    }
    Logic() {
        for (let component of this._components) {
            component.Logic();
        }
    }
    Draw() {
        let transform = this.Component(CTransform);
        G.GFX.Save();
        if (transform) {
            G.GFX.Translate(transform.position.x, transform.position.y);
        }
        for (let component of this._components) {
            component.Draw();
        }
        G.GFX.Restore();
    }
    GetBody() {
        return this._body;
    }
}
class Mob extends Entity {
    Logic() {
        if (this._controller)
            this._controller.Logic();
        super.Logic();
    }
    Draw() {
        if (this._sprite) {
            G.GFX.Translate(this._body.GetPosition().x, this._body.GetPosition().y);
            this._sprite.Draw();
            G.GFX.Translate(-this._body.GetPosition().x, -this._body.GetPosition().y);
        }
        if (this._controller)
            this._controller.Draw();
        super.Draw();
    }
}
//# sourceMappingURL=entity.js.map