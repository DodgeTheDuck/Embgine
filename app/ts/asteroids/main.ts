
class AsteroidsMain extends IState {

    public space: Space;

    public Init(): void {

        G.Worlds.PushWorld(new PHYS.World(32, 32, 1));

        let ent = new Player(new M.Vector2(G.GFX.display.width / 2, G.GFX.display.height / 2));

        G.Worlds.Current().RegisterEntity(ent);

        this.space = new Space();

        //G.GUI.AddRegion(new DebugInfo());

    }

    public Logic(): void {

    }

    public PreDraw(): void {
        
    }
    
    public Draw(): void {        

    }

    public Destroy(): void {

    }

}