import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';
import { useSelector } from 'react-redux';
import { host } from '../../settings';

const { CartFavoritePurchase, SectionHeader, BlackOrangeLink, SeparateLine } =
    css;

export default function Purchase() {
    const [items, setItems] = useState([]);
    const userData = useSelector(state => state.userData.userData);

    useEffect(() => {
        if (!userData.email) {
            return;
        }

        fetch(`${host}purchase`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(result => {
                setItems(result);
            });
    }, [userData.email]);

    const itemList = [
        <>
            <b style={{ gridColumnStart: '1' }}>Name</b>
            <b style={{ gridColumnStart: '6' }}>Count</b>
            <b style={{ gridColumnStart: '8' }}>Price</b>
        </>,
    ];

    items.forEach((item, i) => {
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

                <span style={{ gridColumnStart: '6' }}>{item.count}</span>

                <span style={{ gridColumnStart: '8' }}>{item.price}$</span>
            </>
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
