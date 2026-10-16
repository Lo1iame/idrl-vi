// Shared brand values have one source; presentation-only tints remain explicit here.
export function presentationPalette(tokens) {
  const {brand,light} = tokens
  return {navy:brand.navy,blue:brand.blue,cyan:brand.cyan,soft:brand.navyOnDark,
    ink:light.foreground,muted:light.mutedForeground,rule:light.border,pale:light.surfaceSubtle,
    white:'#ffffff',cool:'#c8d9ee'}
}
