
var electron = require("electron");

module GFX {

    export let context: CanvasRenderingContext2D;
    export let display: Display;

    let scaleStack = Array<MATH.Vector2>();
    let prevScale: MATH.Vector2 = MATH.Vector2.Zero();

    class Display {

        public width: number;
        public height: number;

        private _screen: Electron.Screen;

        constructor(screen: Electron.Screen) {
            this._screen = screen;
            this.width = document.body.clientWidth;
            this.height = document.body.clientHeight;
        }

    }

    export class Sprite {

        public image: HTMLImageElement = null;

        public width: number        = 0;
        public height: number       = 0;

        constructor(src: string) {
            this.image = new Image();
            this.image.src = src;
            this.image.onload = (ev: Event) => { this._onLoad(ev); };
        }

        public Draw(): void {
            context.drawImage(this.image, 0, 0);
        }

        private _onLoad(ev: Event): void {
            this.width = this.image.width;
            this.height = this.image.height;
        }

    }

    export enum EScalingMode {
        Smooth,
        Nearest,
    }

    export function ScalingMode(mode: EScalingMode): void {
        switch (mode) {
            case EScalingMode.Smooth:
                context.imageSmoothingEnabled = true;
                break;
            case EScalingMode.Nearest:
                context.imageSmoothingEnabled = false;
                break;
        }
    }

    export function Init(c: CanvasRenderingContext2D): void {
        scaleStack.push(new MATH.Vector2(1, 1));
        context = c;
        display = new Display(electron.screen);
        context.canvas.width = display.width;
        context.canvas.height = display.height;
    }

    export function Save(): void {
        context.save();
        scaleStack.push(new MATH.Vector2(scaleStack[scaleStack.length-1].x, scaleStack[scaleStack.length-1].y))
    }

    export function Restore(): void {
        context.restore();
        prevScale = scaleStack[scaleStack.length-1];
        scaleStack.pop();
        
    }

    export function Translate(x: number, y: number): void {
        context.translate(x, y);
    }

    export function Scale(x: number, y: number): void {
        context.scale(x, y);
        scaleStack[scaleStack.length-1] = new MATH.Vector2(x, y);    
    }

    export function GetScale(): MATH.Vector2 {
        return prevScale;
    }

    export function Clear(): void {
        context.clearRect(0, 0, display.width, display.height);
    }

}
