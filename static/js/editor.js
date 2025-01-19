// hamburger functionality
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});


const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const resizeButtonToolbar = document.getElementById('resizeButtonToolbar');
const form = document.getElementById('imageForm');
const resizeButton = document.getElementById('resizeButton');


imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();

        // When file is loaded
        reader.onload = (e) => {
            previewImage.src = e.target.result; // Set the image source to the file content
            previewContainer.classList.remove('hidden'); // Show the preview container
        };

        reader.readAsDataURL(file); // Read the file content
    } else {
        previewContainer.classList.add('hidden'); // Hide the preview container if no file is selected
    }
});


// Resize functionality
resizeButtonToolbar.addEventListener("click", (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image to resize.");
        return;
    }

    const formData = new FormData();
    formData.append("imageInput", file);

    fetch("http://127.0.0.1:5000/resize", {
        method: "POST",
        body: formData,
    })

        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to resize the image.");
            }
            return response.json();
        })

        .then((data) => {
            if (data.resized_image) {
                const resizedImageContainer = document.getElementById("resizedImageContainer");
                const previewContainer = document.getElementById("previewContainer");

                // Update the container with the resized image
                const img = document.createElement("img");
                img.src = `data:image/jpeg;base64,${data.resized_image}`;
                img.alt = "Resized Image";
                img.className = "max-w-full max-h-full object-contain";

                resizedImageContainer.innerHTML = ""; // Clear previous content
                resizedImageContainer.appendChild(img);
                resizedImageContainer.classList.remove("hidden");

                // Hide the original preview
                previewContainer.classList.add("hidden");
            } else {
                alert("Failed to retrieve resized image.");
            }
        })

        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while resizing the image.");
        });
});