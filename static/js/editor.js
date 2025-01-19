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
        } else {
            alert("Failed to retrieve image.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the image.");
    }
}


// RESIZE
let hasClickedOnce = false;
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

    // if (!hasClickedOnce) {
    //     document.getElementById("resize-w-h").classList.remove('hidden');
    //     hasClickedOnce = true;
    //     return;
    // }

    // const widthValue = document.getElementById('width').value;
    // const heightValue = document.getElementById('height').value;

    // if (!widthValue || !heightValue) {
    //     alert("Please specify both width and height.");
    //     return;
    // }

    // const additionalData = {
    //     width: widthValue,
    //     height: heightValue
    // };

    submitImageForm("http://127.0.0.1:5000/blur", null);
});