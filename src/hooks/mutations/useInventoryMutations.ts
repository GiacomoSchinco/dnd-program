type InventoryCreatePayload = {
  characterId: string | null
  items: Array<{ item_id: number; quantity: number }>
}

type InventoryUpdatePayload = {
  id: string
  data: Record<string, unknown>
}

type Mutation<TPayload> = {
  mutateAsync: (payload: TPayload) => Promise<void>
}

const createMutation = <TPayload,>(handler?: (payload: TPayload) => void): Mutation<TPayload> => ({
  mutateAsync: async (payload: TPayload) => {
    handler?.(payload)
  },
})

export function useInventoryMutations(_characterId: string | null) {
  return {
    create: createMutation<InventoryCreatePayload>(),
    update: createMutation<InventoryUpdatePayload>(),
    delete: createMutation<string>(),
  }
}
