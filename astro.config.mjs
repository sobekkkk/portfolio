import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    output: 'static',
    trailingSlash: 'always',
    site: 'https://sobekkkk.github.io/portfolio/',
    base: '/portfolio/', // ← Ajoutez cette ligne
    image: {
        service: passthroughImageService()
    },
    // Single page, no prefetch needed
    prefetch: false,
    markdown: {
        shikiConfig: {
            theme: 'catppuccin-mocha'
        }
    },
    integrations: [
        tailwind(),
        sitemap(),
        compress({
            CSS: true,
            SVG: false,
            Image: false,
            HTML: {
                'html-minifier-terser': {
                    collapseWhitespace: true,
                    // collapseInlineTagWhitespace: true, // It breaks display-inline / flex-inline text
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    // removeEmptyElements: true, // It removes sometimes SVGs
                    removeRedundantAttributes: true
                }
            },
            JavaScript: {
                terser: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            }
        })
    ]
});
