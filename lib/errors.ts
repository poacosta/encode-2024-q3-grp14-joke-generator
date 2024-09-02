import {z} from "zod"

const pathToString = (path: (string | number)[]) =>
  path.reduce((p, c) => (typeof c === "string" ? `${p ? `${p}.` : ""}${c}` : `${p}[${c}]`), "")

export const formatErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return `Validation errors:\n${error.issues
      .map(issue => `  - ${pathToString(issue.path)}: ${issue.message}`)
      .join("\n")}`
  } else if (error instanceof Error) {
    return error.message
  } else {
    return `An unexpected error occurred: ${error}`
  }
}
