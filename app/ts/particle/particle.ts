
interface ParticleConstructor {
    position: M.Vector2,
    color: G.GFX.ColorRGB
}

class Particle extends Entity {

    private settings: ParticleConstructor;

    constructor(pCon: ParticleConstructor) {
        super();

        this.settings = pCon;

        this.AddComponent(CTransform)
            .position = pCon.position;

        this.AddComponent(CPointMass)
            .Plug(this.Component(CTransform));
            
        this.AddComponent(CRenderer)
            .Plug(this.Component(CTransform))
            .SetShape(new M.Shapes.Rectangle(2, 2, G.GFX.COL_WHITE));

    }



}