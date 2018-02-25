
module INPUT {

    export let keys: Key[] = [];
    export let mouseLeft: boolean = false;
    export let mouseRight: boolean = false;
    export let mouseXY: M.Vector2 = M.Vector2.Zero();

    export const KEY_W = 87;
    export const KEY_A = 65;
    export const KEY_D = 68;
    export const KEY_S = 83;
    export const KEY_SPACE = 32;

    export enum EKeyState {
        UP,
        DOWN
    }

    export class Key {
        public state = EKeyState.UP;
    }

    export function IsKeyDown(keyCode: number) {
        if(INPUT.keys[keyCode]) {
            return INPUT.keys[keyCode].state === EKeyState.DOWN;
        }
        return false;
    }

    export function IsKeyUp(keyCode: number) {
        if(INPUT.keys[keyCode]) {
            return INPUT.keys[keyCode].state === EKeyState.UP;
        }
        return false;
    }

    window.onkeydown = (ev: KeyboardEvent): void => {
        if( keys[ev.keyCode] === undefined ) {
            keys[ev.keyCode] = new Key();
        }
        keys[ev.keyCode].state = EKeyState.DOWN;
    }

    window.onkeyup = (ev: KeyboardEvent): void => {
        if( keys[ev.keyCode] === undefined ) {
            keys[ev.keyCode] = new Key();
        }
        keys[ev.keyCode].state = EKeyState.UP;
    }

    window.onmousemove = (ev: MouseEvent): void => {
        mouseXY.x = ev.x;
        mouseXY.y = ev.y;
    }

    window.onmousedown = (ev: MouseEvent): void => {
        if(ev.button === 0) mouseLeft = true;
        if(ev.button === 2) mouseRight = true;
    }

    window.onmouseup = (ev: MouseEvent): void => {
        if(ev.button === 0) mouseLeft = false;
        if(ev.button === 2) mouseRight = false;
    }

}