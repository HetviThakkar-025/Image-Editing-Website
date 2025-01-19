from flask import Flask, render_template, request, redirect, jsonify
from flask_cors import CORS
import cv2 as cv
import numpy as np
import base64

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['GET', 'POST'])
def main_func():
    return render_template("editor_window.html")


# RESIZE
@app.route("/resize", methods=['POST'])
def resize():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")

            try:
                width = int(request.form.get("width"))
                height = int(request.form.get("height"))
            except ValueError:
                return jsonify({"error": "Invalid width or height"}), 400

            if not img_file:
                raise ValueError("No file uploaded")

            # Check for allowed file extensions
            allowed_extensions = {"png", "jpg", "jpeg"}
            if img_file.filename.split('.')[-1].lower() not in allowed_extensions:
                return jsonify({"error": "Unsupported file type"}), 400

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = resize_img(img, width, height)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def resize_img(img, w, h):
    resize = cv.resize(img, (w, h), interpolation=cv.INTER_CUBIC)
    return resize


# BLUR
@app.route("/blur", methods=['POST'])
def blur():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")

            if not img_file:
                raise ValueError("No file uploaded")

            # Check for allowed file extensions
            allowed_extensions = {"png", "jpg", "jpeg"}
            if img_file.filename.split('.')[-1].lower() not in allowed_extensions:
                return jsonify({"error": "Unsupported file type"}), 400

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = blur_img(img)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def blur_img(img):
    blurred = cv.blur(img, (7, 7))
    return blurred


# Define and register the b64encode filter
@app.template_filter('b64encode')
def b64encode_filter(data):
    if isinstance(data, bytes):  # Ensure input is bytes
        # Convert bytes to Base64 string
        return base64.b64encode(data).decode('utf-8')
    raise ValueError("Input to b64encode must be bytes")


if __name__ == "__main__":
    app.run(debug=True)
