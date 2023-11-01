import pytest
from httpx import AsyncClient

from app.users.services import UserService


@pytest.mark.parametrize(
    'email, password1, password2, status_code, user_id',
    [
        ('user@test.com', 'testtest', 'testtest', 200, 4),
        ('user@test.com', 'testtest1', 'testtest1', 409, 0),
        ('user1@test.com', 'testtest', 'testtest1', 409, 0),
        ('user1', 'testtest1', 'testtest1', 422, 0),
    ],
)
async def test_register_user(
    email, password1, password2, status_code, user_id, ac: AsyncClient
):
    response = await ac.post(
        '/user/auth/register',
        json={
            'email': email,
            'password1': password1,
            'password2': password2,
        },
    )

    assert response.status_code == status_code

    if status_code == 200:
        user = await UserService.get_user_profile_by_id(user_id)
        assert not user['name']
        assert user['count_cart'] == 0
        assert user['count_favorite'] == 0


@pytest.mark.parametrize(
    'email, password, status_code',
    [
        ('test@test.com', 'test', 200),
        ('test1@test.com', 'test', 409),
        ('test@test.com', 'test1', 409),
        ('test2@test.com', 'string', 200),
    ],
)
async def test_login_user(email, password, status_code, ac: AsyncClient):
    response = await ac.post(
        'user/auth/login',
        json={
            'email': email,
            'password': password,
        },
    )

    assert response.status_code == status_code


async def test_get_user_profile(auth_ac: AsyncClient):
    response = await auth_ac.get('/user/profile')
    assert response.status_code == 200


@pytest.mark.parametrize(
    'name, second_name, number_phone',
    [
        ('TestName', 'TestSecondName', 898989),
        ('TestName', 'TestSecondName', 0),
        ('', 'TestSecondName', 898989),
        ('TestName', '', 898989),
        ('', '', 0),
    ],
)
async def test_change_user_profile(
    name, second_name, number_phone, auth_ac: AsyncClient
):
    data = {'name': name, 'second_name': second_name, 'number_phone': number_phone}
    response = await auth_ac.patch('/user/profile', json=data)
    assert response.status_code == 200
    new_data = response.json()
    assert new_data['name'] == name
    assert new_data['second_name'] == second_name
    assert new_data['number_phone'] == number_phone
