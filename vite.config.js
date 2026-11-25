import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

/**
 * 中文字体包按 unicode-range 切成一百多片。页面是静态的，用到的字是固定的，
 * 所以构建时只保留 index.html 里实际出现的字所在的分片，其余 @font-face 和字体文件都丢掉。
 * 只影响 `vite build`；改了文案重新构建即可。
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
      const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
      const text = html
        .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]+>/g, "");
      used = new Set([...text].map((ch) => ch.codePointAt(0)));
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

// 相对路径输出：dist 可以放在任意子目录或直接用静态服务器预览。
// 这里不配置任何自定义域名或部署目标。
export default defineConfig({
  base: "./",
  plugins: [pruneUnusedFontSlices()],
});
