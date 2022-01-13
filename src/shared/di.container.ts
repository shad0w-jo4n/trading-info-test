/**
 * Interface of global object.
 */
interface IGlobalThis {
  dependencies: {
    [name: string]: any;
  };
}

/**
 * Global object.
 */
const g = global as unknown as IGlobalThis;

/**
 * Dependency Injection Container.
 */
export class DiContainer {
  /**
   * Add service instance to container as singleton.
   *
   * @param name
   * @param service
   */
  public static addSingleton<T extends Object>(name: string, service: T): void {
    if (!g.dependencies) {
      g.dependencies = {};
    }

    g.dependencies[name] = service;
  }

  /**
   * Get service instance from container.
   *
   * @param name
   */
  public static getService<T>(name: string): T {
    return g.dependencies[name];
  }
}
