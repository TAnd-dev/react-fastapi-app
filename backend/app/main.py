from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from app.users.router import router as user_router
from app.shop.router import router as shop_router
from app.cart.router import router as card_router
from app.favorite.router import router as favorite_router
from app.purchase.router import router as purchase_router
from app.admin.router import router as admin_router

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
