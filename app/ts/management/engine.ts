
namespace G {    

    export namespace Engine {

        export const DEBUG_DRAW_ALL = 0b0001;
        export const DEBUG_DRAW_GUI = 0b0010;

        let _debugFlags: number;
        let _states: IState[];        

        export function Init(): void {            
            _states = [];            
            _debugFlags = 0;
            let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
            let context: CanvasRenderingContext2D = canvas.getContext('2d');
            GFX.Init(context);
        }

        export function Run(): void {
            _Logic();
            _Draw();
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
            GUI.Logic();
            _states[_states.length-1].Logic();            
            Worlds.Logic();
        }         

        function _Draw(): void {
            _states[_states.length-1].Draw(); 
            Worlds.Draw();
            GUI.Draw();
        }

    }

}