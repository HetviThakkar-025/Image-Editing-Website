from flask import Flask, render_template, request, redirect
import cv2 as cv
import numpy as np
import base64


app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def main_func():
    if request.method == 'POST':

        try:
            img_file = request.files.get("imageInput")
            # print('hi this is', img_file)
            img_array = np.fromstring(img_file.read(), np.uint8)
            print('img arr', img_array)  
            img = cv.imdecode(img_array, cv.IMREAD_COLOR)

            newimg = resize_img(img)

            _, img_encoded = cv.imencode('.jpg', newimg)
            img_bytes = img_encoded.tobytes()
            img_data = bytes(img_bytes)

            # Return the resized image in a response, as an image rendered on the editor page
            return render_template("editor_window.html", img_data=img_data)
        except Exception as e:
            print(e)

        # img_array = np.fromstring(img_file.read(), np.uint8)
        # x = request.form('myP')
        # print(x)

    return render_template("editor_window.html")


def resize_img(img):
    resize = cv.resize(img, (300, 300), interpolation=cv.INTER_CUBIC)
    return resize

# Define and register the b64encode filter
@app.template_filter('b64encode')
def b64encode_filter(data):
    if isinstance(data, bytes):  # Ensure input is bytes
        return base64.b64encode(data).decode('utf-8')  # Convert bytes to Base64 string
    raise ValueError("Input to b64encode must be bytes")

if __name__ == "__main__":
    app.run(debug=True)
