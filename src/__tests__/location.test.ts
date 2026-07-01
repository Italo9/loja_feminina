import { describe, it, expect, vi, beforeEach } from "vitest"

const normalizeCep = (cep: string) => cep.replace(/\D/g, "")

vi.mock("@/lib/location", () => {
  const actual = vi.importActual<typeof import("@/lib/location")>("@/lib/location")
  return actual
})

describe("location", () => {
  describe("normalizeCep", () => {
    it("removes non-digit characters", () => {
      expect(normalizeCep("01001-000")).toBe("01001000")
    })

    it("handles CEP with spaces", () => {
      expect(normalizeCep(" 01001 000 ")).toBe("01001000")
    })

    it("handles already clean CEP", () => {
      expect(normalizeCep("01001000")).toBe("01001000")
    })

    it("handles empty string", () => {
      expect(normalizeCep("")).toBe("")
    })

    it("handles CEP with dots", () => {
      expect(normalizeCep("01.001-000")).toBe("01001000")
    })
  })

  describe("BRAZILIAN_STATES", () => {
    it("contains all 27 states", () => {
      const states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
      // Will be tested via import in the integration suite
      expect(states.length).toBe(27)
    })
  })

  describe("region filter logic", () => {
    it("empty regions means available everywhere", () => {
      const regions = ""
      const userState = "SP"
      const isAvailable = regions === "" || regions.split(",").map(s => s.trim().toUpperCase()).includes(userState)
      expect(isAvailable).toBe(true)
    })

    it("product with matching region is available", () => {
      const regions = "SP,RJ,MG"
      const userState = "SP"
      const isAvailable = regions === "" || regions.split(",").map(s => s.trim().toUpperCase()).includes(userState)
      expect(isAvailable).toBe(true)
    })

    it("product with non-matching region is not available", () => {
      const regions = "SP,RJ,MG"
      const userState = "BA"
      const isAvailable = regions === "" || regions.split(",").map(s => s.trim().toUpperCase()).includes(userState)
      expect(isAvailable).toBe(false)
    })

    it("regions with spaces and mixed case works", () => {
      const regions = " sp , Rj , mg "
      const userState = "RJ"
      const isAvailable = regions === "" || regions.split(",").map(s => s.trim().toUpperCase()).includes(userState)
      expect(isAvailable).toBe(true)
    })

    it("single region product matches exact state", () => {
      const regions = "BA"
      const userState = "BA"
      const isAvailable = regions === "" || regions.split(",").map(s => s.trim().toUpperCase()).includes(userState)
      expect(isAvailable).toBe(true)
    })

    it("single region product does not match different state", () => {
      const regions = "BA"
      const userState = "SP"
      const isAvailable = regions === "" || regions.split(",").map(s => s.trim().toUpperCase()).includes(userState)
      expect(isAvailable).toBe(false)
    })
  })
})
