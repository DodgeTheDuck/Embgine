class Tile {
    constructor(sprite) {
        this._sprite = sprite;
    }
    Draw() {
        this._sprite.Draw();
    }
}
class TileMap {
    constructor() {
        this._tileBank = {
            grass: new Tile(ASSETS.Instantiate("GRASS_TILE")),
        };
        this._cols = 32;
        this._rows = 32;
        this._tileSize = 16;
        this._tiles = [];
        for (let i = 0; i < this._cols; i++) {
            this._tiles[i] = [];
            for (let j = 0; j < this._rows; j++) {
                this._tiles[i][j] = this._tileBank.grass;
            }
        }
    }
    Draw() {
        G.GFX.Save();
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
                if (this._tiles[i][j]) {
                    this._tiles[i][j].Draw();
                }
                G.GFX.Translate(0, this._tileSize);
            }
            G.GFX.Translate(this._tileSize, -(this._tileSize * this._rows));
        }
        G.GFX.Restore();
    }
}
//# sourceMappingURL=map.js.map