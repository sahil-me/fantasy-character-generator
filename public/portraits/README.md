# Character Portraits

This directory contains the local portrait assets used by **Fantasy Character Generator**.

## Directory Structure

Portraits are organized by character class:

```text
public/portraits/
├── mage/
├── rogue/
├── warrior/
├── ranger/
├── paladin/
└── necromancer/
```

Each class directory contains two WebP portrait variants:

- `variant-1.webp`
- `variant-2.webp`

Existing JPG and SVG files may also be present, but the current application uses the WebP files referenced by `CLASS_PORTRAIT_REGISTRY` in `src/App.tsx`.

## How Portraits Are Used

The application loads portraits from these paths:

```text
/portraits/<class>/variant-1.webp
/portraits/<class>/variant-2.webp
```

Portraits are stored locally in the project, so the application does not need an external image service to display them.

The **Regenerate Portrait** action switches between available portrait variants without changing the character's name, class, stats, or backstory.

## Replacing Portraits

To replace an existing portrait:

1. Open the relevant class directory.
2. Replace the corresponding WebP file.
3. Keep the existing filename and path unchanged.
4. Run the production build and verify the portrait displays correctly.

Use square images for consistent portrait presentation. WebP is recommended for optimized image delivery.

## Adding Portrait Variants

To add another portrait variant:

1. Add a new WebP image to the appropriate class directory, following the naming convention (for example, `variant-3.webp`).
2. Update `CLASS_PORTRAIT_REGISTRY` in `src/App.tsx` to include the new path.
3. Verify that portrait selection and regeneration support the additional variant.
4. Run the production build and test the relevant character class.

## Asset Maintenance

Keep portrait filenames and registry paths consistent. Remove unused image assets only after confirming that neither the application nor any other project resource depends on them.
