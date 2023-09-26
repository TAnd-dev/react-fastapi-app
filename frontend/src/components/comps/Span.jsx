import css from '../../styles/styles';

const { Span } = css;

export function BorderSpan({ style = {}, children }) {
    return <Span.BorderSpan style={style}>{children}</Span.BorderSpan>;
}
