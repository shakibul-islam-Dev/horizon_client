const partners = [
  { name: 'TechFlow', initials: 'TF' },
  { name: 'GreenLeaf', initials: 'GL' },
  { name: 'UrbanStyle', initials: 'US' },
  { name: 'CraftLab', initials: 'CL' },
  { name: 'BrightPath', initials: 'BP' },
  { name: 'NexGen', initials: 'NG' },
];

export default function PartnersSection() {
  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by leading brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center text-sm font-bold">
                {partner.initials}
              </div>
              <span className="text-lg font-semibold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
