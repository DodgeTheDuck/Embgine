module PHYS {

    export class Ray {

        public from: M.Vector2;
        public direction: M.Vector2;
        public world: World;
        public hasIntersected: boolean;

        private static rays: Ray[] = [];
        
        public static CastAll(from: M.Vector2, dir: M.Vector2, world: World) : Array<CollisionEvent> {

            let me = new Ray();
            me.direction = dir;
            me.from = from;
            me.world = world;
            Ray.rays.push(me);
            let events: CollisionEvent[] = [];

            // for( let body of world.GetBodies() ) {
            //     let event: CollisionEvent = null;
            //     let hull = body.GetHull<Hull>();
            //     switch(hull.type) {
            //         case EHullType.NONE: {
            //             break;
            //         }
            //         case EHullType.CIRCLE: {
            //             event = Ray.CastForCircle(me, body.GetPosition().x, body.GetPosition().y, body.GetHull<HullCircle>().radius);
            //             break;
            //         }
            //     }
            //     if( event != null) events.push(event);
            // }
            return events;
        }

        public static CastSingle(from: M.Vector2, dir: M.Vector2, other: Body) : CollisionEvent {
            
            let me = new Ray();
            me.direction = dir;
            me.from = from;
            Ray.rays.push(me);

            let event: CollisionEvent;
            // let hull = other.GetHull<Hull>();
            // switch(hull.type) {
            //     case EHullType.NONE: {
            //         break;
            //     }
            //     case EHullType.CIRCLE: {
            //         event = Ray.CastForCircle(me, other.GetPosition().x, other.GetPosition().y, other.GetHull<HullCircle>().radius);
            //         break;
            //     }
            // }
        
            return event;
        }
    

        public static Draw(): void {

            // for( let ray of Ray.rays ) {
                           
            //     let theta = Math.atan2(ray.direction.y, ray.direction.x);
                
            //     G.GFX.context.strokeStyle = (ray.hasIntersected) ? "green" : "blue";
            //     GFX.context.lineWidth = 0.5;

            //     GFX.context.beginPath();
            //     GFX.context.moveTo(ray.from.x - Math.cos(theta) * 1000, ray.from.y - Math.sin(theta) * 1000);
            //     GFX.context.lineTo(ray.from.x + Math.cos(theta) * 1000, ray.from.y + Math.sin(theta) * 1000);
            //     GFX.context.stroke();
            //     GFX.context.closePath();
            
            // }

            // Ray.rays = [];

        } 

        private static CastForCircle(ray: Ray, cx: number, cy: number, r: number) : CollisionEvent {

            let event: CollisionEvent = null;

            let x0 = ray.from.x - cx;
            let y0 = ray.from.y - cy;

            let x1 = x0 + ray.direction.x;
            let y1 = y0 + ray.direction.y;

            let dx = x1 - x0;
            let dy = y1 - y0;
            let dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
            let D = x0 * y1 - x1 * y0;
                
            let discriminant = Math.pow(r, 2) * Math.pow(dr, 2) - Math.pow(D, 2);

            if( discriminant >= 0) {                

                ray.hasIntersected = true;

                let sign = ( dy < 0 ) ? -1 : 1;
                       
                let x = ( D * dy - sign * dx * Math.sqrt(r * r * dr * dr - D * D) ) / (dr * dr);
                let y = (-D * dx - dy * Math.sqrt(r * r * dr * dr - D * D) ) / (dr * dr);

                let nx = cx - x;
                let ny = cy - y;

                event = {
                    normal: new M.Vector2(nx, ny),
                    contact: new M.Vector2(x, y),                    
                    me: null,
                    v: null,
                    seperationDistance: 0,
                    other: null,
                }
                
            } 
            
            return event;

        }        

    }
  
}   
