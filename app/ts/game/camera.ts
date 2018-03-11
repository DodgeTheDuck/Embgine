
class CCamera extends IComponent {

    public background: IBackground;

    constructor() {
        super();
    }

    public Logic(): void {

    }

    public PreDraw(): void {
        let transform: CTransform = this.Component(CTransform)
        let body: CBody = this.Component(CRigidBody);
        if(transform) {
            G.GFX.Save();
            G.GFX.Color(G.GFX.COL_BLACK);
            G.GFX.FillRect({kind: M.ERectType.EXTENTS, x: 0, y: 0, w: G.GFX.display.width, h: G.GFX.display.height})
            G.GFX.Translate(-transform.position.x + G.GFX.display.width / 2, -transform.position.y + G.GFX.display.height / 2);
            let speed: M.Vector2 = (body) ? body.GetVelocity() : new M.Vector2(1.0, 1.0);            
            this.background.Draw(new M.Vector2(transform.position.x - G.GFX.display.width / 2, transform.position.y - G.GFX.display.height / 2), speed);
        }
    }

    public Draw(): void {

    }

    public PostDraw(): void {
        G.GFX.Restore();
    }

}