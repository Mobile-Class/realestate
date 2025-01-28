import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy.ndimage import gaussian_filter
from PIL import Image

# File paths
csv_file_path = "mouse_data_show.csv"  # Replace with your mouse data CSV file
screenshot_path = "detail.png"  # Replace with your webpage screenshot path

# Canvas dimensions
canvas_width = 1920
canvas_height = 1080
y_offset = -150  # Adjust Y-coordinates by this value
x_offset = -90  # Adjust Y-coordinates by this value

# Function to create heatmap
def generate_heatmap(data, width, height, y_offset, x_offset):
    """
    Generates a heatmap from mouse positions on a canvas of given dimensions with a Y-offset correction.
    """
    heatmap = np.zeros((height, width))
    for x, y in zip(data["x"], data["y"]):
        adjusted_y = y - y_offset  # Apply Y-offset
        adjusted_x = x - x_offset
        if 0 <= adjusted_x < width and 0 <= adjusted_y < height:
            heatmap[adjusted_y, adjusted_x] += 1
    return gaussian_filter(heatmap, sigma=15)  # Apply Gaussian blur for smoothness

# Function to preprocess and split data sections
def preprocess_csv(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()

    # Extract canvas dimensions
    canvas_dims = lines[1].strip().split(',')
    
    # Split the sections for movements and clicks
    movement_start = lines.index("Mouse Movements\n") + 1
    click_start = lines.index("Mouse Clicks\n") + 1

    # Read movement data
    movement_data_lines = [
        line.strip().split(',') for line in lines[movement_start:click_start - 1] if line.strip()
    ]
    movement_data = pd.DataFrame(movement_data_lines, columns=["x", "y", "time"]).astype({
        "x": int, "y": int, "time": int
    })

    # Read click data
    click_data_lines = [
        line.strip().split(',') for line in lines[click_start:] if line.strip()
    ]
    click_data = pd.DataFrame(click_data_lines, columns=["x", "y", "time"]).astype({
        "x": int, "y": int, "time": int
    })

    return movement_data, click_data

# Preprocess the CSV
try:
    movement_data, click_data = preprocess_csv(csv_file_path)
except Exception as e:
    print(f"Error processing CSV file: {e}")
    exit()

# Load the webpage screenshot
try:
    screenshot = Image.open(screenshot_path)
    screenshot_width, screenshot_height = screenshot.size

except Exception as e:
    print(f"Error loading screenshot: {e}")
    exit()

# Generate heatmaps
movement_heatmap = generate_heatmap(movement_data, canvas_width, canvas_height, y_offset, x_offset)
click_heatmap = generate_heatmap(click_data, canvas_width, canvas_height, y_offset, x_offset)

# Normalize the heatmaps (avoid division by zero)
if np.max(movement_heatmap) > 0:
    movement_heatmap = movement_heatmap / np.max(movement_heatmap)
else:
    print("Warning: Movement heatmap is empty.")

if np.max(click_heatmap) > 0:
    click_heatmap = click_heatmap / np.max(click_heatmap)
else:
    print("Warning: Click heatmap is empty.")

# Plot combined heatmap
plt.figure(figsize=(12, 8))
plt.imshow(screenshot, extent=[0, canvas_width, canvas_height, 0])

# Overlay mouse movement heatmap (in red)
plt.imshow(movement_heatmap, cmap='Reds', alpha=0.5, interpolation='nearest', extent=[0, canvas_width, canvas_height, 0])

# Overlay mouse click heatmap (in blue)
plt.imshow(click_heatmap, cmap='Blues', alpha=0.5, interpolation='nearest', extent=[0, canvas_width, canvas_height, 0])

plt.colorbar(label='Intensity')
plt.title("Mouse Movement and Click Heatmap Overlay")
plt.xlabel("Width")
plt.ylabel("Height")
plt.show()
