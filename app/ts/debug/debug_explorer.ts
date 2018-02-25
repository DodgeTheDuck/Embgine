
class DebugExplorer extends GUIRegion {

    private _panel: GUIPanel;

    constructor() {
        super({
            x: 16,
            y: 16,
            w: 256,
            h: G.GFX.display.height-32,
        });

        this._panel = this.AddWidget(new GUIPanel(this.bounds));
        this._panel.AddChild(new GUIGrid(this.bounds));

    }

}