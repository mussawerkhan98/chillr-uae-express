import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndustryForm } from "./industries.new";
import { adminGetIndustry, adminUpdateIndustry } from "@/lib/industries.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/industries/$id")({
  component: EditIndustry,
});

function EditIndustry() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetIndustry);
  const updateFn = useServerFn(adminUpdateIndustry);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "industries", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    content_html: "",
    image_url: null as string | null,
    image_alt: "",
    sort_order: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        slug: data.slug,
        description: data.description,
        content_html: data.content_html ?? "",
        image_url: data.image_url ?? null,
        image_alt: (data as any).image_alt ?? "",
        sort_order: data.sort_order,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      updateFn({
        data: {
          id,
          name: form.name,
          slug: form.slug,
          description: form.description,
          content_html: form.content_html,
          image_url: form.image_url,
          image_alt: form.image_alt || form.name,
          sort_order: form.sort_order,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "industries"] });
      qc.invalidateQueries({ queryKey: ["admin", "industries", id] });
      toast.success("Industry saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/industries"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to industries
        </Link>
        {form.slug && (
          <a
            href={`/industries/${form.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View live <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <h1 className="font-display text-3xl font-bold text-navy">Edit industry</h1>

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
          Save changes
        </Button>
      </div>
    </div>
  );
}
