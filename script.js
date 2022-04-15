const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  let diagrama = document.getElementById("canvasDiagrama")
  diagrama.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    detections.map(function (element, index) {
      let expresiones = []
      expresiones = element.expressions
      //console.log("element: ", expresiones)
      var codigo = ""
      Object.keys(expresiones).map(function (key,index, value){
        codigo +=`<TR><TD>${index+1}</TD><TD>${key}</TD>
        <TD><div class="progress">
        <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: ${(expresiones[key])*100}%" aria-valuenow="${(expresiones[key])*100}" aria-valuemin="0" aria-valuemax="100"></div>
      </div></TD>
        <TD>${((expresiones[key])*100).toFixed(2)}</TD></TR>`        
      })
      document.getElementById('tablebody').innerHTML= codigo
    })
        
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
  setInterval(async () => {
    console.log("punto de inspección")
  }, 1000)
})

