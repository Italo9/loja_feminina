import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { checkRateLimit } from '@/lib/rate-limit'

describe('rate-limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows the first request', () => {
    const result = checkRateLimit('user-1', 5, 60000)
    expect(result).toBe(true)
  })

  it('allows multiple requests within the limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('user-2', 5, 60000)).toBe(true)
    }
  })

  it('rejects requests over the limit', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('user-3', 5, 60000)
    }

    expect(checkRateLimit('user-3', 5, 60000)).toBe(false)
    expect(checkRateLimit('user-3', 5, 60000)).toBe(false)
  })

  it('resets the window after time passes', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('user-4', 5, 60000)
    }

    expect(checkRateLimit('user-4', 5, 60000)).toBe(false)

    vi.advanceTimersByTime(60001)

    expect(checkRateLimit('user-4', 5, 60000)).toBe(true)
  })

  it('treats different keys independently', () => {
    for (let i = 0; i < 3; i++) {
      checkRateLimit('user-a', 3, 60000)
    }

    expect(checkRateLimit('user-a', 3, 60000)).toBe(false)
    expect(checkRateLimit('user-b', 3, 60000)).toBe(true)
  })

  it('allows requests again after partial window advance', () => {
    vi.advanceTimersByTime(30000)
    for (let i = 0; i < 3; i++) {
      checkRateLimit('user-5', 3, 60000)
    }

    expect(checkRateLimit('user-5', 3, 60000)).toBe(false)

    vi.advanceTimersByTime(30001)

    expect(checkRateLimit('user-5', 3, 60000)).toBe(true)
  })

  it('works with limit of 1', () => {
    expect(checkRateLimit('single', 1, 60000)).toBe(true)
    expect(checkRateLimit('single', 1, 60000)).toBe(false)

    vi.advanceTimersByTime(60001)
    expect(checkRateLimit('single', 1, 60000)).toBe(true)
  })
})
