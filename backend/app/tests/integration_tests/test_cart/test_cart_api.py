import pytest
from httpx import AsyncClient

from app.cart.services import CartService


async def test_get_cart(auth_ac: AsyncClient):
    response = await auth_ac.get('/cart')
    assert response.status_code == 200


@pytest.mark.parametrize(
    'item_id, is_item_in_cart',
    [
        (1, True),
        (3, False),
    ],
)
async def test_item_in_cart(item_id, is_item_in_cart, auth_ac: AsyncClient):
    response = await auth_ac.get('/cart/item_in_cart', params={'item_id': item_id})
    assert response.status_code == 200
    assert response.json() == is_item_in_cart


@pytest.mark.parametrize('item_id', [1, 2])
async def test_add_item_to_cart(item_id, auth_ac: AsyncClient):
    response = await auth_ac.post(
        '/cart/add_item', json={'item_id': item_id, 'count': 1}
    )
    assert response.status_code == 200
    assert await CartService.find_item_model(1, item_id)


@pytest.mark.parametrize(
    'item_id, count, is_exists',
    [
        (1, 10, True),
        (2, 10, True),
        (345, 10, False),
    ],
)
async def test_set_item_count_cart(item_id, count, is_exists, auth_ac: AsyncClient):
    response = await auth_ac.patch(
        '/cart/set_count', json={'item_id': item_id, 'count': count}
    )
    assert response.status_code == 200
    item_cart = await CartService.find_item_model(1, item_id)
    if is_exists:
        assert item_cart['count'] == count
    else:
        assert not item_cart


async def test_remove_item_from_cart(auth_ac: AsyncClient):
    assert await CartService.find_item_model(1, 1)
    response = await auth_ac.request('DELETE', '/cart/remove_item', json={'item_id': 1})
    assert response.status_code == 200
    assert not (await CartService.find_item_model(1, 1))
