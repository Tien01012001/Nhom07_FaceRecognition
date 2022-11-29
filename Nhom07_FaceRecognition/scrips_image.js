const container = document.querySelector("#container");
const fileInput = document.querySelector("#fileInput")


async function loadTrainingData(){
    const labels = ['Cong tien','Lan huong','Uyen nhi'];

    const faceDescriptors = []
    
    for(const label of labels){
        const descriptors = [];
        for(let i = 1; i<=4;i++){
            const image = await faceapi.fetchImage(`../data/${label}/${i}.jpg`);
            const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
            descriptors.push(detection.descriptor);
        }
        faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
        Toastify({text: `da load xong ${label}`}).showToast();
 
    }
    Toastify({text: "da load xong"}).showToast();
    
    
    return faceDescriptors;
}

let faceMatcher ;
async function init(){
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../models')
    await faceapi.nets.faceExpressionNet.loadFromUri('../models');

    

    const trainingData = await loadTrainingData();

    faceMatcher = new faceapi.FaceMatcher(trainingData, 0.6)
    

}
init()
fileInput.addEventListener('change', async (e) =>{
    const file = fileInput.files[0];
    const image =  await faceapi.bufferToImage(file);
    const canvas = faceapi.createCanvasFromMedia(image);

    console.log('k he lo')
    container.innerHTML="";

    container.append(image);
    container.append(canvas)
    const size = {
        width: image.width,
        height: image.height
    }

    faceapi.matchDimensions(canvas, size);

    const detections = await faceapi.detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, size)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections )
    for(const detection of resizedDetections){
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
            label: faceMatcher.findBestMatch(detection.descriptor, size)
        })
        drawBox.draw(canvas);
    }
})
