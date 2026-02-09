import { type ClassValue, clsx } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim()
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price"
  if (value >= 1000) {
    const kValue = value / 1000
    return isMin ? `$${kValue}k+` : `<$${kValue}k`
  }
  return isMin ? `$${value}+` : `<$${value}`
}

export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null),
    ),
  )
}

type MutationMessages = {
  success?: string
  error: string
}

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>,
) => {
  const { success, error } = messages

  try {
    const result = await mutationFn
    if (success) toast.success(success)
    return result
  } catch (err) {
    if (error) toast.error(error)
    throw err
  }
}

export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  userRole: string,
  fetchWithBQ: any,
) => {
  const createEndpoint =
    userRole?.toLowerCase() === "manager" ? "/managers" : "/tenants"

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      cognitoId: user.userId,
      name: user.username,
      email: idToken?.payload?.email || "",
      phoneNumber: "",
    },
  })

  if (createUserResponse.error) {
    throw new Error("Failed to create user record")
  }

  return createUserResponse
}

export function formatPhoneToInternational(phoneNumber: string): string {
  if (!phoneNumber) return ""

  // Extract only digits
  const digitsOnly = phoneNumber.replace(/\D/g, "")

  if (!digitsOnly || digitsOnly.length < 10) {
    return phoneNumber
  }

  // Add + prefix if not already there (from original string)
  const needsPlus = !phoneNumber.trim().startsWith("+")
  const prefix = needsPlus ? "+" : ""

  // Format based on length
  if (digitsOnly.length >= 13) {
    // +XXX (XX) XXXXX-XXXX
    return `+${prefix}${digitsOnly.slice(0, 3)} (${digitsOnly.slice(3, 5)}) ${digitsOnly.slice(5, 10)}-${digitsOnly.slice(10)}`
  } else if (digitsOnly.length === 12) {
    // +XX (XX) XXXXX-XXXX
    return `+${prefix}${digitsOnly.slice(0, 2)} (${digitsOnly.slice(2, 4)}) ${digitsOnly.slice(4, 9)}-${digitsOnly.slice(9)}`
  } else if (digitsOnly.length === 11) {
    // +X (XXX) XXX-XXXX or +XX (XXX) XXXX-XXXX
    return `+${prefix}${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 3)}) ${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7)}`
  } else {
    // +X (XX) XXXX-XXXX
    return `+${prefix}${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 3)}) ${digitsOnly.slice(3, 7)}-${digitsOnly.slice(6)}`
  }
}
