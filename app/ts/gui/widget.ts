
abstract class IWidget {

    
    protected _bounds: M.RectExtents;
    private _children: IWidget[];

    constructor(bounds: M.RectExtents) {
        this._children = [];
        this._bounds = bounds;
    }

    public Logic(): void {
        for(let w of this._children) {
            w.Logic();
        }
    }

    public Draw(): void {
        for(let w of this._children) {
            w.Draw();
        }
    }

    public AddChild(widget: IWidget) {
        this._children.push(widget);
    }

}