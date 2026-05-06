import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Booking from './components/Booking'
import Tips from './components/Tips'
import Reviews from './components/Reviews'
import Contacts from './components/Contacts'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { AnimateOnScroll } from './components/AnimateOnScroll'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <AnimateOnScroll><Services /></AnimateOnScroll>
      <AnimateOnScroll><Gallery /></AnimateOnScroll>
      <AnimateOnScroll><Booking /></AnimateOnScroll>
      <AnimateOnScroll><Tips /></AnimateOnScroll>
      <AnimateOnScroll><Reviews /></AnimateOnScroll>
      <AnimateOnScroll><Contacts /></AnimateOnScroll>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
