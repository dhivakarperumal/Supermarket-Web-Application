import React from 'react'
import SupermarketHero from "./SupermarketHero"
import CategoryIcon from './CategoryIcon'
import TrendingProducts from './TrendingProducts'
import OfferProducts from '../Products/OfferProducts'
import VideoSwiper from './VideoSwiper'
import About from "../About/About"

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <SupermarketHero />
      </div>
      <div>
        <CategoryIcon/>
      </div>
      <div className="py-8">
        <TrendingProducts />
      </div>
      <div className="py-8">
        <OfferProducts />
      </div>
      <div>
        <VideoSwiper />
      </div>
      <div>
        <About />
      </div>
    </div>
  )
}

export default Home
