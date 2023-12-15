import css from '../../styles/styles';

const { CountItems: CountItemsStyle } = css;
export default function CountItems({ count }) {
    if (count) return <CountItemsStyle>{count} </CountItemsStyle>;
}
