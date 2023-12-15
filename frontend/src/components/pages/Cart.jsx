import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';
import { host } from '../../settings';

import { Input } from '../comps/Input';
import { OrangeButton, CrossButton } from '../comps/Button';
import { Label } from '../comps/Label';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { changeUserData } from '../../redux-store/reducers/view-user-data';

const {
    ModalContainer,
    Form,
    SectionHeader,
    LabelInput,
    CartFavoritePurchase,
    BlackOrangeLink,
    SeparateLine,
} = css;

function ModalBuy({
    isOpen,
    handleCloseModal,
    purchaseDetails,
    changePurchaseDetails,
    onClickApply,
}) {
    return (
        <ModalContainer style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <Form>
                <SectionHeader>
                    <span style={{ minWidth: '330px' }}>Purchase details</span>
                    <CrossButton onClick={() => handleCloseModal(false)} />
                </SectionHeader>

                <LabelInput>
                    <Label
                        htmlFor="email"
                        text="Email"
                        width="40%"
                        marginBottom="0"
                    />
                    <Input
                        id={'email'}
                        type={'email'}
                        value={purchaseDetails.email ?? ''}
                        onHandle={e =>
                            changePurchaseDetails({
                                ...purchaseDetails,
                                email: e.target.value,
                            })
                        }
                        width="60%"
                        placeholder="Email"
                    ></Input>
                </LabelInput>

                <LabelInput>
                    <Label
                        htmlFor="firstNname"
                        text="First name"
                        width="40%"
                        marginBottom="0"
                    />
                    <Input
                        id={'firstNname'}
                        type={'text'}
                        width="60%"
                        value={purchaseDetails.name ?? ''}
                        onHandle={e =>
                            changePurchaseDetails({
                                ...purchaseDetails,
                                name: e.target.value,
                            })
                        }
                        placeholder="First name"
                    ></Input>
                </LabelInput>

                <LabelInput>
                    <Label
                        htmlFor="secondNname"
                        text="Second name"
                        width="40%"
                        marginBottom="0"
                    />
                    <Input
                        id={'secondNname'}
                        type={'text'}
                        value={purchaseDetails.second_name ?? ''}
                        onHandle={e =>
                            changePurchaseDetails({
                                ...purchaseDetails,
                                second_name: e.target.value,
                            })
                        }
                        width="60%"
                        placeholder="Second name"
                    ></Input>
                </LabelInput>

                <LabelInput style={{ marginBottom: '30px' }}>
                    <Label
                        htmlFor="phone"
                        text="Phone"
                        width="40%"
                        marginBottom="0"
                    />
                    <Input
                        id={'phone'}
                        type={'number'}
                        value={purchaseDetails.phone_number ?? ''}
                        onHandle={e =>
                            changePurchaseDetails({
                                ...purchaseDetails,
                                phone_number: e.target.value,
                            })
                        }
                        width="60%"
                        placeholder="Phone"
                    ></Input>
                </LabelInput>
                <OrangeButton
                    onClick={onClickApply}
                    text="Apply"
                ></OrangeButton>
            </Form>
        </ModalContainer>
    );
}

export default function Cart() {
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [purchaseDetails, setPurchaseDetails] = useState({});
    const [cookies, setCookies, removeCookies] = useCookies();
    const userData = useSelector(state => state.userData.userData);
    const dispatch = useDispatch();

    async function deleteItem(e) {
        const deleteId = +e.target.id;
        if (userData.email) {
            await fetch(`${host}cart/remove_item`, {
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
                    count_cart: userData.count_cart - 1,
                })
            );
        }

        const newListItem = items.filter(item => item.item_id !== deleteId);
        setItems(newListItem);
        setCookies('cart', newListItem);
        setTotalPrice(
            newListItem.reduce(
                (price, item) => price + item.price * item.count,
                0
            )
        );
    }

    async function setCountItem(e) {
        const countItems = +e.target.value < 1 ? '' : +e.target.value;
        const newListItem = items.map(item => {
            if (item.item_id === +e.target.name) {
                return { ...item, count: +countItems };
            }
            return item;
        });
        setItems(newListItem);
        if (userData.email) {
            try {
                await fetch(`${host}cart/set_count`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        item_id: e.target.name,
                        count: +countItems,
                    }),
                });
            } catch (error) {}
        }
        setTotalPrice(
            newListItem.reduce(
                (price, item) => price + item.price * item.count,
                0
            )
        );
    }

    async function onClickApply(e) {
        e.preventDefault();
        items.map(async item => {
            const data = JSON.stringify({
                ...purchaseDetails,
                item_id: item.item_id,
                count: item.count,
                price: item.price * item.count,
            });

            await fetch(`${host}purchase/add_item`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });
        });

        if (userData.email) {
            items.map(async item => {
                await fetch(`${host}cart/remove_item`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ item_id: item.item_id }),
                });
            });
            dispatch(changeUserData({ ...userData, count_cart: 0 }));
        }
        removeCookies('cart');
        setItems([]);
        setIsOpenModal(false);
    }

    useEffect(() => {
        async function fetchData() {
            const request = await fetch(`${host}cart`, {
                method: 'GET',
                credentials: 'include',
            });
            if (request.ok) {
                const data = await request.json();
                setItems(data);
                setTotalPrice(
                    data.reduce(
                        (price, item) => price + item.price * item.count,
                        0
                    )
                );
            }
        }

        if (!userData.email) {
            const data = cookies.cart ?? [];
            setItems(data);
            setTotalPrice(
                data.reduce((price, item) => price + item.price * item.count, 0)
            );
            return;
        }

        fetchData();
    }, [userData.email, cookies.cart]);

    const itemList = [
        <>
            <b style={{ gridColumnStart: '1' }}>Name</b>
            <b style={{ gridColumnStart: '6' }}>Count</b>
            <b style={{ gridColumnStart: '8' }}>Price</b>
            <SeparateLine style={{ gridColumn: '1/12', marginRight: '19px' }} />
        </>,
    ];

    useEffect(() => {
        setPurchaseDetails({
            email: userData.email,
            name: userData.name,
            second_name: userData.second_name,
            phone_number: userData.number_phone,
        });
    }, [userData]);

    items.forEach(item => {
        itemList.push(
            <>
                <span style={{ gridColumnStart: '1' }}>
                    <Link to={`/item/${item.item_id}`} relative="path">
                        <BlackOrangeLink>{item.title}</BlackOrangeLink>
                    </Link>
                </span>
                <span style={{ gridColumnStart: '6' }}>
                    <Input
                        type={'number'}
                        width="43.5px"
                        name={item.item_id}
                        value={item.count}
                        onHandle={setCountItem}
                    ></Input>
                </span>
                <span style={{ gridColumnStart: '8' }}>
                    {item.price * item.count}$
                </span>
                <span style={{ gridColumnStart: '11' }}>
                    <CrossButton
                        id={item.item_id}
                        onClick={deleteItem}
                        size="20px"
                    ></CrossButton>
                </span>
                <SeparateLine
                    style={{ gridColumn: '1/12', marginRight: '19px' }}
                />
            </>
        );
    });
    itemList.push(
        <>
            <h3
                style={{
                    gridColumn: '1/8',
                    justifySelf: 'right',
                    marginTop: '10px',
                }}
            >
                Total price: {totalPrice}$
            </h3>
            <span style={{ gridColumnStart: '8' }}>
                <OrangeButton
                    onClick={() => setIsOpenModal(true)}
                    text="Buy"
                    width="100px"
                />
            </span>
        </>
    );
    return (
        <>
            <CartFavoritePurchase.Container>
                <SectionHeader style={{ marginBottom: '15px' }}>
                    Cart
                </SectionHeader>
                {items.length <= 0 ? (
                    <div>Nothing here</div>
                ) : (
                    <CartFavoritePurchase.ListContainer>
                        {itemList}
                    </CartFavoritePurchase.ListContainer>
                )}
            </CartFavoritePurchase.Container>
            <ModalBuy
                isOpen={isOpenModal}
                handleCloseModal={setIsOpenModal}
                purchaseDetails={purchaseDetails}
                changePurchaseDetails={setPurchaseDetails}
                onClickApply={onClickApply}
            />
        </>
    );
}
