import type { IsPluginEnabled, Plugin, ResolveConfig } from '../../types/config.ts';
import type { Input } from '../../util/input.ts';
import { hasDependency } from '../../util/plugin.ts';
import { resolveFromAST } from './resolveFromAST.ts';

// https://github.com/voidzero-dev/vite-plus

const title = 'vite-plus';

const enablers = ['vite-plus'];

const isEnabled: IsPluginEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);

const config = ['vite.config.{js,mjs,ts,cjs,mts,cts}'];

type ViteConfig = {
  run?: { tasks?: Record<string, { command?: unknown }> };
  staged?: Record<string, unknown>;
};

// Loaded config resolves spreads and imports that the AST visitor cannot see
const resolveConfig: ResolveConfig<ViteConfig> = async (localConfig, options) => {
  const config = typeof localConfig === 'function' ? await (localConfig as () => ViteConfig)() : localConfig;
  const commands: unknown[] = [
    ...Object.values(config?.run?.tasks ?? {}).map(task => task?.command),
    ...Object.values(config?.staged ?? {}),
  ];
  const inputs: Input[] = [];
  for (const command of commands) {
    if (typeof command === 'string')
      for (const input of options.getInputsFromScripts(command, { optionalBinaries: true })) inputs.push(input);
  }
  return inputs;
};

const plugin: Plugin = {
  title,
  enablers,
  isEnabled,
  config,
  isLoadConfigOptional: true,
  resolveConfig,
  resolveFromAST,
};

export default plugin;
