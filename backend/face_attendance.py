import os
import cv2
import numpy as np

# Model paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

YUNET_MODEL = os.path.join(
    BASE_DIR,
    "models",
    "face_detection_yunet_2026may.onnx"
)

SFACE_MODEL = os.path.join(
    BASE_DIR,
    "models",
    "face_recognition_sface_2021dec.onnx"
)

# Face detector
detector = cv2.FaceDetectorYN.create(
    YUNET_MODEL,
    "",
    (320, 320)
)

# Face recognizer
recognizer = cv2.FaceRecognizerSF.create(
    SFACE_MODEL,
    ""
)


def get_face_embedding(image):
    """
    Detect a face in an image and return
    its SFace feature embedding.
    """

    if image is None:
        return None

    height, width = image.shape[:2]

    # YuNet needs the image size
    detector.setInputSize((width, height))

    # Detect faces
    _, faces = detector.detect(image)

    if faces is None or len(faces) == 0:
        return None

    # Use the first detected face
    face = faces[0]

    # Align/crop face for SFace
    aligned_face = recognizer.alignCrop(
        image,
        face
    )

    # Generate face feature
    feature = recognizer.feature(
        aligned_face
    )

    return feature


def compare_faces(feature1, feature2):
    """
    Compare two face embeddings using
    cosine similarity.
    """

    if feature1 is None or feature2 is None:
        return 0.0

    feature1 = np.asarray(
        feature1,
        dtype=np.float32
    )

    feature2 = np.asarray(
        feature2,
        dtype=np.float32
    )

    similarity = recognizer.match(
        feature1,
        feature2,
        cv2.FaceRecognizerSF_FR_COSINE
    )

    return float(similarity)