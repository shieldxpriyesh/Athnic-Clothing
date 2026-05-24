import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-athnic-black border-t-[3px] border-athnic-gray pb-20 md:pb-0">
      {/* Newsletter Bar */}
      <div className="bg-athnic-dark px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold uppercase">
              Join the Tribe
            </h3>
            <p className="text-athnic-light-gray font-mono text-sm mt-1">
              Drops. Exclusives. No spam. Ever.
            </p>
          </div>
          <form className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-80 px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap px-6 py-3"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-3xl font-extrabold tracking-wider">
              ATHNIC<span className="text-athnic-acid">.</span>
            </Link>
            <p className="text-athnic-light-gray font-mono text-xs mt-3 leading-relaxed">
              Catch the vibe.<br />Join the tribe.<br />
              Indian streetwear that hits different.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] text-athnic-acid mb-4 uppercase">
              Shop
            </h4>
            <ul className="space-y-2">
              {["T-Shirts", "Hoodies", "Cargos", "Joggers", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    href="/shop"
                    className="text-athnic-light-gray font-mono text-xs hover:text-athnic-off-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] text-athnic-acid mb-4 uppercase">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Size Guide", href: "/shop" },
                { label: "Shipping", href: "/shop" },
                { label: "Returns", href: "/shop" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-athnic-light-gray font-mono text-xs hover:text-athnic-off-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] text-athnic-acid mb-4 uppercase">
              Connect
            </h4>
            <ul className="space-y-2">
              {["Instagram", "Twitter", "YouTube", "WhatsApp"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-athnic-light-gray font-mono text-xs hover:text-athnic-off-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-athnic-gray">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-athnic-light-gray font-mono text-[10px] tracking-widest uppercase">
            © 2026 Athnic Clothing. All rights reserved.
          </p>
          <p className="text-athnic-light-gray font-mono text-[10px] tracking-widest uppercase">
            Made in India 🇮🇳 · For the streets
          </p>
        </div>
      </div>
    </footer>
  );
}
