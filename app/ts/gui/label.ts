
class GUILabel extends IWidget {

    private _text: string;

    constructor(position: M.Point, text: string) {
        
        super({
            kind: M.ERectType.ABSOLUTE,
            x0: position.x,
            y0: position.y,
            x1: 0,
            y1: 0
        });
        this._text = text;
        this._bounds.x1 = position.x + this.GetTextWidth();
        this._bounds.y1 = position.y + this.GetTextHeight();
    }

    public Draw(treeDepth: number): void {
        super.Draw(treeDepth);
        G.GFX.Color(G.GFX.COL_BLACK);
        G.GFX.FillText(this._text, {x: this._bounds.x0, y: this._bounds.y0 + this._bounds.y1 / 2});
    }

    public GetTextWidth(): number {
        // TODO: Wrap this function?
        return G.GFX.context.measureText(this._text).width;
    }

    public GetTextHeight(): number {
        return 16;
    }

    public SetText(text: string): void {
        this._text = text;
        this._bounds.x1 = this.GetTextWidth();        
    }

}