import pytest
from httpx import AsyncClient

from app.purchase.services import PurchaseService


async def test_get_cart(auth_ac: AsyncClient):
    response = await auth_ac.get('/purchase')
    assert response.status_code == 200


async def test_add_item_to_cart(auth_ac: AsyncClient):
    assert not (await PurchaseService.find_item_model(1, 2))
    response = await auth_ac.post('/purchase/add_item', json={
        'item_id': 2,
        'count': 1,
        'email': 'test@example.com',
        'name': 'NameTest',
        'second_name': 'SecondNameTest',
        'phone_number': 2345343,
        'price': 1000
    })
    assert response.status_code == 200
    item_purchase = await PurchaseService.find_item_model(1, 2)
    assert item_purchase
    assert item_purchase['count'] == 1
    assert item_purchase['email'] == 'test@example.com'
    assert item_purchase['name'] == 'NameTest'
    assert item_purchase['second_name'] == 'SecondNameTest'
    assert item_purchase['phone_number'] == 2345343
    assert item_purchase['price'] == 1000
