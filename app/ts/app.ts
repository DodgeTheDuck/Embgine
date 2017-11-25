
class Application {

    private _context: CanvasRenderingContext2D = null;
    private _canvas: HTMLCanvasElement = null;

    private _map: TileMap = null;

    private _player: EntPlayer;
    private _test: EntTest;

    private _world: PHYS.World;

    constructor() {
        this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this._context = this._canvas.getContext("2d");
        this._Init();
    }

    private _Init(): void {

        GFX.Init(this._context);
        GFX.ScalingMode(GFX.EScalingMode.Nearest);

        this._map = new TileMap();
        this._world = new PHYS.World(GFX.display.width, GFX.display.height, 0.5);
        this._player = new EntPlayer(64, 64, this._world);                
        this._test = new EntTest(100, 100, this._world);                
        

        this._Run();

    }

    private _Run(): void {
        this._Tick();
        this._Draw();
        window.requestAnimationFrame(() => { this._Run(); });
    }

    private _Tick(): void {
        this._world.Logic();
        this._player.Logic();
        this._test.Logic();
    }

    private _Draw(): void {
        GFX.Clear();
        GFX.Save();
        GFX.Scale(4, 4);
        this._map.Draw();
        this._world.Draw();
        this._player.Draw();
        GFX.Restore();
    }

}

const Globals: any = {
    app: new Application(),
};
