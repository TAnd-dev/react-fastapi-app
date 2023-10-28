from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin
from starlette.middleware.cors import CORSMiddleware

from app.admin.auth import authentication_backend
from app.admin.views import UserAdmin, ItemAdmin, ProfileAdmin, ReviewAdmin, CategoryAdmin, ImageAdmin, CartAdmin, \
    FavoriteAdmin, PurchaseAdmin
from app.config import settings
from app.database import engine
from app.users.router import router as user_router
from app.shop.router import router as shop_router
from app.cart.router import router as card_router
from app.favorite.router import router as favorite_router
from app.purchase.router import router as purchase_router
from app.admin.router import router as admin_router

from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

app = FastAPI()
app.include_router(user_router)
app.include_router(shop_router)
app.include_router(card_router)
app.include_router(favorite_router)
app.include_router(purchase_router)
app.include_router(admin_router)

origins = [
    'http://localhost:3000',
    'http://localhost:7304',
    'http://127.0.0.1:7304',
    'http://127.0.0.1:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH', 'PUT'],
    allow_headers=['Content-Type', 'Set-Cookie', 'Access-Control-Allow-Header', 'Access-Control-Allow-Origin',
                   'Authorization']
)

app.mount('/static', StaticFiles(directory='app/static'), name='static')


@app.on_event("startup")
def startup():
    redis = aioredis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}")
    FastAPICache.init(RedisBackend(redis), prefix="cache")


admin = Admin(app, engine, authentication_backend=authentication_backend)

admin.add_view(UserAdmin)
admin.add_view(ProfileAdmin)
admin.add_view(ItemAdmin)
admin.add_view(ReviewAdmin)
admin.add_view(CategoryAdmin)
admin.add_view(ImageAdmin)
admin.add_view(CartAdmin)
admin.add_view(FavoriteAdmin)
admin.add_view(PurchaseAdmin)