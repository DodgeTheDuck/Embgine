
class Projectile extends Entity {

    constructor(position: M.Vector2) {
        super();

        this.AddComponent(CTransform)
            .position = position;
        
        this.AddComponent(CController)            
            .Plug(this.Component(CRigidBody))
            .AddController(new ProjectileController())
            .SetPawn(this);
        
        this.AddComponent(CRenderer)
            .Plug(this.Component(CTransform))
            .SetShape(new M.Shapes.Polygon([
                {x: -8, y: 0},
                {x: +8, y: 0},
            ], {r: 255, g: 255, b: 255} )); //TODO: Make a line shape

        this.AddComponent(CHull)
            .GenerateNodes(this.Component(CRenderer).GetShape(), [
                {mass: 1.0},
                {mass: 1.0},
                {mass: 1.0},
            ])
        
        this.AddComponent(CRigidBody)
            .Plug(this.Component(CTransform))
            .Plug(this.Component(CHull));

    }

}



