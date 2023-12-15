import Header from './components/views/global/Header.jsx';
import Footer from './components/views/global/Footer.jsx';
import ItemListPage from './components/pages/ItemList.jsx';
import ItemDetail from './components/pages/ItemDetail.jsx';

import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/Auth.jsx';
import Profile from './components/pages/Profile.jsx';
import Cart from './components/pages/Cart.jsx';
import Favorite from './components/pages/Favorite.jsx';
import Purchase from './components/pages/Purchase.jsx';
import AddProduct from './components/pages/AddProduct.jsx';
import Admin from './components/pages/Admin.jsx';

import GloabalStyle from './styles/global.js';

export default function App() {
    return (
        <>
            <GloabalStyle />
            <Header />
            <Routes>
                <Route path="/" Component={ItemListPage}></Route>
                <Route
                    path="/category/:categroyId"
                    Component={ItemListPage}
                ></Route>
                <Route path="/item/:itemId" Component={ItemDetail}></Route>
                <Route path="/login" element={<Login type={'login'} />}></Route>
                <Route
                    path="/register"
                    element={<Login type={'register'} />}
                ></Route>
                <Route path="/user/profile" Component={Profile}></Route>
                <Route path="/cart" Component={Cart}></Route>
                <Route path="/favorite" Component={Favorite}></Route>
                <Route path="/purchase" Component={Purchase}></Route>
                <Route path="/admin" Component={Admin}></Route>
                <Route path="/admin/add_item" Component={AddProduct}></Route>
            </Routes>
            <Footer />
        </>
    );
}
