
class PlayerController extends IController {

    private _timer: Timing.OneShot;

    public Control(entity: Player): void {

        if(this._timer === undefined) {
            this._timer = new Timing.OneShot(5, () => { this._timer = null; console.log("hi")});
        }

        let leftThrust = 0;
        let rightThrust = 0;

        if( INPUT.IsKeyDown(INPUT.KEY_W) ) {
            leftThrust = entity.thrustPower;
            rightThrust = entity.thrustPower;
        }

        if( INPUT.IsKeyDown(INPUT.KEY_A) ) {
            leftThrust =entity.thrustPower;
            rightThrust = 0.0;
        }

        if( INPUT.IsKeyDown(INPUT.KEY_D) ) {
            leftThrust = 0.0;
            rightThrust = entity.thrustPower;
        }

        if( INPUT.IsKeyDown(INPUT.KEY_S) ) {
            leftThrust = -entity.thrustPower;
            rightThrust = -entity.thrustPower;
        }

        entity.thrusterLeft.SetForce(M.Vector2.Right().MultScalar(leftThrust))
        entity.thrusterRight.SetForce(M.Vector2.Right().MultScalar(rightThrust))

        G.Worlds.Current().AddEffector(entity.thrusterLeft);
        G.Worlds.Current().AddEffector(entity.thrusterRight);

        if( INPUT.IsKeyDown(INPUT.KEY_SPACE) ) {
            this._Shoot(entity);
        }

    }

    private _Shoot(entity: Player) {

        if( entity.canFire ) {
            let projectile = new Projectile(new M.Vector2(entity.Component(CTransform).position.x, entity.Component(CTransform).position.y)); //TODO: shallow copy vectors?
            projectile.Component(CTransform).angle = entity.Component(CTransform).angle;
            G.Worlds.Current().RegisterEntity(projectile);
            entity.canFire = false;
            G.Timers.RegisterTimer(new Timing.OneShot(1000 / entity.fireRate, (delta) => {entity.canFire = true} ) );
        }

    }

}