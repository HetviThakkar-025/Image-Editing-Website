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
            ks = int(request.form.get("blurValue"))

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = blur_img(img, ks)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def blur_img(img, ks):
    blurred = cv.blur(img, (ks, ks))
    return blurred


# FLIP
@app.route("/flip", methods=['POST'])
def flip():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")
            flipcode = int(request.form.get("flip"))

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = flip_img(img, flipcode)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def flip_img(img, flipcode):
    flipped = cv.flip(img, flipcode)
    return flipped


# GRAY
@app.route("/gray", methods=['POST'])
def gray():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = gray_img(img)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def gray_img(img):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    return gray


# ROTATE
@app.route("/rotate", methods=['POST'])
def rotate():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")
            angle = int(request.form.get("angle"))

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = rotate_img(img, angle)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def rotate_func(img, angle, point=None):
    (height, width) = img.shape[:2]

    if point is None:
        point = (width//2, height//2)

    mat = cv.getRotationMatrix2D(point, angle, 1.0)
    dimensions = (width, height)

    return cv.warpAffine(img, mat, dimensions)


def rotate_img(img, angle):
    rotated = rotate_func(img, angle)
    return rotated


# MORPH
@app.route("/morph", methods=['POST'])
def morph():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")
            morph = request.form.get("morph")

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = morph_img(img, morph)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def morph_img(img, m):
    canny = cv.Canny(img, 125, 175)
    dilate = cv.dilate(canny, (7, 7), iterations=3)
    erode = cv.erode(dilate, (7, 7), iterations=3)

    if m == "dilate":
        return dilate
    elif m == "erode":
        return erode


# MORPH
@app.route("/spaces", methods=['POST'])
def spaces():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")
            space = request.form.get("space")

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = space_img(img, space)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def space_img(img, s):
    if s == "hsv":
        hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
        return hsv
    elif s == "lab":
        lab = cv.cvtColor(img, cv.COLOR_BGR2LAB)
        return lab


# TRANSLATE
@app.route("/translate", methods=['POST'])
def translate():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")

            try:
                x = int(request.form.get("X"))
                y = int(request.form.get("Y"))
            except ValueError:
                return jsonify({"error": "Invalid width or height"}), 400

            if not img_file:
                raise ValueError("No file uploaded")

            img_array = np.frombuffer(img_file.read(), np.uint8)
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if img is None:
                return jsonify({"error": "Invalid image file"}), 400

            newimg = translate_img(img, x, y)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()

            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            return jsonify({"filtered_image": img_base64}), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return render_template("editor_window.html")


def trans(img, x, y):
    transMat = np.float32([[1, 0, x], [0, 1, y]])
    dimensions = (img.shape[1], img.shape[0])
    return cv.warpAffine(img, transMat, dimensions)


def translate_img(img, x, y):
    translated = trans(img, x, y)
    return translated

# Define and register the b64encode filter


@app.template_filter('b64encode')
def b64encode_filter(data):
    if isinstance(data, bytes):  # Ensure input is bytes
        # Convert bytes to Base64 string
        return base64.b64encode(data).decode('utf-8')
    raise ValueError("Input to b64encode must be bytes")


if __name__ == "__main__":
    app.run(debug=True)
