import { Routes, Route, NavLink } from 'react-router-dom'
import { Coffee, ShoppingBag, Package } from 'lucide-react'
import IngredientesPage from './pages/IngredientesPage'
import CategoriasPage from './pages/CategoriasPage'
import ProductosPage from './pages/ProductosPage'
import ProductoDetallePage from './pages/ProductoDetallePage'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
    isActive
      ? 'bg-[#4D6080] text-white shadow-sm'
      : 'text-gray-500 hover:bg-[#FFF2E2] hover:text-[#4D6080]'
  }`

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <nav className="bg-white border-b border-[#FFF2E2] h-16 flex items-center justify-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="public/logo.png" alt="ROST" className="h-10 mr-4" />
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
            Categorías
          </NavLink>
          <NavLink to="/ingredientes" className={linkClass}>
            <Package size={18} />
            Ingredientes
          </NavLink>
        </aside>

        <main className="flex-1 ml-64 py-8 px-6">
          <Routes>
            <Route path="/" element={<ProductosPage />} />
            <Route path="/ingredientes" element={<IngredientesPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:id" element={<ProductoDetallePage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
