
module INPUT {

    export let mouseLeft: boolean = false;
    export let mouseRight: boolean = false;
    export let mouseXY: MATH.Vector2 = MATH.Vector2.Zero();

    export class KeyState {

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