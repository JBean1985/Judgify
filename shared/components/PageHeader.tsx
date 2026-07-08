interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <header className="mb-10">

      <h1 className="text-3xl font-black tracking-tight text-slate-900">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-lg text-slate-600">
          {subtitle}
        </p>
      )}

    </header>
  );
}
