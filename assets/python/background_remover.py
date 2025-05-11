from rembg import remove
from PIL import Image


def remove_bg(input_path, output_path):
    """Removes the background from an image and saves the result."""

    try:
        input_img = Image.open(input_path)
        output_img = remove(input_img)
        output_img.save(output_path)
        print(f"Background removed successfully! Saved to {output_path}")
    except FileNotFoundError:
        print(f"Error: File not found at {input_path}")
    except Exception as e:
        print(f"An error occurred: {e}")


def main():
    input_path = input("Enter the path to your image: ")
    output_choice = input("Do you want to specify the output path? (y/n): ")

    if output_choice.lower() == 'y':
        output_path = input("Enter the desired output path: ")
    else:
        output_path = "removed_bg.png"  # Default output name

    remove_bg(input_path, output_path)


if __name__ == "__main__":
    main()
