
namespace G {    

    export namespace Engine {

        export const DEBUG_DRAW_TRANSFORM       = 0b00001
        export const DEBUG_DRAW_GUI             = 0b00010;
        export const DEBUG_DRAW_GUI_BORDER      = 0b00100;
        export const DEBUG_DRAW_GUI_DIMENSIONS  = 0b01000;
        export const DEBUG_DRAW_BG              = 0b10000;

        let _debugFlags: number;
        let _states: IState[];        

        export function Init(): void {            
            _states = [];            
            _debugFlags = 0;
            let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
            let context: CanvasRenderingContext2D = canvas.getContext('2d');
            GFX.Init(canvas, context);
        }

        export function Run(): void {
            _Logic();
            _PreDraw();
            _Draw();
            _PostDraw();
            window.requestAnimationFrame(() => { this.Run(); });
        }

        export function Shutdown(): void {

        }
                
        export function PushState(state: IState) {
            _states.push(state);
            state.Init();
        }

        export function PopState(state: IState) {
            state.Destroy();
            _states.pop();
        }

        export function SetDebugFlags(flags: number) {
            _debugFlags = _debugFlags | flags;
        }

        export function TestDebugFlags(flags: number): boolean {
            return (flags & _debugFlags) > 0;
        }

        function _Logic(): void {            
            Timers.Logic();
            GUI.Logic();
            _states[_states.length-1].Logic();            
            Worlds.Logic();
        }         

        function _PreDraw(): void {
            G.GFX.Clear();
            _states[_states.length-1].PreDraw(); 
            Worlds.PreDraw();
        }

        function _Draw(): void {
            _states[_states.length-1].Draw(); 
            Worlds.Draw();
            GUI.Draw();
        }

        function _PostDraw(): void {
            Worlds.PostDraw();
        }

    }

}