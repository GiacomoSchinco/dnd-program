import { useState } from 'react';
import { toast } from 'sonner';
import { useDB } from '../../hooks/useDB';
import { useCampaignContext } from '../../context/CampaignContext';
import { useConfirm } from '../../hooks/useConfirm';
import { DeleteConfirmModal } from '../ui';
import { CampaignHeader } from './CampaignHeader';
import { CampaignTable } from './CampaignTable';
import { CampaignFormModal } from './CampaignFormModal';
import type { CampaignFormData } from './CampaignFormModal';
import { Campaign } from '../../types';

interface CampaignPanelProps {
  title?: string;
  compact?: boolean;
}

export function CampaignPanel({ title = 'Campagne', compact = false }: CampaignPanelProps) {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      const createdId = await addCampaign({
        name: data.name.trim(),
        description: data.description.trim(),
        createdAt: new Date().toISOString(),
      });

      setSelectedCampaignId(createdId);
      setIsCreateOpen(false);
      toast.success('Campagna creata');
    } catch (err) {
      console.error('Errore creazione campagna:', err);
      toast.error('Errore durante la creazione della campagna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: CampaignFormData) => {
    if (!editingCampaign?.id) return;
    setIsSubmitting(true);
    try {
      await updateCampaign(editingCampaign.id, {
        name: data.name.trim(),
        description: data.description.trim(),
      });

      setIsEditOpen(false);
      setEditingCampaign(null);
      toast.success('Campagna aggiornata');
    } catch (err) {
      console.error('Errore aggiornamento campagna:', err);
      toast.error("Errore durante l'aggiornamento della campagna");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (campaign: Campaign) => {
    confirm({
      title: 'Elimina Campagna',
      message: `Sei sicuro di voler eliminare la campagna "${campaign.name}"? Verranno eliminati anche tutti i personaggi associati.`,
      onConfirm: async () => {
        try {
          await deleteCampaign(campaign.id!);
          if (selectedCampaignId === campaign.id) {
            const remaining = (campaigns ?? []).filter((c) => c.id !== campaign.id);
            const next = remaining.length > 0 ? remaining[0] : null;
            setSelectedCampaignId(next ? next.id! : null);
          }
          toast.success('Campagna eliminata');
        } catch (err) {
          console.error('Errore eliminazione campagna:', err);
          toast.error("Errore durante l'eliminazione della campagna");
        }
      },
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <CampaignHeader
          title={title}
            disabled={isSubmitting}
          onCreate={() => setIsCreateOpen(true)}
        />
        <div className="mt-2">
          <CampaignTable
            campaigns={campaigns ?? []}
            selectedCampaignId={selectedCampaignId}
            compact={compact}
                    disabled={isSubmitting}
            onSelect={(id) => setSelectedCampaignId(id)}
            onEdit={(campaign) => {
              setEditingCampaign(campaign);
              setIsEditOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {!compact && (campaigns ?? []).length > 0 && (
          <p className="text-xs text-base-content/60 mt-2">
            Suggerimento: imposta la campagna attiva da qui o dalla topbar per aggiornare tutto il contesto.
          </p>
        )}
      </div>

      <CampaignFormModal
        isOpen={isCreateOpen}
        title="Nuova Campagna"
        confirmText="Crea"
        loading={isSubmitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <CampaignFormModal
        isOpen={isEditOpen}
        title="Modifica Campagna"
        confirmText="Salva"
        loading={isSubmitting}
        initialData={
          editingCampaign
            ? { name: editingCampaign.name ?? '', description: editingCampaign.description ?? '' }
            : undefined
        }
        onClose={() => {
          setIsEditOpen(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleEdit}
      />
      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
    </div>
  );
}

