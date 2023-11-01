import pytest
from httpx import AsyncClient

from app.favorite.services import FavoriteService


async def test_get_favorite(auth_ac: AsyncClient):
    response = await auth_ac.get('/favorite')
    assert response.status_code == 200


@pytest.mark.parametrize(
    'item_id, is_item_in_favorite',
    [
        (1, True),
        (3, False),
    ],
)
async def test_item_in_favorite(item_id, is_item_in_favorite, auth_ac: AsyncClient):
    response = await auth_ac.get(
        '/favorite/item_in_favorite', params={'item_id': item_id}
    )
    assert response.status_code == 200
    assert response.json() == is_item_in_favorite


@pytest.mark.parametrize('item_id', [1, 2])
async def test_add_item_to_favorite(item_id, auth_ac: AsyncClient):
    response = await auth_ac.post(
        '/favorite/add_item', json={'item_id': item_id, 'count': 1}
    )
    assert response.status_code == 200
    assert await FavoriteService.find_item_model(1, item_id)


async def test_remove_item_from_favorite(auth_ac: AsyncClient):
    assert await FavoriteService.find_item_model(1, 1)
    response = await auth_ac.request(
        'DELETE', '/favorite/remove_item', json={'item_id': 1}
    )
    assert response.status_code == 200
    assert not (await FavoriteService.find_item_model(1, 1))
