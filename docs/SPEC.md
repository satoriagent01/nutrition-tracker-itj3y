# Especificación del Producto: Nutrition Tracker

## 1. Visión General
Una aplicación web gratuita y sin anuncios para rastrear la nutrición. Permite a los usuarios tomar o subir fotos de las etiquetas nutricionales de los productos, extraer la información usando OCR con IA, y luego registrar comidas especificando la cantidad en gramos de cada producto para calcular los totales nutricionales.

## 2. Ejemplos de las Imágenes Compartidas

### Imagen 1 (1.jpg) - Barra de chocolate sin gluten
- **Producto**: Barra de chocolate sin gluten (Dr. Schär AG)
- **Idiomas**: Alemán, Francés, Neerlandés, Italiano
- **Tabla Nutricional**:
  - Columnas: `100 g` y `30 g = 1 Melto`
  - Filas:
    - Energie / énergie / energie / energia: 2292 kJ / 549 kcal (100g), 688 kJ / 165 kcal (30g)
    - Fett / matières grasses / vetten / grassi: 33 g (100g), 10 g (30g)
    - davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi: 13 g (100g), 3.9 g (30g)
    - Kohlenhydrate / glucides / koolhydraten / carboidrati: 55 g (100g), 16 g (30g)
    - davon Zucker / dont sucres / waarvan suikers / di cui zuccheri: 45 g (100g), 14 g (30g)
    - Ballaststoffe / fibres alimentaires / vezels / fibre: 2.4 g (100g), 0.7 g (30g)
    - Eiweiß / protéines / eiwitten / proteïne: 6.8 g (100g), 2.0 g (30g)
    - Salz / sel / zout / sale: 0.18 g (100g), 0.05 g (30g)
- **Ingredientes**: Múltiples idiomas (alemán, francés, neerlandés, italiano)
- **Alérgenos**: Nueces (almendras, nueces, pistachos), leche, soja

### Imagen 2 (2.jpg) - Zumo de fruta
- **Producto**: Versgeperst appel-sinaasappel- en mangosap (Jugo de manzana-naranja-mango prensado en frío)
- **Volumen**: 1 L / 5 porciones (200 ml)
- **Tabla Nutricional**:
  - Columnas: `100 ml` y `glas (200 ml)`
  - Filas:
    - energie: 199 kJ / 47 kcal (100ml), 399 kJ / 94 kcal (200ml)
    - vetten, waarvan: 0 g (100ml), 0 g (200ml)
    - verzadigde vetzuren: 0 g (100ml), 0 g (200ml)
    - onverzadigde vetzuren: 0 g (100ml), 0 g (200ml)
    - koolhydraten, waarvan: 11 g (100ml), 22 g (200ml)
    - suikers: 10 g (100ml), 20 g (200ml)
    - vezels: 0.7 g (100ml), 1.4 g (200ml)
    - eiwitten: 0.4 g (100ml), 0.8 g (200ml)
    - zout: 0 g (100ml), 0 g (200ml)
- **Porción**: 200 ml
- **Ingredientes**: 45% manzana, 35% naranja, 20% mango, antioxidante (ascorbato de sodio [E301])
- **Alérgenos**: Sin alérgenos declarados

### Imagen 3 (3.jpg) - Aceite de oliva en spray
- **Producto**: Extra Olijfolie van de Eerste Persing (Aceite de oliva virgen extra en spray)
- **Volumen**: 200 ml e / 335 g
- **Tabla Nutricional**:
  - Columna: `per 100 ml`
  - Filas:
    - energie: 3404 kJ / 828 kcal
    - vetten: 92 g
    - waarvan verzadigde vetzuren: 14 g
    - koolhydraten: 0 g
    - waarvan suikers: 0 g
    - vezels: 0 g
    - eiwitten: 0 g
    - zout: 0 g
- **Porción**: 100 ml
- **Ingredientes**: Extra virgin olive oil
- **Alérgenos**: Sin alérgenos declarados

## 3. Criterios de Aceptación

### AC-1: Captura y subida de imágenes
- El usuario puede tomar una foto con la cámara o subir una imagen desde su dispositivo.
- La imagen se procesa para extraer la información nutricional.

### AC-2: OCR con IA para extracción de datos nutricionales
- El usuario configura la URL del endpoint de IA, la clave API y el modelo en la interfaz de usuario.
- La aplicación envía la imagen al endpoint de IA configurado y recibe datos estructurados.
- Los datos extraídos incluyen: nombre del producto, tabla nutricional (por 100g/ml), ingredientes y alérgenos.

### AC-3: Almacenamiento de productos
- Los productos extraídos se almacenan localmente en el navegador (IndexedDB o localStorage).
- Cada producto tiene: nombre, nutrición por 100g (energía en kJ y kcal, grasas totales, grasas saturadas, carbohidratos, azúcares, fibra, proteínas, sal/sodio), ingredientes y alérgenos.

### AC-4: Registro de comidas
- El usuario puede crear comidas (desayuno, almuerzo, cena, snack).
- Cada comida contiene uno o más items, donde cada item tiene: referencia al producto, cantidad en gramos.
- El usuario puede buscar productos almacenados para agregarlos a una comida.

### AC-5: Cálculo de nutrición por comida
- La aplicación calcula la nutrición total de cada comida escalando los valores por 100g según la cantidad en gramos registrada.
- Fórmula: `valor_nutricional = (valor_por_100g * cantidad_en_gramos) / 100`

### AC-6: Totales diarios
- La aplicación muestra los totales nutricionales diarios sumando todas las comidas del día.
- El usuario puede configurar objetivos personalizados para cada nutriente (calorías, sodio, grasas saturadas, etc.).

### AC-7: Interfaz de usuario limpia y simple
- La aplicación es una página web vanilla JS sin paso de construcción.
- Diseño limpio y minimalista, sin anuncios.
- Navegación simple entre secciones: escanear, productos, comidas, diario.

## 4. Módulos de Lógica

### 4.1 OCR Module (`ocr.js`)
Función para extraer información nutricional de imágenes usando IA.

```javascript
/**
 * Extrae información nutricional de una imagen usando OCR con IA.
 * @param {string|Blob} image - Ruta del archivo o buffer de la imagen.
 * @param {Object} config - Configuración del endpoint de IA.
 * @param {string} config.url - URL del endpoint de IA (OpenAI-compatible).
 * @param {string} config.key - Clave API.
 * @param {string} config.model - Modelo a usar.
 * @returns {Promise<Object>} Datos nutricionales extraídos.
 * 
 * Ejemplo de retorno:
 * {
 *   productName: "Barra de chocolate sin gluten",
 *   nutritionPer100g: {
 *     energyKj: 2292,
 *     energyKcal: 549,
 *     fat: 33,
 *     saturatedFat: 13,
 *     carbohydrates: 55,
 *     sugars: 45,
 *     fiber: 2.4,
 *     protein: 6.8,
 *     salt: 0.18
 *   },
 *   ingredients: ["pasta de nueces 57%", "leche en polvo", ...],
 *   allergens: ["nueces", "leche", "soja"]
 * }
 */
async function extractNutrition(image, config)
```

### 4.2 Product Module (`product.js`)
Gestión de productos: almacenamiento y recuperación.

```javascript
/**
 * Guarda un producto en el almacenamiento local.
 * @param {Object} product - Datos del producto.
 * @returns {Promise<string>} ID del producto guardado.
 */
async function saveProduct(product)

/**
 * Obtiene todos los productos almacenados.
 * @returns {Promise<Array>} Lista de productos.
 */
async function getAllProducts()

/**
 * Busca productos por nombre.
 * @param {string} query - Término de búsqueda.
 * @returns {Promise<Array>} Productos que coinciden.
 */
async function searchProducts(query)

/**
 * Obtiene un producto por ID.
 * @param {string} id - ID del producto.
 * @returns {Promise<Object|null>} Producto o null si no existe.
 */
async function getProductById(id)
```

### 4.3 Nutrition Module (`nutrition.js`)
Cálculos nutricionales y escalado de valores.

```javascript
/**
 * Calcula la nutrición para una cantidad dada de producto.
 * @param {Object} nutritionPer100g - Valores nutricionales por 100g.
 * @param {number} grams - Cantidad en gramos.
 * @returns {Object} Nutrición escalada.
 * 
 * Ejemplo:
 * Input: { energyKcal: 549, fat: 33, ... }, 60g
 * Output: { energyKcal: 329.4, fat: 19.8, ... }
 */
function calculateNutritionForAmount(nutritionPer100g, grams)

/**
 * Suma la nutrición de múltiples items.
 * @param {Array} items - Lista de items con nutrición calculada.
 * @returns {Object} Nutrición total.
 */
function sumNutrition(items)
```

### 4.4 Meal Module (`meal.js`)
Gestión de comidas y registro.

```javascript
/**
 * Crea una nueva comida.
 * @param {string} name - Nombre de la comida (ej: "Desayuno").
 * @param {string} date - Fecha (YYYY-MM-DD).
 * @returns {Promise<Object>} Comida creada.
 */
async function createMeal(name, date)

/**
 * Agrega un item a una comida.
 * @param {string} mealId - ID de la comida.
 * @param {string} productId - ID del producto.
 * @param {number} grams - Cantidad en gramos.
 * @returns {Promise<Object>} Item agregado.
 */
async function addMealItem(mealId, productId, grams)

/**
 * Obtiene una comida por ID.
 * @param {string} id - ID de la comida.
 * @returns {Promise<Object|null>} Comida o null.
 */
async function getMealById(id)

/**
 * Obtiene todas las comidas de un día.
 * @param {string} date - Fecha (YYYY-MM-DD).
 * @returns {Promise<Array>} Comidas del día.
 */
async function getMealsByDate(date)

/**
 * Calcula la nutrición total de una comida.
 * @param {Object} meal - Comida con items.
 * @returns {Object} Nutrición total de la comida.
 */
function calculateMealNutrition(meal)
```

### 4.5 Daily Tracker Module (`dailyTracker.js`)
Seguimiento diario y objetivos.

```javascript
/**
 * Obtiene los totales nutricionales del día.
 * @param {string} date - Fecha (YYYY-MM-DD).
 * @returns {Promise<Object>} Totales del día.
 */
async function getDailyTotals(date)

/**
 * Guarda los objetivos diarios del usuario.
 * @param {Object} goals - Objetivos por nutriente.
 * @returns {Promise<void>}
 */
async function saveDailyGoals(goals)

/**
 * Obtiene los objetivos diarios del usuario.
 * @returns {Promise<Object>} Objetivos.
 */
async function getDailyGoals()
```

## 5. Interfaz de Usuario

### 5.1 Pantalla de Escaneo
- **Funcionalidad**: El usuario toma o sube una foto de la etiqueta nutricional.
- **Acciones**:
  - Botón "Tomar Foto" (usa la cámara del dispositivo).
  - Botón "Subir Imagen" (selecciona archivo del dispositivo).
  - Botón "Configurar IA" (abre modal para configurar URL, clave y modelo del endpoint de IA).
- **Lógica**: Llama a `extractNutrition()` del módulo OCR.

### 5.2 Pantalla de Productos
- **Funcionalidad**: Lista todos los productos almacenados.
- **Acciones**:
  - Barra de búsqueda para filtrar productos.
  - Botón "Agregar Producto" (para agregar manualmente).
  - Cada producto muestra: nombre, energía por 100g, grasas, carbohidratos, proteínas.
- **Lógica**: Llama a `getAllProducts()` y `searchProducts()` del módulo Product.

### 5.3 Pantalla de Comidas
- **Funcionalidad**: Registro de comidas del día.
- **Acciones**:
  - Sección para cada comida (Desayuno, Almuerzo, Cena, Snack).
  - Botón "Agregar Item" en cada comida (selecciona producto y cantidad en gramos).
  - Muestra nutrición total por comida.
- **Lógica**: Llama a `createMeal()`, `addMealItem()`, `getMealsByDate()` del módulo Meal y `calculateMealNutrition()`.

### 5.4 Pantalla de Diario
- **Funcionalidad**: Resumen diario de nutrición y objetivos.
- **Acciones**:
  - Muestra totales nutricionales del día.
  - Muestra progreso vs objetivos (barras de progreso).
  - Botón "Configurar Objetivos" para editar metas personalizadas.
- **Lógica**: Llama a `getDailyTotals()`, `getDailyGoals()` del módulo Daily Tracker.

## 6. Modelo de Datos

### Producto
```javascript
{
  id: string, // UUID
  name: string,
  nutritionPer100g: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    fiber: number,
    protein: number,
    salt: number
  },
  ingredients: string[],
  allergens: string[]
}
```

### Comida
```javascript
{
  id: string, // UUID
  name: string, // "Desayuno", "Almuerzo", etc.
  date: string, // "YYYY-MM-DD"
  items: [{
    id: string, // UUID
    productId: string,
    grams: number,
    nutrition: { // Calculado al agregar
      energyKj: number,
      energyKcal: number,
      fat: number,
      saturatedFat: number,
      carbohydrates: number,
      sugars: number,
      fiber: number,
      protein: number,
      salt: number
    }
  }]
}
```

### Objetivos Diarios
```javascript
{
  energyKcal: number,
  fat: number,
  saturatedFat: number,
  carbohydrates: number,
  sugars: number,
  protein: number,
  salt: number
}
```

## 7. Tecnologías
- **Frontend**: HTML, CSS, Vanilla JavaScript (sin framework, sin paso de construcción).
- **Almacenamiento**: IndexedDB para productos y comidas, localStorage para configuración.
- **OCR**: Endpoint de IA compatible con OpenAI (configurable por el usuario).