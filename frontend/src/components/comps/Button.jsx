import css from '../../styles/styles';

const { Btn } = css;

export function OrangeButton({ text, width = '80%', onClick }) {
    return (
        <Btn.DefaultBtn
            $btnColor="linear-gradient(0deg, #fc8507 0%, #ffa218 100%)"
            $btnHoverColor="#fc8507"
            style={{ width: width }}
            onClick={onClick}
        >
            {text}
        </Btn.DefaultBtn>
    );
}

export function WhiteButton({
    style = {},
    children,
    onClick,
    $isHover = false,
}) {
    return (
        <Btn.WhiteBtn onClick={onClick} style={style} $isHover={$isHover}>
            {children}
        </Btn.WhiteBtn>
    );
}

export function RedButton({ text, width = '80%', onClick }) {
    return (
        <Btn.DefaultBtn
            $btnColor="linear-gradient(0deg, #fc0707 0%, #ff7e18 100%)"
            $btnHoverColor="#f50000"
            style={{ width: width }}
            onClick={onClick}
        >
            {text}
        </Btn.DefaultBtn>
    );
}

export function CrossButton({ onClick, size = '30px', id = null }) {
    const { CrossButton: CrossButtonStyle } = css;
    return (
        <CrossButtonStyle id={id} onClick={onClick} size={size}>
            X
        </CrossButtonStyle>
    );
}
