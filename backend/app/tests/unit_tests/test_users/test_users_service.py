import pytest
from sqlalchemy.exc import IntegrityError

from app.users.services import UserService


@pytest.mark.parametrize(
    'email, password',
    [
        ('test_email@mail.com', 'password1'),
        ('test@test.com', 'password123'),
    ],
)
async def test_add_user(email, password):
    count = len(await UserService.find_all())
    try:
        await UserService.add(email=email, hash_password=password)
        count += 1
    except IntegrityError:
        pass
    assert len(await UserService.find_all()) == count


@pytest.mark.parametrize(
    'user_id, email, exists',
    [
        (1, 'test@test.com', True),
        (2, 'test2@test.com', True),
        (999, 'notuser@test.com', False),
    ],
)
async def test_get_user_by_id(user_id, email, exists):
    user = await UserService.get_user_by_id(user_id)
    if exists:
        assert user.id == user_id
        assert user.email == email
    else:
        assert not user


@pytest.mark.parametrize(
    'user_id, name, second_name, number_phone',
    [
        (1, 'TestName', 'TestSecondName', 897897),
        (1, None, 'TestSecondName', 897897),
        (1, 'TestName', None, 897897),
        (1, 'TestName', 'TestSecondName', None),
        (1, None, 'TestSecondName', None),
    ],
)
async def test_update_user_profile(user_id, name, second_name, number_phone):
    data = {}
    if name:
        data['name'] = name
    if second_name:
        data['second_name'] = second_name
    if number_phone:
        data['number_phone'] = number_phone

    await UserService.update_user_profile(user_id, **data)
    user_profile = await UserService.get_user_profile_by_id(user_id)

    if name:
        assert user_profile['name'] == name
    if second_name:
        assert user_profile['second_name'] == second_name
    if number_phone:
        assert user_profile['number_phone'] == number_phone
