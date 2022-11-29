const containerVideo = document.querySelector("#containerVideo");
const fileInputVideo = document.querySelector("#fileInputVideo");

fileInputVideo.addEventListener('change', async (e) =>{
    const file = fileInputVideo.files[0];
    const video =  await faceapi.bufferToVideo(file);
    

    container.innerHTML="";

    container.append(video);

})