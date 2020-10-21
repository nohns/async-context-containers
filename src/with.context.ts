import { ContextHandler, ContextProvider } from './context.handler';

export function withContext(...providers: ContextProvider[]) {
    return new ContextHandler(providers);
}
