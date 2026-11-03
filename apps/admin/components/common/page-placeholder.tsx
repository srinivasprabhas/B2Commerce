import { Card, CardContent } from "@b2c/ui/components/card";

export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Coming soon — this view will load data from the API.
        </CardContent>
      </Card>
    </div>
  );
}
