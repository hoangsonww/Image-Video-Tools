from moviepy.editor import VideoFileClip
import os


def remove_audio_from_video(input_path, output_path):
    """
    Removes the audio track from a video file.

    Args:
    input_path (str): Path to the input video file.
    output_path (str): Path to save the video file without audio.

    Returns:
    bool: True if the operation was successful, False otherwise.
    """
    try:
        # Load the video file
        print("Loading video...")
        video = VideoFileClip(input_path)
        print("Video loaded successfully.")

        # Remove audio
        print("Removing audio...")
        video_no_audio = video.without_audio()

        # Save the new video
        print("Saving the new video without audio...")
        video_no_audio.write_videofile(output_path, codec='libx264', audio_codec=None)
        print(f"Video saved without audio at {output_path}")

        # Close the video file to free up resources
        video.close()
        video_no_audio.close()
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def main():
    # Get user input for file paths
    input_video_path = input("Enter the path to the video file: ")
    output_video_path = input("Enter the path for the output video file: ")

    # Check if the input file exists
    if not os.path.exists(input_video_path):
        print("The specified input file does not exist. Please check the path and try again.")
        return

    # Remove audio from the video
    result = remove_audio_from_video(input_video_path, output_video_path)
    if result:
        print("Process completed successfully.")
    else:
        print("Process failed. Please check the error messages above for details.")


if __name__ == "__main__":
    main()
