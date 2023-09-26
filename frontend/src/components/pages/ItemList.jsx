import { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';

import { OrangeButton } from '../comps/Button';
import { RadioInput, Input } from '../comps/Input';
import { Label } from '../comps/Label';
import { WhiteButton } from '../comps/Button';
import ItemStat from '../comps/Stat';

import css from '../../styles/styles';

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
    const [searchParams, setSearchParams] = useSearchParams();
    const { categroyId } = useParams();

    useEffect(() => {
        let searchTextParam = '';
        searchParams.forEach((param, type) => {
            searchTextParam += `${type}=${param}&`;
        });
        if (categroyId) {
            fetch(
                `http://localhost:8000/shop/category/${categroyId}?${searchTextParam}`
            )
                .then(res => res.json())
                .then(result => setItems(result));
        } else {
            fetch(`http://localhost:8000/shop?${searchTextParam}`)
                .then(res => res.json())
                .then(result => setItems(result));
        }
    }, [searchParams, categroyId]);

    const itemList = [];
    items.forEach(item => {
        itemList.push(
            <li style={{ marginBottom: '20px' }} key={item.id}>
                <ItemListDetail itemDetail={item} />
            </li>
        );
    });

    return <div style={{ width: '70%' }}>{itemList}</div>;
}

function ItemListDetail({ itemDetail }) {
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
                <div style={{ fontSize: 'large' }}>
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
                <WhiteButton style={{ width: '40px' }}>
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.25 6.36912C0.25 3.07041 2.65767 0.25 5.79925 0.25C7.49913 0.25 8.99404 1.08608 10 2.36847C11.0059 1.08613 12.5006 0.25 14.1996 0.25C17.3423 0.25 19.75 3.07167 19.75 6.36912C19.75 7.69532 19.2489 8.97129 18.5251 10.1284C17.7997 11.2883 16.8229 12.3733 15.8015 13.3326C13.7592 15.2508 11.4589 16.7397 10.3901 17.3906C10.1504 17.5365 9.84927 17.5365 9.60965 17.3904C8.54109 16.7391 6.24079 15.2501 4.19851 13.3322C3.17709 12.3729 2.20033 11.288 1.47488 10.1283C0.751138 8.97123 0.25 7.69533 0.25 6.36912ZM5.79925 1.75C3.63983 1.75 1.75 3.73625 1.75 6.36912C1.75 7.31789 2.11117 8.31698 2.74658 9.33278C3.38027 10.3458 4.25947 11.3316 5.22537 12.2387C6.94066 13.8496 8.86662 15.1546 10.0001 15.8678C11.1335 15.1552 13.0594 13.8502 14.7746 12.2392C15.7405 11.3321 16.6197 10.3462 17.2534 9.33299C17.8888 8.31707 18.25 7.3179 18.25 6.36912C18.25 3.73751 16.3602 1.75 14.1996 1.75C12.7203 1.75 11.3843 2.66549 10.6719 4.10155C10.5452 4.35679 10.2849 4.51824 10 4.51824C9.71508 4.51824 9.45476 4.35679 9.32813 4.10155C8.61575 2.66559 7.2798 1.75 5.79925 1.75Z"
                            fill="#AFAFAF"
                        ></path>
                    </svg>
                </WhiteButton>
                <WhiteButton
                    style={{
                        width: '82px',
                        fontSize: 'large',
                        transition: 'all 0.5s',
                    }}
                    isHover={true}
                >
                    Buy
                </WhiteButton>
            </ItemListStyles.ItemListDetailRight>
        </ItemListStyles.ItemListDetail>
    );
}

export default function ItemListPage() {
    const [sortParameters, setSortParameters] = useState({});
    return (
        <Main>
            <Sidebar />
            <ItemList />
        </Main>
    );
}
