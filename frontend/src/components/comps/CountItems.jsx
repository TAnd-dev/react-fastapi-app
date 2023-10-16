import css from '../../styles/styles';

export default function CountItems({ count }) {
    const { CountItems: CountItemsStyle } = css;

    if (count) return <CountItemsStyle>{count} </CountItemsStyle>;
}
