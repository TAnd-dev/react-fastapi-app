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
    CartIcon,
    LoginIcon,
    FavoritIcon,
} from '../../comps/Icons.jsx';
import CountItems from '../../comps/CountItems.jsx';
import { host } from '../../../settings.js';

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
    HeaderNav: HeaderNavStyle,
    NavBtn,
    HeaderBtnLink,
    SearchResult,
    ContainerLogin,
    BlackOrangeLink,
} = css;

function HeaderLogo({ handleClick, isOpenCategory }) {
    return (
        <HeaderLogoStyle>
            <ContainerLogo>
                <Link to={'/'}>
                    <HeaderLogoText>ATA</HeaderLogoText>
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
    const [, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const briefItemsList = briefItems.map(item => {
        return (
            <Link key={item.id} to={`/item/${item.id}`} relative="path">
                <BlackOrangeLink
                    style={{
                        display: 'flex',
                        width: '100%',
                        margin: '10px 0',
                        paddingRight: '20px',
                    }}
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
                `https://${host}shop/brief_items?search_text=${searchValue}`
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
    const [countCartFavorite, setCountCartFavorite] = useState({});
    const dropdownRef = useRef(null);
    const [cookies, , removeCookies] = useCookies();
    const userData = useSelector(state => state.userData.userData);
    const dispatch = useDispatch();
    const photo = userData.photo && userData.photo.split('/users/')[1];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://${host}user/profile`, {
                    method: 'GET',
                    credentials: 'include',
                });

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
        if (cookies.auth_token) {
            fetchUserData();
        }
    }, [cookies.auth_token, dispatch, removeCookies]);

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

    useEffect(() => {
        if (!userData.email) {
            const countCart = cookies.cart ? cookies.cart.length : 0;
            const countFavorite = cookies.favorite
                ? cookies.favorite.length
                : 0;
            setCountCartFavorite({
                countCart: countCart,
                countFavorite: countFavorite,
            });
            return;
        }
        setCountCartFavorite({
            countCart: userData.count_cart,
            countFavorite: userData.count_favorite,
        });
    }, [userData, cookies.cart, cookies.favorite]);

    async function clickLogout() {
        await fetch(`https://${host}user/logout`, {
            method: 'POST',
            credentials: 'include',
            header: {
                'Content-Type': 'application/json',
            },
        });
        dispatch(changeUserData({}));
    }

    return (
        <HeaderNavStyle>
            <HeaderNavBtn
                link="/favorite"
                linkText="Favorite"
                icon={<FavoritIcon />}
                count={countCartFavorite.countFavorite}
            />
            <HeaderNavBtn
                link="/cart"
                linkText="Cart"
                icon={<CartIcon />}
                count={countCartFavorite.countCart}
            />
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
                    icon={photo ? photo : <LoginIcon />}
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
                        {userData.is_admin && (
                            <span>
                                <Link to={`/admin`} relative="path">
                                    <BlackOrangeLink>Admin</BlackOrangeLink>
                                </Link>
                            </span>
                        )}
                        <span
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={clickLogout}
                        >
                            Logout
                        </span>
                    </ContainerLogin>
                )}
            </div>
        </HeaderNavStyle>
    );
}

function HeaderNavBtn({ link, linkText, icon, count }) {
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
                    <span>
                        <img
                            style={{
                                width: '25px',
                                height: '25px',
                                borderRadius: '50%',
                            }}
                            src={`https://${host}${icon}`}
                            alt="Profile"
                        />
                    </span>
                    <span>{linkText}</span>
                </HeaderBtnLink>
            )}
            <CountItems count={count} />
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
