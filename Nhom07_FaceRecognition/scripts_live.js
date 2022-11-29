const realtime = document.getElementById('realtime')
const container = document.getElementById('containerRealtime')

async function loadFaceApi(){
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../models')
    await faceapi.nets.faceExpressionNet.loadFromUri('../models');

    const trainingData = await loadTrainingData();

    faceMatcher = new faceapi.FaceMatcher(trainingData, 0.5)
}

async function loadTrainingData(){
    const labels = ['Cong tien','Lan huong','Uyen nhi'];

    const faceDescriptors = []
    
    for(const label of labels){
        const descriptors = [];
        for(let i = 1; i<=4;i++){
            const image = await faceapi.fetchImage(`../data/${label}/${i}.jpg`);
            const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
            descriptors.push(detection.descriptor);
        }
        faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
        Toastify({text: `da load xong ${label}`}).showToast();

    }
    
    
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

