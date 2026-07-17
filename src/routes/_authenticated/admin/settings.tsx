import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminListSettings, adminUpdateSettings } from "@/lib/settings.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

const FIELDS: { key: string; label: string; multiline?: boolean; group?: string }[] = [
  { key: "site_tagline", label: "Tagline" },
  { key: "site_phone", label: "Phone" },
  { key: "site_whatsapp", label: "WhatsApp number (digits only, e.g. 971501234567)" },
  { key: "site_email", label: "Email" },
  { key: "site_address", label: "Address" },
  { key: "meta_home_title", label: "Homepage SEO title" },
  { key: "meta_home_description", label: "Homepage SEO description", multiline: true },
  { key: "about_hero_title", label: "About page: headline", multiline: true, group: "About page" },
  { key: "about_hero_subtitle", label: "About page: intro paragraph", multiline: true, group: "About page" },
  { key: "about_story_p1", label: "About page: our story — paragraph 1", multiline: true, group: "About page" },
  { key: "about_story_p2", label: "About page: our story — paragraph 2", multiline: true, group: "About page" },
  { key: "about_story_p3", label: "About page: our story — paragraph 3", multiline: true, group: "About page" },
  { key: "stat_1_value", label: "About page: stat 1 value (e.g. 10+)", group: "About page" },
  { key: "stat_1_label", label: "About page: stat 1 label", group: "About page" },
  { key: "stat_2_value", label: "About page: stat 2 value", group: "About page" },
  { key: "stat_2_label", label: "About page: stat 2 label", group: "About page" },
  { key: "stat_3_value", label: "About page: stat 3 value", group: "About page" },
  { key: "stat_3_label", label: "About page: stat 3 label", group: "About page" },
  { key: "stat_4_value", label: "About page: stat 4 value", group: "About page" },
  { key: "stat_4_label", label: "About page: stat 4 label", group: "About page" },
];

function SettingsPage() {
  const listFn = useServerFn(adminListSettings);
  const updateFn = useServerFn(adminUpdateSettings);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => listFn(),
  });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      const map: Record<string, string> = {};
      for (const row of data) map[row.key] = row.value ?? "";
      setForm(map);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => updateFn({ data: form }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings saved");
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
    <div className="p-8 max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-navy">Site settings</h1>
        <p className="text-muted-foreground mt-1">
          Contact info and homepage meta text used across the site.
        </p>
      </header>

      <div className="space-y-5">
        {FIELDS.filter((f) => !f.group).map((f) => (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.multiline ? (
              <Textarea
                id={f.key}
                rows={3}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                id={f.key}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-5 pt-6 border-t">
        <h2 className="font-display text-xl font-bold text-navy">About page content</h2>
        {FIELDS.filter((f) => f.group === "About page").map((f) => (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.multiline ? (
              <Textarea
                id={f.key}
                rows={3}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                id={f.key}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save settings
        </Button>
      </div>
    </div>
  );
}
