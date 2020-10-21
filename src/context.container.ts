import * as cls from 'cls-hooked';
import { DefaultContextMap } from './default-context-map.interface';
import { GenerateProviderOptions } from './context-provider.options';

/**
 * Contains the setters and getters for a chuck of context saved in a cls namespace
 */
export class ContextContainer<TContextMap, KContext extends keyof TContextMap> {
    constructor(private contextName: KContext) {}

    public get namespace() {
        return cls.getNamespace(this.contextName as string);
    }

    public get<K extends keyof TContextMap[KContext], V = TContextMap[KContext][K]>(key: K): V | undefined | null {
        if (!this.namespace) {
            return null;
        }

        return this.namespace.get(key as string) as V | undefined;
    }

    public set<K extends keyof TContextMap[KContext], V = TContextMap[KContext][K]>(key: K, value: V): V | undefined | null {
        if (!this.namespace) {
            return null;
        }

        this.namespace.set(key as string, value);
    }
}
