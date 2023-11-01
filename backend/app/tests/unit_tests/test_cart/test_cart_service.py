import pytest

from app.cart.services import CartService


@pytest.mark.parametrize('user_id', [1, 2, 999])
async def test_find_cart_by_user_id(user_id):
    cart = await CartService.find_model_by_user_id(user_id)
    if cart:
        assert cart[0]['related_id'] == user_id


@pytest.mark.parametrize(
    'related_id, item_id, count, is_added',
    [
        (2, 1, 1, True),
        (1, 1, 1, False),
    ],
)
async def test_add_item(related_id, item_id, count, is_added):
    await CartService.add_item(related_id=related_id, item_id=item_id, count=count)
    cart = await CartService.find_item_model(related_id, item_id)
    assert cart


@pytest.mark.parametrize(
    'related_id, item_id, count',
    [
        (1, 1, 5),
        (1, 2, 4),
    ],
)
async def test_set_count_item(related_id, item_id, count):
    await CartService.set_count_items(related_id, item_id, count=count)
    item_cart = await CartService.find_item_model(related_id, item_id)
    if item_cart:
        assert item_cart['count'] == count


@pytest.mark.parametrize('related_id, item_id', [
    (1, 1),
    (1, 2),
    (3, 1),
])
async def test_remove_item_from_cart(related_id, item_id):
    current_count = len(await CartService.find_model_by_user_id(related_id))
    await CartService.remove_item_from_model(related_id, item_id)
    if current_count != 0:
        current_count -= 1
    assert len(await CartService.find_model_by_user_id(related_id)) == current_count
