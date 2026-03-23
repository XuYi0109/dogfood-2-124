import { useState } from 'react';
import ProductShowcase from './components/ProductShowcase';

type ProductType = 'phone' | 'cup' | 'furniture';

const products = [
  { id: 'phone', name: '智能手机', description: '高端旗舰手机，搭载最新处理器' },
  { id: 'cup', name: '智能水杯', description: '温度显示，长效保温' },
  { id: 'furniture', name: '现代沙发', description: '简约设计，舒适体验' },
];

function App() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('phone');

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      <header className="p-6 bg-slate-800 shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center">3D 商品展示</h1>
        <p className="text-slate-400 text-center mt-2">拖拽旋转查看商品详情</p>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64 bg-slate-800 p-4 border-r border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">选择商品</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id as ProductType)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${selectedProduct === product.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm opacity-80 mt-1">{product.description}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 relative">
          <ProductShowcase productType={selectedProduct} />
        </main>
      </div>
    </div>
  );
}

export default App;