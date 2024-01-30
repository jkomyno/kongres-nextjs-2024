import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";

// Use `/survey` as the canonical homepage URL.
export const loader: LoaderFunction = async ({ }) => {
  return redirect("/survey");
}
