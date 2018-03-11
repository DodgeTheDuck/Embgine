
namespace G {

    export namespace Timers {

        let _timers: Array<Timing.ITimer> = new Array<Timing.ITimer>();

        export function RegisterTimer(timer: Timing.ITimer): void {
            _timers.push(timer);
        }

        export function Logic(): void {
            let killList: Array<Timing.ITimer> = new Array<Timing.ITimer>();
            for(let i = 0; i < _timers.length; i++) {
                if(_timers[i].Tick()) killList.push(_timers[i]);
            }

            for(let i = 0; i < killList.length; i++) {
                _timers.splice(_timers.indexOf(killList[i]), 1);
            }
        }

    }

}