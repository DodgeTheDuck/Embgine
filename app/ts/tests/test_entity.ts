
class Test_Entity extends IState {

    public Init(): void {

        G.Worlds.PushWorld(new PHYS.World(32, 32, 1));

        let ent = new TestEntity();

        G.Worlds.Current().RegisterEntity(ent);

        //G.GUI.AddRegion(new DebugExplorer());

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