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

// MAIN FUNCTION
async function submitImageForm(endpoint, additionalData = {}) {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
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


// RESIZE
const resizeButtonToolbar = document.getElementById('resizeButtonToolbar');
const resizeButton = document.getElementById('resizeButton');

resizeButtonToolbar.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!hasClickedOnce) {
        document.getElementById("resize-w-h").classList.remove('hidden');
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

blurTool.addEventListener("click", async (event) => {
    event.preventDefault();

    submitImageForm("http://127.0.0.1:5000/blur", null);
});

// FLIP
const flipTool = document.getElementById('flipTool');

flipTool.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!hasClickedOnce) {
        document.getElementById("flipping").classList.remove('hidden');
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

rotate.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!hasClickedOnce) {
        document.getElementById("rotate-a").classList.remove('hidden');
        hasClickedOnce = true;
        return;
    }

    const a = document.getElementById('angle').value;

    const additionalData = {
        angle: a
    };


    submitImageForm("http://127.0.0.1:5000/rotate", additionalData);
});


// MORPHOLOGY
const morphology = document.getElementById('morphology');

morphology.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!hasClickedOnce) {
        document.getElementById("morphology-d-e").classList.remove('hidden');
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

    if (!hasClickedOnce) {
        document.getElementById("spaces-b-l").classList.remove('hidden');
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

    if (!hasClickedOnce) {
        document.getElementById("translate-x-y").classList.remove('hidden');
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