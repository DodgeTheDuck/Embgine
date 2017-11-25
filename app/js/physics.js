var PHYS;
(function (PHYS) {
    class Ray {
        static CastAll(from, dir, world) {
            let me = new Ray();
            me.direction = dir;
            me.from = from;
            me.world = world;
            Ray.rays.push(me);
            let events = [];
            for (let body of world.GetBodies()) {
                let event = null;
                let hull = body.GetHull();
                switch (hull.type) {
                    case EHullType.NONE: {
                        break;
                    }
                    case EHullType.CIRCLE: {
                        event = Ray.CastForCircle(me, body.GetPosition().x, body.GetPosition().y, body.GetHull().radius);
                        break;
                    }
                }
                if (event != null)
                    events.push(event);
            }
            return events;
        }
        static CastSingle(from, dir, other) {
            let me = new Ray();
            me.direction = dir;
            me.from = from;
            Ray.rays.push(me);
            let event;
            let hull = other.GetHull();
            switch (hull.type) {
                case EHullType.NONE: {
                    break;
                }
                case EHullType.CIRCLE: {
                    event = Ray.CastForCircle(me, other.GetPosition().x, other.GetPosition().y, other.GetHull().radius);
                    break;
                }
            }
            return event;
        }
        static Draw() {
            for (let ray of Ray.rays) {
                let theta = Math.atan2(ray.direction.y, ray.direction.x);
                GFX.context.strokeStyle = (ray.hasIntersected) ? "green" : "blue";
                GFX.context.lineWidth = 0.5;
                GFX.context.beginPath();
                GFX.context.moveTo(ray.from.x - Math.cos(theta) * 1000, ray.from.y - Math.sin(theta) * 1000);
                GFX.context.lineTo(ray.from.x + Math.cos(theta) * 1000, ray.from.y + Math.sin(theta) * 1000);
                GFX.context.stroke();
                GFX.context.closePath();
            }
            Ray.rays = [];
        }
        static CastForCircle(ray, cx, cy, r) {
            let event = null;
            let x0 = ray.from.x - cx;
            let y0 = ray.from.y - cy;
            let x1 = x0 + ray.direction.x;
            let y1 = y0 + ray.direction.y;
            let dx = x1 - x0;
            let dy = y1 - y0;
            let dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let D = x0 * y1 - x1 * y0;
            let discriminant = Math.pow(r, 2) * Math.pow(dr, 2) - Math.pow(D, 2);
            if (discriminant >= 0) {
                ray.hasIntersected = true;
                let sign = (dy < 0) ? -1 : 1;
                let x = (D * dy - sign * dx * Math.sqrt(r * r * dr * dr - D * D)) / (dr * dr);
                let y = (-D * dx - dy * Math.sqrt(r * r * dr * dr - D * D)) / (dr * dr);
                let nx = x - cx;
                let ny = y - cy;
                event = {
                    normal: new MATH.Vector2(nx, ny),
                    contact: new MATH.Vector2(x, y),
                    force: 0,
                    me: null,
                    other: null,
                };
            }
            return event;
        }
    }
    Ray.rays = [];
    PHYS.Ray = Ray;
    class Effector {
        constructor() {
        }
        ;
    }
    class EffectSpring extends Effector {
        constructor() {
            super();
        }
    }
    PHYS.EffectSpring = EffectSpring;
    class WorldNode {
    }
    class World {
        constructor(width, height, resolution) {
            this._nodes = [];
            this._width = width;
            this._height = height;
            this._resolution = resolution;
            this._bodies = [];
        }
        Init() {
        }
        Logic() {
            let collisionEvents = this._CollisionPrediction();
            this._CollisionResolve(collisionEvents);
            this._Simulate();
        }
        Draw() {
            for (let body of this._bodies) {
                body.Draw();
            }
            PHYS.Ray.Draw();
        }
        Node(x, y) {
            return this._nodes[x][y];
        }
        RegisterBody(body) {
            this._bodies.push(body);
        }
        GetBodies() {
            return this._bodies;
        }
        _Simulate() {
            for (let body of this._bodies) {
                body.Logic();
            }
        }
        _CollisionPrediction() {
            let events = [];
            for (let body of this._bodies) {
                let hull = body.GetHull();
                if (hull != null && body.GetVelocity().Magnitude() > 0) {
                    for (let other of this._bodies) {
                        if (other != body) {
                            if (other.GetHull() != null) {
                                let event = hull.Predict(other);
                                if (event)
                                    events.push(event);
                            }
                        }
                    }
                }
            }
            return events;
        }
        _CollisionResolve(events) {
            if (events.length > 0) {
            }
        }
    }
    PHYS.World = World;
    class Body {
        constructor() {
            this._pos = MATH.Vector2.Zero();
            this._vel = MATH.Vector2.Zero();
            this._acc = MATH.Vector2.Zero();
            this._mass = 1;
        }
        Init() {
            this._hull.onCollision = this.OnCollision;
        }
        Logic() {
            this._vel.Add(this._acc);
            this._pos.Add(this._vel);
            this._vel.Mult(new MATH.Vector2(0.97, 0.97));
            this._acc.Zero();
        }
        Draw() {
            GFX.Save();
            GFX.Translate(this._pos.x, this._pos.y);
            GFX.context.beginPath();
            GFX.context.arc(0, 0, 4, 0, Math.PI * 2);
            GFX.context.stroke();
            GFX.context.closePath();
            GFX.Restore();
        }
        Impulse(force, angle) {
            this._acc.x += Math.cos(angle) * force;
            this._acc.y += Math.sin(angle) * force;
        }
        GetPosition() {
            return this._pos;
        }
        GetVelocity() {
            return this._vel;
        }
        SetPosition(pos) {
            this._pos = pos;
        }
        SetWorld(world) {
            this._world = world;
        }
        OnCollision(ce) {
            //TODO: collision logic
        }
        GetHull() {
            return this._hull;
        }
        SetHull(hull) {
            this._hull = hull;
        }
    }
    PHYS.Body = Body;
    class RigidBody extends Body {
    }
    PHYS.RigidBody = RigidBody;
    let EHullType;
    (function (EHullType) {
        EHullType[EHullType["NONE"] = 0] = "NONE";
        EHullType[EHullType["CIRCLE"] = 1] = "CIRCLE";
    })(EHullType = PHYS.EHullType || (PHYS.EHullType = {}));
    class Hull {
        constructor(parent) {
            this.parent = parent;
        }
        Logic() {
        }
        Draw() {
        }
    }
    class HullCircle extends Hull {
        constructor(parent, radius) {
            super(parent);
            super.type = EHullType.CIRCLE;
            this.radius = radius;
        }
        Logic() {
        }
        Draw() {
        }
        Predict(other) {
            return Ray.CastSingle(this.parent.GetPosition(), this.parent.GetVelocity(), other);
        }
    }
    PHYS.HullCircle = HullCircle;
})(PHYS || (PHYS = {}));
//# sourceMappingURL=physics.js.map