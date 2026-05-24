export const metadata = {
  title: "About — ATHNIC CLOTHING",
  description: "Born from the streets of India. Athnic Clothing is raw, unapologetic Gen Z streetwear.",
};

export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Hero */}
      <section className="relative px-6 md:px-12 py-20 md:py-32 border-b-[3px] border-athnic-gray">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-athnic-acid rounded-full blur-[150px]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-4">
            The Story
          </p>
          <h1 className="font-display text-5xl md:text-8xl font-extrabold uppercase leading-tight">
            We Started With
            <br />
            <span className="gradient-text">A Rebellion.</span>
          </h1>
          <p className="font-mono text-base md:text-lg text-athnic-light-gray mt-8 max-w-2xl leading-relaxed">
            Athnic wasn&apos;t born in a boardroom. It was born on the streets. In the hostels.
            In the DMs where we said &quot;why doesn&apos;t anyone make clothes for US?&quot; — for the kids
            who grew up on hip-hop and chai, who code-switch between Hindi and English,
            who carry their culture like armor.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-4">
            What We Stand For
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase mb-12">
            The Manifesto
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Rooted, Not Routine",
                desc: "Our culture isn't a trend. It's the DNA of every stitch. We remix tradition with raw street energy — because heritage should feel alive, not archived.",
                icon: "🌿",
              },
              {
                title: "Drop the Ordinary",
                desc: "Generic is dead. Every piece we make is designed to trigger a double-take. If it doesn't make you feel something, it doesn't leave the workshop.",
                icon: "⚡",
              },
              {
                title: "For the Many, Not the Few",
                desc: "Premium doesn't have to mean exclusive. We build quality streetwear at prices that don't make you choose between a hoodie and your Zomato order.",
                icon: "✊",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="border-2 border-athnic-gray p-8 hover:border-athnic-acid transition-colors group"
              >
                <span className="text-4xl">{value.icon}</span>
                <h3 className="font-display text-xl uppercase mt-4 mb-3 group-hover:text-athnic-acid transition-colors">
                  {value.title}
                </h3>
                <p className="font-mono text-xs text-athnic-light-gray leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t-[3px] border-athnic-gray mx-6 md:mx-12" />

      {/* Founder Section */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-athnic-dark border-2 border-athnic-gray flex items-center justify-center">
            <span className="font-display text-6xl text-athnic-mid-gray">FOUNDER</span>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-4">
              The Founder
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase mb-6">
              From Vision
              <br />
              to <span className="text-athnic-acid">Vibe.</span>
            </h2>
            <div className="space-y-4 font-mono text-sm text-athnic-light-gray leading-relaxed">
              <p>
                &quot;I grew up wearing brands that weren&apos;t built for me. None of them understood
                the duality of being young, Indian, and global. So I built one that does.&quot;
              </p>
              <p>
                Athnic started in a college dorm with a screen-printing machine and a
                group chat full of ideas. Today, it&apos;s a movement — a tribe of young Indians
                who wear their identity with pride.
              </p>
              <p>
                Every design starts with a question: &quot;Would I wear this?&quot; If the answer
                isn&apos;t an immediate yes, it gets scrapped. No compromises. No filler.
                Just heat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-athnic-acid py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2024", label: "Founded" },
              { number: "50K+", label: "Tribe Strong" },
              { number: "10K+", label: "Orders Shipped" },
              { number: "28", label: "Indian States Served" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-4xl md:text-5xl font-extrabold text-athnic-black">
                  {stat.number}
                </span>
                <p className="font-mono text-[10px] tracking-[0.2em] text-athnic-black/70 uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
