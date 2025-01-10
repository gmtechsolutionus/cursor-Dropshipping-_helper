# API Documentation

## Interfaces

### Interface: ConfigOptions
Represents configuration options for the application.

**Properties:**
- `port` (number): The port number to run the server on
- `host` (string): The host address to bind to
- `debug` (boolean): Enable debug mode

### Interface: RequestHandler
Handles incoming HTTP requests.

**Parameters:**
- `req` (Request): The incoming request object
- `res` (Response): The response object
- `next` (NextFunction): The next middleware function

**Returns:**
- `Promise<void>`: Resolves when handling is complete

## Functions

### Function: initialize(config: ConfigOptions)
Initializes the application with the given configuration.

**Parameters:**
- `config`: Configuration options object

**Returns:**
- `Promise<void>`: Resolves when initialization is complete

**Example:**
```typescript
await initialize({
  port: 3000,
  host: 'localhost',
  debug: true
});
```

// ... existing code ...