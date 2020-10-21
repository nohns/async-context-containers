export type ContextProvider = (next: () => Promise<any>) => Promise<any>;

export class ContextHandler {
    private stack: (() => Promise<any>)[] = [];

    constructor(private providers: ContextProvider[]) {}

    public async in(closure: () => Promise<any>): Promise<void> {
        for (const provide of this.providers) {
            const idx = this.stack.length;
            const func = async () => {
                return (await provide)(async () => await this.next(idx));
            };
            this.stack.push(func);
        }

        // Make sure we execute the closure last so we get all
        this.stack.push(closure);

        // Call all providers in stack + the closure at last
        await this.stack[0]();
    }

    private async next(idx: number) {
        if (idx + 1 < this.stack.length) {
            await this.stack[idx + 1]();
        }
    }
}
