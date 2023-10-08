import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';

export default function Purchase() {
    const [items, setItems] = useState([]);
    const { CartFavoritePurchase, SectionHeader, BlackOrangeLink } = css;

    useEffect(() => {
        fetch('http://localhost:8000/purchase', {
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
            <b style={{ width: '58%' }}>Name</b>
            <b style={{ width: '5%' }}>Count</b>
            <b style={{ width: '16%', paddingLeft: '30px' }}>Price</b>
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

                <span style={{ width: '5%', paddingLeft: '10px' }}>
                    {item.count}
                </span>

                <span style={{ width: '16%', paddingLeft: '30px' }}>
                    {item.price}$
                </span>
            </CartFavoritePurchase.ItemDetail>
        );
    });

    return (
        <CartFavoritePurchase.Container>
            <SectionHeader style={{ marginBottom: '15px' }}>
                Purchase
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
