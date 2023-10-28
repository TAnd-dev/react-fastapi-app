import pytest
from sqlalchemy.exc import IntegrityError

from app.shop.services import CategoryService, ShopService


async def test_find_all_categories():
    categories = await CategoryService.find_all()
    assert categories[0].name == 'Household Appliances'
    assert categories[1].name == 'Computers'
    assert categories[2].name == 'Smartphones'


@pytest.mark.parametrize('name, parent', [
    ('test category 1', None),
    ('test category 2', 1)
])
async def test_add_category(name, parent):
    num_of_categories = len(await CategoryService.find_all())
    category = await CategoryService.add(name=name, parent=parent)
    assert category.name == name
    assert category.parent == parent
    assert num_of_categories + 1 == len(await CategoryService.find_all())


@pytest.mark.parametrize('item_id, category_id, is_added', [
    (1, 1, True),
    (1, 2, False),
    (1, 999, False),
    (999, 1, False),
])
async def test_add_category_for_item(item_id, category_id, is_added):
    try:
        await CategoryService.add_category_for_item(item_id=item_id, category_id=category_id)

        item = await ShopService.find_by_id(item_id)
        category = await CategoryService.find_by_id(category_id)
        category_in_item = any([category_item.id == category.id for category_item in item['categories']])
        assert category_in_item

    except IntegrityError:
        assert is_added is False
    except Exception:
        assert False


@pytest.mark.parametrize('category_id, is_deleted', [
    (5, True),
    (99, False)
])
async def test_delete_by_id(category_id, is_deleted):
    num_of_categories = len(await CategoryService.find_all())
    await CategoryService.delete_by_id(category_id)
    num_of_categories = num_of_categories - 1 if is_deleted else num_of_categories
    assert num_of_categories == len(await CategoryService.find_all())


@pytest.mark.parametrize('item_id, is_deleted', [
    (1, True),
    (999, False)
])
async def test_delete_category_by_item_id(item_id, is_deleted):
    await CategoryService.delete_category_by_item_id(item_id)
    if is_deleted:
        assert len((await ShopService.find_by_id(item_id))['categories']) == 0
    else:
        assert not (await ShopService.find_by_id(item_id))