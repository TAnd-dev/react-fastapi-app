import pytest

from app.shop.services import ReviewService


@pytest.mark.parametrize(
    'item_id, is_exists',
    [
        (1, True),
        (2, True),
        (3, False),
    ],
)
async def test_find_all_reviews(item_id, is_exists):
    reviews = await ReviewService.find_all_reviews(item_id)
    assert bool(reviews) is is_exists


@pytest.mark.parametrize(
    'item_id, user_id, text, rate',
    [
        (1, 1, 'Test Review', 5),
        (1, 2, 'Test Review 2', 1),
        (1, 999, 'Test Review 3', 3),
        (999, 1, 'Test Review 4', 3),
        (1, 1, 'Test Review 5', 6),
        (1, 1, 'Test Review 5', 0),
    ],
)
async def test_add_review(item_id, user_id, text, rate):
    current_count = len(await ReviewService.find_all_reviews(item_id))
    new_review = await ReviewService.add(item_id=item_id, user_id=user_id, text=text, rate=rate)
    current_count = current_count + 1 if new_review else current_count
    reviews = await ReviewService.find_all_reviews(item_id)
    assert len(reviews) == current_count
