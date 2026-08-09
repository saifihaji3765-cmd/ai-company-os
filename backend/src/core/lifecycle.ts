export interface LifecycleComponent {
  readonly name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export class ApplicationLifecycle {
  private readonly components: LifecycleComponent[] = [];
  private started = false;
  private stopping = false;

  register(component: LifecycleComponent): void {
    if (this.started) {
      throw new Error(
        `Cannot register lifecycle component "${component.name}" after startup.`,
      );
    }

    if (
      this.components.some(
        (registeredComponent) => registeredComponent.name === component.name,
      )
    ) {
      throw new Error(
        `Lifecycle component already registered: "${component.name}".`,
      );
    }

    this.components.push(component);
  }

  async start(): Promise<void> {
    if (this.started) {
      return;
    }

    const startedComponents: LifecycleComponent[] = [];

    try {
      for (const component of this.components) {
        await component.start();
        startedComponents.push(component);
      }

      this.started = true;
    } catch (error) {
      await this.stopComponents(startedComponents);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.started || this.stopping) {
      return;
    }

    this.stopping = true;

    try {
      await this.stopComponents([...this.components].reverse());
      this.started = false;
    } finally {
      this.stopping = false;
    }
  }

  isStarted(): boolean {
    return this.started;
  }

  private async stopComponents(
    components: readonly LifecycleComponent[],
  ): Promise<void> {
    for (const component of components) {
      try {
        await component.stop();
      } catch (error) {
        console.error(
          `Failed to stop lifecycle component "${component.name}".`,
          error,
        );
      }
    }
  }
}

export function createApplicationLifecycle(): ApplicationLifecycle {
  return new ApplicationLifecycle();
}
