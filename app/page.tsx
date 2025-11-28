"use client";

import { useEffect, useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatBig(n: number) {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("fr-CA");
}

export default function Page() {
  const [dob, setDob] = useState<string>("1995-01-01");

  // paramètres simples (tu peux les laisser par défaut)
  const [bpm, setBpm] = useState<number>(70);
  const [breathsPerMin, setBreathsPerMin] = useState<number>(14);
  const [tidalVolumeL, setTidalVolumeL] = useState<number>(0.5); // L par respiration (repos)
  const [o2ExtractFrac, setO2ExtractFrac] = useState<number>(0.05); // fraction du volume d'air "utilisé" (approx)

  // refresh live
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const stats = useMemo(() => {
    const birth = new Date(dob + "T00:00:00");
    const ms = now.getTime() - birth.getTime();
    const seconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365.2425;
    const orbitsAroundSun = years; // approx: 1 orbite par année

    const bpmSafe = clamp(bpm, 30, 220);
    const brSafe = clamp(breathsPerMin, 6, 40);
    const tvSafe = clamp(tidalVolumeL, 0.2, 1.5);
    const o2Safe = clamp(o2ExtractFrac, 0.01, 0.1);

    const heartbeats = minutes * bpmSafe;
    const breaths = minutes * brSafe;
    const airLiters = breaths * tvSafe;
    const oxygenLiters = airLiters * o2Safe;

    // eau recommandée (juste une plage simple)
    const waterLow = days * 2.0;
    const waterHigh = days * 3.0;

    return {
      seconds,
      minutes,
      hours,
      days,
      years,
      heartbeats,
      breaths,
      airLiters,
      oxygenLiters,
      waterLow,
      waterHigh,
      orbitsAroundSun,
    };
  }, [dob, now, bpm, breathsPerMin, tidalVolumeL, o2ExtractFrac]);

  const [mode, setMode] = useState<"classic" | "geek">("classic");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          Life Stats Calculator
        </h1>
        <p className="mt-2 text-slate-300">
          Un mini tableau de bord qui estime des statistiques de vie à partir
          d’une date de naissance.
        </p>
        <p className="mt-2 text-slate-300">
          Estimations basées sur des moyennes. Tu peux ajuster les paramètres si
          tu veux.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-slate-900/60 p-6 shadow">
            <h2 className="text-xl font-semibold">Entrée</h2>

            <label className="mt-4 block text-sm text-slate-300">
              Date de naissance
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-2 w-full rounded-xl bg-slate-950/70 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300">
                  Battements/min (BPM)
                </label>
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300">
                  Respirations/min
                </label>
                <input
                  type="number"
                  value={breathsPerMin}
                  onChange={(e) => setBreathsPerMin(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300">
                  Air par respiration (L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tidalVolumeL}
                  onChange={(e) => setTidalVolumeL(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300">
                  O2 utilisé (fraction)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={o2ExtractFrac}
                  onChange={(e) => setO2ExtractFrac(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Notes rapides: 0.5 L/respiration et 14 respi/min est un ordre de
              grandeur au repos. Le O2 utilisé est une approximation grossière.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div className="text-sm font-semibold text-slate-200">Mode</div>

              <div className="inline-flex rounded-xl bg-slate-900/60 p-1 ring-1 ring-slate-800">
                <button
                  onClick={() => setMode("classic")}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    mode === "classic"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Classique
                </button>
                <button
                  onClick={() => setMode("geek")}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    mode === "geek"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Geek
                </button>
              </div>

              <InfoTip text="Classique: les stats principales, rapide et lisible. Geek: plus de détails, unités, hypothèses et chiffres avancés." />
            </div>
          </section>

          <section className="rounded-2xl bg-slate-900/60 p-6 shadow">
            <h2 className="text-xl font-semibold">Résultats</h2>

            <div className="mt-4 grid gap-3">
              <Stat
                label="Tours autour du soleil "
                value={stats.orbitsAroundSun.toFixed(2)}
                info="Approximation: 1 orbite ≈ 1 année (365,2425 jours)."
              />

              <Stat label="Âge (jours)" value={formatBig(stats.days)} />
              <Stat
                label="Temps vécu (heures)"
                value={formatBig(stats.hours)}
              />
              {mode === "geek" && (
                <>
                  <Stat
                    label="Temps vécu (minutes)"
                    value={formatBig(stats.minutes)}
                  />
                  <Stat
                    label="Temps vécu (secondes)"
                    value={formatBig(stats.seconds)}
                  />
                  {/* ajoute d’autres trucs ici */}
                </>
              )}
              <div className="h-px bg-slate-800 my-2" />

              <Stat
                label="Battements de coeur (estimé)"
                value={formatBig(stats.heartbeats)}
                info="Calcul: minutes vécues × BPM. Par défaut 70 BPM (repos). Ajuste le BPM si tu es plus actif."
              />
              <Stat
                label="Respirations (estimé)"
                value={formatBig(stats.breaths)}
                info="Calcul: minutes vécues × respirations/min. Valeur repos typique: 12–16."
              />
              <Stat
                label="Air respiré (L, estimé)"
                value={formatBig(stats.airLiters)}
                info="Calcul: respirations × litres/respiration (volume courant). Valeur repos typique: ~0,5 L par respiration."
              />
              <Stat
                label="Oxygène utilisé (L, estimé)"
                value={formatBig(stats.oxygenLiters)}
                info="Estimation grossière: air respiré × fraction d’oxygène “utilisé”. C’est une simplification pour donner un ordre de grandeur."
              />

              <div className="h-px bg-slate-800 my-2" />

              <Stat
                label="Eau recommandée (L, 2 à 3 L / jour)"
                value={`${formatBig(stats.waterLow)} à ${formatBig(
                  stats.waterHigh
                )}`}
                info="Plage indicative: 2 à 3 L/jour (inclut souvent l’eau provenant des aliments). Ça varie selon chaleur, activité, etc."
              />
            </div>

          
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  info,
}: {
  label: string;
  value: string;
  info?: string;
}) {
  return (
    <div className="flex items-baseline justify-between rounded-xl bg-slate-950/50 px-4 py-3 ring-1 ring-slate-800">
      <div className="text-sm text-slate-300 flex items-center">
        {label}
        {info ? <InfoTip text={info} /> : null}
      </div>
      <div className="text-lg font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center group">
      <span
        role="button"
        tabIndex={0}
        className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full
                   bg-slate-800 text-xs font-bold text-slate-200 ring-1 ring-slate-700
                   hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        ?
      </span>

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-[260px]
                   -translate-x-1/2 rounded-xl bg-slate-950/95 px-3 py-2 text-xs
                   text-slate-200 opacity-0 shadow-lg ring-1 ring-slate-700
                   transition group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
