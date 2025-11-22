# ORYX v0.1 — Optimized Representation for Yielding eXpression

**Estado:** Especificación inicial (Draft)
**Licencia sugerida:** MIT
**Objetivo:** Definir la sintaxis, semántica y principios de diseño del formato ORYX, orientado a comunicación optimizada con modelos de lenguaje.

---

# 1. Introducción

ORYX es un formato de datos compacto, legible y altamente eficiente en el consumo de tokens, diseñado para interactuar con modelos de lenguaje (LLMs). Mantiene compatibilidad conceptual con el modelo de datos JSON, pero reduce redundancia estructural y proporciona señales claras que facilitan el razonamiento para IA.

---

# 2. Principios del diseño

1. **Densidad semántica máxima**: Reducir tokens sin sacrificar claridad.
2. **Compatibilidad JSON**: Todo documento ORYX puede mapearse 1:1 a una estructura JSON.
3. **Estructura explícita mínima**: Evitar repeticiones de claves y sintaxis innecesaria.
4. **Optimización para LLMs**: Delimitadores consistentes y bloques semánticos.
5. **Legibilidad humana**: El formato debe ser interpretable incluso sin herramientas.
6. **Tipos inferidos**: Valores identificados automáticamente (int, float, bool, string).
7. **Dualidad anidada-tabular**: Soporte tanto para objetos como para tablas compactas.

---

# 3. Elementos base del formato

## 3.1. Pares clave-valor

Estructura fundamental equivalente a objetos JSON.

```
clave: valor
```

## 3.2. Objetos anidados

La indentación genera jerarquía.

```
usuario:
  nombre: Iran
  edad: 35
```

Las claves deben estar alineadas por indentación consistente.

## 3.3. Arrays simples

Listas de valores homogéneos.

```
roles[3]: admin,editor,viewer
```

El número entre corchetes indica la longitud declarada del array.

## 3.4. Arrays de objetos homogéneos (modo tabular)

Permite definir una tabla de objetos con campos repetidos.

```
usuarios[2]{id,nombre,rol}:
  1, Iran, admin
  2, Luis, user
```

Cada fila corresponde a un objeto.

### Reglas:

* Las claves dentro de `{}` definen el esquema.
* El número dentro de `[N]` declara la cantidad de filas.
* La cantidad de valores en cada fila debe coincidir con la cantidad de claves.

---

# 4. Compresión de claves mediante alias

El bloque `@alias` permite definir sustituciones para reducir tokens.

```
@alias { id:i, nombre:n, rol:r }
```

Uso posterior:

```
usuarios[2]{i,n,r}:
  1, Iran, admin
  2, Luis, user
```

Los alias deben ser únicos dentro del documento.

---

# 5. Inferencia de tipos

ORYX no requiere comillas salvo ambigüedad.

* `25` → int
* `3.14` → float
* `true` / `false` → bool
* `texto` → string
* "texto, con, comas" → string literal protegido

Regla general: si contiene comas o caracteres ambiguos, úsense comillas dobles.

---

# 6. Bloques semánticos

Los bloques marcados con `@block` permiten agrupar información contextual recomendada para LLMs.

```
@block contexto:
  sistema: inventario
  version: 0.1
```

No afectan la estructura JSON, pero mejoran interpretabilidad.

---

# 7. Modo ultradenso

Para máxima compresión se permite una variante sin saltos de línea.

```
usuarios[2]{i,n,r}:1,Iran,admin;2,Luis,user
```

Reglas:

* Filas separadas por `;`.
* No requiere indentación.
* Debe mantenerse la estructura exacta del esquema.

---

# 8. Comentarios

Los comentarios utilizan `#`.

```
# Comentario de línea
```

Los comentarios no forman parte del mapeo JSON.

---

# 9. Conversión ORYX → JSON

Ejemplo:

```
productos[2]{id,nombre,precio}:
  1, Mouse Pro, 25.99
  2, Teclado MK, 59.50
```

Se convierte en:

```
{
  "productos": [
    { "id": 1, "nombre": "Mouse Pro", "precio": 25.99 },
    { "id": 2, "nombre": "Teclado MK", "precio": 59.50 }
  ]
}
```

---

# 10. Restricciones sintácticas

1. No se permiten claves duplicadas en el mismo nivel.
2. El número declarado en `[N]` debe coincidir con las filas.
3. Alias deben definirse antes de ser usados.
4. Indentación consistente de dos espacios.
5. Claves deben ser strings sin espacios (usar alias en caso contrario).

---

# 11. Ejemplo completo ORYX v0.1

```
@alias { id:i, nombre:n, rol:r }
@block contexto:
  sistema: inventario
  version: 0.1
  autor: Iran

productos[3]{i,n,r,precio,stock}:
  1, Mouse Pro, hw, 25.99, 120
  2, Teclado MK, hw, 59.50, 80
  3, Suscripción Max AI, sw, 14.99, 5000

config:
  modo: produccion
  optimizacion: true
```

---

# 12. Roadmap sugerido

* v0.2: Definición formal EBNF
* v0.3: Parser oficial (TS y Python)
* v0.4: Validación y estructura de errores
* v1.0: Estándar estable

---

Fin de ORYX Especificación v0.1
