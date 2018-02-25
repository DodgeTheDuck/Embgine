
namespace G {

    export namespace Worlds {

        export type WorldHandle = number;

        let _worlds: PHYS.World[] = [];

        export function Current(): PHYS.World {
            return _worlds[_worlds.length-1];
        }

        export function Logic(): void {
            _worlds[_worlds.length-1].Logic();
        }

        export function Draw(): void {
            _worlds[_worlds.length-1].Draw();
        }

        export function PushWorld(world: PHYS.World): WorldHandle {
            return _worlds.push(world)-1;
        }

        export function PopWorld(): void {
            _worlds.pop();
        }

    }

}