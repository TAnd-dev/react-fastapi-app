import { useState } from 'react';
import css from '../../styles/styles';
import { CrossButton, RedButton } from '../comps/Button';
import { Input } from '../comps/Input';
import { Label } from '../comps/Label';
import { host } from '../../settings';

const { ModalContainer, Form, SectionHeader, LabelInput } = css;

export default function DeleteProduct({ handleCloseModal, isOpen = false }) {
    const [idProuct, setIdProduct] = useState('');

    async function onClickDelete(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('item_id', idProuct);
        const request = await fetch(`${host}admin/delete_item`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                accept: 'application/json',
            },
            body: formData,
        });
        if (request.ok) {
            setIdProduct('');
            handleCloseModal('');
        }
    }
    return (
        <ModalContainer style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <Form style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <SectionHeader style={{ marginBottom: '30px' }}>
                    Delete product
                    <CrossButton onClick={() => handleCloseModal('')} />
                </SectionHeader>

                <LabelInput>
                    <Label
                        width="20%"
                        text="Id product"
                        htmlFor={'id-product'}
                    />
                    <Input
                        id="id-product"
                        onHandle={e => setIdProduct(e.target.value)}
                        value={idProuct}
                        type="number"
                        placeholder="Id proudct"
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
