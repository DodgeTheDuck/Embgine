
class DebugExplorer extends GUIRegion {

    private _panel: GUIPanel;

    constructor() {
        super({
            kind: M.ERectType.ABSOLUTE,
            x0: 32,
            y0: 32,
            x1: 256,
            y1: G.GFX.display.height-32,
        });

        this._panel = this.AddWidget(new GUIPanel({
            kind: M.ERectType.ABSOLUTE,
            x0: 0,
            y0: 0,
            x1: this.bounds.x1-this.bounds.x0,
            y1: this.bounds.y1-this.bounds.y0
        }));

        this._panel.AddChild(new GUIGrid(this._panel.GetBounds()));        

    }

}