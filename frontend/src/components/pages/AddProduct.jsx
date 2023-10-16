import { useEffect, useState } from 'react';
import css from '../../styles/styles';
import { CheckBoxInput, Input, TextArea } from '../comps/Input';
import { Label } from '../comps/Label';
import { CrossButton, OrangeButton } from '../comps/Button';
import { host } from '../../settings';

export default function AddProduct({ handleCloseModal, isOpen = false }) {
    const [addItem, setAddItem] = useState({
        title: '',
        description: '',
        price: '',
        categories: [],
        photos: [],
    });
    const [categories, setCategories] = useState([]);
    const { ModalContainer, Form, LabelInput, InputLabelFile, SectionHeader } =
        css;

    function addDeleteCategory(e) {
        const newCategories = addItem.categories.includes(e.target.id)
            ? addItem.categories.filter(id => id !== e.target.id)
            : [...addItem.categories, e.target.id];

        setAddItem({ ...addItem, categories: newCategories });
    }

    useEffect(() => {
        async function fetchCategories() {
            const request = await fetch(`${host}shop/categories`);
            if (request.ok) {
                const data = await request.json();
                setCategories(data);
            }
        }
        fetchCategories();
    }, []);

    const categoyList = categories.map(category => {
        return (
            <div key={category.id} style={{ marginBottom: '10px' }}>
                <CheckBoxInput
                    id={category.id}
                    value={category.name}
                    name="category"
                    onChange={addDeleteCategory}
                />
                <Label width="20%" text={category.name} htmlFor={category.id} />
            </div>
        );
    });

    function setItemImages(e) {
        e.preventDefault();
        const imageList = Object.values(e.target.files);
        setAddItem({ ...addItem, images: imageList });
    }

    async function onClickSend(e) {
        e.preventDefault();

        const formData = new FormData();
        addItem.images.forEach(image => formData.append('files', image));
        formData.append('title', addItem.title);
        formData.append('description', addItem.description);
        formData.append('price', addItem.price);
        formData.append('categories', addItem.categories);

        const request = await fetch(`${host}admin/add_item`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                accept: 'application/json',
            },
            body: formData,
        });
        if (request.ok) {
            setAddItem({
                title: '',
                description: '',
                price: '',
                categories: [],
                photos: [],
            });
            handleCloseModal('');
        }
    }
    return (
        <ModalContainer style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <Form
                encType="multipart/form-data"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}
            >
                <SectionHeader style={{ marginBottom: '30px' }}>
                    Add product
                    <CrossButton onClick={() => handleCloseModal('')} />
                </SectionHeader>
                <Label width="20%" text="Categoies" />
                <div style={{ width: '80%' }}>{categoyList}</div>
                <LabelInput>
                    <Label width="20%" text="Name" htmlFor={'title'} />
                    <Input
                        id="title"
                        onHandle={e =>
                            setAddItem({ ...addItem, title: e.target.value })
                        }
                        value={addItem.title}
                        type="text"
                        placeholder="Name"
                        width="80%"
                    ></Input>
                </LabelInput>
                <LabelInput>
                    <Label
                        htmlFor={'description'}
                        width="20%"
                        text="Description"
                    />
                    <TextArea
                        id="description"
                        onChange={e =>
                            setAddItem({
                                ...addItem,
                                description: e.target.value,
                            })
                        }
                        text={addItem.description}
                        placeholder="Description"
                        style={{ minWidth: '80%' }}
                    />
                </LabelInput>
                <LabelInput>
                    <Label htmlFor={'price'} width="20%" text="Price" />
                    <Input
                        id={'price'}
                        onHandle={e =>
                            setAddItem({ ...addItem, price: e.target.value })
                        }
                        value={addItem.price}
                        type="number"
                        placeholder="Price"
                        width="80%"
                    />
                </LabelInput>
                <Label width="20%" text="Photos" />
                <InputLabelFile.FilesContainer>
                    <InputLabelFile.InputFile
                        type="file"
                        id="input__file"
                        onChange={setItemImages}
                        multiple
                    />
                    <InputLabelFile.Label
                        htmlFor="input__file"
                        style={{ margin: '0 0 15px' }}
                    >
                        {addItem.images ? addItem.images.length : 'Load images'}
                    </InputLabelFile.Label>
                </InputLabelFile.FilesContainer>
                <OrangeButton onClick={onClickSend} text={'Send'} width="30%" />
            </Form>
        </ModalContainer>
    );
}
