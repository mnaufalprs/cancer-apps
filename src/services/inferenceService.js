const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {

    const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()

    return model.predict(tensor).data();

}

module.exports = predictClassification;