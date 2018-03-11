
namespace Timing {

    export type AlarmDelegate = (delta: number) => void;

    export abstract class ITimer {
        public abstract Tick(): void;
    }

    export class OneShot {

        private _end: number;
        private _cb: AlarmDelegate;

        constructor(ms: number, callback: AlarmDelegate) {
            this._end = performance.now() + ms;
            this._cb = callback;
        }

        public Tick(): boolean {
            let now = performance.now();
            if(now > this._end) {
                this._cb(now-this._end);
                return true;
            } else {
                return false;
            }
        }

    }   

}