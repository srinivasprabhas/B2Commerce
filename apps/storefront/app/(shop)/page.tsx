import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid title="Featured Products" limit={6} />
      <About />
      <Newsletter />
    </>
  );
}
