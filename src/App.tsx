import { useState } from 'react'
import ProductViewer from './components/ProductViewer'
import './App.css'

type ProductType = 'phone' | 'cup' | 'furniture'

const productInfo = {
  phone: {
    name: '智能手机 Pro',
    price: '¥5999',
    description: '6.7英寸 AMOLED 显示屏，128GB 存储空间',
  },
  cup: {
    name: '智能保温杯',
    price: '¥299',
    description: '24小时保温，智能温度显示',
  },
  furniture: {
    name: '现代简约沙发',
    price: '¥3999',
    description: '进口真皮材质，舒适柔软',
  },
}

function App() {
  const [currentProduct, setCurrentProduct] = useState<ProductType>('phone')

  return (
    <div className="app">
      <header className="header">
        <h1>3D 商品展示平台</h1>
        <p>360° 旋转查看商品</p>
      </header>
      
      <main className="main">
        <div className="product-selector">
          <button 
            className={currentProduct === 'phone' ? 'active' : ''}
            onClick={() => setCurrentProduct('phone')}
          >
            📱 手机
          </button>
          <button 
            className={currentProduct === 'cup' ? 'active' : ''}
            onClick={() => setCurrentProduct('cup')}
          >
            ☕ 水杯
          </button>
          <button 
            className={currentProduct === 'furniture' ? 'active' : ''}
            onClick={() => setCurrentProduct('furniture')}
          >
            🛋️ 家具
          </button>
        </div>

        <div className="product-viewer-container">
          <ProductViewer type={currentProduct} />
        </div>

        <div className="product-info">
          <h2>{productInfo[currentProduct].name}</h2>
          <p className="price">{productInfo[currentProduct].price}</p>
          <p className="description">{productInfo[currentProduct].description}</p>
        </div>
      </main>
    </div>
  )
}

export default App
