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

    // énergie approximative dégagée par le corps au repos (≈ 100 W)
    const restingPowerW = 100;
    const bodyEnergyKWh = (hours * restingPowerW) / 1000;

    // eau liée à l’hygiène (ordre de grandeur)
    const flushPerDay = 5;
    const litersPerFlush = 6;
    const toiletWaterLiters = days * flushPerDay * litersPerFlush;

    const showersPerDay = 1;
    const litersPerShower = 60;
    const hygieneWaterLiters = days * showersPerDay * litersPerShower;

    const personalWaterLiters = toiletWaterLiters + hygieneWaterLiters;

    // petits bonus "geek"
    const awakeFraction = 16 / 24;
    const awakeMinutes = minutes * awakeFraction;
    const blinksPerMinute = 15;
    const eyeBlinks = awakeMinutes * blinksPerMinute;

    const yawnsPerDay = 8;
    const yawns = days * yawnsPerDay;

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
      bodyEnergyKWh,
      toiletWaterLiters,
      hygieneWaterLiters,
      personalWaterLiters,
      eyeBlinks,
      yawns,
    };
  }, [dob, now, bpm, breathsPerMin, tidalVolumeL, o2ExtractFrac]);

  const [mode, setMode] = useState<"classic" | "geek">("classic");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          Statistiques de ta vie
        </h1>
        <p className="mt-2 text-slate-300">
          Un tableau de bord qui calcule quelques chiffres marquants à partir de
          ta date de naissance.
        </p>
        <p className="mt-2 text-slate-300">
          Toutes les valeurs sont basées sur des moyennes et des hypothèses
          simples. Tu peux ajuster les paramètres si tu veux affiner.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-slate-900/60 p-6 shadow">
            <h2 className="text-xl font-semibold">Tes paramètres</h2>

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
              0,5&nbsp;L par respiration et 14 respirations/minute sont des
              ordres de grandeur au repos. La fraction d’oxygène utilisé est
              aussi une approximation.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <div className="text-sm font-semibold text-slate-200">
                Niveau de détail
              </div>

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

            {/* Vue d’ensemble */}
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vue d’ensemble
              </h3>
              <div className="mt-2 grid gap-3">
                <Stat
                  label="Tours autour du Soleil"
                  value={stats.orbitsAroundSun.toFixed(2)}
                  unit="tours"
                  info="Approximation : 1 orbite ≈ 1 année (365,2425 jours)."
                />
                <Stat
                  label="Âge total en jours"
                  value={formatBig(stats.days)}
                  unit="jours"
                />
                <Stat
                  label="Temps vécu en heures"
                  value={formatBig(stats.hours)}
                  unit="heures"
                />
                {mode === "geek" && (
                  <>
                    <Stat
                      label="Temps vécu en minutes"
                      value={formatBig(stats.minutes)}
                      unit="minutes"
                    />
                    <Stat
                      label="Temps vécu en secondes"
                      value={formatBig(stats.seconds)}
                      unit="secondes"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Cœur et respiration */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Cœur et respiration
              </h3>
              <div className="mt-2 grid gap-3">
                <Stat
                  label="Battements de cœur"
                  value={formatBig(stats.heartbeats)}
                  unit="battements"
                  info="Calcul : minutes vécues × BPM moyen. Chiffre estimé à partir de ta valeur de BPM."
                />
                <Stat
                  label="Respirations"
                  value={formatBig(stats.breaths)}
                  unit="respirations"
                  info="Calcul : minutes vécues × respirations/minute. Valeur typique au repos : 12 à 16 respirations/min."
                />
                <Stat
                  label="Volume d’air respiré"
                  value={formatBig(stats.airLiters)}
                  unit="L"
                  info="Calcul : respirations × volume d’air par respiration. Valeur repos typique : ~0,5 L par respiration."
                />
                <Stat
                  label="Oxygène utilisé"
                  value={formatBig(stats.oxygenLiters)}
                  unit="L"
                  info="Estimation : volume d’air respiré × fraction d’oxygène utilisé. Donne un ordre de grandeur, pas une mesure clinique."
                />
                <Stat
                  label="Énergie dissipée par ton corps (repos)"
                  value={formatBig(stats.bodyEnergyKWh)}
                  unit="kWh"
                  info="Estimation : heures vécues × 100 W (métabolisme de base), converti en kWh."
                />
              </div>
            </div>

            {/* Hydratation */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Hydratation
              </h3>
              <div className="mt-2 grid gap-3">
                <Stat
                  label="Eau bue (plage estimée)"
                  value={`${formatBig(stats.waterLow)} à ${formatBig(
                    stats.waterHigh
                  )}`}
                  unit="L"
                  info="Plage indicative : 2 à 3 L/jour, incluant l’eau provenant des aliments. Les besoins réels varient selon l’activité et la température."
                />
              </div>
            </div>

            {/* Bonus (mode geek seulement) */}
            {mode === "geek" && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Bonus geek
                </h3>
                <div className="mt-2 grid gap-3">
                  <Stat
                    label="Clignements d’yeux"
                    value={formatBig(stats.eyeBlinks)}
                    unit="clignements"
                    info="Approximation : ~15 clignements par minute pendant environ 16 heures d’éveil par jour."
                  />
                  <Stat
                    label="Bâillements"
                    value={formatBig(stats.yawns)}
                    unit="bâillements"
                    info="Ordre de grandeur : quelques bâillements par jour, ici on prend environ 8/jour."
                  />
                  <Stat
                    label="Eau pour la toilette"
                    value={formatBig(stats.toiletWaterLiters)}
                    unit="L"
                    info="Estimation basée sur ~5 chasses d’eau par jour à 6 L chacune."
                  />
                  <Stat
                    label="Eau pour la douche et le lavage"
                    value={formatBig(stats.hygieneWaterLiters)}
                    unit="L"
                    info="Ordre de grandeur : 1 douche par jour à ~60 L."
                  />
                  <Stat
                    label="Eau d’hygiène perso (toilette + douche)"
                    value={formatBig(stats.personalWaterLiters)}
                    unit="L"
                    info="Addition de l’eau estimée pour la toilette et pour la douche/lavage."
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  unit,
  info,
}: {
  label: string;
  value: string;
  unit?: string;
  info?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 items-baseline rounded-xl bg-slate-950/50 px-4 py-3 ring-1 ring-slate-800">
      <div className="flex items-center text-sm text-slate-300">
        {label}
        {info ? <InfoTip text={info} /> : null}
      </div>
      <div className="text-lg font-semibold text-slate-100 text-right">
        {value}
      </div>
      {unit && <div className="text-xs text-slate-400 text-right">{unit}</div>}
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
