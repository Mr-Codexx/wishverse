# Brand assets

The star mark here (`favicon.svg`, `icon.svg`, `apple-icon.svg`) is a scalable
recreation of the WishVerse identity. To use your original artwork, drop these
files into `/public` and they will be picked up automatically:

- `favicon.ico` (32x32)
- `icon.png` / `icon.svg`  (512x512, app icon)
- `apple-icon.png`         (180x180)
- `og-image.png`           (1200x630, social share)

Then, if you add PNGs, update `src/app/layout.tsx` `metadata.icons` to point at them.
