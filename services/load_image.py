import cv2
import numpy as np
from fastapi import UploadFile
from typing import Tuple

async def load_image(
    image_file: UploadFile, 
    target_size: Tuple[int, int] = (224, 224),
    is_grayscale: bool = False
) -> np.ndarray:
    """
    Universal image loader for medical imaging (Brain Tumor/Alzheimer's MRI)
    
    Args:
        image_file: FastAPI UploadFile object
        target_size: Output dimensions (height, width)
        is_grayscale: Set True for grayscale MRI (typical for brain scans)
        
    Returns:
        Preprocessed image with shape (1, H, W, C) ready for model prediction
    
    Raises:
        ValueError: If image processing fails
    """
    try:
        # Read and decode image
        contents = await image_file.read()
        nparr = np.frombuffer(contents, np.uint8)
        
        # Handle both color and grayscale MRI scans
        color_flag = cv2.IMREAD_GRAYSCALE if is_grayscale else cv2.IMREAD_COLOR
        image = cv2.imdecode(nparr, color_flag)
        
        if image is None:
            raise ValueError("Invalid image file or format")
            
        # Convert grayscale to 3-channel if needed (for models expecting RGB)
        if is_grayscale:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        
        # Resize and normalize
        image = cv2.resize(image, target_size)
        image = image.astype("float32") / 255.0
        
        # Add batch dimension
        return np.expand_dims(image, axis=0)
        
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")