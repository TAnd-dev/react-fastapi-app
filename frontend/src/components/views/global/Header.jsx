import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';

import { useSelector, useDispatch } from 'react-redux';
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import { changeUserData } from '../../../redux-store/reducers/view-user-data.js';

import css from '../../../styles/styles.js';
import Categories from '../../comps/Categories.jsx';
import {
    ArrowIcon,
    SearchIcon,
    CompareIcon,
    CartIcon,
    LoginIcon,
    FavoritIcon,
} from '../../comps/Icons.jsx';

const {
    HeaderContainer,
    HeaderWrapper,
    HeaderLogo: HeaderLogoStyle,
    ContainerLogo,
    HeaderLogoText,
    ContainerCatalog,
    HeaderContainerCatalog,
    HeaderSearch: HeaderSearchStyle,
    HeaderSearchInput,
    HeaderSearchBtn,
    NavBtn,
    HeaderBtnLink,
    SearchResult,
} = css;

function HeaderLogo({ handleClick, isOpenCategory }) {
    return (
        <HeaderLogoStyle>
            <ContainerLogo>
                <Link to={'/'}>
                    <HeaderLogoText>DNS</HeaderLogoText>
                </Link>
            </ContainerLogo>
            <ContainerCatalog>
                <Catalog
                    handleClick={handleClick}
                    isOpenCategory={isOpenCategory}
                />
            </ContainerCatalog>
        </HeaderLogoStyle>
    );
}

function Catalog({ handleClick, isOpenCategory }) {
    return (
        <HeaderContainerCatalog onClick={() => handleClick(!isOpenCategory)}>
            <span>Catalog</span>
            <ArrowIcon direction={isOpenCategory ? '180' : '0'} />
        </HeaderContainerCatalog>
    );
}

function HeaderSearch() {
    const [searchText, setSearchText] = useState('');
    const [briefItems, setBriefItems] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { BlackOrangeLink } = css;

    const briefItemsList = briefItems.map(item => {
        return (
            <Link key={item.id} to={`/item/${item.id}`} relative="path">
                <BlackOrangeLink
                    style={{ display: 'flex', width: '100%', margin: '10px 0' }}
                >
                    <span style={{ width: '90%' }}>
                        {item.title.length > 50
                            ? `${item.title.slice(0, 50)}...`
                            : item.title}
                    </span>
                    <span style={{ width: '10%' }}>{item.price}$</span>
                </BlackOrangeLink>
            </Link>
        );
    });
    function searchItems() {
        setSearchText('');
        setBriefItems([]);
        if (
            !location.pathname.includes('/category/') ||
            !location.pathname === '/'
        ) {
            navigate(`/?s=${searchText}`, { replace: true });
        } else {
            setSearchParams({ s: searchText });
        }
    }

    async function getBriefItems(searchValue) {
        if (searchValue) {
            const request = await fetch(
                `http://localhost:8000/shop/brief_items?search_text=${searchValue}`
            );
            if (request.ok) {
                const data = await request.json();
                setBriefItems(data);
            }
        } else {
            setBriefItems([]);
        }
    }

    return (
        <>
            <HeaderSearchStyle>
                <HeaderSearchInput
                    type="text"
                    placeholder="Search site"
                    value={searchText}
                    onChange={e => {
                        setSearchText(e.target.value);
                        getBriefItems(e.target.value);
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            searchItems();
                        }
                    }}
                ></HeaderSearchInput>

                <HeaderSearchBtn onClick={searchItems}>
                    <SearchIcon />
                </HeaderSearchBtn>
            </HeaderSearchStyle>
            {briefItems.length > 0 && (
                <SearchResult>{briefItemsList}</SearchResult>
            )}
        </>
    );
}

function HeaderNav() {
    const [isVisibleUserLinks, setIsVisibleUserLinks] = useState(false);
    const dropdownRef = useRef(null);
    const [cookies, setCookies, removeCookies] = useCookies();
    const userData = useSelector(state => state.userData.userData);
    const dispatch = useDispatch();

    const { ContainerLogin, BlackOrangeLink } = css;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/user/profile',
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    dispatch(changeUserData(data));
                } else {
                    dispatch(changeUserData({}));
                }
            } catch (error) {
                dispatch(changeUserData({}));
                removeCookies('auth_token');
            }
        };
        if (cookies['auth_token']) {
            fetchUserData();
        }
    }, [cookies]);

    useEffect(() => {
        const handleOutsideClick = () => {
            if (dropdownRef.current) {
                setIsVisibleUserLinks(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    async function clickLogout() {
        await fetch('http://localhost:8000/user/logout', {
            method: 'POST',
            credentials: 'include',
            header: {
                'Content-Type': 'application/json',
            },
        });
        dispatch(changeUserData({}));
    }
    console.log(isVisibleUserLinks);
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <HeaderNavBtn
                link="/favorite"
                linkText="Favorite"
                icon={<FavoritIcon />}
            />
            <HeaderNavBtn link="/cart" linkText="Cart" icon={<CartIcon />} />
            <div
                onMouseOver={() =>
                    userData.email
                        ? setIsVisibleUserLinks(true)
                        : setIsVisibleUserLinks(false)
                }
            >
                <HeaderNavBtn
                    link={userData.email ? null : '/login'}
                    linkText={
                        userData.email
                            ? `${userData.email.slice(0, 7)}...`
                            : 'login'
                    }
                    icon={<LoginIcon />}
                />
                {userData.email && isVisibleUserLinks && (
                    <ContainerLogin ref={dropdownRef}>
                        <span>
                            <Link to={`/user/profile`} relative="path">
                                <BlackOrangeLink>Profile</BlackOrangeLink>
                            </Link>
                        </span>
                        <span>
                            <Link to={`/purchase`} relative="path">
                                <BlackOrangeLink>Purchase</BlackOrangeLink>
                            </Link>
                        </span>
                        <span
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={clickLogout}
                        >
                            Logout
                        </span>
                    </ContainerLogin>
                )}
            </div>
        </div>
    );
}

function HeaderNavBtn({ link, linkText, icon }) {
    return (
        <NavBtn>
            {link ? (
                <Link to={link}>
                    <HeaderBtnLink>
                        <span>{icon}</span>
                        <span>{linkText}</span>
                    </HeaderBtnLink>
                </Link>
            ) : (
                <HeaderBtnLink>
                    <span>{icon}</span>
                    <span>{linkText}</span>
                </HeaderBtnLink>
            )}
        </NavBtn>
    );
}

export default function Header() {
    const [isOpenCategory, setIsOpenCategory] = useState(false);
    return (
        <>
            <HeaderContainer>
                <HeaderWrapper>
                    <HeaderLogo
                        handleClick={setIsOpenCategory}
                        isOpenCategory={isOpenCategory}
                    />
                    <HeaderSearch />
                    <HeaderNav />
                </HeaderWrapper>
            </HeaderContainer>
            {isOpenCategory && <Categories />}
        </>
    );
}
