---
name: svgmaker
description: >
	Advanced image-to-SVG generator. Converts raster images (PNG, JPG, etc.) into clean, accurate SVG vector graphics. Faithfully preserves all visual details, shapes, colors, and text. Optimized for web use. Use when you need to vectorize an image for web, print, or design workflows.
---

# SVG Maker Skill

## What this skill does

This skill converts any provided raster image (such as PNG or JPG) into a clean, accurate SVG vector graphic. It is designed for high-fidelity vectorization, preserving all important visual details, proportions, and color schemes from the original image. Text in the image is reproduced as SVG text elements. The SVG output is optimized for web use (clean structure, minimal file size, and compatible with all major browsers).

## Workflow

1. Receive a raster image as input (PNG, JPG, etc.).
2. Analyze the image to identify all key shapes, lines, colors, and text.
3. Reconstruct the image as an SVG, preserving:
		- All important visual details
		- Accurate proportions and color schemes
		- Text as SVG text elements
4. Avoid unnecessary simplification or artistic interpretation.
5. Output only the SVG code, with no explanation or comments.
6. Ensure the SVG is optimized for web use (clean structure, minimal file size, browser compatibility).

## Quality Criteria

- SVG output must be visually faithful to the original image.
- All text in the image must be reproduced as SVG text elements.
- Output must be a valid SVG code block, with no extra explanation or comments.
- SVG must be optimized for web (clean, minimal, compatible).

## Example Prompts

- "Convert this PNG logo to SVG."
- "Vectorize this JPG and preserve all text."
- "Make an SVG version of this image for web use."

## Completion Checks

- SVG output matches the original image in detail and color.
- All text is present as SVG text elements.
- Output is a valid, minimal SVG code block.

## Related Customizations

- Add a prompt for batch image-to-SVG conversion.
- Integrate with a web UI for drag-and-drop image vectorization.

---
