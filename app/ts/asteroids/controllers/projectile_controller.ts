
class ProjectileController extends IController {

    private _fired: boolean;
    
    public Control(entity: Entity) {
        let transform: CTransform = entity.Component(CTransform);
        let body: CRigidBody = entity.Component(CRigidBody);
        if(!this._fired && transform) {
            if(body) {
                let angle = transform.angle;
                body.LinearImpulse(20, angle * Math.PI / 180);
                this._fired = true;
            }
        }
    }

}