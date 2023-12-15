import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../comps/Input';
import { Label } from '../comps/Label';
import { BorderSpan } from '../comps/Span';
import { host } from '../../settings';

import { Link } from 'react-router-dom';

import css from '../../styles/styles';
import { GreyButton, OrangeButton } from '../comps/Button';
import {
    isSamePass,
    isValidEmail,
    isValidPass,
} from '../../services/validators';

const { LabelInput, Form, Main } = css;

function Login() {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleFormSubmit(event) {
        event.preventDefault();

        if (!isValidEmail(userData.email)) {
            setError('Email is invalid');
            return;
        }
        if (!isValidPass(userData.password)) {
            setError('Password is invalid');
            return;
        }

        const formJson = JSON.stringify(userData);
        const request = await fetch(`${host}user/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: formJson,
        });
        if (request.status === 409) {
            setError('Incorrect login or password');
            return;
        }
        navigate('/', { repalce: true });
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
            <span style={{ color: 'red' }}>{error}</span>
            <LabelInput>
                <Label
                    htmlFor="login-user"
                    text="Email"
                    width="25%"
                    textAlign="center"
                />
                <Input
                    placeholder="Email"
                    id="login-user"
                    type="text"
                    name="login-user"
                    width="80%"
                    value={userData.email}
                    onHandle={e => {
                        setUserData({ ...userData, email: e.target.value });
                        isValidEmail(e.target.value)
                            ? setError(null)
                            : setError('Email is invalid');
                    }}
                />
            </LabelInput>
            <LabelInput>
                <Label
                    htmlFor="password-login-user"
                    text="Password"
                    width="25%"
                    textAlign="center"
                />
                <Input
                    placeholder="Password"
                    width="80%"
                    id="password-login-user"
                    type="password"
                    name="password-login-user"
                    onHandle={e => {
                        setUserData({ ...userData, password: e.target.value });
                        isValidPass(e.target.value)
                            ? setError(null)
                            : setError('Password is invalid');
                    }}
                    value={userData.password}
                />
            </LabelInput>

            <LabelInput>
                {isValidEmail(userData.email) &&
                isValidPass(userData.password) ? (
                    <OrangeButton text="Login" width="30%"></OrangeButton>
                ) : (
                    <GreyButton text="Login" width="30%"></GreyButton>
                )}

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
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleFormSubmit(event) {
        event.preventDefault();
        if (!isValidEmail(userRegData.email)) {
            setError('Email is invalid');
            return;
        }
        if (!isValidPass(userRegData.password1)) {
            setError('Password is invalid');
            return;
        }
        if (!isSamePass(userRegData.password1, userRegData.password2)) {
            setError('Password missmatch');
            return;
        }
        const formJson = JSON.stringify(userRegData);
        const request = await fetch(`${host}user/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: formJson,
        });
        if (request.status === 409) {
            setError('Email is already exists');
            return;
        }
        navigate('/', { repalce: true });
    }
    return (
        <Form
            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
            onSubmit={handleFormSubmit}
        >
            <span style={{ color: 'red' }}>{error}</span>
            <LabelInput>
                <Label
                    htmlFor="email"
                    text="Email"
                    width="25%"
                    textAlign="center"
                />
                <Input
                    placeholder="Email"
                    id="email"
                    type="email"
                    name="email"
                    width="80%"
                    onHandle={e => {
                        setUserRegData({
                            ...userRegData,
                            email: e.target.value,
                        });
                        isValidEmail(e.target.value)
                            ? setError(null)
                            : setError('Email is invalid');
                    }}
                    value={userRegData.email}
                />
            </LabelInput>

            <LabelInput>
                <Label
                    htmlFor="password1"
                    text="Password"
                    width="25%"
                    textAlign="center"
                />
                <Input
                    placeholder="Password"
                    width="80%"
                    id="password1"
                    type="password"
                    name="password1"
                    onHandle={e => {
                        setUserRegData({
                            ...userRegData,
                            password1: e.target.value,
                        });
                        isValidPass(e.target.value)
                            ? setError(null)
                            : setError('Password is invalid');
                    }}
                    value={userRegData.password1}
                />
            </LabelInput>

            <LabelInput>
                <Label
                    htmlFor="password2"
                    text="Confirm password"
                    width="25%"
                    textAlign="center"
                />
                <Input
                    placeholder="Confirm password"
                    width="80%"
                    id="password2"
                    type="password"
                    name="password2"
                    onHandle={e => {
                        setUserRegData({
                            ...userRegData,
                            password2: e.target.value,
                        });
                        isValidPass(e.target.value)
                            ? setError(null)
                            : setError('Password is invalid');
                        isSamePass(e.target.value, userRegData.password1)
                            ? setError(null)
                            : setError('Password mismatch');
                    }}
                    value={userRegData.password2}
                />
            </LabelInput>

            <LabelInput>
                {isValidEmail(userRegData.email) &&
                isValidPass(userRegData.password1) &&
                isValidPass(userRegData.password2) &&
                isSamePass(userRegData.password1, userRegData.password2) ? (
                    <OrangeButton
                        type="submit"
                        text="Register"
                        width="30%"
                    ></OrangeButton>
                ) : (
                    <GreyButton text="Register" width="30%"></GreyButton>
                )}

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
