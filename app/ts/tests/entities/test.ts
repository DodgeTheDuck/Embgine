
class TestEntity extends Entity {

    constructor() {
        super();
        this.AddComponent(CTransform);
        this.AddComponent(CRigidBody)
            .Plug(this.Component(CTransform));
        this.AddComponent(CRenderer);

        this.Component(CRigidBody).LinearImpulse(5, 45);

    }

    public Logic(): void {
        super.Logic();
    }

    public Draw(): void {
        super.Draw();
    }

}