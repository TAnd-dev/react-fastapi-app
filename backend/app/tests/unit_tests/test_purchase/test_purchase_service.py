import pytest

from app.purchase.services import PurchaseService


@pytest.mark.parametrize('user_id', [1, 2, 999, ])
async def test_find_purchase_by_user_id(user_id):
    purchase = await PurchaseService.find_model_by_user_id(user_id)
    if purchase:
        assert purchase[0]['related_id'] == user_id


@pytest.mark.parametrize(
    'related_id, item_id',
    [
        (1, 2),
        (2, 2),
        (1, 1),
    ],
)
async def test_add_item(related_id, item_id):
    count = len(await PurchaseService.find_model_by_user_id(related_id)) + 1

    await PurchaseService.add_item(
        related_id=related_id,
        item_id=item_id,
        count=1,
        price=999,
        email='email@email.com',
        name='Name',
        second_name='Second Name',
        phone_number=789456,
    )

    purchase = await PurchaseService.find_model_by_user_id(related_id)
    assert len(purchase) == count
