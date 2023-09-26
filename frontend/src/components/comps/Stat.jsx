import css from '../../styles/styles';
import { Rating } from '@mui/material';
import { BorderSpan } from './Span';

export default function ItemStat({ itemId, avgRating, countReviews }) {
    const { ItemListDetailStat } = css;

    return (
        <ItemListDetailStat>
            <BorderSpan style={{ marginRight: '15px' }}>
                <span style={{ marginRight: '5px' }}>
                    {avgRating ? avgRating.toFixed(2) : 0}
                </span>
                <Rating
                    size="small"
                    precision={0.1}
                    readOnly
                    value={avgRating}
                />
            </BorderSpan>
            <BorderSpan style={{ marginRight: '15px' }}>
                Reviews: {countReviews}
            </BorderSpan>
        </ItemListDetailStat>
    );
}
