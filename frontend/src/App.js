import Header from './components/views/global/Header.jsx';
import Footer from './components/views/global/Footer.jsx';
import ItemListPage from './components/pages/ItemList.jsx';
import ItemDetail from './components/pages/ItemDetail.jsx';

import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/Auth.jsx';
import Profile from './components/pages/Profile.jsx';

export default function App() {
    return (
        <>
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
            </Routes>
            <Footer />
        </>
    );
}
