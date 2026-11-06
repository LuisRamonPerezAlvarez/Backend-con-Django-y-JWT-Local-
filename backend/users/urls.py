from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import UserApiViewSet, UserView

router = routers.DefaultRouter()
router.register(r'users', UserApiViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/me/', UserView.as_view(), name='auth_me'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

