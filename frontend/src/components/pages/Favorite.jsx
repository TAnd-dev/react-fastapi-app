import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';

import { CrossButton } from '../comps/Button';

export default function Favorite() {
    const [items, setItems] = useState([]);
    const { CartFavoritePurchase, SectionHeader, BlackOrangeLink } = css;

    async function deleteItem(e) {
        await fetch('http://localhost:8000/favorite/remove_item', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: e.target.id }),
        });

        const newListItem = items.filter(item => item.item_id !== +e.target.id);
        setItems(newListItem);
    }

    useEffect(() => {
        fetch('http://localhost:8000/favorite', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(result => {
                setItems(result);
            });
    }, []);
    const itemList = [
        <CartFavoritePurchase.ItemDetail>
            <b style={{ width: '59%' }}>Name</b>
            <b style={{ width: '13%', paddingLeft: '30px' }}>Price</b>
            <span style={{ width: '5%' }}></span>
        </CartFavoritePurchase.ItemDetail>,
    ];

    items.forEach(item => {
        itemList.push(
            <CartFavoritePurchase.ItemDetail
                key={item.item_id}
                styleLast={false}
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
