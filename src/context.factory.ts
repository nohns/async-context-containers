import * as cls from 'cls-hooked';
import { GenerateProviderOptions } from './context-provider.options';
import { ContextContainer } from './context.container';
import { ContextProvider } from './context.handler';
import { DefaultContextMap } from './default-context-map.interface';

export class ContextFactory<TContextMap> {
    private contextsMap = new Map<string, ContextContainer<TContextMap, any>>();

    public create<K extends keyof TContextMap>(contextName: K) {
        this.contextsMap.set(String(contextName), new ContextContainer<TContextMap, K>(contextName));
        return cls.createNamespace(String(contextName));
    }

    public load<K extends keyof TContextMap>(contextName: K): ContextContainer<TContextMap, K> | undefined {
        return this.contextsMap.get(String(contextName));
    }

    public generateContextProvider<K extends keyof TContextMap>({ contextName, use }: GenerateProviderOptions<TContextMap, K>): ContextProvider {
        return async (next) => {
            const ctx = this.create(contextName);
            await ctx.runPromise(async () => {
                const ctxContainer = this.load(contextName);
                return use ? use(ctxContainer, next) : next();
            });
        };
    }
}

export function createContextFactory<TContextMap extends DefaultContextMap = DefaultContextMap>() {
    return new ContextFactory<TContextMap>();
}
