import Link from "next/link";

/** Small "Home / Title" trail plus page heading used by content pages. */
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-10">
      <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        Home
      </Link>
      <span className="mx-2 text-muted-foreground">/</span>
      <span className="text-sm">{title}</span>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">{title}</h1>
      {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}
