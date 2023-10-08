import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../comps/Input';
import { Label } from '../comps/Label';
import { BorderSpan } from '../comps/Span';

import { Link } from 'react-router-dom';

import css from '../../styles/styles';
import { OrangeButton } from '../comps/Button';

function Login() {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const { LabelInput, Form } = css;
    const navigate = useNavigate();

    async function handleFormSubmit(event) {
        event.preventDefault();
        const formJson = JSON.stringify(userData);
        const request = await fetch('http://localhost:8000/user/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: formJson,
        });
        if (request.ok) {
            navigate('/', { replace: true });
        }
    }

    return (
        <Form
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginBottom: '60px',
            }}
            onSubmit={handleFormSubmit}
        >
            <LabelInput>
                <Label
                    htmlFor="login-user"
                    text="Username"
                    width="20%"
                    textAlign="center"
                />
                <Input
                    placeholder="Username"
                    id="login-user"
                    type="text"
                    name="login-user"
                    width="80%"
                    value={userData.email}
                    onHandle={e =>
                        setUserData({ ...userData, email: e.target.value })
                    }
                />
            </LabelInput>
            <LabelInput>
                <Label
                    htmlFor="password-login-user"
                    text="Password"
                    width="20%"
                    textAlign="center"
                />
                <Input
                    placeholder="Password"
                    width="80%"
                    id="password-login-user"
                    type="password"
                    name="password-login-user"
                    onHandle={e =>
                        setUserData({ ...userData, password: e.target.value })
                    }
                    value={userData.password}
                />
            </LabelInput>

            <LabelInput>
                <OrangeButton text="Login" width="30%"></OrangeButton>
                <Link
                    to={'/register'}
                    style={{
                        color: 'inherit',
                        width: '30%',
                        textAlign: 'center',
                        margin: '0 auto',
                    }}
                >
                    <BorderSpan style={{ height: '40px' }}>Register</BorderSpan>
                </Link>
            </LabelInput>
        </Form>
    );
}

function Reg() {
    const [userRegData, setUserRegData] = useState({
        email: '',
        password1: '',
        password2: '',
    });
    const navigate = useNavigate();
    const { LabelInput, Form } = css;

    async function handleFormSubmit(event) {
        event.preventDefault();
        const formJson = JSON.stringify(userRegData);
        const request = await fetch(
            'http://localhost:8000/user/auth/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: formJson,
            }
        );
        if (request.ok) {
            navigate('/', { repalce: true });
        }
    }
    return (
        <Form
            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
            onSubmit={handleFormSubmit}
        >
            <LabelInput>
                <Label
                    htmlFor="email"
                    text="Email"
                    width="20%"
                    textAlign="center"
                />
                <Input
                    placeholder="Email"
                    id="email"
                    type="email"
                    name="email"
                    width="80%"
                    onHandle={e =>
                        setUserRegData({
                            ...userRegData,
                            email: e.target.value,
                        })
                    }
                    value={userRegData.email}
                />
            </LabelInput>

            <LabelInput>
                <Label
                    htmlFor="password1"
                    text="Password"
                    width="20%"
                    textAlign="center"
                />
                <Input
                    placeholder="Password"
                    width="80%"
                    id="password1"
                    type="password"
                    name="password1"
                    onHandle={e =>
                        setUserRegData({
                            ...userRegData,
                            password1: e.target.value,
                        })
                    }
                    value={userRegData.password1}
                />
            </LabelInput>

            <LabelInput>
                <Label
                    htmlFor="password2"
                    text="Confirm password"
                    width="20%"
                    textAlign="center"
                />
                <Input
                    placeholder="Confirm password"
                    width="80%"
                    id="password2"
                    type="password"
                    name="password2"
                    onHandle={e =>
                        setUserRegData({
                            ...userRegData,
                            password2: e.target.value,
                        })
                    }
                    value={userRegData.password2}
                />
            </LabelInput>

            <LabelInput>
                <OrangeButton
                    type="submit"
                    text="Register"
                    width="30%"
                ></OrangeButton>
                <Link
                    to={'/login'}
                    style={{
                        color: 'inherit',
                        width: '30%',
                        textAlign: 'center',
                        margin: '0 auto',
                    }}
                >
                    <BorderSpan
                        style={{
                            height: '40px',
                        }}
                    >
                        Login
                    </BorderSpan>
                </Link>
            </LabelInput>
        </Form>
    );
}

export default function LoginRegister({ type }) {
    const { Main } = css;

    return (
        <Main style={{ margin: '100px 0' }}>
            <h2
                style={{
                    width: '100%',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}
            >
                {type === 'register' ? 'Registration' : 'Login'}
            </h2>
            {type === 'login' ? <Login /> : <Reg />}
        </Main>
    );
}
