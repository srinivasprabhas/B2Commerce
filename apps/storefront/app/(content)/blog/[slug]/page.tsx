import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/sections/product-grid";
import { getProduct } from "@/lib/catalog";
import { blogPosts } from "@/lib/data/content";
import type { Product } from "@/lib/types";

export const generateStaticParams = () => blogPosts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Post Not Found" };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  const products = post.productSlugs.map(getProduct).filter((p): p is Product => p !== null);

  return (
    <article>
      <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Back to blog
        </Link>
        <h1 className="mt-6 text-4xl font-medium tracking-tight text-balance sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {post.author} · {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} ·{" "}
          {post.readingMinutes} min read
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-secondary">
          <Image src={post.image} alt={post.title} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
        </div>
      </div>
      <div className="prose prose-lg mx-auto mt-12 max-w-3xl px-4 dark:prose-invert sm:px-6 lg:px-8">
        <p className="lead">{post.excerpt}</p>
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {products.length > 0 && (
        <ProductGrid title="Shop this story" description="Products featured in this article" products={products} showViewAll={false} />
      )}
    </article>
  );
}
