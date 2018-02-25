
type RegionHandle = number;
type WidgetHandle = number;

namespace G {

    export namespace GUI {

        let _regions: GUIRegion[] = [];

        export function Logic(): void {
            for(let region of _regions) {
                region.Logic();
            }
        }

        export function Draw(): void {
            for(let region of _regions) {
                region.Draw();
            }
        }

        export function AddRegion(region: GUIRegion): RegionHandle {
            return _regions.push(region)-1;
        }

    }

}