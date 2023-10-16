from fastapi import APIRouter, Form, UploadFile, File, Depends

from app.shop.schemas import SAddCategory
from app.shop.services import ShopService, CategoryService
from app.users.dependecies import current_user
from app.users.models import Users

router = APIRouter(prefix='/admin', tags=['admin'])


@router.post('/add_item')
async def add_item(
        categories: list[str] = Form(...),
        title: str = Form(...),
        description: str = Form(...),
        price: int = Form(...),
        files: list[UploadFile] = File(...),
        user: Users = Depends(current_user)):
    categories = categories[0].split(',')
    try:
        for i, category in enumerate(categories):
            categories[i] = int(category)
    except Exception:
        return False

    return await ShopService.add_new_item(user, categories, files, title=title,
                                          description=description, price=price)


@router.delete('/delete_item')
async def delete_item(item_id: int = Form(...), user: Users = Depends(current_user)):
    if user.is_admin:
        await ShopService.delete_item(item_id)


@router.post('/add_category')
async def add_category(category: SAddCategory,
                       user: Users = Depends(current_user)):
    if user.is_admin:
        await CategoryService.add(name=category.name, parent=category.parent)


@router.delete('/delete_category')
async def delete_category(category_id: int = Form(...), user: Users = Depends(current_user)):
    if user.is_admin:
        await CategoryService.delete_by_id(category_id)
