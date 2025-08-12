# Ingredient Detector & Recipe Finder

Assignment Note: The model is fine tuned to limited extent, it only has common ingredients like vegetables,fruits etc as for a more advanced model it would take a lot of time and memory, so I have only used specific image dataset to train. The model was fine tuned from google colab and a best_1.pt file has been added to the project root folder which contains the best custom model for the current project. Thank you


## What it can do?
1. Upload a picture of food
2. Figures out what ingredients are in the image(fine tuned using ingredient dataset from Kaggle)
3. Spoonacular API finds recipes which can be made with the ingredients list.  

## Tech Stack
- Backend: Django REST Framework, YOLOv8 (Ultralytics), Pillow  
- Frontend: React (with Axios for talking to the backend)  
- Additional API: Spoonacular (recipe database) - Used for generating quick recipe ideas from ingredients and added instructions for all recipes.

## How to Run Locally:
## Backend (Django + YOLO)
1.Clone the repo
2.cd image_ext
3.create a venv
4.pip install -r requirements.txt
5.use the '.env.example' file to create a .env file with the API keys.
6.python manage.py runserver

## Frontend (React)
1.cd recipe-frontend
2.use the '.env.example' file to add the BASE URL
3.npm start
