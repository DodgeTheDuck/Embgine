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
                let nx = cx - x;
                let ny = cy - y;
                event = {
                    normal: new M.Vector2(nx, ny),
                    contact: new M.Vector2(x, y),
                    me: null,
                    v: null,
                    seperationDistance: 0,
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
            this.bodies = [];
        }
        ;
    }
    class EffectLocalForce extends Effector {
        constructor(body, position, force) {
            super();
            this.bodies.push(body);
            this._force = force;
            this._position = position;
        }
        Do() {
            let body = this.bodies[0];
            let hull = body.GetHull();
            let com = hull.com;
            let dx = this._position.x - com.x;
            let dy = this._position.y - com.y;
            let m = new M.Vector2(dx, dy).Magnitude();
            let ang = M.atan2(dy, dx);
            let lever = new M.Vector2(com.x + M.cos(ang) * m, com.y + M.sin(ang) * m);
            let t = lever.x * this._force.y - lever.y * this._force.x;
            body.SetAngularAcceleration(body.GetAngularAcceleration() + t);
            let angle = M.atan2(this._force.y, this._force.x);
            body.Impulse(this._force.Magnitude(), angle);
        }
        Draw() {
            let body = this.bodies[0];
            let hull = body.GetHull();
            let com = hull.com;
            let dx = this._position.x - com.x;
            let dy = this._position.y - com.y;
            let m = new M.Vector2(dx, dy).Magnitude();
            let ang = M.atan2(dy, dx);
            let lever = new M.Vector2(com.x + M.cos(ang) * m, com.y + M.sin(ang) * m);
            GFX.context.save();
            GFX.context.beginPath();
            GFX.context.strokeStyle = "green";
            GFX.context.translate(body.GetPosition().x + com.x, body.GetPosition().y + com.y);
            GFX.context.moveTo(0, 0);
            GFX.context.lineTo(lever.x, lever.y);
            GFX.context.stroke();
            GFX.context.closePath();
            GFX.context.restore();
        }
    }
    PHYS.EffectLocalForce = EffectLocalForce;
    class EffectSpring extends Effector {
        constructor(bodyA, bodyB) {
            super();
            this.bodies.push(bodyA);
            this.bodies.push(bodyB);
            this.k = 0.02;
        }
        Do() {
            let a = this.bodies[0];
            let b = this.bodies[1];
            let x = a.GetPosition().DistanceTo(b.GetPosition());
            let dPos = M.Vector2.Sub(b.GetPosition(), a.GetPosition());
            let d = 32;
            let dv = M.Vector2.Sub(b.GetVelocity(), a.GetVelocity());
            let angle = M.Vector2.Angle(b.GetPosition(), a.GetPosition());
            let F = -this.k * (x - d) * (M.Vector2.Normal(dPos).Magnitude()) * 0.7;
            a.Impulse(F, angle);
            b.Impulse(F, angle - (Math.PI));
        }
    }
    PHYS.EffectSpring = EffectSpring;
    class WorldNode {
    }
    let ECollisionDetectionMethod;
    (function (ECollisionDetectionMethod) {
        ECollisionDetectionMethod[ECollisionDetectionMethod["DISCRETE"] = 0] = "DISCRETE";
        ECollisionDetectionMethod[ECollisionDetectionMethod["CONTINUOUS"] = 1] = "CONTINUOUS";
    })(ECollisionDetectionMethod = PHYS.ECollisionDetectionMethod || (PHYS.ECollisionDetectionMethod = {}));
    class World {
        constructor(width, height, resolution) {
            this._nodes = [];
            this._width = width;
            this._height = height;
            this._resolution = resolution;
            this._bodies = [];
            this._colDetectMethod = ECollisionDetectionMethod.DISCRETE; //TODO: dunno if i wanna have a default one.
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
        SetCollisionDetectionMethod(method) {
            this._colDetectMethod = method;
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
                                let event = null;
                                if (this._colDetectMethod === ECollisionDetectionMethod.CONTINUOUS) {
                                    event = hull.Predict(other);
                                }
                                else if (this._colDetectMethod === ECollisionDetectionMethod.DISCRETE) {
                                    event = hull.TestIntersect(other);
                                }
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
            for (let event of events) {
                // let angle = M.Vector2.Angle(event.contact, event.me.parent.GetPosition());
                // let bodyA = event.me.parent;
                // let bodyB = event.other.parent;
                // let newvxa = (bodyA.GetVelocity().x * (bodyA.GetMass() - bodyB.GetMass() ) + (2 * bodyB.GetMass() * bodyB.GetVelocity().x)) / (bodyA.GetMass() + bodyB.GetMass());
                // let newvya = (bodyA.GetVelocity().y * (bodyA.GetMass() - bodyB.GetMass() ) + (2 * bodyB.GetMass() * bodyB.GetVelocity().y)) / (bodyA.GetMass() + bodyB.GetMass());
                // let newvxb = (bodyB.GetVelocity().x * (bodyB.GetMass() - bodyA.GetMass() ) + (2 * bodyA.GetMass() * bodyA.GetVelocity().x)) / (bodyB.GetMass() + bodyA.GetMass());
                // let newvyb = (bodyB.GetVelocity().y * (bodyB.GetMass() - bodyA.GetMass() ) + (2 * bodyA.GetMass() * bodyA.GetVelocity().y)) / (bodyB.GetMass() + bodyA.GetMass());
                // bodyA.SetVelocity(new M.Vector2(newvxa, newvya));
                // bodyB.SetVelocity(new M.Vector2(newvxb, newvyb))
                let spring = new EffectSpring(event.me.parent, event.other.parent);
                spring.Do();
                break;
            }
        }
    }
    PHYS.World = World;
    class Body {
        constructor() {
            this._pos = M.Vector2.Zero();
            this._vel = M.Vector2.Zero();
            this._acc = M.Vector2.Zero();
            this._ang = 0.0;
            this._angVel = 0.0;
            this._angAccel = 0.0;
        }
        Init() {
            this._hull.onCollision = this.OnCollision;
        }
        Logic() {
            this._vel.Add(new M.Vector2(this._acc.x / this._hull.mass, this._acc.y / this._hull.mass));
            this._pos.Add(this._vel);
            this._vel.Mult(new M.Vector2(0.97, 0.97));
            this._acc.Zero();
            this._angVel += this._angAccel / this._hull.moi;
            this._ang += this._angVel;
            this._angVel *= 0.97;
            this._angAccel = 0;
        }
        Draw() {
            // GFX.Save();
            // GFX.Translate(this._pos.x, this._pos.y);
            // GFX.context.beginPath();
            // GFX.context.arc(0, 0, 4, 0, Math.PI * 2);            
            // GFX.context.stroke();
            // GFX.context.closePath();
            // GFX.Restore();
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
        SetVelocity(vel) {
            this._vel = vel;
        }
        GetAngularAcceleration() {
            return this._angAccel;
        }
        SetAngularAcceleration(aa) {
            this._angAccel = aa;
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
        SetAngle(angle) {
            this._ang = angle;
        }
        GetAngle() {
            return this._ang;
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
        EHullType[EHullType["POLYGON"] = 2] = "POLYGON";
    })(EHullType = PHYS.EHullType || (PHYS.EHullType = {}));
    class Hull {
        constructor(parent) {
            this.moi = 0;
            this.mass = 0;
            this.parent = parent;
            this.nodes = [];
            this.com = new M.Vector2(0, 0);
        }
        Logic() {
        }
        Draw() {
            for (let i = 0; i < this.nodes.length; i++) {
                let p = this.nodes[i].position;
                GFX.context.beginPath();
                GFX.context.arc(p.x, p.y, 2, 0, 360);
                GFX.context.stroke();
                GFX.context.closePath();
            }
            GFX.context.beginPath();
            GFX.context.moveTo(this.nodes[0].position.x, this.nodes[0].position.y);
            for (let i = 1; i < this.nodes.length; i++) {
                let p = this.nodes[i].position;
                GFX.context.lineTo(p.x, p.y);
            }
            GFX.context.lineTo(this.nodes[0].position.x, this.nodes[0].position.y);
            GFX.context.stroke();
            GFX.context.closePath();
            GFX.context.beginPath();
            GFX.context.strokeStyle = "red";
            GFX.context.arc(this.com.x, this.com.y, 0.5, 0, 360);
            GFX.context.stroke();
            GFX.context.strokeStyle = "black";
            GFX.context.closePath();
        }
    }
    class HullPolygon extends Hull {
        constructor(parent, nodes) {
            super(parent);
            super.type = EHullType.POLYGON;
            super.nodes = nodes;
            this._calculateCoM();
            this._calculateMoI();
            this._calculateMass();
        }
        _Build() {
        }
        _calculateMass() {
            for (let i = 0; i < this.nodes.length; i++) {
                this.mass += this.nodes[i].mass;
            }
        }
        _calculateCoM() {
            let xSum = 0;
            let ySum = 0;
            let massSum = 0;
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i];
                xSum += node.mass * node.position.x;
                ySum += node.mass * node.position.y;
                massSum += node.mass;
            }
            this.com.x = xSum / massSum;
            this.com.y = ySum / massSum;
            console.log(this.com);
        }
        _calculateMoI() {
            let I = 0;
            let high = M.Vector2.Zero();
            let low = M.Vector2.Zero();
            for (let i = 0; i < this.nodes.length; i++) {
                let nodeA = this.nodes[i];
                let nodeB = this.nodes[(i + 1 % (this.nodes.length - 2))];
                let n = M.Vector2.Normal(M.Vector2.Mult(nodeB.position, nodeA.position));
                low.Add(n);
                let d = M.Vector2.Dot(nodeA.position, nodeA.position) + M.Vector2.Dot(nodeA.position, nodeB.position) + M.Vector2.Dot(nodeB.position, nodeB.position);
                n.MultScalar(d);
                high.Add(n);
            }
            let c = M.Vector2.Divide(high, low);
            this.moi = (1.0 / 6.0) * c.Magnitude();
        }
        Logic() {
        }
        Draw() {
            super.Draw();
        }
        Predict(other) {
            return Ray.CastSingle(this.parent.GetPosition(), this.parent.GetVelocity(), other);
        }
        TestIntersect(other) {
            return null;
        }
    }
    PHYS.HullPolygon = HullPolygon;
    class HullCircle extends Hull {
        constructor(parent, radius) {
            super(parent);
            super.type = EHullType.CIRCLE;
            this.radius = radius;
            this._Build();
        }
        _Build() {
            let step = (Math.PI * 2) / 16;
            for (let i = 0; i < 16; i++) {
                let node = {
                    position: new M.Vector2(M.cos(step * i) * this.radius, M.sin(step * i) * this.radius),
                    mass: 1.0
                };
                this.nodes.push(node);
            }
        }
        _calculateMass() {
            for (let i = 0; i < this.nodes.length; i++) {
                this.mass += this.nodes[i].mass;
            }
        }
        _calculateCoM() {
            this.com = M.Vector2.Zero();
        }
        _calculateMoI() {
        }
        Logic() {
        }
        Draw() {
        }
        Predict(other) {
            return Ray.CastSingle(this.parent.GetPosition(), this.parent.GetVelocity(), other);
        }
        TestIntersect(other) {
            if (other.GetHull().type === EHullType.CIRCLE) {
                return this._TestCircle(other);
            }
        }
        _TestCircle(other) {
            let event = null;
            let distance = M.Vector2.Distance(this.parent.GetPosition(), other.GetPosition());
            if (distance <= this.radius + other.GetHull().radius) {
                let dx = other.GetPosition().x - this.parent.GetPosition().x;
                let dy = other.GetPosition().y - this.parent.GetPosition().y;
                let angle = M.atan2(dy, dx);
                let cx = this.parent.GetPosition().x + M.cos(angle) * this.radius;
                let cy = this.parent.GetPosition().y + M.sin(angle) * this.radius;
                let sepDist = this.radius + other.GetHull().radius;
                let dot = M.Vector2.Dot(this.parent.GetPosition(), other.GetPosition());
                let v = new M.Vector2(this.parent.GetVelocity().x * dot, this.parent.GetVelocity().y * dot);
                M.Vector2.Mult;
                event = {
                    normal: new M.Vector2(dx, dy),
                    contact: new M.Vector2(cx, cy),
                    seperationDistance: sepDist,
                    v: v,
                    me: this,
                    other: other.GetHull(),
                };
            }
            return event;
        }
    }
    PHYS.HullCircle = HullCircle;
})(PHYS || (PHYS = {}));
//# sourceMappingURL=physics.js.map