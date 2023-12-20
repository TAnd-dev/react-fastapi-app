import { useState } from 'react';
import css from '../../styles/styles';
import { CrossButton, RedButton } from '../comps/Button';
import { Input } from '../comps/Input';
import { Label } from '../comps/Label';
import { host } from '../../settings';

const { ModalContainer, Form, SectionHeader, LabelInput } = css;

export default function DeleteCategory({ handleCloseModal, isOpen = false }) {
    const [idCategory, setIdCategory] = useState('');

    async function onClickDelete(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('category_id', idCategory);
        const request = await fetch(`http://${host}admin/delete_category`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                accept: 'application/json',
            },
            body: formData,
        });
        if (request.ok) {
            setIdCategory('');
            handleCloseModal('');
        }
    }
    return (
        <ModalContainer style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <Form style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <SectionHeader style={{ marginBottom: '30px' }}>
                    Delete category
                    <CrossButton onClick={() => handleCloseModal('')} />
                </SectionHeader>

                <LabelInput>
                    <Label
                        width="20%"
                        text="Id category"
                        htmlFor={'id-category'}
                    />
                    <Input
                        id="id-category"
                        onHandle={e => setIdCategory(e.target.value)}
                        value={idCategory}
                        type="number"
                        placeholder="Id category"
                        width="80%"
                    ></Input>
                </LabelInput>

                <RedButton
                    onClick={onClickDelete}
                    text={'Delete'}
                    width="30%"
                />
            </Form>
        </ModalContainer>
    );
}
