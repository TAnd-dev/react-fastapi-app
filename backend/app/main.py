from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from backend.app.users.router import router as user_router
from backend.app.shop.router import router as shop_router

app = FastAPI()
app.include_router(user_router)
app.include_router(shop_router)

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
