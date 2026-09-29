import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveProduct, getAllProducts, searchProducts, getProductById } from "../src/product.js";

// Mock storage for testing
const mockStorage = new Map();

// Override global storage for tests
const originalStorage = global.localStorage;

describe("Product Module", () => {
  test("should save a product and return its ID (AC-3)", async () => {
    const product = {
      name: "Barra de chocolate sin gluten",
      nutritionPer100g: {
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        salt: 0.18
      },
      ingredients: ["pasta de nueces 57%", "leche en polvo", "azúcar"],
      allergens: ["nueces", "leche", "soja"]
    };

    const id = await saveProduct(product);
    assert.ok(id);
    assert.equal(typeof id, "string");
  });

  test("should store nutrition per 100g correctly (AC-3)", async () => {
    const product = {
      name: "Zumo de manzana-naranja-mango",
      nutritionPer100g: {
        energyKj: 199,
        energyKcal: 47,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 11,
        sugars: 10,
        fiber: 0.7,
        protein: 0.4,
        salt: 0
      },
      ingredients: ["45% manzana", "35% naranja", "20% mango"],
      allergens: []
    };

    const id = await saveProduct(product);
    const retrieved = await getProductById(id);
    
    assert.equal(retrieved.name, product.name);
    assert.equal(retrieved.nutritionPer100g.energyKj, 199);
    assert.equal(retrieved.nutritionPer100g.energyKcal, 47);
    assert.equal(retrieved.nutritionPer100g.fat, 0);
    assert.equal(retrieved.nutritionPer100g.saturatedFat, 0);
    assert.equal(retrieved.nutritionPer100g.carbohydrates, 11);
    assert.equal(retrieved.nutritionPer100g.sugars, 10);
    assert.equal(retrieved.nutritionPer100g.fiber, 0.7);
    assert.equal(retrieved.nutritionPer100g.protein, 0.4);
    assert.equal(retrieved.nutritionPer100g.salt, 0);
  });

  test("should store ingredients and allergens (AC-3)", async () => {
    const product = {
      name: "Aceite de oliva virgen extra",
      nutritionPer100g: {
        energyKj: 3404,
        energyKcal: 828,
        fat: 92,
        saturatedFat: 14,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 0,
        salt: 0
      },
      ingredients: ["Aceite de oliva virgen extra"],
      allergens: []
    };

    const id = await saveProduct(product);
    const retrieved = await getProductById(id);
    
    assert.deepStrictEqual(retrieved.ingredients, ["Aceite de oliva virgen extra"]);
    assert.deepStrictEqual(retrieved.allergens, []);
  });

  test("should return all products (AC-3)", async () => {
    await saveProduct({
      name: "Producto A",
      nutritionPer100g: { energyKj: 100, energyKcal: 50, fat: 5, saturatedFat: 2, carbohydrates: 10, sugars: 5, fiber: 1, protein: 3, salt: 0.1 },
      ingredients: ["ingrediente A"],
      allergens: []
    });

    await saveProduct({
      name: "Producto B",
      nutritionPer100g: { energyKj: 200, energyKcal: 100, fat: 10, saturatedFat: 4, carbohydrates: 20, sugars: 10, fiber: 2, protein: 6, salt: 0.2 },
      ingredients: ["ingrediente B"],
      allergens: ["nueces"]
    });

    const products = await getAllProducts();
    assert.equal(products.length, 2);
  });

  test("should search products by name (AC-3)", async () => {
    await saveProduct({
      name: "Barra de chocolate sin gluten",
      nutritionPer100g: { energyKj: 2292, energyKcal: 549, fat: 33, saturatedFat: 13, carbohydrates: 55, sugars: 45, fiber: 2.4, protein: 6.8, salt: 0.18 },
      ingredients: ["pasta de nueces"],
      allergens: ["nueces"]
    });

    await saveProduct({
      name: "Zumo de manzana",
      nutritionPer100g: { energyKj: 199, energyKcal: 47, fat: 0, saturatedFat: 0, carbohydrates: 11, sugars: 10, fiber: 0.7, protein: 0.4, salt: 0 },
      ingredients: ["manzana"],
      allergens: []
    });

    const results = await searchProducts("chocolate");
    assert.equal(results.length, 1);
    assert.equal(results[0].name, "Barra de chocolate sin gluten");

    const results2 = await searchProducts("manzana");
    assert.equal(results2.length, 1);
    assert.equal(results2[0].name, "Zumo de manzana");

    const results3 = await searchProducts("no existe");
    assert.equal(results3.length, 0);
  });

  test("should return null for non-existent product (AC-3)", async () => {
    const product = await getProductById("non-existent-id");
    assert.equal(product, null);
  });
});