# Image & Video Tools: Unleash the Power of Media

📸 Welcome to the Image & Video Tools application. This application provides a **lightweight** and **comprehensive** suite of tools for manipulating images and videos directly in your browser. Below you will find detailed instructions on how to use each tool and information on the available features.

This application is current live [here](https://hoangsonww.github.io/Image-Video-Tools/). Let our tools transform your images & videos! 📸

## Table of Contents

1. [User Interface](#user-interface)
2. [Introduction](#introduction)
3. [Features](#features)
    - [Image Resizer](#image-resizer)
    - [Image Cropper](#image-cropper)
    - [Image Rotator](#image-rotator)
    - [Image Filters](#image-filters)
    - [Image Converter](#image-converter)
    - [Image Watermarker](#image-watermarker)
    - [Image Background Remover](#image-background-remover)
    - [Thumbnail Generator](#thumbnail-generator)
    - [Sound Remover](#sound-remover)
    - [Dark Mode](#dark-mode)
4. [Installation](#installation)
5. [Usage](#usage)
    - [General Instructions](#general-instructions)
    - [Tool-Specific Instructions](#tool-specific-instructions)
6. [Python Implementation](#python-implementation)
7. [Contributing](#contributing)
8. [License](#license)

## User Interface

<p align="center">
   <a href="https://hoangsonww.github.io/Image-Video-Tools/">
      <img src="../assets/UI.png" alt="Image & Video Tools User Interface" width="100%" style="border-radius: 8px">
   </a>
</p>

## Introduction

This web application offers a variety of tools for editing and manipulating images and videos. Each tool is designed to be user-friendly and efficient, providing a seamless experience for performing common media editing tasks.

## Features

### Image Resizer

Resize images to specific dimensions while optionally maintaining the aspect ratio.

### Image Cropper

Crop images by selecting a rectangular area. The area outside the selection is darkened for better visibility.

### Image Rotator

Rotate images in 90-degree increments. The current rotation angle is displayed, and the user can download the rotated image.

### Image Filters

Apply various filters to images such as grayscale, sepia, invert, brightness, contrast, blur, saturate, and hue-rotate.

### Image Background Remover

Remove the background from images using a pre-trained machine learning model. The user can download the image with the background removed.

### Image Converter

Convert images between different formats such as PNG, JPEG, BMP, GIF, WEBP, and TIFF.

### Image Watermarker

Add a text watermark to images with customizable text, font size, color, and position.

### Thumbnail Generator

Generate 20 random thumbnails from a video or capture a thumbnail at a specific timestamp. Users can select and download their preferred thumbnail.

### Sound Remover

Remove audio from videos and download the silent version.

### Dark Mode

Toggle between light and dark modes using a button with a moon icon. The user's preference is stored in local storage and applied on subsequent visits.

## Installation

To install and run this application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/image-video-tools.git
   ```

2. Navigate to the project directory:
   ```bash
   cd image-video-tools
   ```

3. Open `index.html` in your preferred web browser.

## Usage

### General Instructions

1. Open the application in your web browser.
2. Use the navigation bar to select the desired tool.
3. Follow the specific instructions for each tool as outlined below.

### Tool-Specific Instructions

#### Image Resizer

1. Choose an image by clicking the "Choose an image to resize" input.
2. Select the desired width and height. Check "Maintain Aspect Ratio" if you want to preserve the original aspect ratio.
3. Click "Resize Image" to resize the image.
4. View the live preview and download the resized image if needed.

#### Image Cropper

1. Choose an image by clicking the "Choose an image to crop" input.
2. Drag to select the area to crop.
3. Click "Crop Image" to crop the image.
4. View the live preview and download the cropped image if needed.

#### Image Rotator

1. Choose an image by clicking the "Choose an image to rotate" input.
2. Click "Rotate Image" to rotate the image by 90 degrees.
3. Click "Download Rotated Image" to download the rotated image.

#### Image Filters

1. Choose an image by clicking the "Choose an image to apply filters" input.
2. Select the desired filter from the list of buttons.
3. View the live preview with the applied filter.
4. Click "Download Filtered Image" to download the filtered image.

#### Image Converter

1. Choose an image by clicking the "Choose an image to convert" input.
2. Select the desired format by clicking one of the "Convert to..." buttons.
3. Click "Download Converted Image" to download the image in the selected format.

#### Image Watermarker

1. Choose an image by clicking the "Choose an image to watermark" input.
2. Enter the watermark text.
3. Adjust the font size, color, and position (X and Y coordinates) of the watermark.
4. Click "Add Watermark" to apply the watermark.
5. View the live preview and click "Download Watermarked Image" to download the watermarked image.

#### Image Background Remover

1. Choose an image by clicking the "Choose an image to remove background" input.
2. Click "Remove Background" to process the image. It may take some time depending on the image size.
3. Click "Download Image" to download the image with the background removed.

#### Thumbnail Generator

1. Choose a video by clicking the "Choose a video" input.
2. Click "Generate 20 Thumbnails" to generate random thumbnails.
3. Enter a specific timestamp and click "Capture Thumbnail" to generate a thumbnail at that time.
4. Select a preferred thumbnail from the preview section.
5. Click "Download Thumbnail" to download the selected thumbnail.

#### Sound Remover

1. Choose a video by clicking the "Choose a video to remove sound" input.
2. Click "Remove Sound" to process the video. It may take some time depending on the video length.
3. Click "Download Video" to download the video without sound.

### Dark Mode

1. Click the moon icon button to toggle between light and dark modes.
2. Your preference will be saved and applied on future visits.

## Python Implementation

There are also Python implementations of some of the tools available in this application. You can find them in the `python` directory. The following tools are available:

1. [Background Remover](../src/python/background_remover.py)
2. [Image Resizer, Rotator, & Cropper](../src/python/image_tools.py)
3. [Audio Remover](../src/python/remove_audio_from_video.py)
4. [Thumbnail Generator](../src/python/thumbnail.py)

Feel free to run these scripts locally on your machine to perform the desired tasks!

## Contributing

We welcome contributions to improve this application. Please follow these steps:

1. Fork the repository or clone it locally:
   ```bash
   git clone https://github.com/hoangsonww/Image-Video-Tools.git
   ```
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request on GitHub if you would like to propose your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details. 

**NOTE: Direct copying of this project is not prohibited for any purpose.** 

I have spent a lot of time and effort to create this project, so I would appreciate it if you do not copy it directly. So, feel free to fork and contribute to this project.

## Contact

If you have any questions, feedback, or concerns, please feel free to [contact me](https://github.com/hoangsonww). I'll be happy to help!

---

Created with ❤️ by [Son Nguyen](https://github.com/hoangsonww) in 2024. Thank you for visiting us today! 🚀
