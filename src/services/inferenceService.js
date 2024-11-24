const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exception/InputError.js');
 
async function predictClassification(model, image) {
    try{
        const tensor = tf.node
        .decodeImage(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();
    
        const prediksi = model.predict(tensor);
        const score = await prediksi.data();
        const confidence = Math.max(...score);
    
        let label, suggestion;
        
        if (confidence <= 0.5) {
            label = 'Non-cancer';
            suggestion = "Penyakit kanker tidak terdeteksi.";
        }
    
        if(confidence > 0.5){
            label = 'Cancer';
            suggestion = 'Segera periksa ke dokter!';
        }
    
        return { label, suggestion };
    } catch (error) {
        throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
    }
}

module.exports = predictClassification;