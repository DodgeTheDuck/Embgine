
class GUIPanel extends IWidget {    

    constructor(bounds: M.RectExtents) {
        super(bounds);
    }

    public Logic(): void {
        super.Logic();
    }

    public Draw(): void {
        
        G.GFX.Color({r: 200, g: 200, b: 200 });
        G.GFX.FillRect(this._bounds);
        
        G.GFX.Color({r: 0, g: 0, b: 0 });
        G.GFX.DrawRect(this._bounds);
        
        super.Draw();

    }

}