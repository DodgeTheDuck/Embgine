
class GUIGrid extends IWidget {

    private _cols: number;
    private _rows: number;

    constructor(bounds: M.RectExtents) {
        super(bounds);
        this._cols = 1;
        this._rows = 4;
    }

    public Logic(): void {

    }

    public Draw(): void {

        let cellWidth: number = this._bounds.w / this._cols;
        let cellHeight: number = this._bounds.h / this._rows;

        for(let i = 0; i < this._cols; i++ ) {
            let x = i * cellWidth + this._bounds.x;
            G.GFX.DrawLine(x, this._bounds.y, x, this._bounds.y+this._bounds.h);
            for(let j = 0; j < this._rows; j++ ) {
                let y = j * cellHeight + this._bounds.y;
                G.GFX.DrawLine(this._bounds.x, y, this._bounds.x + this._bounds.w, y);
            }
        }

    }

}
