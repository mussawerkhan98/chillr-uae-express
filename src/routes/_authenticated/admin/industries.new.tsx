import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, lazy, Suspense } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { adminCreateIndustry } from "@/lib/industries.functions";
import { toast } from "sonner";

// Lazy-loaded: TipTap/ProseMirror is only needed on this admin form,
// so this keeps it out of the shared bundle every public page loads.
const RichTextEditor = lazy(() =>
  import("@/components/admin/RichTextEditor").then((m) => ({ default: m.RichTextEditor })),
);

export const Route = createFileRoute("/_authenticated/admin/industries/new")({
  component: NewIndustry,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  content_html: string;
  image_url: string | null;
  image_alt: string;
  sort_order: number;
};

function NewIndustry() {
  const navigate = useNavigate();
  const createFn = useServerFn(adminCreateIndustry);
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    content_html: "",
    image_url: null,
    image_alt: "",
    sort_order: 0,
  });

  const save = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          name: form.name,
          slug: form.slug || slugify(form.name),
          description: form.description,
          content_html: form.content_html,
          image_url: form.image_url,
          image_alt: form.image_alt || form.name,
          sort_order: form.sort_order,
        },
      }),
    onSuccess: ({ id }) => {
      toast.success("Industry created");
      navigate({ to: "/admin/industries/$id", params: { id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <Link
        to="/admin/industries"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to industries
      </Link>
      <h1 className="font-display text-3xl font-bold text-navy">New industry</h1>

      <IndustryForm form={form} setForm={setForm} />

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate({ to: "/admin/industries" })}>
          Cancel
        </Button>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !form.name.trim()}>
          {save.isPending ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save industry
        </Button>
      </div>
    </div>
  );
}

export function IndustryForm({
  form,
  setForm,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })
          }
          placeholder="Restaurants"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (page URL)</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/industries/</span>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
          />
        </div>
      </div>
      <ImageUploader
        value={form.image_url}
        onChange={(url) => setForm({ ...form, image_url: url })}
        folder="industries"
        label="Industry image"
      />
      <div className="space-y-2">
        <Label htmlFor="image_alt">Image alt text (for accessibility &amp; SEO)</Label>
        <Input
          id="image_alt"
          value={form.image_alt}
          onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
          placeholder="e.g. Chiller van delivering to a restaurant kitchen, Dubai"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Short description (shown on the Industries list)</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Full page content (shown on this industry's own page)</Label>
        <Suspense fallback={<div className="min-h-[440px] rounded-lg border border-input bg-card animate-pulse" />}>
          <RichTextEditor
            value={form.content_html}
            onChange={(html) => setForm({ ...form, content_html: html })}
          />
        </Suspense>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort_order">Sort order</Label>
        <Input
          id="sort_order"
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
        />
      </div>
    </div>
  );
}
