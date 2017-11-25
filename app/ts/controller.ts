
class Controller {

    protected _body: PHYS.Body;

    constructor(body: PHYS.Body) {
        this._body = body;
    }

    public Logic(): void {
        
    }

    public Draw(): void {

    }

}

class ConPlayer extends Controller {

    constructor(body: PHYS.Body) {
        super(body);
    }

    public Logic(): void {
        super.Logic();        
        if( this._body.GetPosition().DistanceTo(MATH.Vector2.Divide(INPUT.mouseXY, GFX.GetScale())) > 8 ) { 
            let d = MATH.Vector2.Sub(this._body.GetPosition(), MATH.Vector2.Divide(INPUT.mouseXY, GFX.GetScale()));
            let angle = Math.atan2(d.y, d.x) - Math.PI; 
            this._body.Impulse(0.02, angle);
        }
    }

    public Draw(): void {
        super.Draw();
    }
    
}