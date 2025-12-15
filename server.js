const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde el directorio `dist/venta-ware-x-frontend/browser`
app.use(express.static(path.join(__dirname, 'dist/venta-ware-x-frontend/browser')));

// Redirigir todas las solicitudes a `index.html`
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/venta-ware-x-frontend/browser/index.html'));
});

// Configurar el puerto y escuchar las solicitudes
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
