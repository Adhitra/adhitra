# Adhitra Corporate Website

The official corporate website and parent-brand presence for **Adhitra** — *Engineered for What's Next.*

Adhitra is a technology product venture engineering solutions across software, hardware, and connected experiences.

---

## Technical Overview

- **Stack**: Semantic HTML5, Vanilla CSS3 (Custom Design System with CSS variables), and lightweight Vanilla JavaScript.
- **Dependencies**: None. Zero build step, zero frameworks, no external runtime dependencies.
- **Hosting**: Designed and optimized for static hosting via **GitHub Pages** (fully compatible with custom domains or subpath repositories such as `/adhitra/`).
- **Typography**: Google Fonts — [Manrope](https://fonts.google.com/specimen/Manrope) for headings and [DM Sans](https://fonts.google.com/specimen/DM+Sans) for body text.

---

## Brand Identity & Approved Assets

Approved logo assets are located in `assets/brand/`:

- **Main Header & Footer**: `assets/brand/logo_full.svg` (Transparent full logo with icon mark and wordmark)
- **Favicon**: `assets/brand/logo_symbol.svg` (SVG vector) with fallback `assets/brand/logo_symbol.png`
- **Hero Schematic Mark**: `assets/brand/logo_symbol.svg`
- **Social Sharing / Open Graph**: `assets/brand/og_preview.png` (Optimized 1200×630 card)
- **Raster Fallback Logo**: `assets/brand/logo_full_dark_bg.png`

### Official Brand Palette

- **Deep Teal**: `#004D54`
- **Teal**: `#009E9B`
- **Bright Aqua**: `#00E5D4`
- **Dark Background**: `#0C232B`
- **Supporting Dark**: `#07171D`
- **Supporting Light / Ink**: `#EAF4F2`

---

## Project Structure

```
adhitra-website/
├── .nojekyll             # Prevents GitHub Pages Jekyll processing
├── robots.txt            # Search engine crawler instructions & sitemap link
├── sitemap.xml           # XML sitemap for search engine indexing
├── index.html            # Main site structure & semantic markup with SEO/OG tags
├── styles.css            # Responsive design system, custom scrollbar & animations
├── script.js             # Mobile nav, hero carousel, scroll-spy & scroll reveals
├── README.md             # Project & deployment documentation
└── assets/
    └── brand/            # Official vector & raster brand assets
        ├── logo_full.svg
        ├── logo_name.svg
        ├── logo_symbol.svg
        ├── og_preview.png     # 1200x630 social sharing preview card
        └── ...
```

---

## Deploying to GitHub Pages

1. Push all files to your GitHub repository (e.g. `Adhitra/adhitra-website` or `Adhitra/adhitra`).
2. Navigate to **Settings → Pages** in your repository.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or default branch), folder: `/(root)`
4. Click **Save**.
5. The site will be published at `https://<organization>.github.io/<repository>/` (or custom domain).
   - All assets and internal anchors use strictly relative paths (e.g., `assets/brand/...`, `styles.css`, `script.js`), ensuring flawless rendering on any subpath.

---

## Local Development & Testing

To run locally with any static web server:

```bash
# Using Python 3
python3 -m http.server 4173

# Or using Node http-server / npx
npx serve .
```

Open `http://localhost:4173` in your browser.
