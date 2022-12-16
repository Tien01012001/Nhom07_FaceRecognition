const fs = require('fs')
const path = require('path')
const container = document.querySelector("#container");
const fileInput = document.querySelector("#fileInput")
faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement('canvas'),
    createImageElement: () => document.createElement('img')
})

async function loadTrainingData(){
    let pathNameDelete = path.join(__dirname, '../data/')
    const faceDescriptors = []
    const labels=[]
    if( fs.existsSync(pathNameDelete) ) {
        fs.readdirSync(pathNameDelete).forEach(async function(label,index){
            labels.push(label);
        });  
    }


    for(const label of labels){
        if(fs.existsSync(path.join(__dirname, '../data/',label,"1.jpg"))){
            let folderLabel = path.join(__dirname, '../data/',label)
            let count = fs.readdirSync(folderLabel).length
            const descriptors = [];
            for(let i = 1; i<=count;i++){
                const image = await faceapi.fetchImage(`../data/${label}/${i}.jpg`);
                const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
                if(detection == undefined){
                    console.log(`ảnh ${i}.jpg của folder ${label} không tìm thấy khuôn mặt`)
                }
                else{
                descriptors.push(detection.descriptor);
                }
            }

            faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
        }
        else {
            console.log(`folder ${label} trong`)
        }
        
        //Toastify({text: `da load xong ${label}`}).showToast();
        }
        //Toastify({text: "da load xong"}).showToast();
    
    
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
    alert("bạn có thể bắt đầu nhận diện")

}
init()
fileInput.addEventListener('change', async (e) =>{
    const file = fileInput.files[0];
    const image =  await faceapi.bufferToImage(file);
    const canvas = faceapi.createCanvasFromMedia(image);

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
