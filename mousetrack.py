import pyautogui
from datetime import datetime

while True:
    x, y = pyautogui.position()
    print(f"{datetime.now()} - Mouse Position: ({x}, {y})")
