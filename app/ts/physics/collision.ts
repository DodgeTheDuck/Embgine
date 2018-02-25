
module PHYS {

    export interface CollisionEvent {
        me: Hull;
        other: Hull;
        contact: M.Vector2;
        normal: M.Vector2;
        v: M.Vector2;
        seperationDistance: number;
    }    


    export type collisionCallback = (ce: CollisionEvent) => void;

}