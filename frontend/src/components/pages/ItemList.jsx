import { useState, useEffect } from 'react';
import {
    Link,
    useSearchParams,
    useParams,
    useNavigate,
} from 'react-router-dom';

import { OrangeButton } from '../comps/Button';
import { RadioInput, Input } from '../comps/Input';
import { Label } from '../comps/Label';
import { WhiteButton } from '../comps/Button';
import ItemStat from '../comps/Stat';

import css from '../../styles/styles';
import { FavoritIcon } from '../comps/Icons';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserData } from '../../redux-store/reducers/view-user-data';
import { host } from '../../settings';

const { Main, ItemList: ItemListStyles, Form, BlackOrangeLink } = css;

function Sidebar() {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [typeSort, setTypeSort] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    function handleSortChange(event) {
        setTypeSort(event.target.value);
    }

    function submitSortForm(event) {
        event.preventDefault();
        const s = searchParams.get('s');
        const newParams = {
            min_price: minPrice,
            max_price: maxPrice,
            type_sort: typeSort,
        };
        if (s) {
            newParams['s'] = s;
        }

        setSearchParams(newParams);
    }

    return (
        <div style={{ width: '20%' }}>
            <Form
                style={{ position: 'stucky', top: '105px', left: '0' }}
                onSubmit={submitSortForm}
            >
                <ItemListStyles.TypeSort style={{ marginBottom: '20px' }}>
                    <ItemListStyles.SidebarCaption>
                        Price
                    </ItemListStyles.SidebarCaption>
                    <Input
                        type="number"
                        value={minPrice}
                        placeholder="0"
                        onHandle={e => setMinPrice(e.target.value)}
                    />
                    <span style={{ marginTop: '10px' }}>-</span>
                    <Input
                        type="number"
                        value={maxPrice}
                        placeholder="999999"
                        onHandle={e => setMaxPrice(e.target.value)}
                    />
                </ItemListStyles.TypeSort>
                <ItemListStyles.TypeSort>
                    <ItemListStyles.SidebarCaption>
                        Sort
                    </ItemListStyles.SidebarCaption>
                    <RadioInput
                        id="cheap"
                        value="asc_price"
                        name="order"
                        checked={typeSort === 'asc_price'}
                        onHandle={handleSortChange}
                    />
                    <Label htmlFor="cheap" text={'Cheap at first'} />

                    <RadioInput
                        id="expensive"
                        value="desc_price"
                        name="order"
                        checked={typeSort === 'desc_price'}
                        onHandle={handleSortChange}
                    />
                    <Label htmlFor="expensive" text={'Expensive at first'} />

                    <RadioInput
                        id="popular"
                        value="popular"
                        name="order"
                        checked={typeSort === 'popular'}
                        onHandle={handleSortChange}
                    />
                    <Label htmlFor="popular" text={'Popular at first'} />

                    <RadioInput
                        id="best"
                        value="best"
                        name="order"
                        checked={typeSort === 'best'}
                        onHandle={handleSortChange}
                    />
                    <Label htmlFor="best" text={'Best grade at first'} />
                </ItemListStyles.TypeSort>
                <OrangeButton text="Apply" />
            </Form>
        </div>
    );
}

function ItemList() {
    const [items, setItems] = useState([]);
    const [itemsInCart, setItemsInCart] = useState([]);
    const [itemsInFavorite, setItemsInFavorite] = useState([]);
    const userData = useSelector(state => state.userData.userData);
    const [searchParams] = useSearchParams();
    const { categroyId } = useParams();
    const [cookies] = useCookies();

    useEffect(() => {
        let searchTextParam = '';
        searchParams.forEach((param, type) => {
            searchTextParam += `${type}=${param}&`;
        });
        fetch(
            `${host}shop/${
                categroyId ? `category/${categroyId}` : ''
            }?${searchTextParam}`
        )
            .then(res => res.json())
            .then(result => setItems(result));
    }, [searchParams, categroyId]);

    useEffect(() => {
        if (!userData.email) {
            const cookieCart = cookies.cart ?? [];
            const cookieCartId = cookieCart.map(item => item.id);
            setItemsInCart(cookieCartId);
            return;
        }

        items.forEach(async item => {
            const request = await fetch(
                `${host}cart/item_in_cart?item_id=${item.id}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            if (request.ok) {
                const data = await request.json();
                if (data && !itemsInCart.includes(item.id)) {
                    setItemsInCart([...itemsInCart, item.id]);
                }
            }
        });
    }, [items, cookies.cart, userData]);

    useEffect(() => {
        if (!userData.email) {
            const cookieFavorite = cookies.favorite ?? [];
            const cookieFavoriteId = cookieFavorite.map(item => item.id);
            setItemsInFavorite(cookieFavoriteId);
            return;
        }

        items.forEach(async item => {
            const request = await fetch(
                `${host}favorite/item_in_favorite?item_id=${item.id}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            if (request.ok) {
                const data = await request.json();
                if (data && !itemsInFavorite.includes(item.id)) {
                    setItemsInFavorite([...itemsInFavorite, item.id]);
                }
            }
        });
    }, [items, cookies.favorite, userData]);

    const itemList = [];
    items.forEach(item => {
        itemList.push(
            <li style={{ marginBottom: '20px' }} key={item.id}>
                <ItemListDetail
                    itemDetail={item}
                    isItemInCart={itemsInCart.includes(item.id)}
                    addItemToCart={itemId => {
                        if (!itemsInCart.includes(item.id)) {
                            setItemsInCart([...itemsInCart, itemId]);
                        }
                    }}
                    isItemInFavorite={itemsInFavorite.includes(item.id)}
                    addDeleteItemToFovorite={itemId => {
                        if (itemsInFavorite.includes(itemId)) {
                            setItemsInFavorite(
                                itemsInFavorite.filter(i => i !== itemId)
                            );
                        } else {
                            setItemsInFavorite([...itemsInFavorite, itemId]);
                        }
                    }}
                />
            </li>
        );
    });

    return <div style={{ width: '70%' }}>{itemList}</div>;
}

function ItemListDetail({
    itemDetail,
    isItemInCart,
    addItemToCart,
    isItemInFavorite,
    addDeleteItemToFovorite,
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.userData.userData);
    const [cookies, setCookies] = useCookies();
    async function onClickBuy() {
        const cookiesCart = cookies.cart ?? [];
        if (isItemInCart) {
            navigate('/cart', { repalce: true });
            return;
        }

        addItemToCart(itemDetail.id);

        if (!userData.email && !cookiesCart.includes(itemDetail)) {
            setCookies('cart', [
                ...cookiesCart,
                { ...itemDetail, item_id: itemDetail.id, count: 1 },
            ]);
            return;
        }
        await fetch(`${host}cart/add_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ item_id: itemDetail.id }),
        });
        dispatch(
            changeUserData({ ...userData, count_cart: userData.count_cart + 1 })
        );
    }

    async function onClickFavorite() {
        const cookiesFavorite = cookies.favorite ?? [];
        addDeleteItemToFovorite(itemDetail.id);

        if (isItemInFavorite && !userData.email) {
            console.log('item in favorite, not user');
            setCookies(
                'favorite',
                cookiesFavorite.filter(
                    itemCookie => itemCookie.id !== itemDetail.id
                )
            );
            return;
        }

        if (isItemInFavorite && userData.email) {
            await fetch(`${host}favorite/remove_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ item_id: itemDetail.id }),
            });
            dispatch(
                changeUserData({
                    ...userData,
                    count_favorite: userData.count_favorite - 1,
                })
            );
            return;
        }

        if (!userData.email) {
            setCookies('favorite', [
                ...cookiesFavorite,
                { ...itemDetail, item_id: itemDetail.id },
            ]);
            return;
        }

        await fetch(`${host}favorite/add_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ item_id: itemDetail.id }),
        });
        dispatch(
            changeUserData({
                ...userData,
                count_favorite: userData.count_favorite + 1,
            })
        );
    }

    return (
        <ItemListStyles.ItemListDetail>
            <ItemListStyles.ItemListDetailLeft>
                <Link to={`/item/${itemDetail.id}`} relative="path">
                    <ItemListStyles.ItemListDetailImg
                        src={`${host}${itemDetail.images[0].file_path}`}
                        alt="item"
                    />
                </Link>
            </ItemListStyles.ItemListDetailLeft>
            <ItemListStyles.ItemListDetailCenter>
                <div style={{ fontSize: '22px' }}>
                    <Link to={`/item/${itemDetail.id}`} relative="path">
                        <BlackOrangeLink>{itemDetail.title}</BlackOrangeLink>
                    </Link>
                </div>
                <ItemStat
                    itemId={itemDetail.id}
                    avgRating={itemDetail.avg_rate}
                    countReviews={itemDetail.count_reviews}
                />
            </ItemListStyles.ItemListDetailCenter>
            <ItemListStyles.ItemListDetailRight>
                <h2 style={{ width: '100%' }}>{itemDetail.price} $</h2>
                <WhiteButton
                    style={{ width: '40px' }}
                    onClick={onClickFavorite}
                >
                    <FavoritIcon color={isItemInFavorite ? '#fc8507' : null} />
                </WhiteButton>
                <WhiteButton
                    style={{
                        width: '82px',
                        fontSize: 'large',
                        transition: 'all 0.5s',
                    }}
                    $isHover={true}
                    onClick={onClickBuy}
                >
                    {isItemInCart ? 'In cart' : 'Buy'}
                </WhiteButton>
            </ItemListStyles.ItemListDetailRight>
        </ItemListStyles.ItemListDetail>
    );
}

export default function ItemListPage() {
    return (
        <Main>
            <Sidebar />
            <ItemList />
        </Main>
    );
}
