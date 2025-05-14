import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from '@apollo/gateway';

export class SubgraphGraphQLDataSource extends RemoteGraphQLDataSource {
  // Forward all headers from the incoming request to the outgoing request
  public willSendRequest({ request, context }: GraphQLDataSourceProcessOptions): void {
    if (context.req) {
      const { headers } = context.req as { headers: Record<string, string> };

      Object.entries(headers).forEach(([key, value]) => {
        request.http?.headers.set(key, String(value));
      });
    }
  }
}
