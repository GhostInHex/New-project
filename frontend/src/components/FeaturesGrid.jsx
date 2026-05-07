const features = [
  {
    title: "Smart Contribution Logging",
    eyebrow: "Zero-stress updates",
    description: "Capture tiny daily receipts in seconds, so work stays visible without pressure.",
    accent: "from-cyan-200 via-indigo-300 to-violet-300",
    Visual: ContributionVisual,
  },
  {
    title: "Team Activity Timeline",
    eyebrow: "Shared momentum",
    description: "See the project pulse at a glance with a calm timeline of effort and progress.",
    accent: "from-indigo-300 via-cyan-200 to-sky-300",
    Visual: TimelineVisual,
  },
  {
    title: "Private Peer Reflection System",
    eyebrow: "Safe feedback loops",
    description: "Turn anonymous reflections into private coaching, never public callouts.",
    accent: "from-violet-300 via-fuchsia-300 to-cyan-200",
    Visual: ReflectionVisual,
  },
];

function ContributionVisual() {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 150" className="h-full w-full">
      <defs>
        <linearGradient id="contribution-card" x1="42" x2="195" y1="24" y2="128">
          <stop stopColor="#A5F3FC" />
          <stop offset="0.5" stopColor="#818CF8" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
        <filter id="contribution-glow" x="-35%" y="-45%" width="170%" height="190%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect x="54" y="29" width="132" height="86" rx="22" fill="#020617" opacity="0.68" />
      <rect
        x="54"
        y="29"
        width="132"
        height="86"
        rx="22"
        fill="url(#contribution-card)"
        filter="url(#contribution-glow)"
        opacity="0.28"
      />
      <rect
        x="54"
        y="29"
        width="132"
        height="86"
        rx="22"
        fill="none"
        stroke="url(#contribution-card)"
        strokeOpacity="0.9"
        strokeWidth="2"
      />
      <path d="M79 57h82M79 75h64M79 93h48" stroke="#E0F2FE" strokeLinecap="round" strokeWidth="5" />
      <path
        d="M60 122c26-20 46-23 71-9c19 10 34 9 55-13"
        fill="none"
        stroke="url(#contribution-card)"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <circle cx="187" cy="99" r="8" fill="#F8FAFC" />
      <circle cx="187" cy="99" r="18" fill="#67E8F9" opacity="0.15" />
    </svg>
  );
}

function TimelineVisual() {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 150" className="h-full w-full">
      <defs>
        <linearGradient id="timeline-rail" x1="38" x2="202" y1="78" y2="78">
          <stop stopColor="#C4B5FD" />
          <stop offset="0.48" stopColor="#67E8F9" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <radialGradient id="timeline-node" cx="50%" cy="50%" r="50%">
          <stop stopColor="#F8FAFC" />
          <stop offset="0.45" stopColor="#67E8F9" />
          <stop offset="1" stopColor="#312E81" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M38 78h164" stroke="url(#timeline-rail)" strokeLinecap="round" strokeWidth="5" />
      <g fill="none" stroke="#E0E7FF" strokeOpacity="0.2" strokeLinecap="round">
        <path d="M58 37v82" />
        <path d="M111 28v95" />
        <path d="M166 42v76" />
      </g>
      <g>
        <circle cx="58" cy="78" r="23" fill="url(#timeline-node)" opacity="0.52" />
        <circle cx="58" cy="78" r="7" fill="#F8FAFC" />
        <circle cx="111" cy="78" r="30" fill="url(#timeline-node)" opacity="0.58" />
        <circle cx="111" cy="78" r="9" fill="#F8FAFC" />
        <circle cx="166" cy="78" r="23" fill="url(#timeline-node)" opacity="0.52" />
        <circle cx="166" cy="78" r="7" fill="#F8FAFC" />
      </g>
      <path
        d="M58 54c14-17 39-17 53 0M111 102c14 15 41 15 55 0"
        fill="none"
        stroke="#A5F3FC"
        strokeLinecap="round"
        strokeOpacity="0.82"
        strokeWidth="3"
      />
    </svg>
  );
}

function ReflectionVisual() {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 150" className="h-full w-full">
      <defs>
        <linearGradient id="reflection-shield" x1="70" x2="170" y1="20" y2="128">
          <stop stopColor="#DDD6FE" />
          <stop offset="0.5" stopColor="#C084FC" />
          <stop offset="1" stopColor="#67E8F9" />
        </linearGradient>
        <filter id="reflection-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <path
        d="M120 24l58 21v34c0 35-22 55-58 70c-36-15-58-35-58-70V45l58-21Z"
        fill="url(#reflection-shield)"
        filter="url(#reflection-glow)"
        opacity="0.22"
      />
      <path
        d="M120 29l49 18v31c0 29-18 46-49 60c-31-14-49-31-49-60V47l49-18Z"
        fill="#020617"
        fillOpacity="0.48"
        stroke="url(#reflection-shield)"
        strokeWidth="2"
      />
      <path
        d="M96 82c10 11 19 16 24 16s14-5 24-16"
        fill="none"
        stroke="#F8FAFC"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <circle cx="90" cy="63" r="7" fill="#A5F3FC" />
      <circle cx="150" cy="63" r="7" fill="#C4B5FD" />
      <g fill="none" stroke="#E0F2FE" strokeLinecap="round" strokeOpacity="0.34">
        <path d="M43 53h24" />
        <path d="M173 53h24" />
        <path d="M47 102h26" />
        <path d="M167 102h26" />
      </g>
    </svg>
  );
}

export function FeaturesGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-light uppercase tracking-[0.34em] text-cyan-100/70">
          Modern project survival kit
        </p>
        <h2
          id="features-title"
          className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-slate-50 sm:text-5xl"
        >
          Survival, without the stress.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base font-light leading-7 text-slate-400 sm:text-lg">
          Three quiet systems that make group work clearer, kinder, and easier to finish.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
        {features.map(({ title, eyebrow, description, accent, Visual }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.052] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-22px_48px_rgba(15,23,42,0.34),0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.078] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-22px_58px_rgba(49,46,129,0.24),0_34px_110px_rgba(8,47,73,0.38)]"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div
              className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-[0.34]`}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/[0.045]" />

            <div className="relative h-40 overflow-hidden rounded-[1.45rem] border border-white/10 bg-slate-950/45 shadow-[inset_0_0_46px_rgba(148,163,184,0.08)]">
              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-[0.15]`} />
              <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,.34)_1px,transparent_1px)] [background-size:13px_13px] opacity-[0.18]" />
              <div className="relative h-full p-3 transition-transform duration-300 group-hover:scale-[1.03]">
                <Visual />
              </div>
            </div>

            <div className="relative mt-6 min-w-0">
              <p className={`bg-gradient-to-r ${accent} bg-clip-text text-sm font-medium text-transparent`}>
                {eyebrow}
              </p>
              <h3 className="mt-2 text-pretty text-2xl font-semibold tracking-[-0.03em] text-slate-50">
                {title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm font-light leading-6 text-slate-400">
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
