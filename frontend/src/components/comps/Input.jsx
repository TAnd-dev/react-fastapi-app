import css from '../../styles/styles';

const { Input: InputStyle, TextArea: TextAreaStyle } = css;

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

export function CheckBoxInput({ id, value, name, onChange }) {
    return (
        <input
            id={id}
            style={{ width: '10%' }}
            value={value}
            name={name}
            onChange={onChange}
            type="checkbox"
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

export function TextArea({ onChange, text, style }) {
    return (
        <TextAreaStyle
            style={style}
            onChange={onChange}
            value={text}
        ></TextAreaStyle>
    );
}
