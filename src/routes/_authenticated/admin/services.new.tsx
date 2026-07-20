import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { adminCreateService } from "@/lib/services.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/services/new")({
  component: NewService,
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
  title: string;
  slug: string;
  description: string;
  content_html: string;
  image_url: string | null;
  image_alt: string;
  icon: string;
  meta_title: string;
  meta_description: string;
  h1_override: string;
  sort_order: number;
};

function NewService() {
  const navigate = useNavigate();
  const createFn = useServerFn(adminCreateService);
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    description: "",
    content_html: "",
    image_url: null,
    image_alt: "",
    icon: "",
    meta_title: "",
    meta_description: "",
    h1_override: "",
    sort_order: 0,
  });

  const save = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          title: form.title,
          slug: form.slug || slugify(form.title),
          description: form.description,
          content_html: form.content_html,
          image_url: form.image_url,
          image_alt: form.image_alt || form.title,
          icon: form.icon || null,
          meta_title: form.meta_title || null,
          meta_description: form.meta_description || null,
          h1_override: form.h1_override || null,
          sort_order: form.sort_order,
        },
      }),
    onSuccess: ({ id }) => {
      toast.success("Service created");
      navigate({ to: "/admin/services/$id", params: { id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <Link
        to="/admin/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>
      <h1 className="font-display text-3xl font-bold text-navy">New service</h1>

      <ServiceForm form={form} setForm={setForm} />

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate({ to: "/admin/services" })}>
          Cancel
        </Button>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !form.title.trim()}>
          {save.isPending ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save service
        </Button>
      </div>
    </div>
  );
}

export function ServiceForm({
  form,
  setForm,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })
          }
          placeholder="Food & Beverage Transport"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (page URL)</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/services/</span>
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
        folder="services"
        label="Service image"
      />
      <div className="space-y-2">
        <Label htmlFor="image_alt">Image alt text (for accessibility &amp; SEO)</Label>
        <Input
          id="image_alt"
          value={form.image_alt}
          onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
          placeholder="e.g. Chiller van loading fresh produce, Dubai"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Short description (shown on the Services list)</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Full page content (shown on this service's own page)</Label>
        <RichTextEditor
          value={form.content_html}
          onChange={(html) => setForm({ ...form, content_html: html })}
        />
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

      <div className="space-y-5 pt-4 border-t">
        <h2 className="font-display text-lg font-bold text-navy">SEO overrides (optional)</h2>
        <div className="space-y-2">
          <Label htmlFor="h1_override">Page heading (H1) override</Label>
          <Input
            id="h1_override"
            value={form.h1_override}
            onChange={(e) => setForm({ ...form, h1_override: e.target.value })}
            placeholder={`Defaults to "${form.title || "service title"}"`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_title">SEO title</Label>
          <Input
            id="meta_title"
            value={form.meta_title}
            onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            placeholder="Defaults to service title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_description">SEO description</Label>
          <Textarea
            id="meta_description"
            rows={2}
            value={form.meta_description}
            onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
            placeholder="Defaults to short description"
          />
        </div>
      </div>
    </div>
  );
}
