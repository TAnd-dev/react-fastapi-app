import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';
import { host } from '../../settings';

import { CrossButton } from '../comps/Button';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserData } from '../../redux-store/reducers/view-user-data';

const { CartFavoritePurchase, SectionHeader, BlackOrangeLink, SeparateLine } =
    css;

export default function Favorite() {
    const [items, setItems] = useState([]);
    const [cookies, setCookies] = useCookies();
    const userData = useSelector(state => state.userData.userData);
    const dispatch = useDispatch();

    async function deleteItem(e) {
        const deleteId = +e.target.id;
        if (userData.email) {
            await fetch(`${host}favorite/remove_item`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item_id: deleteId }),
            });
            dispatch(
                changeUserData({
                    ...userData,
                    count_favorite: userData.count_favorite - 1,
                })
            );
        }

        const newListItem = items.filter(item => item.item_id !== deleteId);
        setItems(newListItem);
        setCookies('favorite', newListItem);
    }

    useEffect(() => {
        async function fetchData() {
            const request = await fetch(`${host}favorite`, {
                method: 'GET',
                credentials: 'include',
            });
            if (request.ok) {
                const data = await request.json();
                setItems(data);
            }
        }

        if (!userData.email) {
            const data = cookies.favorite ?? [];
            setItems(data);
            return;
        }

        fetchData();
    }, [userData.email, cookies.favorite]);

    const itemList = [
        <>
            <b style={{ gridColumnStart: '1' }}>Name</b>
            <b style={{ gridColumnStart: '8' }}>Price</b>
        </>,
    ];

    items.forEach(item => {
        itemList.push(
            <>
                <SeparateLine
                    style={{ gridColumn: '1/12', marginRight: '19px' }}
                />
                <span style={{ gridColumnStart: '1' }}>
                    <Link to={`/item/${item.item_id}`} relative="path">
                        <BlackOrangeLink>{item.title}</BlackOrangeLink>
                    </Link>
                </span>

                <span style={{ gridColumnStart: '8' }}>{item.price}$</span>
                <span style={{ gridColumnStart: '11' }}>
                    <CrossButton
                        id={item.item_id}
                        onClick={deleteItem}
                        size="20px"
                    ></CrossButton>
                </span>
            </>
        );
    });

    return (
        <CartFavoritePurchase.Container>
            <SectionHeader style={{ marginBottom: '15px' }}>
                Favorite
            </SectionHeader>
            {items.length <= 0 ? (
                <div>Nothing here</div>
            ) : (
                <CartFavoritePurchase.ListContainer>
                    {itemList}
                </CartFavoritePurchase.ListContainer>
            )}
        </CartFavoritePurchase.Container>
    );
}
