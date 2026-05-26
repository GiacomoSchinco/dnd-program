import type { CreateItemDTO } from '@/types/item'

type MutationHandlers<TPayload> = {
  isPending: boolean
  mutate: (payload: TPayload, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => void
  mutateAsync: (payload: TPayload) => Promise<void>
}

function createMutation<TPayload>(): MutationHandlers<TPayload> {
  return {
    isPending: false,
    mutate: (_payload, options) => {
      try {
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error as Error)
      }
    },
    mutateAsync: async () => {},
  }
}

export function useCreateItem() {
  return createMutation<CreateItemDTO>()
}

export function useUpdateItem() {
  return createMutation<{ id: number; data: CreateItemDTO & { id: number } }>()
}

export function useDeleteItem() {
  return createMutation<number>()
}
