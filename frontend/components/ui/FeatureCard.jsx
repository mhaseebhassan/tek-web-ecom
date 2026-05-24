export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <div
      className="surface-card p-6 transition-smooth hover:-translate-y-0.5 hover:border-primary/25"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black tracking-tight text-foreground">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
