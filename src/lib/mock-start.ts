export function createServerFn(options?: any) {
  const builder: any = {
    middleware: () => builder,
    validator: () => builder,
    inputValidator: () => builder,
    handler: (fn: any) => {
      const serverFn: any = async (args: any) => {
        try {
          return await fn({ data: args, context: {} });
        } catch (e) {
          console.error("Server function error (client fallback):", e);
          return null;
        }
      };
      serverFn.url = "";
      return serverFn;
    },
  };
  return builder;
}

export function useServerFn(fn: any) {
  return fn;
}

export function createMiddleware() {
  return {
    middleware: () => createMiddleware(),
    server: (fn: any) => fn,
    client: (fn: any) => fn,
  };
}

export function createStart(fn: any) {
  return fn?.() || {};
}

export function getRequest() {
  return typeof Request !== "undefined" ? new Request("http://localhost") : undefined;
}
