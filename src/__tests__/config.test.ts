import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const envBackup: Record<string, string | undefined> = {}

function setEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key]
  } else {
    process.env[key] = value
  }
}

function clearStoreEnv() {
  const keys = [
    'NEXT_PUBLIC_STORE_NAME',
    'NEXT_PUBLIC_STORE_SHORT_NAME',
    'NEXT_PUBLIC_STORE_TAGLINE',
    'NEXT_PUBLIC_STORE_DESCRIPTION',
    'NEXT_PUBLIC_STORE_CITY',
    'NEXT_PUBLIC_STORE_WHATSAPP',
    'NEXT_PUBLIC_STORE_PHONE',
    'NEXT_PUBLIC_STORE_EMAIL',
    'NEXT_PUBLIC_STORE_INSTAGRAM',
    'NEXT_PUBLIC_STORE_PAYMENTS',
    'NEXT_PUBLIC_STORE_SHIPPING',
    'NEXT_PUBLIC_STORE_HOURS',
    'NEXT_PUBLIC_DEVELOPER_NAME',
    'NEXT_PUBLIC_DEVELOPER_URL',
    'NEXT_PUBLIC_ASSISTANT_NAME',
    'NEXT_PUBLIC_ASSISTANT_ROLE',
    'NEXT_PUBLIC_ASSISTANT_AVAILABILITY',
  ]
  for (const key of keys) {
    delete process.env[key]
  }
}

describe('config', () => {
  beforeEach(() => {
    const keys = [
      'NEXT_PUBLIC_STORE_NAME',
      'NEXT_PUBLIC_STORE_SHORT_NAME',
      'NEXT_PUBLIC_STORE_TAGLINE',
      'NEXT_PUBLIC_STORE_DESCRIPTION',
      'NEXT_PUBLIC_STORE_CITY',
      'NEXT_PUBLIC_STORE_WHATSAPP',
      'NEXT_PUBLIC_STORE_PHONE',
      'NEXT_PUBLIC_STORE_EMAIL',
      'NEXT_PUBLIC_STORE_INSTAGRAM',
      'NEXT_PUBLIC_STORE_PAYMENTS',
      'NEXT_PUBLIC_STORE_SHIPPING',
      'NEXT_PUBLIC_STORE_HOURS',
      'NEXT_PUBLIC_DEVELOPER_NAME',
      'NEXT_PUBLIC_DEVELOPER_URL',
      'NEXT_PUBLIC_ASSISTANT_NAME',
      'NEXT_PUBLIC_ASSISTANT_ROLE',
      'NEXT_PUBLIC_ASSISTANT_AVAILABILITY',
    ]
    for (const key of keys) {
      envBackup[key] = process.env[key]
    }
    clearStoreEnv()
    // Force re-import by resetting module cache
    vi.resetModules()
  })

  afterEach(() => {
    clearStoreEnv()
    for (const [key, value] of Object.entries(envBackup)) {
      if (value !== undefined) {
        process.env[key] = value
      } else {
        delete process.env[key]
      }
    }
  })

  describe('store defaults', () => {
    it('uses default store name when env var is missing', async () => {
      const { store } = await import('@/lib/config')
      expect(store.name).toBe('Lumière')
    })

    it('uses default shortName', async () => {
      const { store } = await import('@/lib/config')
      expect(store.shortName).toBe('Lumière')
    })

    it('uses default tagline', async () => {
      const { store } = await import('@/lib/config')
      expect(store.tagline).toBe('Moda Feminina de Luxo')
    })

    it('uses default city', async () => {
      const { store } = await import('@/lib/config')
      expect(store.city).toBe('Salvador, BA')
    })

    it('uses default payments list', async () => {
      const { store } = await import('@/lib/config')
      expect(store.payments).toEqual(['Visa', 'Mastercard', 'Elo', 'Pix', 'Boleto'])
    })
  })

  describe('store from env vars', () => {
    it('reads store name from env var', async () => {
      setEnv('NEXT_PUBLIC_STORE_NAME', 'Minha Loja')
      const { store } = await import('@/lib/config')
      expect(store.name).toBe('Minha Loja')
    })

    it('reads whatsapp from env var', async () => {
      setEnv('NEXT_PUBLIC_STORE_WHATSAPP', '5511999999999')
      const { store } = await import('@/lib/config')
      expect(store.whatsapp).toBe('5511999999999')
    })

    it('reads email from env var', async () => {
      setEnv('NEXT_PUBLIC_STORE_EMAIL', 'loja@teste.com')
      const { store } = await import('@/lib/config')
      expect(store.email).toBe('loja@teste.com')
    })

    it('reads instagram from env var', async () => {
      setEnv('NEXT_PUBLIC_STORE_INSTAGRAM', 'minhaloja')
      const { store } = await import('@/lib/config')
      expect(store.instagram).toBe('minhaloja')
    })

    it('reads developer info from env vars', async () => {
      setEnv('NEXT_PUBLIC_DEVELOPER_NAME', 'Fulano')
      setEnv('NEXT_PUBLIC_DEVELOPER_URL', 'https://fulano.com')
      const { store } = await import('@/lib/config')
      expect(store.developerName).toBe('Fulano')
      expect(store.developerUrl).toBe('https://fulano.com')
    })
  })

  describe('readList parsing', () => {
    it('parses comma-separated payments', async () => {
      setEnv('NEXT_PUBLIC_STORE_PAYMENTS', 'Pix,Boleto')
      const { store } = await import('@/lib/config')
      expect(store.payments).toEqual(['Pix', 'Boleto'])
    })

    it('trims whitespace from list items', async () => {
      setEnv('NEXT_PUBLIC_STORE_PAYMENTS', ' Pix , Boleto , Cartão ')
      const { store } = await import('@/lib/config')
      expect(store.payments).toEqual(['Pix', 'Boleto', 'Cartão'])
    })

    it('filters empty entries', async () => {
      setEnv('NEXT_PUBLIC_STORE_PAYMENTS', 'Pix,,Boleto,')
      const { store } = await import('@/lib/config')
      expect(store.payments).toEqual(['Pix', 'Boleto'])
    })

    it('returns single item for single value', async () => {
      setEnv('NEXT_PUBLIC_STORE_PAYMENTS', 'Pix')
      const { store } = await import('@/lib/config')
      expect(store.payments).toEqual(['Pix'])
    })
  })

  describe('assistant defaults', () => {
    it('uses default assistant name', async () => {
      const { assistant } = await import('@/lib/config')
      expect(assistant.name).toBe('Lumi')
    })

    it('uses default assistant role', async () => {
      const { assistant } = await import('@/lib/config')
      expect(assistant.role).toBe('sua stylist virtual')
    })

    it('reads assistant name from env var', async () => {
      setEnv('NEXT_PUBLIC_ASSISTANT_NAME', 'Ana')
      const { assistant } = await import('@/lib/config')
      expect(assistant.name).toBe('Ana')
    })
  })

  describe('whatsappUrl', () => {
    it('generates base whatsapp URL', async () => {
      const { whatsappUrl } = await import('@/lib/config')
      expect(whatsappUrl()).toBe('https://wa.me/5571991673902')
    })

    it('generates whatsapp URL with encoded text', async () => {
      const { whatsappUrl } = await import('@/lib/config')
      const url = whatsappUrl('Olá, gostaria de saber mais')
      expect(url).toContain('https://wa.me/5571991673902')
      expect(url).toContain('?text=')
      expect(url).toContain('Ol%C3%A1')
    })

    it('uses custom whatsapp number from env', async () => {
      setEnv('NEXT_PUBLIC_STORE_WHATSAPP', '5511888888888')
      const { whatsappUrl } = await import('@/lib/config')
      expect(whatsappUrl()).toBe('https://wa.me/5511888888888')
    })
  })
})
