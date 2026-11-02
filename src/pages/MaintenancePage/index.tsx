import { Wrench, Clock3, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0b1020] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.28),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(135deg,_#07130d_0%,_#0c1c14_52%,_#08100c_100%)]" />
      <div className="relative flex flex-col min-h-screen items-center justify-center px-4 py-12">
        <img src={'/images/logo-transparent.png'} alt="" className="h-auto w-[160px]" />

        <Card className="w-full max-w-2xl border-emerald-400/15 bg-white/5 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10">
                  <Wrench className="h-11 w-11 text-emerald-300" />
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100/90">
                <ShieldAlert className="h-3.5 w-3.5" />
                Maintenance Mode
              </span>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl text-white">
                We&apos;ll be back shortly
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-6 text-slate-200/80 sm:text-base">
                The site is temporarily unavailable while we make improvements and perform
                maintenance. Please check back in a little while.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                  <Clock3 className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-white">Expected downtime</h2>
                <p className="mt-1 text-sm text-slate-200/75">
                  Short and temporary while updates are being applied.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-white">Need help?</h2>
                <p className="mt-1 text-sm text-slate-200/75">
                  Reach out to the support team if you need urgent assistance.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-emerald-400 px-6 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Refresh page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
