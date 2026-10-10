import { GRAPHQL_POST, GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";
import configPromise from "@payload-config";

export const POST = GRAPHQL_POST(configPromise);
export const GET = GRAPHQL_PLAYGROUND_GET(configPromise);
