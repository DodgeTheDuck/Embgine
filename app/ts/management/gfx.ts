
var electron = require("electron");

namespace G {
    
    export namespace GFX {

        export let canvas: HTMLCanvasElement;
        export let context: CanvasRenderingContext2D;
        export let display: Display;
        export let SVG: SVGSVGElement;

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
            SMOOTH,
            NEAREST,
        }

        export enum ELineMode {
            SOLID,
            DASHED
        }

        export interface ColorRGB {
            r: number,
            g: number,
            b: number
        }

        export const COL_WHITE: ColorRGB = {r: 255, g: 255, b: 255};
        export const COL_RED: ColorRGB = {r: 255, g: 0, b: 0};
        export const COL_GREEN: ColorRGB = {r: 0, g: 255, b: 0};
        export const COL_BLUE: ColorRGB = {r: 0, g: 0, b: 255};
        export const COL_BLACK: ColorRGB = {r: 0, g: 0, b: 0};

        export function ScalingMode(mode: EScalingMode): void {
            switch (mode) {
                case EScalingMode.SMOOTH:
                    context.imageSmoothingEnabled = true;
                    break;
                case EScalingMode.NEAREST:
                    context.imageSmoothingEnabled = false;
                    break;
            }
        }

        export function Init(can: HTMLCanvasElement, con: CanvasRenderingContext2D): void {
            scaleStack.push(new M.Vector2(1, 1));
            SVG = <SVGSVGElement><any>document.getElementById("SVG"); //FIXME: this is so hacky
            canvas = can;
            context = con;
            display = new Display(electron.screen);
            context.canvas.width = display.width;
            context.canvas.height = display.height;  
            ScalingMode(EScalingMode.NEAREST);
            // Translate(0.5, 0.5);
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
            context.rotate(angle*Math.PI/180);
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

        export function Pattern(pattern: CanvasPattern): void {
            context.strokeStyle = pattern;
            context.fillStyle = pattern;
        }

        export function LineMode(mode: ELineMode) {
            switch(mode) {
                case ELineMode.SOLID:
                    context.setLineDash([]);
                    break;
                case ELineMode.DASHED:
                    context.setLineDash([5, 5]);
                    break;
            }
        }

        export function DrawPolygon(points: M.Point[]): void {

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

        export function DrawRect(rect: M.Rect) {

            context.beginPath();

            switch(rect.kind) {
                case M.ERectType.EXTENTS:
                    context.rect(rect.x, rect.y, rect.w, rect.h);
                    break;
                case M.ERectType.ABSOLUTE:
                    context.rect(rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0);
                    break;
            }
 
            context.stroke();
            context.closePath();

        }

        export function FillRect(rect: M.Rect) {

            context.beginPath();        
            
            switch(rect.kind) {
                case M.ERectType.EXTENTS:
                    context.rect(rect.x, rect.y, rect.w, rect.h);
                    break;
                case M.ERectType.ABSOLUTE:
                    context.rect(rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0);
                    break;
            }

            context.fill();
            context.closePath();

        }

        export function FillText(text: string, position: M.Point): void {
            context.fillText(text, position.x, position.y);
        }

        export function DebugDrawDimension(x0: number, y0: number, x1: number, y1: number, dim: number, offset: M.Vector2) {

            // CAP
            G.GFX.DrawRect({kind: M.ERectType.EXTENTS, x: x0 + offset.x - 3, y: y0 + offset.y - 3, w: 6, h: 6})

            G.GFX.LineMode(G.GFX.ELineMode.DASHED);            
            G.GFX.DrawLine(x0 + offset.x, y0 + offset.y, x1 + offset.x, y1 + offset.y);
            G.GFX.LineMode(G.GFX.ELineMode.SOLID);
            
            // //CAP
            G.GFX.DrawRect({kind: M.ERectType.EXTENTS, x: x1 + offset.x - 3, y: y1 + offset.y - 3, w: 6, h: 6})

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