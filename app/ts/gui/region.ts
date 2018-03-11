
class GUIRegion {

    private _widgets: IWidget[]

    public bounds: M.RectAbsolute;

    constructor(bounds: M.RectAbsolute) {
        this.bounds = bounds;
        this._widgets = [];
    }

    public Logic(): void {        
        for(let widget of this._widgets) {
            widget.Logic();
        }
    }

    public Draw(): void {

        G.GFX.Save();
        G.GFX.Translate(this.bounds.x0, this.bounds.y0);

        for(let widget of this._widgets) {
            widget.Draw(0);
        }

        if(G.Engine.TestDebugFlags(G.Engine.DEBUG_DRAW_GUI)) {

            for(let widget of this._widgets) {
                widget.DebugDraw(0);
            }

        }

        G.GFX.Restore();

        if(G.Engine.TestDebugFlags(G.Engine.DEBUG_DRAW_GUI_BORDER)) {
            G.GFX.DrawRect(this.bounds);
        }

    }
        
    public AddWidget(widget: IWidget): IWidget {
        this._widgets.push(widget);
        return widget;
    }

}
