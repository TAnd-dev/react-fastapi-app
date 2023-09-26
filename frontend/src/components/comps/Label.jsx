export function Label({
    htmlFor,
    text,
    width = '85%',
    textAlign = 'left',
    marginBottom = '10px',
}) {
    return (
        <label
            htmlFor={htmlFor}
            style={{
                width: width,
                marginBottom: marginBottom,
                cursor: 'pointer',
                textAlign: textAlign,
            }}
        >
            {text}
        </label>
    );
}
