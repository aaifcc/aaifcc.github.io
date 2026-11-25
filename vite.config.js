import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const HTML_ENTRIES = [
  resolve(process.cwd(), "index.html"),
  resolve(process.cwd(), "en/index.html"),
];

/**
 * 中文字体包按 unicode-range 切成一百多片。页面是静态的，用到的字是固定的，
 * 所以构建时扫描中英文全部入口 HTML 里实际出现的字符，只保留用到的分片，
 * 其余 @font-face 和字体文件都丢掉。只影响 `vite build`；改了文案重新构建即可。
 */
function pruneUnusedFontSlices() {
  let used = new Set();

  const inRange = (range) =>
    range.split(",").some((part) => {
      const m = part.trim().match(/^U\+([0-9A-F?]+)(?:-([0-9A-F]+))?$/i);
      if (!m) return true; // 看不懂的写法就保留
      const lo = parseInt(m[1].replace(/\?/g, "0"), 16);
      const hi = m[2] ? parseInt(m[2], 16) : parseInt(m[1].replace(/\?/g, "F"), 16);
      for (const cp of used) if (cp >= lo && cp <= hi) return true;
      return false;
    });

  return {
    name: "prune-unused-font-slices",
    apply: "build",
    buildStart() {
      used = new Set();
      for (const entry of HTML_ENTRIES) {
        const html = readFileSync(entry, "utf8");
        const text = html
          .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<[^>]+>/g, "");
        for (const ch of text) used.add(ch.codePointAt(0));
      }
      for (let cp = 0x20; cp < 0x7f; cp++) used.add(cp); // 基本拉丁字符始终保留
    },
    generateBundle(_, bundle) {
      const cssFiles = Object.values(bundle).filter((f) => f.type === "asset" && f.fileName.endsWith(".css"));
      for (const css of cssFiles) {
        css.source = String(css.source).replace(/@font-face\s*\{[^}]*\}/g, (block) => {
          const range = block.match(/unicode-range\s*:\s*([^;}]+)/i);
          return !range || inRange(range[1]) ? block : "";
        });
      }
      const allCss = cssFiles.map((f) => String(f.source)).join("\n");
      for (const [key, file] of Object.entries(bundle)) {
        if (!/\.(woff2?|ttf|otf)$/.test(file.fileName)) continue;
        if (!allCss.includes(file.fileName.split("/").pop())) delete bundle[key];
      }
    },
  };
}

function injectHreflangLinks() {
  return {
    name: "inject-hreflang-links",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const isEn = ctx.filename.replace(/\\/g, "/").endsWith("/en/index.html");
        const tags = isEn
          ? [
              { tag: "link", attrs: { rel: "alternate", hreflang: "zh-CN", href: "../" }, injectTo: "head" },
              { tag: "link", attrs: { rel: "alternate", hreflang: "en", href: "./" }, injectTo: "head" },
            ]
          : [
              { tag: "link", attrs: { rel: "alternate", hreflang: "zh-CN", href: "./" }, injectTo: "head" },
              { tag: "link", attrs: { rel: "alternate", hreflang: "en", href: "./en/" }, injectTo: "head" },
            ];
        return { html, tags };
      },
    },
  };
}

// 相对路径输出：dist 可以放在任意子目录或直接用静态服务器预览。
// 同时输出中文首页（/）与英文版（/en/）。
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: HTML_ENTRIES[0],
        en: HTML_ENTRIES[1],
      },
    },
  },
  plugins: [pruneUnusedFontSlices(), injectHreflangLinks()],
});
