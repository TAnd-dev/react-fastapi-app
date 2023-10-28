import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Typography, Rating } from '@mui/material';

import {
    CrossButton,
    GreyButton,
    OrangeButton,
    WhiteButton,
} from '../comps/Button';
import { Label } from '../comps/Label';
import { TextArea } from '../comps/Input';
import ItemStat from '../comps/Stat';
import ReviewsBar from '../comps/ReviewsRates';

import { register } from 'swiper/element/bundle';

import css from '../../styles/styles';
import { useCookies } from 'react-cookie';
import { host } from '../../settings';
import { isValidText } from '../../services/validators';

function ImageSwiper({ photoList }) {
    const { ItemDetail: ItemDetailStyles } = css;
    const swiperElRef = useRef(null);
    const swiperElRef1 = useRef(null);
    const photos = [];
    const smallPhotos = [];

    useEffect(() => {
        register();

        const params = {
            loop: true,
            spaceBetween: 1,
            slidesPerView: 1,
            thumbs: {
                swiper: swiperElRef1.current,
            },
        };

        Object.assign(swiperElRef.current, params);
        swiperElRef.current.initialize();
    }, []);

    useEffect(() => {
        register();

        const params = {
            loop: true,
            navigation: true,
            spaceBetween: 1,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        };

        Object.assign(swiperElRef1.current, params);
        swiperElRef1.current.initialize();
    }, []);

    photoList.forEach(photo => {
        const photoName = photo.file_path.split('/items/')[1];
        const smallPhoto = photo.file_path.replace(
            photoName,
            'small_' + photoName
        );
        photos.push(
            <swiper-slide style={{ textAlign: 'center' }} key={photo.id}>
                <ItemDetailStyles.ItemDetailImage
                    src={`${host}${photo.file_path}`}
                    alt={photo.descritption}
                />
            </swiper-slide>
        );
        smallPhotos.push(
            <swiper-slide style={{ textAlign: 'center' }} key={photo.id}>
                <ItemDetailStyles.ItemDetailImage
                    src={`${host}${smallPhoto}`}
                    alt={photo.descritption}
                />
            </swiper-slide>
        );
    });

    return (
        <div style={{ height: '400px', width: '80%' }}>
            <swiper-container
                style={{ height: '80%' }}
                init="false"
                ref={swiperElRef}
            >
                {photos}
            </swiper-container>
            <swiper-container
                style={{
                    height: '20%',
                    marginTop: '20px',
                    paddingBottom: '20px',
                }}
                init="false"
                ref={swiperElRef1}
            >
                {smallPhotos}
            </swiper-container>
        </div>
    );
}

function ItemRating({ itemDetail, rateData, handleOpenModal, userData }) {
    const { ItemDetail: ItemDetailStyles, SectionHeader } = css;
    return (
        <ItemDetailStyles.ItemSubDetail>
            <SectionHeader>
                <span>Rating:</span>
            </SectionHeader>
            <ItemDetailStyles.ItemRating>
                <h1 style={{ textAlign: 'center', fontSize: '60px' }}>
                    {itemDetail.avg_rate ? itemDetail.avg_rate.toFixed(2) : 0}
                </h1>
                <Rating precision={0.2} readOnly value={itemDetail.avg_rate} />
                <Typography component="legend">
                    <span style={{ marginLeft: '15px' }}>
                        Reviews: {itemDetail.count_reviews}
                    </span>
                </Typography>
            </ItemDetailStyles.ItemRating>
            <div style={{ height: '300px', width: '45%' }}>
                <ReviewsBar data={rateData} />
            </div>
            {userData.email ? (
                <WhiteButton
                    onClick={() => handleOpenModal(true)}
                    style={{ marginRight: '50px' }}
                >
                    <h4>Add review</h4>
                </WhiteButton>
            ) : (
                <WhiteButton style={{ marginRight: '50px' }}>
                    <Link to={'/login'} style={{ color: 'black' }}>
                        Login to add review
                    </Link>
                </WhiteButton>
            )}
        </ItemDetailStyles.ItemSubDetail>
    );
}

function ItemReviews({ reviews }) {
    const { ItemDetail: ItemDetailStyles, SectionHeader } = css;
    return (
        <ItemDetailStyles.ItemSubDetail>
            <SectionHeader>Reviews:</SectionHeader>
            {reviews.length > 0 ? (
                reviews
            ) : (
                <h2 style={{ margin: '60px auto 60px 5px' }}>
                    No reviews yet. Be the first
                </h2>
            )}
        </ItemDetailStyles.ItemSubDetail>
    );
}

function ItemAddReview({
    isOpen,
    handleCloseModal,
    itemId,
    reviews,
    addReview,
    userData,
}) {
    const [dataReview, setDataReview] = useState({ rate: 1, text: '' });
    const [error, setError] = useState(null);
    const { SectionHeader, ModalContainer, Form, LabelInput } = css;

    async function handleFormSubmit(event) {
        event.preventDefault();
        if (!isValidText(dataReview.text)) {
            setError('Too short comment');
            return;
        }
        const formJson = JSON.stringify(dataReview);
        const request = await fetch(`${host}shop/item/${itemId}/add_review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: formJson,
        });
        if (request.ok) {
            const reviewData = await request.json();
            addReview([
                {
                    email: userData.email,
                    rate: reviewData.rate,
                    text: reviewData.text,
                },
                ...reviews,
            ]);
            handleCloseModal(false);
            setDataReview({ rate: 1, text: '' });
        }
    }

    return (
        <ModalContainer style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <Form onSubmit={handleFormSubmit}>
                <span style={{ color: 'red' }}>{error}</span>
                <SectionHeader>
                    Add review
                    <CrossButton onClick={() => handleCloseModal(false)} />
                </SectionHeader>
                <LabelInput $justifyContent="start">
                    <Label
                        htmlFor="reivew-rate"
                        text="Your rate"
                        width="20%"
                        marginBottom="0"
                    />
                    <Rating
                        precision={1}
                        defaultValue={1}
                        value={dataReview.rate}
                        size="large"
                        onChange={e =>
                            setDataReview({
                                ...dataReview,
                                rate: e.target.value,
                            })
                        }
                    />
                </LabelInput>

                <LabelInput>
                    <Label
                        htmlFor="reivew-comment"
                        text="Comment"
                        width="50%"
                        marginBottom="0"
                    />
                    <TextArea
                        onChange={e => {
                            setDataReview({
                                ...dataReview,
                                text: e.target.value,
                            });
                            isValidText(e.target.value)
                                ? setError(null)
                                : setError('Too short comment');
                        }}
                        text={dataReview.text}
                    ></TextArea>
                </LabelInput>
                {isValidText(dataReview.text) ? (
                    <OrangeButton text="Send"></OrangeButton>
                ) : (
                    <GreyButton text="send"></GreyButton>
                )}
            </Form>
        </ModalContainer>
    );
}

export default function ItemDetail() {
    const [itemDetail, setItemDetail] = useState({});
    const [itemReviews, setItemReviews] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isItemInCart, setIsItemInCart] = useState(false);
    const userData = useSelector(state => state.userData.userData);
    const { itemId } = useParams();
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();
    const {
        ItemDetail: ItemDetailStyles,
        SectionHeader,
        Main,
        SectionWrapper,
    } = css;
    const reviews = [];
    const rates = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };

    useEffect(() => {
        async function fetchItem() {
            const request = await fetch(`${host}shop/item/${itemId}`);
            if (!request.ok) {
                return;
            }

            const result = await request.json();
            if (!result) {
                setItemDetail('No such item');
                return;
            }
            setItemDetail(result);
            setIsLoaded(true);
        }

        fetchItem();
    }, [itemId]);

    useEffect(() => {
        async function getData() {
            const request = await fetch(
                `${host}cart/item_in_cart?item_id=${itemId}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            if (request.ok) {
                const result = await request.json();
                setIsItemInCart(result);
            }
        }

        if (!isLoaded) return;

        if (userData.email) {
            getData();
            return;
        }
        const cookieCart = cookies.cart ?? [];
        setIsItemInCart(cookieCart.map(item => item.id).includes(+itemId));
    }, [itemId, userData.email, cookies.cart, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        fetch(`${host}shop/item/${itemId}/reviews`)
            .then(res => res.json())
            .then(result => {
                setItemReviews(result);
            });
    }, [itemId, isLoaded]);

    async function onClickBuy() {
        if (isItemInCart) {
            navigate('/cart', { repalce: true });
            return;
        }
        setIsItemInCart(true);

        if (!userData.email) {
            const cookiesCart = cookies.cart ?? [];
            setCookies('cart', [...cookiesCart, { ...itemDetail, count: 1 }]);
            return;
        }

        await fetch(`${host}cart/add_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ item_id: itemId }),
        });
    }

    itemReviews.forEach((comment, i) => {
        rates[comment.rate] += 1;
        reviews.push(
            <div key={i} style={{ width: '100%' }}>
                <h3 style={{ margin: '30px auto 10px 5px' }}>
                    {comment.email}
                </h3>
                <ItemDetailStyles.CommentContainer>
                    <h4>Rate:</h4>
                    <Rating readOnly value={comment.rate} />
                </ItemDetailStyles.CommentContainer>
                <ItemDetailStyles.CommentContainer>
                    <h4>Comment:</h4>
                    {comment.text}
                </ItemDetailStyles.CommentContainer>
                <div
                    style={{
                        borderTop: '1px solid #d7d7d7',
                        marginTop: '30px',
                    }}
                ></div>
            </div>
        );
    });
    const countRate = Object.values(rates).reduce(
        (count, current) => count + current,
        0
    );

    const rateData = [];

    for (let i = 1; i <= 5; i++) {
        const percentRate = countRate === 0 ? 0 : (100 / countRate) * rates[i];
        rateData.push({ rate: i, count: rates[i], [i]: percentRate });
    }

    return itemDetail === 'No such item' ? (
        <div>No such product</div>
    ) : isLoaded ? (
        <Main style={{ display: 'block' }}>
            <SectionWrapper>
                <SectionHeader style={{ marginBottom: '30px' }}>
                    {itemDetail.title}
                </SectionHeader>

                <ItemDetailStyles.ItemDetailSection>
                    <ImageSwiper photoList={itemDetail.images}></ImageSwiper>
                </ItemDetailStyles.ItemDetailSection>
                <ItemDetailStyles.ItemDetailSection>
                    <ItemDetailStyles.ItemDetailRight>
                        <p style={{ fontSize: 'large' }}>
                            {itemDetail.description.length > 450
                                ? `${itemDetail.description.slice(0, 450)}...`
                                : itemDetail.description}
                        </p>
                        <div style={{ alignSelf: 'start', marginTop: '-50px' }}>
                            <ItemStat
                                countReviews={itemDetail.count_reviews}
                                avgRating={itemDetail.avg_rate}
                            />
                        </div>
                        <ItemDetailStyles.ItemDetailBuy>
                            <h2 style={{ marginRight: '20px' }}>
                                {itemDetail.price}$
                            </h2>
                            <OrangeButton
                                onClick={onClickBuy}
                                text={isItemInCart ? 'In cart' : 'Buy'}
                                width="100px"
                            />
                        </ItemDetailStyles.ItemDetailBuy>
                    </ItemDetailStyles.ItemDetailRight>
                </ItemDetailStyles.ItemDetailSection>
            </SectionWrapper>

            {itemDetail.description.length > 450 && (
                <ItemDetailStyles.ItemSubDetail>
                    <SectionHeader>Description:</SectionHeader>
                    <div style={{ padding: '15px', fontSize: '20px' }}>
                        {itemDetail.description}
                    </div>
                </ItemDetailStyles.ItemSubDetail>
            )}

            <ItemRating
                itemDetail={itemDetail}
                rateData={rateData}
                handleOpenModal={setIsOpenModal}
                userData={userData}
            />
            <ItemReviews reviews={reviews} />
            <ItemAddReview
                isOpen={isOpenModal}
                userData={userData}
                handleCloseModal={setIsOpenModal}
                itemId={itemDetail.id}
                reviews={itemReviews}
                addReview={setItemReviews}
            />
        </Main>
    ) : (
        <div>Wait some time...</div>
    );
}
