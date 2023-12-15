import css from '../../styles/styles';

const { Label: LabelStyle } = css;
export function Label({
    htmlFor,
    text,
    width = '85%',
    textAlign = 'left',
    marginBottom = '10px',
}) {
    return (
        <LabelStyle
            htmlFor={htmlFor}
            $width={width}
            $marginBottom={marginBottom}
            $textAlign={textAlign}
        >
            {text}
        </LabelStyle>
    );
}
