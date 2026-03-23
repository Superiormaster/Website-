import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError
from flask import current_app
from PIL import Image
import io

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_image(file, folder="SuperiorNews", resize_max_height=None,
                 crop_width=None, crop_height=None):
    """
    Upload image directly to Cloudinary.

    Options:
    resize_max_height → Resize locally while keeping aspect ratio
    crop_width + crop_height → Cloudinary crop (object-cover)
    """

    if not file:
        current_app.logger.error("No file received")
        return None

    if not allowed_file(file.filename):
        current_app.logger.error(f"Invalid file type: {file.filename}")
        return None

    try:
        file_to_upload = file

        file.stream.seek(0)  # rewind
        image = Image.open(file.stream)
        image.verify()  # verify it's an image

        file.stream.seek(0)  

        # Optional proportional resize
        if resize_max_height:
            image = Image.open(file)
            width, height = image.size

            if height > resize_max_height:
                new_width = int((resize_max_height / height) * width)

                image = image.resize(
                    (new_width, resize_max_height),
                    Image.Resampling.LANCZOS
                )

                buffer = io.BytesIO()
                image.save(buffer, format="JPEG", quality=85)
                buffer.seek(0)

                file_to_upload = buffer
            else:
                file_to_upload = file.stream

        transformations = None

        # Optional crop for ads or thumbnails
        if crop_width and crop_height:
            transformations = [{
                "width": crop_width,
                "height": crop_height,
                "crop": "fill"
            }]

        result = cloudinary.uploader.upload(
            file_to_upload,
            folder=folder,
            resource_type="image",
            transformation=transformations,
            timeout=60
        )

        return result["secure_url"]

    except CloudinaryError as e:
        current_app.logger.error(f"Cloudinary upload failed: {e}")
        return None

    except Exception as e:
        current_app.logger.error(f"Unexpected error: {e}")
        return None