from rest_framework.views import APIView
from rest_framework.response import Response
from ultralytics import YOLO
from PIL import Image
import io
import requests
import os
from decouple import config

model = YOLO('best_1.pt')

class PredictView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('image')
        if not file_obj:
            return Response({"error": "No image provided"})

        try:
            img = Image.open(io.BytesIO(file_obj.read()))
            results = model(img)

            detections = []
            for r in results:
                for box in r.boxes:
                    label = model.names[int(box.cls[0])]
                    if box.conf[0] > 0.4: 
                        detections.append(label)

            unique_ingredients = list(set(detections))
            return Response({"ingredients": unique_ingredients})

        except Exception as e:
            return Response({"error": str(e)})

SPOONACULAR_API_KEY = config("SPOONACULAR_API_KEY")

class PredictAndSuggestView(APIView):
    def post(self, request):
        file_obj = request.data.get('image')
        if not file_obj:
            return Response({"error": "No image provided"})

        try:
            img = Image.open(io.BytesIO(file_obj.read()))
            results = model(img)

            detections = []
            for r in results:
                for box in r.boxes:
                    label = model.names[int(box.cls[0])]
                    if box.conf[0] > 0.4:
                        detections.append(label)

            unique_ingredients = list(set(detections))

            if not unique_ingredients:
                return Response({"error": "No ingredients detected"})

            query = ",".join(unique_ingredients)
            url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={query}&number=5&apiKey={SPOONACULAR_API_KEY}"
            r = requests.get(url)
            recipes = r.json()

            return Response({
                "ingredients": unique_ingredients,
                "recipes": recipes
            })

        except Exception as e:
            return Response({"error": str(e)})



class RecipeDetailView(APIView):
    def get(self, request, recipe_id):
        try:
            url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?apiKey={SPOONACULAR_API_KEY}"
            r = requests.get(url)
            r.raise_for_status()
            data = r.json()

            # Extract steps (instructions)
            instructions = data.get("instructions")
            if not instructions and data.get("analyzedInstructions"):
                steps = []
                for instr in data["analyzedInstructions"]:
                    for step in instr.get("steps", []):
                        steps.append(step.get("step"))
                instructions = "\n".join(steps)

            return Response({
                "title": data.get("title"),
                "image": data.get("image"),
                "instructions": instructions,
                "sourceUrl": data.get("sourceUrl"),
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)