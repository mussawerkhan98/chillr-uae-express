import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "./services.new";
import { adminGetService, adminUpdateService } from "@/lib/services.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/services/$id")({
  component: EditService,
});

function EditService() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetService);
  const updateFn = useServerFn(adminUpdateService);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "services", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content_html: "",
    image_url: null as string | null,
    icon: "",
    sort_order: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title,
        slug: data.slug ?? "",
        description: data.description,
        content_html: data.content_html ?? "",
        image_url: data.image_url ?? null,
        icon: data.icon ?? "",
        sort_order: data.sort_order,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      updateFn({
        data: {
          id,
          title: form.title,
          slug: form.slug,
          description: form.description,
          content_html: form.content_html,
          image_url: form.image_url,
          icon: form.icon || null,
          sort_order: form.sort_order,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      qc.invalidateQueries({ queryKey: ["admin", "services", id] });
      toast.success("Service saved");
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
          to="/admin/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
        {form.slug && (
          <a
            href={`/services/${form.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View live <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <h1 className="font-display text-3xl font-bold text-navy">Edit service</h1>

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
          Save changes
        </Button>
      </div>
    </div>
  );
}
