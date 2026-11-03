import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data/content";

export const metadata: Metadata = { title: "Blog", description: "Guides, gift ideas and stories from our team." };

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">Guides, gift ideas and stories from our team</p>
      </div>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mb-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {formatDate(featured.publishedAt)} · {featured.readingMinutes} min read
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight group-hover:underline sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{featured.excerpt}</p>
          </div>
        </Link>
      )}

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min read
            </p>
            <h2 className="mt-2 text-xl font-medium tracking-tight group-hover:underline">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
