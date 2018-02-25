
var electron = require("electron");

namespace G {
    
    export namespace GFX {

        export let context: CanvasRenderingContext2D;
        export let display: Display;

        let scaleStack = Array<M.Vector2>();
        let prevScale: M.Vector2 = M.Vector2.Zero();

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

        export interface ColorRGB {
            r: number,
            g: number,
            b: number
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
            scaleStack.push(new M.Vector2(1, 1));
            context = c;
            display = new Display(electron.screen);
            context.canvas.width = display.width;
            context.canvas.height = display.height;
        }

        export function Save(): void {
            context.save();
            scaleStack.push(new M.Vector2(scaleStack[scaleStack.length-1].x, scaleStack[scaleStack.length-1].y))
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
            scaleStack[scaleStack.length-1] = new M.Vector2(x, y);    
        }

        export function Rotate(angle: number): void {
            context.rotate(angle);
        }

        export function GetScale(): M.Vector2 {
            return prevScale;
        }

        export function Clear(): void {
            context.clearRect(0, 0, display.width, display.height);
        }

        export function Color(color: ColorRGB): void {
            let c: string = "rgb("+color.r+","+color.g+","+color.b+")";
            context.strokeStyle = c;
            context.fillStyle = c;
        }

        export function DrawPolygon(points: M.Vector2[]): void {

            context.beginPath();        
            
            for( let i = 0; i < points.length; i++ ) {
                if( i === 0 ) {
                    context.moveTo(points[0].x, points[0].y);    
                } else {
                    context.lineTo(points[i].x, points[i].y);    
                }            
            }
            context.lineTo(points[0].x, points[0].y);    
            context.stroke();
            context.closePath();

        }


        export function DrawCircle(x: number, y: number, r: number): void {
            context.beginPath();
            context.arc(x, y, r, 0, 360);
            context.stroke();
            context.closePath();
        }

        export function DrawRect(rect: M.RectExtents) {

            context.beginPath();
            context.rect(rect.x, rect.y, rect.w, rect.h);
            context.stroke();
            context.closePath();

        }

        export function FillRect(rect: M.RectExtents) {

            context.beginPath();
            context.rect(rect.x, rect.y, rect.w, rect.h);
            context.fill();
            context.closePath();

        }

        export function DrawLine(x0: number, y0: number, x1: number, y1: number) {

            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.stroke();
            context.closePath();

        }


    }

}