"use client";

import { Avatar, AvatarFallback } from "@b2c/ui/components/avatar";
import { Badge } from "@b2c/ui/components/badge";
import { Button } from "@b2c/ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@b2c/ui/components/dialog";
import { Input } from "@b2c/ui/components/input";
import { Label } from "@b2c/ui/components/label";
import { Progress } from "@b2c/ui/components/progress";
import { Textarea } from "@b2c/ui/components/textarea";
import { CirclePlus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type ReviewRow = { id: string; author: string; initials: string; ago: string; rating: number; content: string; verified: boolean };

const STEP = 4;

export function ProductReviews({ reviews }: { reviews: ReviewRow[] }) {
  const [shown, setShown] = useState(STEP);
  const [open, setOpen] = useState(false);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const share = (n: number) => (reviews.length ? Math.round((reviews.filter((r) => r.rating === n).length / reviews.length) * 100) : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              <CirclePlus />
              Submit Review
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a review</DialogTitle>
                <DialogDescription>Add a review on behalf of a customer.</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast.success("Review submitted");
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="r-name">Name</Label>
                  <Input id="r-name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="r-rating">Rating (1–5)</Label>
                  <Input id="r-rating" type="number" min={1} max={5} defaultValue={5} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="r-body">Review</Label>
                  <Textarea id="r-body" required />
                </div>
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:gap-6 xl:grid-cols-3">
          <div className="order-last space-y-4 xl:order-first xl:col-span-2">
            {reviews.slice(0, shown).map((r) => (
              <div key={r.id} className="grid gap-4 rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="size-10">
                    <AvatarFallback>{r.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium">{r.author}</div>
                      <div className="text-xs text-muted-foreground">{r.ago}</div>
                      {r.verified && <span className="text-xs text-green-600">Verified Purchase</span>}
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Star className="fill-orange-400 text-orange-400" />
                      {r.rating.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.content}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
            {shown < reviews.length && (
              <div className="text-center">
                <Button variant="link" onClick={() => setShown((s) => s + STEP)}>
                  Load more..
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="size-6 fill-orange-400 text-orange-400" />
              <span className="text-2xl font-semibold">{avg.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
            </div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="flex items-center gap-3 text-sm">
                  <span className="w-3">{n}</span>
                  <Star className="size-3.5 fill-orange-400 text-orange-400" />
                  <Progress value={share(n)} className="h-2 flex-1" indicatorClassName="bg-orange-400" />
                  <span className="w-10 text-right text-muted-foreground">{share(n)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
