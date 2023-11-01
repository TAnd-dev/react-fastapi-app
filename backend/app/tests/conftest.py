import asyncio
import json

import pytest
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from httpx import AsyncClient
from redis import asyncio as aioredis
from sqlalchemy import insert

from app.cart.models import Carts, cart_item
from app.config import settings
from app.database import Base, async_session_maker, engine
from app.favorite.models import Favorites, favorites_item_user
from app.image.models import Images
from app.main import app as fastapi_app
from app.purchase.models import Purchases
from app.purchase.models import purchase_item_user as purchase_item_user_model
from app.shop.models import Categories, Items, Reviews, item_category
from app.shop.models import item_image as item_image_model
from app.users.models import Profiles, Users


@pytest.fixture(scope='session', autouse=True)
async def prepare_database():
    assert settings.MODE == 'TEST'

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    def open_mock_json(model: str):
        with open(f'app/tests/mock_{model}.json') as file:
            return json.load(file)

    images = open_mock_json('images')
    categories = open_mock_json('categories')
    items = open_mock_json('items')
    category_item = open_mock_json('category_item')
    item_image = open_mock_json('item_image')
    users = open_mock_json('users')
    profiles = open_mock_json('profiles')
    carts = open_mock_json('carts')
    favorites = open_mock_json('favorites')
    purchases = open_mock_json('purchases')
    reviews = open_mock_json('reviews')
    cart_item_user = open_mock_json('cart_item_user')
    favorite_item_user = open_mock_json('favorite_item_user')
    purchase_item_user = open_mock_json('purchase_item_user')

    async with async_session_maker() as session:
        add_images = insert(Images).values(images)
        add_categories = insert(Categories).values(categories)
        add_items = insert(Items).values(items)
        add_category_item = insert(item_category).values(category_item)
        add_item_image = insert(item_image_model).values(item_image)
        add_users = insert(Users).values(users)
        add_profiles = insert(Profiles).values(profiles)
        add_carts = insert(Carts).values(carts)
        add_favorites = insert(Favorites).values(favorites)
        add_purchases = insert(Purchases).values(purchases)
        add_reviews = insert(Reviews).values(reviews)
        add_cart_item_user = insert(cart_item).values(cart_item_user)
        add_favorite_item = insert(favorites_item_user).values(favorite_item_user)
        add_purchase_item_user = insert(purchase_item_user_model).values(purchase_item_user)

        await session.execute(add_images)
        await session.execute(add_categories)
        await session.execute(add_items)
        await session.execute(add_category_item)
        await session.execute(add_item_image)
        await session.execute(add_users)
        await session.execute(add_profiles)
        await session.execute(add_carts)
        await session.execute(add_favorites)
        await session.execute(add_purchases)
        await session.execute(add_reviews)
        await session.execute(add_cart_item_user)
        await session.execute(add_favorite_item)
        await session.execute(add_purchase_item_user)

        await session.commit()


@pytest.fixture(scope='session')
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope='function')
async def ac():
    redis = aioredis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}")
    FastAPICache.init(RedisBackend(redis), prefix="cache")
    async with AsyncClient(app=fastapi_app, base_url='http://test') as ac:
        yield ac


@pytest.fixture(scope='session')
async def auth_ac():
    redis = aioredis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}")
    FastAPICache.init(RedisBackend(redis), prefix="cache")
    async with AsyncClient(app=fastapi_app, base_url='http://test') as ac:
        await ac.post('user/auth/login', json={
            'email': 'test@test.com',
            'password': 'test',
        })
        assert ac.cookies['auth_token']
        yield ac
