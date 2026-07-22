---
name: image-to-svg
description: 'Convert a provided raster image (PNG/JPG/WebP/GIF) into a clean, accurate SVG vector graphic. Use for image-to-SVG, png-to-svg, jpg-to-svg, vectorize/trace workflows where shapes, lines, colors, proportions, and text must be preserved.'
argument-hint: 'Attach an image and request an SVG conversion'
user-invocable: true
---

# Image to SVG (Raster → Vector)

## When to Use
- Convert a raster image (PNG/JPG/JPEG/WebP/GIF) into an SVG.
- You need a scalable, editable SVG that matches the original image’s geometry and colors.
- You must preserve visible text as SVG `<text>` elements.

## Input Requirements
- You will receive an image as input.
- If no image is present or accessible, request the image before proceeding.

## Output Contract (Strict)
- Output **only** a single Markdown fenced code block with language `svg`.
- The code block contents must be a **valid SVG**: begin with `<svg` and end with `</svg>`.
- Make the SVG responsive using `viewBox` only: do **not** set `width` or `height` attributes on the root `<svg>`.
- Do **not** output any other text (no explanations, headings, or extra code blocks).
- Do **not** include SVG/XML comments or editor metadata.
- Do **not** embed the original raster image (no `<image>` elements, no base64/data URIs). The output must be vector shapes and SVG text.
- Avoid filters for compatibility/performance (no `<filter>`, `feGaussianBlur`, `drop-shadow`, etc.). Use gradients and opacity instead.

## Procedure
1. Inspect the image.
   - Use the available image-viewing capability to zoom in and confirm fine details.
2. Establish canvas + coordinate system.
   - Choose `viewBox="0 0 W H"` matching the image’s visible bounds.
   - Do not set `width`/`height` on the root `<svg>`; rely on `viewBox` for responsiveness.
3. Identify all key visual elements.
   - Background fills, silhouettes, borders, strokes/lines, icons, shadows/highlights.
   - Distinct colors (prefer hex) and any opacity.
   - Text: exact characters, approximate font size, weight, alignment, and position.
4. Reconstruct geometry faithfully.
   - Avoid unnecessary simplification or artistic interpretation; preserve important visual details and proportions.
   - Prefer primitives where exact: `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polyline>`, `<polygon>`.
   - Use `<path>` for complex contours.
   - Preserve stroke widths, caps (`stroke-linecap`), joins (`stroke-linejoin`), and miter limits when applicable.
   - Preserve z-order (layering) so overlaps match the raster.
   - Apply transforms only when they reduce duplication and keep the structure clean.
5. Recreate gradients and transparency.
   - Use `<defs>` + `<linearGradient>` / `<radialGradient>` to match gradient direction and stops.
   - Use `opacity`, `fill-opacity`, and `stroke-opacity` to match transparency.
   - If the raster has soft shadows/highlights, approximate with gradients and opacity (avoid filters).
6. Preserve text as text.
   - Use `<text>` elements for text (do not convert text to paths).
   - Match alignment using `text-anchor` and baseline using `dominant-baseline`.
   - Use a reasonable `font-family` fallback (e.g., `sans-serif`, `serif`, `monospace`) unless a specific font is clearly required by the image.
7. Optimize for web without losing fidelity.
   - Remove redundant attributes and unnecessary grouping.
   - Reuse definitions in `<defs>` when repeated (gradients/clip paths).
   - Keep IDs short and avoid unused defs.
   - Avoid external CSS, scripts, and `<foreignObject>` for maximum browser compatibility.
8. Final validation.
   - Ensure the SVG renders correctly at 100% and when scaled.
   - Confirm all key shapes/lines/colors are present and proportionally correct.
   - Ensure the output is syntactically valid SVG.

## Quality Checklist
- Fidelity: matches original proportions, spacing, colors, and layering.
- Completeness: no missing marks, borders, icons, or text.
- Text: reproduced as `<text>` with correct content.
- Compatibility: works in major browsers without external dependencies.
- Vector-only: no embedded bitmap content (`<image>`, base64, data URIs).
- No filters: avoid `<filter>` and filter primitives; use gradients/opacities instead.
- Output: exactly one `svg` code block and nothing else.
