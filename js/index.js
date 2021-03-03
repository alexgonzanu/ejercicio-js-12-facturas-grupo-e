const urlApi = "http://localhost:3001/facturas";
const tBody = document.querySelector("tbody");

const clonarFila = () => {
  const molde = document.querySelector(".clonada").cloneNode(true);
  molde.classList.remove("row-dummy");
  return molde;
};

const rellenarTabla = (dato, numRow, fechaRow, conceptoRow, baseRow, ivaRow, totalRow, estadoRow, venceRow) => {
  numRow.textContent = dato.numero;
  fechaRow.textContent = dato.fecha;
  conceptoRow.textContent = dato.concepto;
  baseRow.textContent = dato.base;
  ivaRow.textContent = `${(dato.base * dato.tipoIva) / 100}€ (${dato.tipoIva}%)`;
  totalRow.textContent = `${(((dato.base * dato.tipoIva) / 100) + dato.base).toFixed(2)}€`;
  estadoRow.textContent = dato.abonada;
  venceRow.textContent = dato.vencimiento;
};

const recogerDatos = async () => {
  const responsive = await fetch(urlApi);
  const datos = await responsive.json();
  const datosTipoIngreso = datos.filter(dato => dato.tipo.includes("ingreso"));
  for (const dato of datosTipoIngreso) {
    const filaClonada = clonarFila();
    const num = filaClonada.querySelector(".num");
    const fecha = filaClonada.querySelector(".fecha");
    const concepto = filaClonada.querySelector(".concepto");
    const base = filaClonada.querySelector(".base");
    const iva = filaClonada.querySelector(".iva");
    const total = filaClonada.querySelector(".total");
    const estado = filaClonada.querySelector(".estado");
    const vence = filaClonada.querySelector(".vence");
    estado.classList.remove("table-danger");
    vence.classList.remove("table-success");
    rellenarTabla(dato, num, fecha, concepto, base, iva, total, estado, vence);
    tBody.prepend(filaClonada);
  }
};
recogerDatos();
