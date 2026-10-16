/** PostgreSQL devuelve las columnas numeric como texto; esto las convierte a number. */
export const numericTransformer = {
  to: (valor) => valor,
  from: (valor) => (valor === null || valor === undefined ? valor : Number(valor)),
};
