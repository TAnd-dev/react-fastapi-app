import pytest

from app.favorite.services import FavoriteService


@pytest.mark.parametrize('user_id', [
    1, 2, 999,
])
async def test_find_favorite_by_user_id(user_id):
    favorite = await FavoriteService.find_model_by_user_id(user_id)
    if favorite:
        assert favorite[0]['related_id'] == user_id


@pytest.mark.parametrize('related_id, item_id', [
    (1, 2),
    (2, 2),
    (1, 1),
])
async def test_add_item(related_id, item_id):
    await FavoriteService.add_item(related_id=related_id, item_id=item_id)
    favorite = await FavoriteService.find_item_model(related_id, item_id)
    assert favorite


@pytest.mark.parametrize('related_id, item_id', [
    (1, 1),
    (1, 2),
    (3, 1),
])
async def test_remove_item_from_cart(related_id, item_id):
    current_count = len(await FavoriteService.find_model_by_user_id(related_id))
    await FavoriteService.remove_item_from_model(related_id, item_id)
    if current_count != 0:
        current_count -= 1
    assert len(await FavoriteService.find_model_by_user_id(related_id)) == current_count
