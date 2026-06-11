import { Jimp } from 'jimp';

async function analyze() {
    const image = await Jimp.read('public/pests/roach_runner.png');
    
    function getColor(x, y) {
        const idx = image.getPixelIndex(x, y);
        return [
            image.bitmap.data[idx],
            image.bitmap.data[idx+1],
            image.bitmap.data[idx+2]
        ];
    }
    
    console.log('0,0:', getColor(0, 0));
    console.log('0,5:', getColor(0, 5));
    console.log('5,0:', getColor(5, 0));
    console.log('5,5:', getColor(5, 5));
    console.log('10,10:', getColor(10, 10));
}

analyze();
