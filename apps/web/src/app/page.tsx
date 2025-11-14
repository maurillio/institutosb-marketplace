import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/featured-products';
import { FeaturedCourses } from '@/components/home/featured-courses';
import { Categories } from '@/components/home/categories';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <FeaturedCourses />
      </main>

      <Footer />
    </div>
  );
}
