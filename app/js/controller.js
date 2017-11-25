class Controller {
    constructor(body) {
        this._body = body;
    }
    Logic() {
    }
    Draw() {
    }
}
class ConPlayer extends Controller {
    constructor(body) {
        super(body);
    }
    Logic() {
        super.Logic();
        if (this._body.GetPosition().DistanceTo(MATH.Vector2.Divide(INPUT.mouseXY, GFX.GetScale())) > 8) {
            let d = MATH.Vector2.Sub(this._body.GetPosition(), MATH.Vector2.Divide(INPUT.mouseXY, GFX.GetScale()));
            let angle = Math.atan2(d.y, d.x) - Math.PI;
            this._body.Impulse(0.02, angle);
        }
    }
    Draw() {
        super.Draw();
    }
}
//# sourceMappingURL=controller.js.map