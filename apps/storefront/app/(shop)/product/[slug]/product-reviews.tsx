import { BadgeCheck } from "lucide-react";
import { StarRating } from "@/app/(shop)/product/[slug]/star-rating";
import { WriteReview } from "@/app/(shop)/product/[slug]/review-form";
import type { Review } from "@/lib/types";

export function reviewSummary(reviews: Review[]) {
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average };
}

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  const { count, average } = reviewSummary(reviews);

  return (
    <section id="reviews" className="mt-20 scroll-mt-24 border-t border-border pt-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-medium tracking-tight">Customer Reviews</h2>
        {count > 0 && (
          <div className="flex items-center gap-3">
            <StarRating rating={average} size="lg" />
            <span className="text-lg font-medium">{average.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({count} {count === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {count > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-2 border-b border-border pb-6 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <StarRating rating={review.rating} />
                  <span className="font-medium">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                      Verified purchase
                    </span>
                  )}
                </div>
                <time className="text-sm text-muted-foreground" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </time>
              </div>
              <p className="leading-relaxed text-muted-foreground">{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews yet. Be the first!</p>
      )}

      <div className="mt-10">
        <WriteReview />
      </div>
    </section>
  );
}
