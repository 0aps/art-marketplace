import { App as BaseApp } from 'art-marketplace-common';
import { SwaggerSchemas } from './swagger.js';

class App extends BaseApp {
  getSwaggerOptions () {
    return {
      name: 'payments',
      swaggerDefinition: {
        openapi: '3.0.1',
        info: {
          title: `${this.getAppName()} microservice API`,
          version: this.env.npm_package_version,
          description: 'Provides capability to handle payments.',
          license: {
            name: 'MIT',
            url: 'https://github.com/0aps/art-marketplace/blob/main/LICENSE'
          },
          contact: {
            name: 'Jessie Romero Pérez',
            url: 'https://github.com/jesromper/',
            email: 'jessieromeroperez@gmail.com'
          }
        },
        servers: [{
          url: this.router.getBaseRoute()
        }],
        components: {
          securitySchemes: {
            jwt: {
              type: 'http',
              scheme: 'bearer',
              in: 'header',
              bearerFormat: 'JWT'
            }
          },
          schemas: SwaggerSchemas
        },
        security: [{
          jwt: []
        }]
      },
      apis: ['./src/views.js']
    };
  }
}

export default App;
