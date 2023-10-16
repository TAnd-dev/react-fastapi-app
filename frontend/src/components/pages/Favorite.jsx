import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';
import { host } from '../../settings';

import { CrossButton } from '../comps/Button';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserData } from '../../redux-store/reducers/view-user-data';

export default function Favorite() {
    const [items, setItems] = useState([]);
    const [cookies, setCookies] = useCookies();
    const userData = useSelector(state => state.userData.userData);
    const dispatch = useDispatch();
    const { CartFavoritePurchase, SectionHeader, BlackOrangeLink } = css;

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
        <CartFavoritePurchase.ItemDetail key={0}>
            <b style={{ width: '59%' }}>Name</b>
            <b style={{ width: '13%', paddingLeft: '30px' }}>Price</b>
            <span style={{ width: '5%' }}></span>
        </CartFavoritePurchase.ItemDetail>,
    ];

    items.forEach(item => {
        itemList.push(
            <CartFavoritePurchase.ItemDetail
                key={item.item_id}
                $styleLast={false}
            >
                <span style={{ width: '58%' }}>
                    <Link to={`/item/${item.item_id}`} relative="path">
                        <BlackOrangeLink>{item.title}</BlackOrangeLink>
                    </Link>
                </span>

                <span style={{ width: '16%', paddingLeft: '30px' }}>
                    {item.price}$
                </span>
                <CrossButton
                    id={item.item_id}
                    onClick={deleteItem}
                    size="20px"
                ></CrossButton>
            </CartFavoritePurchase.ItemDetail>
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
