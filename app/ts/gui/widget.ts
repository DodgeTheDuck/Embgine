
abstract class IWidget {

    
    protected _bounds: M.RectAbsolute;
    private _children: IWidget[];

    constructor(bounds: M.RectAbsolute) {
        this._children = [];
        this._bounds = bounds;
    }

    public Logic(): void {
        for(let w of this._children) {
            w.Logic();
        }
    }

    public Draw(treeDepth: number): void {

        G.GFX.Save();
        G.GFX.Translate(this._bounds.x0, this._bounds.y0);

        for(let w of this._children) {
            w.Draw(treeDepth + 1);
        }

        G.GFX.Restore();

    }

    public DebugDraw(treeDepth: number) {

        if(G.Engine.TestDebugFlags(G.Engine.DEBUG_DRAW_GUI_DIMENSIONS)) {

            let x0 = this._bounds.x0;
            let y0 = this._bounds.y0;
            let x1 = this._bounds.x1;
            let y1 = this._bounds.y1;

            let offset = (16 * treeDepth ) + 16;

            G.GFX.Color({r: 255, g: 0, b: 0});
            G.GFX.DrawCircle(x0, y0, 4);
            G.GFX.DrawCircle(x1, y0, 4);
            G.GFX.DrawCircle(x1, y1, 4);
            G.GFX.DrawCircle(x0, y1, 4);

            G.GFX.DebugDrawDimension(x0, y0, x1, y0, 0, {x: 0, y: -offset } as M.Vector2);            
            G.GFX.DebugDrawDimension(x1, y0, x1, y1, 0, {x: offset, y: 0 } as M.Vector2);  
            G.GFX.DebugDrawDimension(x1, y1, x0, y1, 0, {x: 0, y: offset } as M.Vector2);  
            G.GFX.DebugDrawDimension(x0, y1, x0, y0, 0, {x: -offset, y: 0 } as M.Vector2);  
            

        }

        for(let w of this._children) {
            w.DebugDraw(treeDepth + 1);
        }

    }

    public AddChild(widget: IWidget): void {
        this._children.push(widget);
    }

    public SetBounds(bounds: M.RectAbsolute): void {
        this._bounds = bounds;
    }
    
    public GetBounds(): M.RectAbsolute {
        return this._bounds;
    }

    public Left(value: number): number {
        if(value != undefined) {
            this._bounds.x0 = value;
        }
        return this._bounds.x0;
    }

    public Right(value: number): number {
        if(value != undefined) {
            this._bounds.x1 = value;
        }
        return this._bounds.x1;
    }

    public Top(value: number): number {
        if(value != undefined) {
            this._bounds.y0 = value;
        }
        return this._bounds.y0;
    }

    public Bottom(value: number): number {
        if(value != undefined) {
            this._bounds.y1 = value;
        }
        return this._bounds.y1;
    }


}