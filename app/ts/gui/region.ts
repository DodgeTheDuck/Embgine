
class GUIRegion {

    private _widgets: IWidget[]

    public bounds: M.RectExtents;

    constructor(bounds: M.RectExtents) {
        this.bounds = bounds;
        this._widgets = [];
    }

    public Logic(): void {        
        for(let widget of this._widgets) {
            widget.Logic();
        }
    }

    public Draw(): void {
        for(let widget of this._widgets) {
            widget.Draw();
        }

        if(G.Engine.TestDebugFlags(G.Engine.DEBUG_DRAW_GUI)) {
            G.GFX.DrawRect(this.bounds);
        }

    }
        
    public AddWidget(widget: IWidget): IWidget {
        this._widgets.push(widget);
        return widget;
    }

}
