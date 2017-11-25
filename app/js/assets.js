var ASSETS;
(function (ASSETS) {
    const SPRITE_PATH = "./content/sprites/";
    class Asset {
        constructor(key, object) {
            this.key = key;
            this.object = object;
        }
    }
    const Assets = [
        new Asset("GRASS_TILE", new GFX.Sprite(SPRITE_PATH + "test.png")),
    ];
    function FindAsset(key) {
        let obj = new Asset("", null);
        for (const asset of Assets) {
            if (asset.key === key) {
                obj = asset;
                break;
            }
        }
        return obj;
    }
    function Instantiate(key) {
        return DeepCopy(FindAsset(key).object);
    }
    ASSETS.Instantiate = Instantiate;
    function DeepCopy(obj) {
        let copy;
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
})(ASSETS || (ASSETS = {}));
//# sourceMappingURL=assets.js.map