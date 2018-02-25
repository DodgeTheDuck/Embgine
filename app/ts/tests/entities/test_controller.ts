
class TestController extends IController {

    public Control(body: CRigidBody) {

        if( INPUT.IsKeyDown(INPUT.KEY_A ) ) {
            body.LinearImpulse(0.2, 0);
        }

    }

}