import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/styles';
import { ArrowIcon } from './Icons';

function CategoryTree({ category, categories, onToggle, openCategories }) {
    const [isOpen, setIsOpen] = useState(false);

    const filteredCategories = categories.filter(c => c.parent === category.id);
    const { BlackOrangeLink, Categories: CategoryStyle } = css;

    const handleCategoryClick = () => {
        setIsOpen(!isOpen);
        onToggle(category.id);
    };

    return (
        <CategoryStyle.CategoryLi key={category.id}>
            <div style={{ display: 'flex' }}>
                <Link to={`/category/${category.id}`} style={{ width: '90%' }}>
                    <BlackOrangeLink>{category.name}</BlackOrangeLink>
                </Link>
                {filteredCategories.length > 0 && (
                    <span
                        onClick={handleCategoryClick}
                        style={{ width: '10%', cursor: 'pointer' }}
                    >
                        {isOpen ? (
                            <ArrowIcon
                                colorArrow="#000"
                                marginLeft="0"
                                direction="180"
                            />
                        ) : (
                            <ArrowIcon colorArrow="#000" marginLeft="0" />
                        )}
                    </span>
                )}
            </div>
            {isOpen && (
                <ul style={{ marginLeft: '20px' }}>
                    {filteredCategories.map(childCategory => (
                        <CategoryTree
                            key={childCategory.id}
                            category={childCategory}
                            categories={categories}
                            onToggle={onToggle}
                            openCategories={openCategories}
                        />
                    ))}
                </ul>
            )}
        </CategoryStyle.CategoryLi>
    );
}

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [openCategories, setOpenCategories] = useState([]);

    const { Categories: CategoryStyle } = css;

    useEffect(() => {
        const fetchCategories = async () => {
            const request = await fetch(
                'http://localhost:8000/shop/categories'
            );
            if (request.ok) {
                const data = await request.json();
                setCategories(data);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryToggle = categoryId => {
        if (openCategories.includes(categoryId)) {
            setOpenCategories(openCategories.filter(id => id !== categoryId));
        } else {
            setOpenCategories([...openCategories, categoryId]);
        }
    };

    const rootCategories = categories.filter(c => !c.parent);

    return (
        <CategoryStyle.CategoryContainer>
            <ul style={{ width: '100%' }}>
                {rootCategories.map(rootCategory => (
                    <CategoryTree
                        key={rootCategory.id}
                        category={rootCategory}
                        categories={categories}
                        onToggle={handleCategoryToggle}
                        openCategories={openCategories}
                    />
                ))}
            </ul>
        </CategoryStyle.CategoryContainer>
    );
}
