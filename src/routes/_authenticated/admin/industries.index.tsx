import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminListIndustries, adminDeleteIndustry } from "@/lib/industries.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/industries/")({
  component: IndustriesList,
});

function IndustriesList() {
  const navigate = useNavigate();
  const listFn = useServerFn(adminListIndustries);
  const deleteFn = useServerFn(adminDeleteIndustry);
  const qc = useQueryClient();

  const { data: industries = [], isLoading } = useQuery({
    queryKey: ["admin", "industries"],
    queryFn: () => listFn(),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "industries"] });
      toast.success("Industry deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">Industries</h1>
          <p className="text-muted-foreground mt-1">
            Manage the industries shown on the Industries page.
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/admin/industries/new" })}>
          <Plus className="h-4 w-4 mr-1" /> New industry
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : industries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No industries yet. Add your first one.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Description</th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody>
              {industries.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="font-medium text-navy">{i.name}</div>
                    <div className="text-xs text-muted-foreground">/{i.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground line-clamp-1 max-w-md">
                    {i.description}
                  </td>
                  <td className="p-4 flex gap-1 justify-end">
                    <Link
                      to="/admin/industries/$id"
                      params={{ id: i.id }}
                      className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${i.name}"? This cannot be undone.`)) del.mutate(i.id);
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
