import Link from 'next/link';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F8F6F1] lg:grid lg:grid-cols-[55%_45%]">
      {/*LEFT SIDE — STATIC*/}
      <section className="relative hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
        {/* Furniture Background */}
        <div
          className="absolute inset-0 bg-[#F8F6F1] bg-[url('/images/auth-background.jpg')] bg-cover bg-center bg-no-repeat"
          aria-hidden="true"
        />
        {/* Subtle Overlay */}
        <div
          className="absolute inset-0 bg-white/[0.04]"
          aria-hidden="true"
        />
        {/* Left Content */}
        <div className="relative z-10 flex h-full flex-col px-10 py-8 xl:px-14">
          {/*LOGO*/}
          <Link
            href="/login"
            className="flex w-fit items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-[#D8D5CC] bg-[#F8F6F1]/95 shadow-sm">
              <img
                src="/images/logo.png"
                alt="Urban Furniture Logo"
                className="h-9 w-9 object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-[#2C2C2C]">
                Urban Furniture
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#737373]">
                Accounting System
              </span>
            </div>
          </Link>
          {/*HERO*/}
          <div className="mt-16 max-w-3xl xl:mt-20">
            <h1 className="max-w-2xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#2C2C2C] xl:text-[3.2rem]">
              Beautiful Business.
              <br />
              Intelligent Accounting.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#737373] xl:text-base">
              A modern accounting system built for furniture businesses to
              manage finances, stock, sales, purchases and reports —
              effortlessly.
            </p>
          </div>
          {/*FEATURES*/}
          <div className="mt-auto pb-2 pt-10">
            <div className="grid grid-cols-4 gap-3 rounded-2xl border border-white/70 bg-[#F8F6F1]/90 p-4 shadow-[0_12px_40px_rgba(44,44,44,0.08)] backdrop-blur-md">
              <Feature
                icon="chart"
                title="Real-time Insights"
                description="Track your financial performance with live dashboards and smart analytics."
              />
              <Feature
                icon="control"
                title="Complete Control"
                description="Manage sales, purchases, payments, inventory and accounting in one place."
              />
              <Feature
                icon="shield"
                title="Secure & Reliable"
                description="Role-based access, data security and audit-ready records."
              />
              <Feature
                icon="growth"
                title="Built for Growth"
                description="Scalable system that grows with your furniture business."
              />
            </div>
            <p className="mt-4 text-center text-xs text-[#737373]">
              © 2026 Urban Furniture ERP. All rights reserved.
            </p>
          </div>
        </div>
      </section>
      {/*RIGHT SIDE — SCROLLABLE FORM
       */}
      <section className="min-h-screen bg-[#FCFBF8]">
        <div className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[500px]">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <Link
                href="/login"
                className="flex w-fit items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#D8D5CC] bg-white shadow-sm">
                  <img
                    src="/images/logo.png"
                    alt="Urban Furniture Logo"
                    className="h-8 w-8 object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold leading-tight text-[#2C2C2C]">
                    Urban Furniture
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#737373]">
                    Accounting System
                  </span>
                </div>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
/* ====
   FEATURE COMPONENT
==== */
function Feature({
  icon,
  title,
  description,
}: {
  icon: 'chart' | 'control' | 'shield' | 'growth';
  title: string;
  description: string;
}) {
  return (
    <div className="min-w-0 px-2 py-2">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B705C] text-white">
        {icon === 'chart' && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 19V5" />
            <path d="M4 19H20" />
            <path d="M7 15l3-4 3 2 5-7" />
          </svg>
        )}
        {icon === 'control' && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6V11.4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V13.6h-.1a1.7 1.7 0 0 0-1.5 1.4Z" />
          </svg>
        )}
        {icon === 'shield' && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 3l7 3v5c0 4.6-2.9 8.4-7 10-4.1-1.6-7-5.4-7-10V6l7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        )}
        {icon === 'growth' && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 19h16" />
            <path d="M6 16l4-4 3 3 5-7" />
            <path d="M15 8h3v3" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-semibold leading-5 text-[#2C2C2C]">
        {title}
      </h3>
      <p className="mt-1.5 text-xs leading-5 text-[#737373]">
        {description}
      </p>
    </div>
  );
}