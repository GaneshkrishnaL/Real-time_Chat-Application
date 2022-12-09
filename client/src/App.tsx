import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedView from './components/ProtectedView'
import Chat from './views/Chat'
import Login from './views/Login'
import Register from './views/Register'

const App: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedView>
                            <Chat />
                        </ProtectedView>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
