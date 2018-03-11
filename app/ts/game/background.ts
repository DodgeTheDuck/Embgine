
interface BackgroundLayer {
    image: ImageBitmap,
    depth: number,
    pos: M.Vector2
}

abstract class IBackground {
    
    public layers: Array<BackgroundLayer> = new Array<BackgroundLayer>();
    
    public Draw(offset: M.Vector2, speed: M.Vector2): void {

        for(let i = 0; i < this.layers.length; i++) {

            let layer = this.layers[i];

            if(layer.image) {

                let scale = i+1;

                let parallaxMod = 3;

                layer.pos.x += speed.x / layer.depth / parallaxMod / scale;
                layer.pos.y += speed.y / layer.depth / parallaxMod / scale;
            
                G.GFX.Save();
                G.GFX.Scale(scale, scale);

                let imgWidth = layer.image.width;
                let imgHeight = layer.image.height;

                let scrWidth = G.GFX.display.width;
                let scrHeight = G.GFX.display.height;

                let repsX = Math.round(scrWidth / (imgWidth / scale));
                let repsY = Math.round(scrHeight / (imgHeight / scale));

                let offx = (Math.floor((offset.x / scale - layer.pos.x) / imgWidth ) * imgWidth) + layer.pos.x;
                let offy = (Math.floor((offset.y / scale - layer.pos.y) / imgHeight ) * imgHeight) + layer.pos.y;

                
                for(let j = -1; j < repsX+1; j++) {
                    for(let k = -1; k < repsY+1; k++) {

                        let x = offx + imgWidth * j;
                        let y = offy + imgHeight * k;

                        G.GFX.context.drawImage(layer.image, x, y);

                        if(G.Engine.TestDebugFlags(G.Engine.DEBUG_DRAW_BG)) {

                            switch (i % 3) {
                                case 0: 
                                    G.GFX.Color(G.GFX.COL_RED);
                                    break;
                                case 1:
                                    G.GFX.Color(G.GFX.COL_BLUE);
                                    break;
                                case 2:
                                    G.GFX.Color(G.GFX.COL_GREEN);
                                    break;
                            }

                            G.GFX.DrawRect({kind: M.ERectType.EXTENTS, x: x, y: y, w: imgWidth, h: imgHeight});

                        }

                    }
                }

                G.GFX.Restore();

            }

        }

    }

}