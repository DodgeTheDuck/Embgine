
class TestEntity extends Entity {

    constructor() {
        super();
        
        this.AddComponent(CTransform);

        this.AddComponent(CRigidBody)
            .Plug(this.Component(CTransform));

        this.AddComponent(CRenderer);

        this.AddComponent(CController)
            .Plug(this.Component(CRigidBody))

        this.Component(CController).controller = new TestController();

    }

    public Logic(): void {
        super.Logic();
    }

    public Draw(): void {
        super.Draw();
    }

}