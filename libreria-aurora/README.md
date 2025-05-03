# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## If you will develop with both the backend and frontend, keep in mind: 
### Switching between environments in [`libreria-aurora\src\api\config.js`]
```javascript
const config = {
    // Set to false to use the local backend during development
    useProductionBackend: true,
    
    // Additional configuration settings...
};
```

## Connecting to Existing API Modules

### Configuration Workflow

#### 1. Determine which backend module you need to connect to

First, identify which API endpoint you need to access:

- Check `backend/config/urls.py` to see all registered API modules:
  ```python
  urlpatterns = [
      # ...
      path('api/libros/', include('apps.libros.urls')),
      path('api/usuarios/', include('apps.usuarios.urls')),
      path('api/finanzas/', include('apps.finanzas.urls')),
      # ...
  ]
  ```

#### 2. Choose your API connection approach

The project supports two methods of connecting to APIs:

**Method 1: Direct URL approach** (more flexible)
```jsx
import { getApiUrl } from "../api/config";

// Inside your component:
const apiUrl = getApiUrl("/api/libros/");

// Use in fetch calls:
fetch(apiUrl, {
  // options...
})
```

**Method 2: Predefined endpoint key** (more maintainable)
```jsx
import { getApiUrlByKey } from "../api/config";

// Inside your component:
const apiUrl = getApiUrlByKey("libros");

// Use in fetch calls:
fetch(apiUrl, {
  // options...
})
```

#### 3. Add new endpoints when needed

If you need to connect to a new endpoint not yet in the configuration:

1. Open `src/api/config.js`
2. Add your endpoint to the `endpoints` object:
   ```javascript
   endpoints: {
     // existing endpoints...
     
     // Add your new endpoint
     miNuevoEndpoint: "/api/mi-modulo/mi-endpoint/",
   }
   ```
3. Use it in your components with `getApiUrlByKey("miNuevoEndpoint")`

#### 4. Authentication for protected endpoints

Most API endpoints require authentication:

```jsx
// Inside an async function:
const token = localStorage.getItem("token");
if (!token) {
  // Handle unauthenticated state
  return;
}

const response = await fetch(apiUrl, {
  method: "GET", // or POST, PUT, DELETE
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  // body: JSON.stringify(data) // for POST/PUT requests
});
```

#### 5. Testing different environments

- Switch between local and production backends by changing `useProductionBackend` in `src/api/config.js`
- This allows testing against local backend during development and production backend for final testing

## Available Scripts

In the project directory, you can run:

## `cd libreria-aurora`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
