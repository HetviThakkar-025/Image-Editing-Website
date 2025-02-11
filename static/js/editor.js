// hamburger functionality
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});


const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const form = document.getElementById('imageForm');

let hasClickedOnce = false;

// MAIN FUNCTION
async function submitImageForm(endpoint, additionalData = {}) {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    const formData = new FormData();
    formData.append("imageInput", file);

    for (const key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
            formData.append(key, additionalData[key]);
        }
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Request failed.");
        }

        const data = await response.json();
        console.log("Server response:", data);

        if (data.filtered_image) {
            const imageContainer = document.getElementById("resizedImageContainer");
            const previewContainer = document.getElementById("previewContainer");

            const img = document.createElement("img");
            img.src = `data:image/jpeg;base64,${data.filtered_image}`;
            img.alt = "Processed Image";
            img.className = "max-w-full max-h-full object-contain";

            imageContainer.innerHTML = ""; // Clear previous content
            imageContainer.appendChild(img);
            imageContainer.classList.remove("hidden");
            form.classList.add("hidden");
            previewContainer.classList.add("hidden");
            hasClickedOnce = false;
        } else {
            alert("Failed to retrieve image.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the image.");
    }
}

//RESET

const reset = document.getElementById('resetbtn');

reset.addEventListener('click', () => {
    const imageContainer = document.getElementById("previewContainer");
    const resimageContainer = document.getElementById("resizedImageContainer");
    const fileInput = document.getElementById("imageInput");

    // Clear the displayed images
    imageContainer.innerHTML = "";
    resimageContainer.innerHTML = "";
    fileInput.value = "";

    // Manually trigger a change event to ensure the file input resets
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
});

// preview image
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewContainer.classList.remove('hidden');
        };

        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.add('hidden');
    }
});

// const reset = document.getElementById('resetbtn')

// reset.addEventListener('click', (event) => {
//     const imageContainer = document.getElementById("previewContainer");
//     const resimageContainer = document.getElementById("resizedImageContainer");
//     const fileInput = document.getElementById("imageInput");
//     const file = fileInput.files[0];

//     if (file) {
//         imageContainer.innerHTML = "";
//         resimageContainer.innerHTML = "";
//         fileInput.value = "";
//     }
// });


// RESIZE
const resizeButtonToolbar = document.getElementById('resizeButtonToolbar');
const resizeButton = document.getElementById('resizeButton');

resizeButtonToolbar.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("resize-w-h").classList.remove('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        document.getElementById("morphology-d-e").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }

    const widthValue = document.getElementById('width').value;
    const heightValue = document.getElementById('height').value;

    if (!widthValue || !heightValue) {
        alert("Please specify both width and height.");
        return;
    }

    const additionalData = {
        width: widthValue,
        height: heightValue
    };

    submitImageForm("http://127.0.0.1:5000/resize", additionalData);
});

// BLUR
const blurTool = document.getElementById('blurTool');

const blurInput = document.getElementById('blur-slider');
const blurValue = document.getElementById('blurValue');

// Update displayed value when the range slider is changed
blurInput.addEventListener('input', () => {
    blurValue.textContent = blurInput.value;
});

blurTool.addEventListener("click", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("blur-img").classList.remove('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("resize-w-h").classList.add('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        document.getElementById("morphology-d-e").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }


    const b = blurInput.value;

    const additionalData = {
        blurValue: b
    };

    submitImageForm("http://127.0.0.1:5000/blur", additionalData);
});

// FLIP
const flipTool = document.getElementById('flipTool');

flipTool.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("flipping").classList.remove('hidden');
        document.getElementById("resize-w-h").classList.add('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        document.getElementById("morphology-d-e").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }

    const selectedRadio = document.querySelector('input[name="flip"]:checked');
    const flipValue = selectedRadio ? selectedRadio.value : null;

    const additionalData = {
        flip: flipValue
    };

    console.log("Submitting with flip value:", flipValue);
    submitImageForm("http://127.0.0.1:5000/flip", additionalData);
});


// GRAYSCALE
const gray = document.getElementById('grayscale');

gray.addEventListener("click", async (event) => {
    event.preventDefault();

    submitImageForm("http://127.0.0.1:5000/gray", null);
});


// ROTATE
const rotate = document.getElementById('rotate');

const rangeInput = document.getElementById('rotate-s');
const rangeValue = document.getElementById('rangeValue');

rangeInput.addEventListener('input', () => {
    rangeValue.textContent = rangeInput.value;
});

rotate.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("rotate-a").classList.remove('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("resize-w-h").classList.add('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        document.getElementById("morphology-d-e").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }


    const a = rangeInput.value;

    const additionalData = {
        angle: a
    };

    submitImageForm("http://127.0.0.1:5000/rotate", additionalData);
});


// MORPHOLOGY
const morphology = document.getElementById('morphology');

morphology.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("morphology-d-e").classList.remove('hidden');
        document.getElementById("resize-w-h").classList.add('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }

    const selectedRadio = document.querySelector('input[name="morph"]:checked');
    const morphValue = selectedRadio ? selectedRadio.value : null;

    const additionalData = {
        morph: morphValue
    };

    console.log("Submitting with flip value:", morphValue);
    submitImageForm("http://127.0.0.1:5000/morph", additionalData);
});


// SPACES
const spaces = document.getElementById('spaces');

spaces.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("spaces-b-l").classList.remove('hidden');
        document.getElementById("resize-w-h").classList.add('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        document.getElementById("morphology-d-e").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }

    const selectedRadio = document.querySelector('input[name="space"]:checked');
    const spaceValue = selectedRadio ? selectedRadio.value : null;

    const additionalData = {
        space: spaceValue
    };

    submitImageForm("http://127.0.0.1:5000/spaces", additionalData);
});

// TRANSLATE
const translate = document.getElementById('translate');

translate.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("translate-x-y").classList.remove('hidden');
        document.getElementById("adj-txt").classList.add('hidden');
        document.getElementById("resize-w-h").classList.addEventListener('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("morphology-d-e").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }

    const x = document.getElementById('x').value;
    const y = document.getElementById('y').value;

    if (!x || !y) {
        alert("Please specify both x and y");
        return;
    }

    const additionalData = {
        X: x,
        Y: y
    };

    submitImageForm("http://127.0.0.1:5000/translate", additionalData);
});


// HISTOGRAM
const hist = document.getElementById('graph');

hist.addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    if (!hasClickedOnce) {
        document.getElementById("morphology-d-e").classList.add('hidden');
        document.getElementById("resize-w-h").classList.add('hidden');
        document.getElementById("adj-txt").classList.remove('hidden');
        document.getElementById("flipping").classList.add('hidden');
        document.getElementById("rotate-a").classList.add('hidden');
        document.getElementById("spaces-b-l").classList.add('hidden');
        document.getElementById("translate-x-y").classList.add('hidden');
        hasClickedOnce = true;
        return;
    }

    submitImageForm("http://127.0.0.1:5000/histogram", null);
});


//LOGIN-SIGNUP
login = document.getElementById("login-form")
exportBtn = document.getElementById("export")
loginBtn = document.getElementById("login-signup")

// exportBtn.addEventListener("click", async (event) => {
//     login.classList.remove('hidden');
// });

loginBtn.addEventListener("click", async (event) => {
    login.classList.remove('hidden');
});

function closeModal() {
    login.classList.add('hidden');
    document.getElementById('successModal').style.display = 'none';
}

exportBtn.addEventListener("click", async (event) => {
    const response = await fetch('/check_login'); // Check user session
    const result = await response.json();

    if (!result.logged_in) {

        alert("Please log in to export the filtered image.");
        return;
    }

    // Request server to save and return image

    const imgResponse = await fetch('/export_filtered_image');
    if (imgResponse.ok) {
        const blob = await imgResponse.blob();
        alert('ok')
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "filtered_image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Failed to export image.");
    }
});
