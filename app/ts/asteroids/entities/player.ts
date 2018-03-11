
class Player extends Entity {

    public canFire: boolean;
    public fireRate: number;

    public thrustPower: number;
    
    public thrusterLeft: PHYS.EffectLocalForce;
    public thrusterRight: PHYS.EffectLocalForce;

    constructor(position: M.Vector2) {
        super();

        this.AddComponent(CTransform)
            .position = position;
        
        this.AddComponent(CController)            
            .Plug(this.Component(CRigidBody))
            .AddController(new PlayerController())
            .SetPawn(this);
        
        this.AddComponent(CRenderer)
            .Plug(this.Component(CTransform))
            .SetShape(new M.Shapes.Polygon([
                {x:-16, y:-16},
                {x:+16, y: 0},
                {x:-16, y:+16},
                {x:-10, y: 0},
            ], {r: 255, g: 255, b: 255} ));                

        this.AddComponent(CHull)
            .GenerateNodes(this.Component(CRenderer).GetShape(), [
                {mass: 1.0},
                {mass: 1.0},
                {mass: 1.0},
                {mass: 1.0},
            ])
        
        this.AddComponent(CRigidBody)
            .Plug(this.Component(CTransform))
            .Plug(this.Component(CHull));   
            
        // this.AddComponent(CParticleEmitter)
        //     .Plug(this.Component(CTransform));

        this.AddComponent(CCamera)
            .Plug(this.Component(CRigidBody))
            .Plug(this.Component(CTransform))
            .background = new Space();

        this.canFire = true;
        this.fireRate = 4;
        this.thrustPower = 0.01;

        this.thrusterLeft = new PHYS.EffectLocalForce(this, new M.Vector2(-16, -16), M.Vector2.Zero());
        this.thrusterRight = new PHYS.EffectLocalForce(this, new M.Vector2(-16, 16), M.Vector2.Zero());

    }

}