from django.contrib import admin
from django.urls import path
from .views import PredictAndSuggestView, PredictView, RecipeDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('predict/', PredictView.as_view(), name='predict_api'),
    path("predict_and_suggest/", PredictAndSuggestView.as_view(), name="predict_and_suggest"),
    path('recipes/<int:recipe_id>/', RecipeDetailView.as_view(), name='recipe-detail'),
]