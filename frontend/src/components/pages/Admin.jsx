import { useState } from 'react';
import css from '../../styles/styles';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import AddCategory from './AddCategory';
import DeleteCategory from './DeleteCategory';

export default function Admin() {
    const [action, setAction] = useState('');
    const { Admin: AdminStyle, BlackOrangeLink } = css;
    function onClickAction(e) {
        setAction(e.target.id);
    }
    return (
        <>
            <AdminStyle.Container onClick={onClickAction}>
                <BlackOrangeLink id="add-product">Add product</BlackOrangeLink>
                <BlackOrangeLink id="delete-product">
                    Delete product
                </BlackOrangeLink>
                <BlackOrangeLink id="add-category">
                    Add category
                </BlackOrangeLink>
                <BlackOrangeLink id="delete-category">
                    Delete category
                </BlackOrangeLink>
            </AdminStyle.Container>
            <AddProduct
                handleCloseModal={setAction}
                isOpen={action === 'add-product'}
            />
            <DeleteProduct
                handleCloseModal={setAction}
                isOpen={action === 'delete-product'}
            />
            <AddCategory
                handleCloseModal={setAction}
                isOpen={action === 'add-category'}
            />
            <DeleteCategory
                handleCloseModal={setAction}
                isOpen={action === 'delete-category'}
            />
        </>
    );
}
