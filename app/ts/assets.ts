
module ASSETS {

    const SPRITE_PATH: string = "./content/sprites/";

    class Asset<T> {
        public key: string;
        public object: T;
        constructor(key: string, object: T) {
            this.key = key;
            this.object = object;
        }        
    }

    const Assets: Array<Asset<any>> = [
        new Asset<GFX.Sprite>("GRASS_TILE", new GFX.Sprite(SPRITE_PATH + "test.png")),
    ];

    function FindAsset(key: string): Asset<any> {
        let obj: Asset<any> = new Asset("", null);
        for (const asset of Assets) {
            if (asset.key === key ) {
                obj = asset;
                break;
            }
        }
        return obj;
    }

    export function Instantiate<T>(key: string): T {
        return DeepCopy(FindAsset(key).object);
    }

    function DeepCopy(obj) {

        let copy: any;
        
        if (null == obj || "object" !== typeof obj) {
            return obj;
        }
            
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = DeepCopy(obj[i]);
            }
            return copy;
        }
        
        if (obj instanceof Object) {
            copy = Object.create(obj);
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

}