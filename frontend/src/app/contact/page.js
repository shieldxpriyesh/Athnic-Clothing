export const metadata = {
  title: "Contact — ATHNIC CLOTHING",
  description: "Get in touch with Athnic Clothing. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Header */}
      <div className="px-6 md:px-12 py-12 border-b-[3px] border-athnic-gray">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
            Get in Touch
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
            Contact
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          {/* ── Form ───────────────────────────────── */}
          <div>
            <h2 className="font-display text-2xl uppercase mb-6">
              Drop Us a <span className="text-athnic-acid">Line</span>
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Name</label>
                  <input className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Subject</label>
                <input className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Message</label>
                <textarea rows={6} className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-4">
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* ── Contact Info ───────────────────────── */}
          <div>
            <h2 className="font-display text-2xl uppercase mb-6">
              Or Just <span className="text-athnic-acid">Hit Us Up</span>
            </h2>

            <div className="space-y-8">
              {/* Instagram */}
              <a href="https://instagram.com/athnicclothing" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 border-2 border-athnic-gray p-6 hover:border-athnic-acid group transition-colors">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white text-xl shrink-0">
                  IG
                </div>
                <div>
                  <p className="font-display text-sm tracking-wider uppercase group-hover:text-athnic-acid transition-colors">
                    Instagram
                  </p>
                  <p className="font-mono text-[10px] text-athnic-light-gray">@athnicclothing</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 border-2 border-athnic-gray p-6 hover:border-athnic-acid group transition-colors">
                <div className="w-12 h-12 bg-green-500 flex items-center justify-center text-white text-xl shrink-0">
                  WA
                </div>
                <div>
                  <p className="font-display text-sm tracking-wider uppercase group-hover:text-athnic-acid transition-colors">
                    WhatsApp
                  </p>
                  <p className="font-mono text-[10px] text-athnic-light-gray">+91 98765 43210</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:hey@athnic.com"
                className="flex items-center gap-4 border-2 border-athnic-gray p-6 hover:border-athnic-acid group transition-colors">
                <div className="w-12 h-12 bg-athnic-acid flex items-center justify-center text-athnic-black text-xl shrink-0 font-display font-bold">
                  @
                </div>
                <div>
                  <p className="font-display text-sm tracking-wider uppercase group-hover:text-athnic-acid transition-colors">
                    Email
                  </p>
                  <p className="font-mono text-[10px] text-athnic-light-gray">hey@athnic.com</p>
                </div>
              </a>
            </div>

            {/* Extra info */}
            <div className="mt-12 border-2 border-athnic-gray p-6">
              <p className="font-display text-sm tracking-wider uppercase mb-3">Response Time</p>
              <p className="font-mono text-xs text-athnic-light-gray leading-relaxed">
                We usually get back within 24 hours. For order-related queries,
                include your order ID. For collabs, just say &quot;collab&quot; in the subject.
                We&apos;re all ears.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
