insectImg = document.getElementById('insectPic');
if (insectImg) {
    imgData = getBase64Image(insectImg);
    localStorage.setItem('imgData', imgData);
}

let dataImage = localStorage.getItem('imgData');
insectImg = document.getElementById('user-pic');
// insectImg.src = "data:image/png;base64," + dataImage;

let prediction;

let identify = document.querySelector('.identify');
if (identify) {
    identify.addEventListener('click', async function(data) {
        event.preventDefault();

        function indexOfMax(arr) {

            var max = arr[0];
            var maxIndex = 0;

            for (var i = 1; i < arr.length; i++) {
                if (arr[i] > max) {
                    maxIndex = i;
                    max = arr[i];
                }
            }

            return maxIndex;
        }
        let user_pic = document.querySelector('.dz-image').children[0];
        sessionStorage.setItem('user_pic', user_pic.src)
        let imageData;
        // Creating Canvas User Image
        const image = new Image();
        image.src = user_pic.src;
        const canvas = document.querySelector('#myCanvas');

        const context = canvas.getContext('2d');
        context.drawImage(user_pic, 0, 0, 175, 175);

        imageData = context.getImageData(0, 0, 175, 175);
        // Replace the Dropzone with the image that is cropped
        // After that, give that image to the prediction method
        const response = await tf.loadLayersModel('model.json');
        response.summary();

        // let flat = tf.util.flatten(user_pic)
        // console.log('This is Flattened Tensor: ', flat)
        const tensor_image = tf.browser
            .fromPixels(imageData)
            .reshape([175, 175, 3])
            .div(tf.scalar(255))
            .cast('float32')
            .expandDims();

        // Prediction on the image we have
        prediction = response.model.predict(
            // The second arg makes it grayscale (supposedly)
            // This is also the only way to get a proper setup
            tensor_image, { batchSize: 1 },
            true
        );
        // This is the problem spot. All 4 numbers get put together.
        // Our structure is [null, 200, 200, 1] in the model
        // Because there is a null, it equates to 0 where it needs to be 40000
        let results = prediction.dataSync();
        let predictionDigit = indexOfMax(results)
        console.log('Results: ', results)
        console.log('Prediction Digit: ', predictionDigit)

        let answers = {
            0: 'dissosteira carolina',
            1: 'melanoplus bivittatus',
            2: 'melanoplus differentialis',
            3: 'phyllopalpus pulchellus',
            4: 'romalea microptera'
        };

        // When the model works, the 0 will be the result from the prediction
        // Just building the skeleton now
        // This is a weird way to do this and I am too tired to keep going

        // Javascript page rendering
        console.log('This is the prediction digit', predictionDigit)

        if (predictionDigit === 0) {
            console.log('index 0')
            window.location.href = "dcarolina.html"
        } else if (predictionDigit === 1) {
            console.log('index 1')
            window.location.href = "mbivittatus.html"
        } else if (predictionDigit === 2) {
            console.log('index 2')
            window.location.href = "mdifferentialis.html"
        } else if (predictionDigit === 3) {
            console.log('index 3')
            window.location.href = "ppulchellus"
        } else if (predictionDigit === 4) {
            console.log('index 4')
            window.location.href = "rmicroptera.html"
        }
    });

    // console.log('Tensor Object: ', tensor_image)
    // // const prediction = model.predict(tensor_image)
    // console.log('This is your prediction: ', prediction)
    // // sessionStorage.setItem('prediction', prediction)
}

// Bug info rendering
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + ' = ') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let carousel = document.querySelector('.carousel');
if (carousel) {
    let slideIndex = 1;

    // Setting a default so that it will move by itself
    function plusSlides(n = 1) {
        showSlides((slideIndex += n));
    }

    function currentSlide(n) {
        showSlides((slideIndex = n));
    }

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName('slide');
        let dots = document.getElementsByClassName('dot');
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(' active', '');
        }
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].className += ' active';
    }
    showSlides(slideIndex);

    window.setInterval(plusSlides, 5000);

    fetch('/api/');
}