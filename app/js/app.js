class Application {
    constructor() {
        this._context = null;
        this._canvas = null;
        this._map = null;
        this._canvas = document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
        this._Init();
    }
    _Init() {
        GFX.Init(this._context);
        GFX.ScalingMode(GFX.EScalingMode.Nearest);
        this._map = new TileMap();
        this._world = new PHYS.World(GFX.display.width, GFX.display.height, 0.5);
        this._player = new EntPlayer(64, 64, this._world);
        this._test = new EntTest(100, 100, this._world);
        this._Run();
    }
    _Run() {
        this._Tick();
        this._Draw();
        window.requestAnimationFrame(() => { this._Run(); });
    }
    _Tick() {
        this._world.Logic();
        this._player.Logic();
        this._test.Logic();
    }
    _Draw() {
        GFX.Clear();
        GFX.Save();
        GFX.Scale(4, 4);
        this._map.Draw();
        this._world.Draw();
        this._player.Draw();
        GFX.Restore();
    }
}
const Globals = {
    app: new Application(),
};
//# sourceMappingURL=app.js.map