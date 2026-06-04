interface CampaignHeaderProps {
  title: string;
  disabled?: boolean;
  onCreate: () => void;
}

export function CampaignHeader({ title, disabled = false, onCreate }: CampaignHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="card-title">{title}</h2>
      <button
        className="btn btn-primary btn-sm gap-1"
        onClick={onCreate}
        disabled={disabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Nuova Campagna
      </button>
    </div>
  );
}
