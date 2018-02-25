var INPUT;
(function (INPUT) {
    INPUT.keys = [];
    INPUT.mouseLeft = false;
    INPUT.mouseRight = false;
    INPUT.mouseXY = M.Vector2.Zero();
    INPUT.KEY_W = 87;
    INPUT.KEY_A = 65;
    INPUT.KEY_D = 68;
    INPUT.KEY_S = 83;
    INPUT.KEY_SPACE = 32;
    let EKeyState;
    (function (EKeyState) {
        EKeyState[EKeyState["UP"] = 0] = "UP";
        EKeyState[EKeyState["DOWN"] = 1] = "DOWN";
    })(EKeyState = INPUT.EKeyState || (INPUT.EKeyState = {}));
    class Key {
        constructor() {
            this.state = EKeyState.UP;
        }
    }
    INPUT.Key = Key;
    function IsKeyDown(keyCode) {
        if (INPUT.keys[keyCode]) {
            return INPUT.keys[keyCode].state === EKeyState.DOWN;
        }
        return false;
    }
    INPUT.IsKeyDown = IsKeyDown;
    function IsKeyUp(keyCode) {
        if (INPUT.keys[keyCode]) {
            return INPUT.keys[keyCode].state === EKeyState.UP;
        }
        return false;
    }
    INPUT.IsKeyUp = IsKeyUp;
    window.onkeydown = (ev) => {
        if (INPUT.keys[ev.keyCode] === undefined) {
            INPUT.keys[ev.keyCode] = new Key();
        }
        INPUT.keys[ev.keyCode].state = EKeyState.DOWN;
    };
    window.onkeyup = (ev) => {
        if (INPUT.keys[ev.keyCode] === undefined) {
            INPUT.keys[ev.keyCode] = new Key();
        }
        INPUT.keys[ev.keyCode].state = EKeyState.UP;
    };
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