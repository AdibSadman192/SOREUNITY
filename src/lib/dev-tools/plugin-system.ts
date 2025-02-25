import { EventEmitter } from 'events';

type PluginMetadata = {
  name: string;
  version: string;
  description: string;
  author: string;
};

type PluginHooks = {
  onInit?: () => Promise<void>;
  onDestroy?: () => Promise<void>;
};

export interface Plugin extends PluginMetadata, PluginHooks {
  install: () => Promise<void>;
}

class PluginManager extends EventEmitter {
  private plugins: Map<string, Plugin> = new Map();
  private static instance: PluginManager;

  private constructor() {
    super();
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`);
    }

    try {
      await plugin.install();
      if (plugin.onInit) {
        await plugin.onInit();
      }
      this.plugins.set(plugin.name, plugin);
      this.emit('pluginRegistered', plugin.name);
    } catch (error) {
      this.emit('pluginError', { plugin: plugin.name, error });
      throw error;
    }
  }

  async unregisterPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} is not registered`);
    }

    try {
      if (plugin.onDestroy) {
        await plugin.onDestroy();
      }
      this.plugins.delete(pluginName);
      this.emit('pluginUnregistered', pluginName);
    } catch (error) {
      this.emit('pluginError', { plugin: pluginName, error });
      throw error;
    }
  }

  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginManager = PluginManager.getInstance();