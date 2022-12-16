const fs = require('fs')
const path = require('path')
const realtime = document.getElementById('realtime')
const container = document.getElementById('containerRealtime')
faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement('canvas'),
    createImageElement: () => document.createElement('img')
})
async function loadFaceApi(){
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../models')
    await faceapi.nets.faceExpressionNet.loadFromUri('../models');

    const trainingData = await loadTrainingData();

    faceMatcher = new faceapi.FaceMatcher(trainingData, 0.5)
    alert("bạn có thể bắt đầu nhận diện")
}

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

function getCameraStream(){
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video : {}})
            .then(stream => {
                realtime.srcObject = stream;

            })
    }
}



realtime.addEventListener('playing' , ()=>{
   
    const canvas =  faceapi.createCanvasFromMedia(realtime);
    
    
    container.append(canvas)
    const size = {
        width: realtime.videoWidth,
        height: realtime.videoHeight
    }
    setInterval(async ()=>{
        const detect = await faceapi.detectAllFaces(realtime)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withFaceExpressions();
        const resizeDetects = faceapi.resizeResults(detect,size)
        canvas.getContext('2d').clearRect(0,0,size.width,size.height);


        faceapi.draw.drawDetections(canvas, resizeDetects )
        //faceapi.draw.drawFaceLandmarks(canvas, resizeDetects )
        faceapi.draw.drawFaceExpressions(canvas, resizeDetects )

        for(const detection of resizeDetects){
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: faceMatcher.findBestMatch(detection.descriptor, size)
            })
            drawBox.draw(canvas);
        }
    }, 300)
})

loadFaceApi().then(getCameraStream);

