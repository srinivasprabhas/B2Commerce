"use client";

import { Button } from "@b2c/ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Checkbox } from "@b2c/ui/components/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@b2c/ui/components/dialog";
import { Input } from "@b2c/ui/components/input";
import { Label } from "@b2c/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@b2c/ui/components/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@b2c/ui/components/select";
import { Separator } from "@b2c/ui/components/separator";
import { Switch } from "@b2c/ui/components/switch";
import { Textarea } from "@b2c/ui/components/textarea";
import { ChevronLeft, ImageUp, Link2, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Cat = { slug: string; name: string; parent?: string };
type VariantRow = { id: number; option: string | null; value: string; price: string };

const optionItems = [
  { label: "Color", value: "color" },
  { label: "Size", value: "size" },
  { label: "Material", value: "material" },
  { label: "Style", value: "style" },
];
const statusItems = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

function Field({ label, htmlFor, children, hint }: { label?: string; htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AddCategoryButton({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <Popover>
      <PopoverTrigger render={<Button type="button" variant="outline" size="icon" aria-label="Add new" />}>
        <Plus />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 space-y-2 p-3">
        <Label htmlFor="new-cat">New</Label>
        <div className="flex gap-2">
          <Input id="new-cat" value={name} onChange={(e) => setName(e.target.value)} className="h-8" />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (name.trim()) onAdd(name.trim());
              setName("");
            }}
          >
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ProductForm({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cats, setCats] = useState(categories);
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [urlOpen, setUrlOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: 1, option: null, value: "", price: "" },
    { id: 2, option: null, value: "", price: "" },
  ]);

  const roots = cats.filter((c) => !c.parent);
  const subs = cats.filter((c) => c.parent && c.parent === category);
  const toItems = (list: Cat[]) => list.map((c) => ({ label: c.name, value: c.slug }));

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const ok = [...files].filter((f) => /image\/(png|jpe?g)/.test(f.type) && f.size <= 5 * 1024 * 1024);
    if (ok.length < files.length) toast.error("Only PNG or JPG up to 5MB");
    setImages((imgs) => [...imgs, ...ok.map((f) => URL.createObjectURL(f))]);
  };

  const submit = (kind: "draft" | "publish") => (e?: React.FormEvent) => {
    e?.preventDefault();
    toast.success(kind === "draft" ? "Draft saved" : "Product published", {
      description: "Connect apps/server to persist products.",
    });
  };

  return (
    <form onSubmit={submit("publish")} className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pages/products" className="rounded-md p-1 hover:bg-muted" aria-label="Back to products">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Add Products</h1>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => router.push("/dashboard/pages/products")}>
            Discard
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => submit("draft")()}>
            Save Draft
          </Button>
          <Button type="submit" size="sm">
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-6">
        <div className="space-y-4 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Name" htmlFor="name">
                <Input id="name" name="name" required className="h-8" />
              </Field>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="SKU" htmlFor="sku">
                  <Input id="sku" name="sku" className="h-8" />
                </Field>
                <Field label="Barcode" htmlFor="barcode">
                  <Input id="barcode" name="barcode" className="h-8" />
                </Field>
              </div>
              <Field label="Description (Optional)" htmlFor="description" hint="Set a description to the product for better visibility.">
                <Textarea id="description" name="description" className="min-h-24" />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardAction>
                <Dialog open={urlOpen} onOpenChange={setUrlOpen}>
                  <DialogTrigger render={<Button type="button" variant="link" size="xs" className="h-7" />}>
                    <Link2 />
                    <span className="hidden sm:inline">Add media from URL</span>
                    <span className="sm:hidden">Add URL</span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add media from URL</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={() => {
                          if (/^https?:\/\//.test(url)) setImages((i) => [...i, url]);
                          setUrl("");
                          setUrlOpen(false);
                        }}
                      >
                        Add
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {/* biome-ignore lint/a11y/noStaticElementInteractions: drop target */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(e.dataTransfer.files);
                }}
                data-dragging={dragging || undefined}
                className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors data-dragging:bg-accent/50"
              >
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" multiple hidden onChange={(e) => addFiles(e.target.files)} />
                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background">
                    <ImageUp className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
                  <p className="text-xs text-muted-foreground">PNG or JPG (max. 5MB)</p>
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => fileRef.current?.click()}>
                    <ImageUp className="opacity-60" />
                    Select images
                  </Button>
                </div>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {images.map((src, i) => (
                    <div key={src} className="group relative overflow-hidden rounded-lg border">
                      {/* biome-ignore lint/performance/noImgElement: local blob previews */}
                      <img src={src} alt={`Upload ${i + 1}`} className="aspect-square w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((imgs) => imgs.filter((x) => x !== src))}
                        className="absolute top-1 right-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardAction>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-7"
                  onClick={() => setVariants((v) => [...v, { id: Date.now(), option: null, value: "", price: "" }])}
                >
                  <Plus />
                  Add Variant
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((v, i) => (
                <div key={v.id} className="grid items-end gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                  <Field label={i === 0 ? "Options" : undefined}>
                    <Select
                      items={optionItems}
                      value={v.option}
                      onValueChange={(val) => setVariants((rows) => rows.map((r) => (r.id === v.id ? { ...r, option: val as string } : r)))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {optionItems.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={i === 0 ? "Value" : undefined}>
                    <Input
                      className="h-9"
                      value={v.value}
                      onChange={(e) => setVariants((rows) => rows.map((r) => (r.id === v.id ? { ...r, value: e.target.value } : r)))}
                    />
                  </Field>
                  <Field label={i === 0 ? "Price" : undefined}>
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      step="0.01"
                      value={v.price}
                      onChange={(e) => setVariants((rows) => rows.map((r) => (r.id === v.id ? { ...r, price: e.target.value } : r)))}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove variant"
                    disabled={variants.length === 1}
                    onClick={() => setVariants((rows) => rows.filter((r) => r.id !== v.id))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Base Price" htmlFor="base-price">
                <Input id="base-price" name="basePrice" type="number" min={0} step="0.01" className="h-8" />
              </Field>
              <Field label="Discounted Price" htmlFor="discount-price">
                <Input id="discount-price" name="discountedPrice" type="number" min={0} step="0.01" className="h-8" />
              </Field>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox name="chargeTax" />
                Charge tax on this product
              </label>
              <Separator />
              <label className="flex items-center gap-2 text-sm font-medium">
                <Switch name="inStock" defaultChecked />
                In stock
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Field hint="Set the product status.">
                <Select items={statusItems} value={status} onValueChange={(v) => setStatus(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusItems.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select
                  items={toItems(roots)}
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v as string);
                    setSubCategory(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {roots.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AddCategoryButton
                  onAdd={(name) => {
                    const slug = name.toLowerCase().replace(/\s+/g, "-");
                    setCats((c) => [...c, { slug, name }]);
                    setCategory(slug);
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Select items={toItems(subs)} value={subCategory} onValueChange={(v) => setSubCategory(v as string)} disabled={!category}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subs.length === 0 && <div className="px-2 py-1.5 text-sm text-muted-foreground">No sub categories</div>}
                    {subs.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AddCategoryButton
                  onAdd={(name) => {
                    if (!category) return toast.error("Pick a category first");
                    const slug = name.toLowerCase().replace(/\s+/g, "-");
                    setCats((c) => [...c, { slug, name, parent: category }]);
                    setSubCategory(slug);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
