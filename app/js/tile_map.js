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
            grass: new Tile(Assets.Instantiate("GRASS_TILE"))
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
        GFX.Save();
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
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
//# sourceMappingURL=tile_map.js.map