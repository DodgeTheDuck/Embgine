
class CParticleEmitter extends IComponent {    
    
    public Logic(): void {

        let transform: CTransform = this.Component(CTransform);

        G.Worlds.Current().RegisterEntity(new Particle(
            {
                position: (transform) ? new M.Vector2(transform.position.x, transform.position.y) : M.Vector2.Zero(),
                color: {r: 255, g: 255, b: 255}
            }
        ));

    }

    public Draw(): void {
        
    }

}