import { Card, CardTitle } from "@/components/ui/Card";
import { TONE, freshnessText } from "@/lib/utils/dashboard";
import { isDataStale } from "@/lib/utils/format";
import type { QueryStatus } from "@/hooks/useLatestReading";
import type { SensorDataRow } from "@/lib/supabase/types";

function HealthRow({ label, value, ok }: { label: string; value: string; ok: boolean | null }) {
  const t = ok === null ? TONE.warning : ok ? TONE.normal : TONE.danger;
  return (
    <div className="flex items-center justify-between border-b border-[#e6eef2] py-3 text-[13px] last:border-b-0 last:pb-0">
      <span className="text-[#4a6070]">{label}</span>
      <span className="flex items-center gap-2 text-[12px] font-bold" style={{ color: t.text }}>
        <i className="h-2 w-2 rounded-full" style={{ backgroundColor: t.dot }} />
        {value}
      </span>
    </div>
  );
}

export function StationHealthCard({
  queryStatus, envRow, weatherRow, latestTimestamp,
}: { queryStatus: QueryStatus; envRow: SensorDataRow | null; weatherRow: SensorDataRow | null; latestTimestamp: string | null }) {
  const envOk = envRow ? !isDataStale(envRow.created_at) : null;
  const wxOk = weatherRow ? !isDataStale(weatherRow.created_at) : null;
  const telemetry =
    !envRow && !weatherRow ? { v: "No data", ok: null as boolean | null }
    : envOk && wxOk ? { v: "Connected", ok: true }
    : { v: envOk || wxOk ? "Partial" : "Stale", ok: envOk || wxOk ? null : false };
  const gateway =
    queryStatus === "success" ? { v: "Online", ok: true as boolean | null }
    : queryStatus === "error" ? { v: "Offline", ok: false }
    : { v: "Connecting…", ok: null };
  const fresh = isDataStale(latestTimestamp) ? false : true;

  return (
    <Card className="flex h-full flex-col">
      <CardTitle>Station health</CardTitle>
      <div className="mt-3">
        <HealthRow label="Sensor telemetry" value={telemetry.v} ok={telemetry.ok} />
        <HealthRow label="Gateway connection" value={gateway.v} ok={gateway.ok} />
        <HealthRow label="Data freshness" value={freshnessText(latestTimestamp)} ok={latestTimestamp ? fresh : null} />
      </div>
    </Card>
  );
}
