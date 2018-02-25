
class Test_GUI extends IState {

    public Init(): void {
                
        G.GUI.AddRegion(new GUIRegion(
            {
                x: 16, 
                y: 16, 
                w: G.GFX.display.width-32, 
                h: G.GFX.display.height-32
            }
        ));

    }

    public Logic(): void {

    }

    public Draw(): void {

    }

    public Destroy(): void {

    }

}