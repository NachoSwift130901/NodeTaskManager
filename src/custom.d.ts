declare module 'swagger-jsdoc' {
  import { OpenAPIV3 } from 'openapi-types';

  interface Options {
    definition: any;
    apis: string[];
  }

  export default function swaggerJSDoc(options: Options): OpenAPIV3.Document;
}
