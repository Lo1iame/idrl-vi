# IDRL motion adapters

`animated-content.tsx` adapts React Bits AnimatedContent for this website.

Source: https://github.com/DavidHDev/react-bits/blob/1eeb6f105c68b964289d85dabbe84a1d551f3797/src/ts-default/Animations/AnimatedContent/AnimatedContent.tsx

The upstream license is retained in `LICENSE.md`. These adapters are integrated website code; do not publish them as a standalone component bundle or include them in the planned IDRL component registry without checking the upstream distribution terms.

IDRL changes: IntersectionObserver replaces ScrollTrigger; GSAP loads on demand only when the website mounts; content is visible by default and text retains full opacity; images enter from 0.78 opacity; no disappearance mode; reduced motion and keyboard focus clear the animation; mobile movement is limited to 8px / 300ms; observers and timelines are cleaned up on unmount. Animation only uses transform and opacity and plays once per mount. Theme and language changes do not replay it.

## Stronger website effects

`tilted-visual.tsx` adapts the pointer-to-rotation mapping from https://github.com/DavidHDev/react-bits/blob/1eeb6f105c68b964289d85dabbe84a1d551f3797/src/ts-default/Components/TiltedCard/TiltedCard.tsx with CSS interpolation, without additional Motion dependencies, captions or overlays. Fine mouse pointers only; touch/reduced-motion interactions remain static.

The website now configures larger 48–72px desktop section entries, sequential research rows, and image opacity 0.35. AnimatedContent defaults remain conservative for reuse; mobile section motion remains capped at 8px/300ms.

The hero uses the repo-native `../brand-logo-motion.tsx`, built from IDRL’s original six SVG paths. Pi.dev is a visual reference for the fine grid and replayable brand motion; no Pi logo or site code is copied.
