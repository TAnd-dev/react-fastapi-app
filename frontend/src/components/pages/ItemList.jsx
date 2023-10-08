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
    const [searchParams, setSearchParams] = useSearchParams();
    const { categroyId } = useParams();

    useEffect(() => {
        let searchTextParam = '';
        searchParams.forEach((param, type) => {
            searchTextParam += `${type}=${param}&`;
        });
        fetch(
            `http://localhost:8000/shop/${
                categroyId ? `category/${categroyId}` : ''
            }?${searchTextParam}`
        )
            .then(res => res.json())
            .then(result => setItems(result));
    }, [searchParams, categroyId]);

    useEffect(() => {
        items.forEach(async item => {
            const request = await fetch(
                `http://localhost:8000/cart/item_in_cart?item_id=${item.id}`,
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
    }, [items, itemsInCart]);

    useEffect(() => {
        items.forEach(async item => {
            const request = await fetch(
                `http://localhost:8000/favorite/item_in_favorite?item_id=${item.id}`,
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
    }, [items, itemsInFavorite]);

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
                                itemsInFavorite.filter(
                                    itemId => !itemsInFavorite.includes(itemId)
                                )
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
    const navigate = useNavigate();

    async function onClickBuy(itemId) {
        if (isItemInCart) {
            navigate('/cart', { repalce: true });
        } else {
            await fetch('http://localhost:8000/cart/add_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ item_id: itemId }),
            });
            addItemToCart(itemDetail.id);
        }
    }

    async function onClickFavorite(itemId, isItemInFavorite) {
        if (isItemInFavorite) {
            await fetch('http://localhost:8000/favorite/remove_item', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ item_id: itemId }),
            });
        } else {
            await fetch('http://localhost:8000/favorite/add_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ item_id: itemId }),
            });
        }
        addDeleteItemToFovorite(itemDetail.id);
    }

    return (
        <ItemListStyles.ItemListDetail>
            <ItemListStyles.ItemListDetailLeft>
                <Link to={`/item/${itemDetail.id}`} relative="path">
                    <ItemListStyles.ItemListDetailImg
                        src={`http://localhost:8000/${itemDetail.images[0].file_path}`}
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
                    onClick={() => {
                        onClickFavorite(itemDetail.id, isItemInFavorite);
                    }}
                >
                    <FavoritIcon color={isItemInFavorite ? '#fc8507' : null} />
                </WhiteButton>
                <WhiteButton
                    style={{
                        width: '82px',
                        fontSize: 'large',
                        transition: 'all 0.5s',
                    }}
                    isHover={true}
                    onClick={() => {
                        onClickBuy(itemDetail.id);
                    }}
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
