var electron = require("electron");
var GFX;
(function (GFX) {
    let scaleStack = Array();
    let prevScale = MATH.Vector2.Zero();
    class Display {
        constructor(screen) {
            this._screen = screen;
            this.width = document.body.clientWidth;
            this.height = document.body.clientHeight;
        }
    }
    class Sprite {
        constructor(src) {
            this.image = null;
            this.width = 0;
            this.height = 0;
            this.image = new Image();
            this.image.src = src;
            this.image.onload = (ev) => { this._onLoad(ev); };
        }
        Draw() {
            GFX.context.drawImage(this.image, 0, 0);
        }
        _onLoad(ev) {
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }
    GFX.Sprite = Sprite;
    let EScalingMode;
    (function (EScalingMode) {
        EScalingMode[EScalingMode["Smooth"] = 0] = "Smooth";
        EScalingMode[EScalingMode["Nearest"] = 1] = "Nearest";
    })(EScalingMode = GFX.EScalingMode || (GFX.EScalingMode = {}));
    function ScalingMode(mode) {
        switch (mode) {
            case EScalingMode.Smooth:
                GFX.context.imageSmoothingEnabled = true;
                break;
            case EScalingMode.Nearest:
                GFX.context.imageSmoothingEnabled = false;
                break;
        }
    }
    GFX.ScalingMode = ScalingMode;
    function Init(c) {
        scaleStack.push(new MATH.Vector2(1, 1));
        GFX.context = c;
        GFX.display = new Display(electron.screen);
        GFX.context.canvas.width = GFX.display.width;
        GFX.context.canvas.height = GFX.display.height;
    }
    GFX.Init = Init;
    function Save() {
        GFX.context.save();
        scaleStack.push(new MATH.Vector2(scaleStack[scaleStack.length - 1].x, scaleStack[scaleStack.length - 1].y));
    }
    GFX.Save = Save;
    function Restore() {
        GFX.context.restore();
        prevScale = scaleStack[scaleStack.length - 1];
        scaleStack.pop();
    }
    GFX.Restore = Restore;
    function Translate(x, y) {
        GFX.context.translate(x, y);
    }
    GFX.Translate = Translate;
    function Scale(x, y) {
        GFX.context.scale(x, y);
        scaleStack[scaleStack.length - 1] = new MATH.Vector2(x, y);
    }
    GFX.Scale = Scale;
    function GetScale() {
        return prevScale;
    }
    GFX.GetScale = GetScale;
    function Clear() {
        GFX.context.clearRect(0, 0, GFX.display.width, GFX.display.height);
    }
    GFX.Clear = Clear;
})(GFX || (GFX = {}));
//# sourceMappingURL=gfx.js.map