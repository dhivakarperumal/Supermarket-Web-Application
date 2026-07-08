import React from 'react'
import SupermarketHero from "./SupermarketHero"
import CategoryIcon from './CategoryIcon'
import FlashSale from './FlashSale'
import PromoBanners from './PromoBanners'
import BestSelling from './BestSelling'
import ShopByCategory from './ShopByCategory'
import TopOffersBanner from './TopOffersBanner'
import TrendingProducts from './TrendingProducts'
import FeatureBar from './FeatureBar'
import NewsletterBanner from './NewsletterBanner'
import VideoSwiper from './VideoSwiper'

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <SupermarketHero />

      {/* Category Quick Nav */}
      <CategoryIcon />

      {/* Flash Sale with Countdown */}
      <FlashSale />

      {/* 4 Promo Banners: Organic, Combo, Free Delivery, Super Saver */}
      <PromoBanners />

      {/* Best Selling Products */}
      <BestSelling />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Top Offers For You Banner */}
      <TopOffersBanner />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Feature Bar: Delivery, Quality, Payment, Returns, Support */}
      <FeatureBar />

      {/* Showcase Reels (Videos) */}
      <VideoSwiper />

      {/* Newsletter Subscribe */}
      <NewsletterBanner />
    </div>
  )
}

export default Home
