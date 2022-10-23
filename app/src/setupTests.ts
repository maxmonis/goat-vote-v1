import "@testing-library/jest-dom/extend-expect"

;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: (newLanguage: string) => newLanguage,
      language: "en",
    },
    t: (localeKey: string) => localeKey,
  }),
}))
