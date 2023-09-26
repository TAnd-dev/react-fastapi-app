import css from '../../styles/styles';

export function RadioInput({ id, value, name, onHandle }) {
    return (
        <input
            id={id}
            type="radio"
            style={{ width: '15%', marginBottom: '10px' }}
            value={value}
            name={name}
            onChange={onHandle}
        />
    );
}

export function Input({
    id,
    type,
    value = '',
    name,
    width = '45%',
    placeholder = '',
    onHandle,
}) {
    const { Input: InputStyle } = css;
    return (
        <InputStyle
            id={id}
            type={type}
            value={value}
            name={name}
            placeholder={placeholder}
            width={width}
            onChange={onHandle}
        ></InputStyle>
    );
}

export function TextArea({ onChange, text }) {
    const { TextArea: TextAreaStyle } = css;
    return <TextAreaStyle onChange={onChange} value={text}></TextAreaStyle>;
}
