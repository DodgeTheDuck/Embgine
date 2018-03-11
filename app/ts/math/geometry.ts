
module M {

    export enum ERectType {        
        ABSOLUTE,
        EXTENTS
    }

    export type Rect = RectExtents | RectAbsolute;

    export interface RectExtents {
        kind: ERectType.EXTENTS,
        x: number,
        y: number,
        w: number,
        h: number        
    }

    export interface RectAbsolute {
        kind: ERectType.ABSOLUTE,
        x0: number,
        y0: number,
        x1: number,
        y1: number        
    }

    export interface Point {
        x: number;
        y: number;
    }

    export namespace Shapes {

        export enum EShapeType {
            UNDEFINED,
            POLYGON
        }

        export abstract class IShape {
            public type: EShapeType;
            public color: G.GFX.ColorRGB;
            abstract Draw(): void;
        }

        export class Rectangle extends IShape {
            
            private _points: M.Point[];
            
            public width: number;
            public height: number;

            constructor(width: number, height: number, color: G.GFX.ColorRGB) {
                super();
                this.type = EShapeType.POLYGON;                
                this.color = color;
                this.width = width;
                this.height = height;
            }

            public Draw(): void {
                G.GFX.Color(this.color);
                G.GFX.DrawRect({kind: M.ERectType.EXTENTS, x: -this.width / 2, y: -this.height / 2, w: this.width, h: this.height});
            }

            public GetPoints(): M.Point[] {
                return this._points;
            }

        }

        export class Polygon extends IShape {
            
            private _points: M.Point[];

            constructor(points: M.Point[], color: G.GFX.ColorRGB) {
                super();
                this.type = EShapeType.POLYGON;
                this._points = points;
                this.color = color;
            }

            public Draw(): void {
                G.GFX.Color(this.color);
                G.GFX.DrawPolygon(this._points);
            }

            public GetPoints(): M.Point[] {
                return this._points;
            }

        }

    }

}