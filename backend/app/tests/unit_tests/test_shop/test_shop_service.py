import pytest
from sqlalchemy.exc import IntegrityError

from app.shop.schemas import SortItems
from app.shop.services import ShopService


@pytest.mark.parametrize(
    'sort, first_item',
    [
        (SortItems('', '0', '99999', ''), 'Test Item 1'),
        (SortItems('', '600', '99999', ''), 'Test Item 1'),
        (SortItems('', '0', '600', ''), 'Test Item 2'),
        (SortItems('', '0', '99999', '1'), 'Test Item 1'),
        (SortItems('', '0', '100', ''), ''),
    ],
)
async def test_find_all_items(sort, first_item):
    items = await ShopService.find_all_items(sort)
    if items:
        assert items[0]['title'] == first_item


@pytest.mark.parametrize(
    'search_text, count',
    [
        ('Test Item', 2),
        ('Test Item 1', 1),
        ('Test Item 2', 1),
        ('Test Item 3', 0),
    ],
)
async def test_find_brief_items(search_text, count):
    brief_items = await ShopService.find_brief_items(search_text)
    assert len(brief_items) == count


@pytest.mark.parametrize(
    'item_id, is_exists',
    [
        (1, True),
        (2, True),
        (999, False),
    ],
)
async def test_find_item_by_id(item_id, is_exists):
    item = await ShopService.find_by_id(item_id)
    if is_exists:
        assert item['id'] == item_id
    else:
        assert not item


@pytest.mark.parametrize(
    'title, description, price, is_added',
    [
        ('test add item 1', 'description test item 1', 999, True),
        ('test add item 2', 'description test item 2', 0, False),
    ],
)
async def test_add_item(title, description, price, is_added):
    num_of_items = len(await ShopService.find_all_items(SortItems()))
    await ShopService.add(title=title, description=description, price=price)
    num_of_items = num_of_items + 1 if is_added else num_of_items
    assert num_of_items == len(await ShopService.find_all_items(SortItems()))


@pytest.mark.parametrize(
    'item_id, is_deleted',
    [
        (2, True),
        (987, False),
    ],
)
async def test_delete_item(item_id, is_deleted):
    num_of_items = len(await ShopService.find_all_items(SortItems()))
    await ShopService.delete_item(item_id)
    num_of_items = num_of_items - 1 if is_deleted else num_of_items
    assert num_of_items == len(await ShopService.find_all_items(SortItems()))
