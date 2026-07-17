import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminListServices, adminDeleteService } from "@/lib/services.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/services/")({
  component: ServicesList,
});

function ServicesList() {
  const navigate = useNavigate();
  const listFn = useServerFn(adminListServices);
  const deleteFn = useServerFn(adminDeleteService);
  const qc = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: () => listFn(),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("Service deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage service offerings shown on the Services page.
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/admin/services/new" })}>
          <Plus className="h-4 w-4 mr-1" /> New service
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No services yet. Add your first one.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Description</th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-4 font-medium text-navy">{s.title}</td>
                  <td className="p-4 text-sm text-muted-foreground line-clamp-1 max-w-md">
                    {s.description}
                  </td>
                  <td className="p-4 flex gap-1 justify-end">
                    <Link
                      to="/admin/services/$id"
                      params={{ id: s.id }}
                      className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${s.title}"? This cannot be undone.`))
                          del.mutate(s.id);
                      }}
                      className="h-8 w-8 rounded-md hover:bg-destructive/10 text-destructive flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
