
class Tile {
    
    private _sprite: GFX.Sprite;

    constructor(sprite: GFX.Sprite) {
        this._sprite = sprite;
    }

    public Draw(): void {
        this._sprite.Draw();
    }

}

class TileMap {

    private _tiles: Tile[][];
    private _cols: number;
    private _rows: number;
    private _tileSize: number;

    private _tileBank: any = {
        grass: new Tile(ASSETS.Instantiate("GRASS_TILE")),
    };

    constructor() {

        this._cols = 32;
        this._rows = 32;
        this._tileSize = 16;

        this._tiles = [];

        for ( let i: number = 0; i < this._cols; i++ ) {
            this._tiles[i] = [];
            for ( let j: number = 0; j < this._rows; j++ ) {
                this._tiles[i][j] = this._tileBank.grass;
            }
        }

    }

    public Draw(): void {

        GFX.Save();

        for (let i: number = 0; i < this._cols; i++ ) {
            for (let j: number = 0; j < this._rows; j++ ) {
                if (this._tiles[i][j]) {
                    this._tiles[i][j].Draw();
                }
                GFX.Translate(0, this._tileSize);
            }
            GFX.Translate(this._tileSize, -(this._tileSize * this._rows));
        }

        GFX.Restore();

    }

}
