import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminCreateService } from "@/lib/services.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/services/new")({
  component: NewService,
});

type FormState = { title: string; description: string; icon: string; sort_order: number };

function NewService() {
  const navigate = useNavigate();
  const createFn = useServerFn(adminCreateService);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    icon: "",
    sort_order: 0,
  });

  const save = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          title: form.title,
          description: form.description,
          icon: form.icon || null,
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
    <div className="p-8 max-w-2xl space-y-6">
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
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Food & Beverage Transport"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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
    </div>
  );
}
