
class Space extends IBackground {

    constructor() {
        super();

        let width = 512;
        let height = 512;

        for(let i = 0; i < 3; i++) {

            let imageData: ImageData = G.GFX.context.createImageData(width, height);
    
            for(let j = 0; j < 24; j++) {
                let x = Math.random() * width;
                let y = Math.random() * height;
                let index = Math.floor(  x * width * 4 + y );
                imageData.data[index - index % 4] = 255;
                imageData.data[index - index % 4 + 1] = 255;
                imageData.data[index - index % 4 + 2] = 255;
                imageData.data[index - index % 4 + 3] = 255;
            }
    
            createImageBitmap(imageData).then((bmp: ImageBitmap) => {
                this.layers.push({
                    image: bmp,
                    depth: i+1,
                    pos: M.Vector2.Zero()
                })
            })

        }

    }

}