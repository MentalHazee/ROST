import { Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom'
import { Coffee, ShoppingBag, Package, ClipboardList } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import IngredientesPage from './pages/IngredientesPage'
import CategoriasPage from './pages/CategoriasPage'
import ProductosPage from './pages/ProductosPage'
import ProductoDetallePage from './pages/ProductoDetallePage'
import CajeroPedidosPage from './pages/CajeroPedidosPage'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
    isActive
      ? 'bg-[#4D6080] text-white shadow-sm'
      : 'text-gray-500 hover:bg-[#FFF2E2] hover:text-[#4D6080]'
  }`

function Layout() {
  const { usuario, logout, hasRole } = useAuth()

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <nav className="bg-white border-b border-[#FFF2E2] h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ROST" className="h-10" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{usuario?.email}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-red-500 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-[#FFF2E2] min-h-[calc(100vh-4rem)] fixed left-0 top-16 p-4 flex flex-col gap-1.5">
          <NavLink to="/productos" className={linkClass}>
            <Coffee size={18} />
            Productos
          </NavLink>
          <NavLink to="/categorias" className={linkClass}>
            <ShoppingBag size={18} />
            Categorias
          </NavLink>
          <NavLink to="/ingredientes" className={linkClass}>
            <Package size={18} />
            Ingredientes
          </NavLink>
          {hasRole('ADMIN') && (
            <NavLink to="/pedidos" className={linkClass}>
              <ClipboardList size={18} />
              Pedidos
            </NavLink>
          )}
        </aside>

        <main className="flex-1 ml-64 py-8 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/productos" replace />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="productos/:id" element={<ProductoDetallePage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="ingredientes" element={<IngredientesPage />} />
          <Route path="pedidos" element={
            <ProtectedRoute roles={['ADMIN', 'PEDIDOS']}>
              <CajeroPedidosPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
