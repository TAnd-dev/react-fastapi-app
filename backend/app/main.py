import sentry_sdk
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_pagination import add_pagination
from redis import asyncio as aioredis
from sqladmin import Admin
from starlette.middleware.cors import CORSMiddleware

from app.admin.auth import authentication_backend
from app.admin.router import router as admin_router
from app.admin.views import (CartAdmin, CategoryAdmin, FavoriteAdmin,
                             ImageAdmin, ItemAdmin, ProfileAdmin,
                             PurchaseAdmin, ReviewAdmin, UserAdmin)
from app.cart.router import router as card_router
from app.config import settings
from app.database import engine
from app.favorite.router import router as favorite_router
from app.purchase.router import router as purchase_router
from app.shop.router import router as shop_router
from app.users.router import router as user_router

app = FastAPI()
app.include_router(user_router)
app.include_router(shop_router)
app.include_router(card_router)
app.include_router(favorite_router)
app.include_router(purchase_router)
app.include_router(admin_router)

sentry_sdk.init(
    dsn="https://a3032a5bbbfc7606584207766a1e128f@o4506150343081984.ingest.sentry.io/4506150345965568",
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

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
    allow_headers=[
        'Content-Type',
        'Set-Cookie',
        'Access-Control-Allow-Header',
        'Access-Control-Allow-Origin',
        'Authorization',
    ],
)

app.mount('/static', StaticFiles(directory='app/static'), name='static')
add_pagination(app)


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
