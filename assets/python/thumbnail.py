from moviepy.editor import VideoFileClip
import os


def generate_thumbnail(video_path, times, output_folder, img_format='jpeg'):
    """
    Generates thumbnails from a video at specified times.

    Args:
    video_path (str): Path to the video file.
    times (list of float): List of times (in seconds) to capture the thumbnails.
    output_folder (str): Directory to save the thumbnail images.
    img_format (str): Image format for saving thumbnails (default is 'jpeg').
    """
    try:
        # Ensure output directory exists
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        with VideoFileClip(video_path) as video:
            for i, time in enumerate(times):
                # Generate thumbnail for each specified time
                frame = video.get_frame(time)
                output_path = os.path.join(output_folder, f"thumbnail_{i + 1}.{img_format}")
                Image.fromarray(frame).save(output_path)
                print(f"Thumbnail saved at {output_path}")
    except Exception as e:
        print(f"An error occurred while generating thumbnails: {e}")


def main():
    video_path = input("Enter the path to the video file: ")
    if not os.path.isfile(video_path):
        print("File does not exist. Please check the path and try again.")
        return

    try:
        times_input = input("Enter the times to capture thumbnails (in seconds, separated by commas): ")
        times = [float(time.strip()) for time in times_input.split(',')]
    except ValueError:
        print("Invalid input for times. Please enter valid numbers separated by commas.")
        return

    output_folder = input("Enter the output directory for thumbnails: ")
    img_format = input("Enter the image format for thumbnails (e.g., jpeg, png): ")

    generate_thumbnail(video_path, times, output_folder, img_format)


if __name__ == "__main__":
    main()
