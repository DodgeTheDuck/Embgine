
class GUIGrid extends IWidget {

    private _cells: GUIPanel[];
    private _cols: number;
    private _rows: number;

    constructor(bounds: M.RectAbsolute) {
        super(bounds);
        this._cols = 1;
        this._rows = 4;
        this._cells = new Array<GUIPanel>(this._cols * this._rows);     

        this._AutoLayout();   
    }    

    private _Init(): void {

    }

    public Logic(): void {
        super.Logic();
    }

    public Draw(treeDepth): void {
        super.Draw(treeDepth);
    }

    private _AutoLayout(): void {

        let cellWidth: number = (this._bounds.x1 - this._bounds.x0 )  / this._cols;
        let cellHeight: number = (this._bounds.y1 - this._bounds.y0)  / this._rows;

        for(let i = 0; i < this._cells.length; i++) {

            let cx: number = (i % this._cols);
            let cy: number = Math.floor((i / this._cols));

            cx += cellWidth * cx;
            cy += cellHeight * cy;

            this._cells[i] = new GUIPanel({kind: M.ERectType.ABSOLUTE, x0: cx, y0: cy, x1: cx+cellWidth, y1: cy+cellHeight});
            this.AddChild(this._cells[i]);

        }        

    }

    public Cells(index: number) {
        return this._cells[index];
    }

}
