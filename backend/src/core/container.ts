export type ServiceToken<T> = symbol & {
  readonly __serviceType?: T;
};

type ServiceFactory<T> = (container: Container) => T;

interface ServiceDefinition<T> {
  readonly factory: ServiceFactory<T>;
  readonly singleton: boolean;
}

export class Container {
  private readonly definitions = new Map<
    symbol,
    ServiceDefinition<unknown>
  >();

  private readonly instances = new Map<symbol, unknown>();

  register<T>(
    token: ServiceToken<T>,
    factory: ServiceFactory<T>,
    options: { singleton?: boolean } = {},
  ): void {
    if (this.definitions.has(token)) {
      throw new Error(`Service already registered: ${token.description ?? "unknown"}`);
    }

    this.definitions.set(token, {
      factory,
      singleton: options.singleton ?? true,
    });
  }

  resolve<T>(token: ServiceToken<T>): T {
    const definition = this.definitions.get(token);

    if (!definition) {
      throw new Error(`Service not registered: ${token.description ?? "unknown"}`);
    }

    if (definition.singleton && this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    const instance = definition.factory(this);

    if (definition.singleton) {
      this.instances.set(token, instance);
    }

    return instance;
  }

  has<T>(token: ServiceToken<T>): boolean {
    return this.definitions.has(token);
  }

  clear(): void {
    this.instances.clear();
    this.definitions.clear();
  }
}

export function createContainer(): Container {
  return new Container();
}
