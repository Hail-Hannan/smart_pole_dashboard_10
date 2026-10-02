import { ReactNode } from "react";
import { CircleDashed, Sun } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TONE, feelsLike, uiLabel } from "@/lib/utils/dashboard";
import { evaluateHumidity, evaluateTemperature, type Severity } from "@/lib/utils/thresholds";
import type { SensorDataRow } from "@/lib/supabase/types";

function Tile({
  title, value, unit, severity, statusLabel, sub, icon,
}: {
  title: string; value: string; unit?: string; severity: Severity; statusLabel?: string; sub?: string; icon: ReactNode;
}) {
  const t = TONE[severity];
  return (
    <Card className="!px-[18px] !py-5">
      <h3 className="text-[13.5px] font-medium text-[#3d5363]">{title}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[38px] font-bold leading-none tracking-[-0.03em] text-[#12283a]">{value}</span>
        {unit && <span className="text-[14px] text-[#8397a6]">{unit}</span>}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-[#5b6f7e]">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: t.dot }} />
          <b className="font-bold" style={{ color: t.text }}>{statusLabel ?? uiLabel(severity)}</b>
          {sub && <span className="truncate">· {sub}</span>}
        </span>
        <span className="shrink-0 text-[#a3c4c6]">{icon}</span>
      </div>
    </Card>
  );
}

export function KpiRow({ envRow }: { envRow: SensorDataRow | null }) {
  const temp = envRow?.temperature ?? null;
  const hum = envRow?.humidity ?? null;
  const feels = feelsLike(temp, hum);
  const ic = { size: 20, strokeWidth: 1.5 };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Tile title="Temperature" value={temp === null ? "—" : temp.toFixed(1)} unit="°C"
        severity={evaluateTemperature(temp).severity}
        sub={feels === null ? undefined : `Feels like ${feels.toFixed(1)} °C`} icon={<Sun {...ic} />} />
      <Tile title="Humidity" value={hum === null ? "—" : hum.toFixed(0)} unit="%RH"
        severity={evaluateHumidity(hum).severity} sub="Relative humidity" icon={<CircleDashed {...ic} />} />
    </div>
  );
}
