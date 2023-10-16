import { useEffect, useState } from 'react';
import css from '../../styles/styles';
import { CrossButton, OrangeButton } from '../comps/Button';
import { Input, RadioInput } from '../comps/Input';
import { Label } from '../comps/Label';
import { host } from '../../settings';

export default function AddCategory({ handleCloseModal, isOpen = false }) {
    const [category, setCategory] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [existingCategories, setExistingCategories] = useState([]);
    const { ModalContainer, Form, SectionHeader, LabelInput } = css;

    useEffect(() => {
        async function fetchCategories() {
            const request = await fetch(`${host}shop/categories`);
            if (request.ok) {
                const data = await request.json();
                setExistingCategories(data);
            }
        }
        fetchCategories();
    }, []);

    async function onClickApply(e) {
        e.preventDefault();

        const data = { name: category };
        if (parentCategory) {
            data['parent'] = parentCategory;
        }

        const formJson = JSON.stringify(data);

        const request = await fetch(`${host}admin/add_category`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: formJson,
        });
        if (request.ok) {
            setCategory('');
            setParentCategory('');
            handleCloseModal('');
        }
    }

    const categoyList = existingCategories.map(category => {
        return (
            <div key={category.id} style={{ marginBottom: '10px' }}>
                <RadioInput
                    id={`${category.id}-${category.name}`}
                    key={category.id}
                    value={category.name}
                    name="category"
                    onHandle={e => setParentCategory(category.id)}
                />
                <Label
                    width="20%"
                    text={category.name}
                    htmlFor={`${category.id}-${category.name}`}
                />
            </div>
        );
    });
    categoyList.push(
        <div key={-1} style={{ marginBottom: '10px' }}>
            <RadioInput
                id={`none-parent`}
                value={''}
                name="category"
                onHandle={e => setParentCategory('')}
            />
            <Label width="20%" text={'No parent'} htmlFor={`none-parent`} />
        </div>
    );
    return (
        <ModalContainer style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <Form style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <SectionHeader style={{ marginBottom: '30px' }}>
                    Add category
                    <CrossButton onClick={() => handleCloseModal('')} />
                </SectionHeader>

                <LabelInput>
                    <Label
                        width="20%"
                        text="Category name"
                        htmlFor={'category-name'}
                    />
                    <Input
                        id="category-name"
                        onHandle={e => setCategory(e.target.value)}
                        value={category}
                        type="text"
                        placeholder="category name"
                        width="80%"
                    ></Input>
                </LabelInput>

                <Label width="20%" text="Parent category" />
                <div style={{ width: '80%' }}>{categoyList}</div>

                <OrangeButton
                    onClick={onClickApply}
                    text={'Apply'}
                    width="30%"
                />
            </Form>
        </ModalContainer>
    );
}
