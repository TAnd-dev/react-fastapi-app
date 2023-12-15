import css from '../../styles/styles';

const { Btn, CrossButton: CrossButtonStyle } = css;

function Button({ color, hover, text, width = '80%', style = {}, onClick }) {
    return (
        <Btn.DefaultBtn
            $btnColor={color}
            $btnHoverColor={hover}
            style={{ width: width, ...style }}
            onClick={onClick}
        >
            {text}
        </Btn.DefaultBtn>
    );
}

export function OrangeButton({ text, width = '80%', onClick }) {
    return (
        <Button
            color="linear-gradient(0deg, #fc8507 0%, #ffa218 100%)"
            hover="#fc8507"
            text={text}
            width={width}
            onClick={onClick}
        />
    );
}

export function GreyButton({ text, width = '80%', onClick }) {
    return (
        <Button
            color="linear-gradient(0deg, #b4b4b4 0%, #d1d1d1 100%)"
            hover="#b4b4b4"
            width={width}
            onClick={onClick}
            text={text}
        />
    );
}

export function RedButton({ text, width = '80%', onClick }) {
    return (
        <Button
            color="linear-gradient(0deg, #fc0707 0%, #ff7e18 100%)"
            hover="#f50000"
            width={width}
            onClick={onClick}
            text={text}
        />
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

export function CrossButton({ onClick, size = '30px', id = null }) {
    return (
        <CrossButtonStyle id={id} onClick={onClick} size={size}>
            X
        </CrossButtonStyle>
    );
}
