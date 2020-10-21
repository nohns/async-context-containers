import { ContextContainer } from './context.container';
import { DefaultContextMap } from './default-context-map.interface';

export interface GenerateProviderOptions<TContextMap, TContextName extends keyof TContextMap> {
    contextName: TContextName;
    use?: (context: ContextContainer<TContextMap, TContextName> | undefined, next: () => Promise<any>) => Promise<any>;
}
