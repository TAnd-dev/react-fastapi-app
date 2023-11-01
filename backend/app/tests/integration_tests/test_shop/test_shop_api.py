import pytest
from httpx import AsyncClient
from redis import asyncio as aioredis

from app.config import settings


async def test_get_items(ac: AsyncClient):
    response = await ac.get('/shop')
    assert response.status_code == 200


@pytest.mark.parametrize(
    'search_text, count',
    [
        ('Test Item 1', 1),
        ('Test Item', 2),
        ('Non-existent', 0),
    ],
)
async def test_get_brief_items(search_text, count, ac: AsyncClient):
    response = await ac.get('/shop/brief_items', params={'search_text': search_text})
    assert response.status_code == 200
    assert len(response.json()) == count


@pytest.mark.parametrize(
    'item_id, is_exists',
    [
        (1, True),
        (112, False),
    ],
)
async def test_get_item(item_id, is_exists, ac: AsyncClient):
    response = await ac.get(f'/shop/item/{item_id}')
    assert response.status_code == 200
    assert is_exists is bool(response.json())


async def test_get_categories(ac: AsyncClient):
    redis = aioredis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}")
    response = await ac.get('/shop/categories')
    assert response.status_code == 200
    assert response.json()[0]['name'] == 'Household Appliances'
    assert await redis.get('cache::e45c0b601bebb95b36c3729d27c569db')


async def test_get_reviews(ac: AsyncClient):
    response = await ac.get('/shop/item/1/reviews')
    assert response.status_code == 200
    assert len(response.json()['items']) == 2


@pytest.mark.parametrize(
    'client, rate, status_code',
    [
        ('auth_cl', 5, 200),
        ('auth_cl', 6, 422),
        ('auth_cl', 0, 422),
        ('cl', 5, 401),
    ],
)
async def test_add_review(
    client, rate, status_code, ac: AsyncClient, auth_ac: AsyncClient
):
    async_client = ac if client == 'cl' else auth_ac
    response = await async_client.post(
        '/shop/item/1/add_review', json={'text': 'Added review with test', 'rate': rate}
    )
    assert response.status_code == status_code
