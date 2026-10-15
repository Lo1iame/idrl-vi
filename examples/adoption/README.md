# 接入验证页面

在源仓库根目录执行 `npm run vi:example`，打开 `/examples/adoption/`。独立生产构建：`npm run vi:example:build`。

导出的快照可以在其根目录执行 `npm ci`，随后 `npx vite --config examples/adoption/vite.config.ts`，打开终端打印的根地址。构建使用 `npx tsc --noEmit -p examples/adoption/tsconfig.json` 和 `npx vite build --config examples/adoption/vite.config.ts`。只验证已导出的示例，不执行原仓库 package.json 中其他未随包提供的脚本。

需要 Node 与 npm，依赖精确版本从 package-lock.json 安装。这是用于检查组件闭包、主题和样式的源码快照，不是可以直接部署的产品。reference.css 含全局样式，已有应用逐项接入，不全量覆盖。示例没有业务存储、认证或 API；正式接入使用自己的配置与逻辑。

快照沿用源仓库 package.json / lockfile，以精确复现依赖，因而可能包含当前示例未用到的官网依赖。正式整合时只将组件实际需要的依赖合并入目标应用，不覆盖其 package.json / lockfile。
