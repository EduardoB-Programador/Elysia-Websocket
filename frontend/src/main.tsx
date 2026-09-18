import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserPage from "./pages/UserPage.tsx"
import AdminPage from './pages/AdminPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login.tsx'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CookiesProvider>
			<BrowserRouter>
				<Routes>
					<Route Component={UserPage} path='/user' />
					<Route Component={AdminPage} path='/admin' />
					<Route Component={Login} path='/login' />
				</Routes>
			</BrowserRouter>
		</CookiesProvider>
	</StrictMode>,
)
