from PIL import Image
import os


def resize_image(input_path, output_path, new_width, new_height):
    """Resize the image to the specified dimensions."""
    try:
        with Image.open(input_path) as img:
            resized_img = img.resize((new_width, new_height))
            resized_img.save(output_path)
            print(f"Image resized and saved to {output_path}")
    except Exception as e:
        print(f"Error resizing image: {e}")


def convert_image_format(input_path, output_path, new_format):
    """Convert the image to a different format."""
    try:
        with Image.open(input_path) as img:
            img.save(output_path, format=new_format.upper())
            print(f"Image converted to {new_format} and saved to {output_path}")
    except Exception as e:
        print(f"Error converting image format: {e}")


def rotate_image(input_path, output_path, degrees):
    """Rotate the image by the specified number of degrees."""
    try:
        with Image.open(input_path) as img:
            rotated_img = img.rotate(degrees, expand=True)
            rotated_img.save(output_path)
            print(f"Image rotated by {degrees} degrees and saved to {output_path}")
    except Exception as e:
        print(f"Error rotating image: {e}")


def main():
    while True:
        print("\nImage Tools Menu:")
        print("1. Resize Image")
        print("2. Convert Image Format")
        print("3. Rotate Image")
        print("4. Exit")
        choice = input("Enter your choice (1-4): ")

        if choice == '4':
            print("Exiting the program.")
            break

        if choice not in ['1', '2', '3']:
            print("Invalid choice, please choose a valid option.")
            continue

        input_path = input("Enter the path to the input image: ")
        if not os.path.exists(input_path):
            print("The specified file does not exist.")
            continue

        output_path = input("Enter the path for the output image: ")

        if choice == '1':
            width = int(input("Enter the new width: "))
            height = int(input("Enter the new height: "))
            resize_image(input_path, output_path, width, height)
        elif choice == '2':
            new_format = input("Enter the new image format (e.g., JPEG, PNG): ")
            convert_image_format(input_path, output_path, new_format)
        elif choice == '3':
            degrees = float(input("Enter the number of degrees to rotate the image: "))
            rotate_image(input_path, output_path, degrees)


if __name__ == "__main__":
    main()
