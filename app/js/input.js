var INPUT;
(function (INPUT) {
    INPUT.mouseLeft = false;
    INPUT.mouseRight = false;
    INPUT.mouseXY = MATH.Vector2.Zero();
    class KeyState {
    }
    INPUT.KeyState = KeyState;
    window.onmousemove = (ev) => {
        INPUT.mouseXY.x = ev.x;
        INPUT.mouseXY.y = ev.y;
    };
    window.onmousedown = (ev) => {
        if (ev.button === 0)
            INPUT.mouseLeft = true;
        if (ev.button === 2)
            INPUT.mouseRight = true;
    };
    window.onmouseup = (ev) => {
        if (ev.button === 0)
            INPUT.mouseLeft = false;
        if (ev.button === 2)
            INPUT.mouseRight = false;
    };
})(INPUT || (INPUT = {}));
//# sourceMappingURL=input.js.map