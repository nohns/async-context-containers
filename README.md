# Async context containers

## What is the async-context-containers library?

Async context containers is a strongly-typed Typescript library that 
helps deeply nested async functions with getting context set higher up the call stack. 
It relies on cls-hooked, which is using the experimental node feature async-hooks.

##### Disclaimer!
As the async-hooks feature in Node.js is not yet stable, you should expect that your 
data could be undefined when you access it. Not that this happens that often 
(haven't tried it yet myself), but it is good practice to check for it anyways.

## Concept

**Context container:** 
A piece of context that can be shared at some point in your app, 
*eg. request context, config context, etc.* You can access your context containers 
state with the `.get()` method, and set state with te `.set()` method. These methods are exposed 
by a `ContainerContext` instance.

**Context map *(Typescript only)*:**
A context map is a Typescript interface that lays out a map of all your context containers.
Here is an example:
```typescript
interface ContextMap {
    config: ConfigContextContainer; // The 'config' key is the context name
    request: RequestContextContainer; // The 'request' key is the context name
}

// The properties describes the context state you can access with the .get() and .set() functions
interface ConfigContextContainer {
    debug: boolean; 
}

// Perhaps you want to share an Express request object longer down the call stack...
interface RequestContextContainer {
    req: Request; 
    res: Resposne;
}
```

**Context factory:** 
The object instance which is being used to load and create `ContextContainer` instances.

**Point of introduction:**
When dealing with async shared context, we are also dealing with the concept of time. 
Therefore, the context we would to provide our app with, can only be available after we 
introduce it at some point in the async call stack, and then only be available for the 
duration of that async call stack. This can be a little hard to grasp at first, but when 
you start writing some code with it, it should start to sink in.

**Context provider:**
When we want to introduce the context in the async call stack, we use the `generateContextProvider()`
method with some parameters that then can inserted into this function call...
```typescript
withContext(...contextProviders: ContextProvider[]).in(async() => { 
    // Move on in the async call stack 
});
```
They are pretty much just a type of middleware. You will learn more about this in the following *Getting Started* guide.

## Getting started

**Installation**:

```shell script
# With NPM
npm install async-context-containers --save

# Or with Yarn
yarn add async-context-containers
```

*The following usage examples uses Typescript as this library provides type-hinting...*

Create a file for your context logic. Mine is called **context.ts**

**context.ts:**

```typescript
// Import the factory creator function
import { createContextFactory } from 'async-context-containers'; 

// Define what your context looks like. Remember, keys are context names and the type describes
// what state can be accessed
interface ContextMap {
    config: ConfigContextContainer;
}

// Example: config context
interface ConfigContextContainer {
    debug: boolean;
    greeting: string;
}

// Export the Context factory object as you are going to use 
// this to access context  around in your app.
// Make sure to pass in your ContextMap as this will provide type hinting
export const Context = createContextFactory<ContextMap>();

// Create context provider for the config context..
export const configCtx = (debug: boolean) => {
    return Context.generateContextProvider({
        contextName: 'config', // Can only be 'config' here as it is the only context name stated in the context map
        use: async (configContextContainer, next) => {
            // We can only set 'debug' and 'gretting' state, as they are the only properties described on 
            // the ConfigContextContainer interface.
            configContextContainer?.set('debug', debug); 
            configContextContainer?.set('greeting', 'Hello, World!');
            
            // Always run next() function at last, so we can go to next context provider
            return next();
        }       
    });
}
```

Now we got our context boilerplate code sorted out, we will need to find where we 
want to introduce our context into our application. For demonstration purposes we
will introduce the context at the starting point of our app, which of course also
is a valid strategy. I do this in my **index.ts**

**index.ts:**
```typescript
import { withContext } from 'async-context-containers';
import { configCtx, Context } from './context.ts';

async function main() {
    
    // Introduce our context into the async call stack
    await withContext(configCtx()).in(async () => {
        // Continue down the async call stack...
        // For demonstration purposes we just call another async method
        await sideEffect();

        // Remember only calls made inside this 'in' closure can use the context provided. In our
        // case, the config context.
    });
}

// Run application
main()
  .then(() => {})
  .catch((err) => console.log(err));


async function sideEffect() {
    const configContextContainer = Context.load('config'); // Load context container by name
    const debug = configContextContainer?.get('debug'); // Boolean, but can be in rare circumstances be undefined 

    if (debug) {
        const greeting = configContextContainer?.get('greeting');
        console.log(greeting); // logs: "Hello, World!"
    }
}
```

That is pretty much it. Feel free to play around with it all you like! If you find a bug, 
be sure to submit an issue on GitHub.

