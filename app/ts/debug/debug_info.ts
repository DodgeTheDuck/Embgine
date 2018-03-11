
class DebugInfo extends GUIRegion {

    private _panel: GUIPanel;
    private _grid: GUIGrid;

    private _lblEntityCount: GUILabel;

    constructor() {
        super({
            kind: M.ERectType.ABSOLUTE,
            x0: 32,
            y0: 32,
            x1: 256,
            y1: 128,
        });

        this._panel = this.AddWidget(new GUIPanel({
            kind: M.ERectType.ABSOLUTE,
            x0: 0,
            y0: 0,
            x1: this.bounds.x1-this.bounds.x0,
            y1: this.bounds.y1-this.bounds.y0
        }));

        this._grid = new GUIGrid(this._panel.GetBounds());

        this._lblEntityCount = new GUILabel({x: 2, y: 2}, "")

        this._grid.Cells(0).AddChild(this._lblEntityCount);

        this._panel.AddChild(this._grid);        

    }

    public Logic(): void {
        super.Logic();
        this._lblEntityCount.SetText("Entity Count: " + G.Worlds.Current().GetEntities().length);
    }

}