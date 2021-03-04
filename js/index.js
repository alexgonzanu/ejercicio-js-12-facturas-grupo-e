/* eslint-disable no-undef */
const urlApi = "http://localhost:3001/facturas";
const tBody = document.querySelector("tbody");
const tFoot = document.querySelector("tfoot");

const clonarFila = () => {
  const molde = document.querySelector(".clonada").cloneNode(true);
  molde.classList.remove("row-dummy");
  return molde;
};

const estaAbonada = (dato) => dato === true;

// eslint-disable-next-line radix
const convertirTimestampFecha = (fechaTimestamp) => new Date(parseInt(fechaTimestamp));

const compararFechas = (fecha, fechaVencimiento, vence, dato) => {
  const DateTimeFecha = luxon.DateTime.fromISO(new Date(parseInt(dato.fecha)).toISOString());
  const DateTimeFechaVencimiento = luxon.DateTime.fromISO(new Date(parseInt(dato.vencimiento)).toISOString());
  console.log(fecha.toLocaleDateString(), fechaVencimiento.toLocaleDateString());
  const restanteDias = Math.trunc(DateTimeFechaVencimiento.diff(DateTimeFecha, "days").values.days);
  if (fecha > fechaVencimiento) {
    vence.classList.add("table-danger");
    vence.textContent = `${fechaVencimiento.toLocaleDateString()} (hace ${restanteDias} dias)`;
  } else if (fecha <= fechaVencimiento) {
    vence.classList.add("table-success");
    vence.textContent = `${fechaVencimiento.toLocaleDateString()} (faltan ${restanteDias} dias)`;
  }
};

const rellenarTabla = (dato, numRow, fechaRow, conceptoRow, baseRow, ivaRow, totalRow, estadoRow, venceRow) => {
  numRow.textContent = dato.numero;
  fechaRow.textContent = dato.fecha;
  conceptoRow.textContent = dato.concepto;
  baseRow.textContent = `${dato.base}€`;
  ivaRow.textContent = `${(dato.base * dato.tipoIva) / 100} € (${dato.tipoIva}%)`;
  totalRow.textContent = `${(((dato.base * dato.tipoIva) / 100) + dato.base).toFixed(2)} €`;
  const fecha = convertirTimestampFecha(dato.fecha);
  const fechaDeVencimiento = convertirTimestampFecha(dato.vencimiento);
  // console.log(fechaSinTimestamp);
  if (estaAbonada(dato.abonada)) {
    estadoRow.classList.add("table-success");
    estadoRow.textContent = "Abonada";
    venceRow.classList.add("table-success");
    venceRow.textContent = "-";
  } else {
    estadoRow.classList.add("table-danger");
    estadoRow.textContent = "Pendiente";
    compararFechas(fecha, fechaDeVencimiento, venceRow, dato);
  }
};

const recogerDatos = async () => {
  const responsive = await fetch(urlApi);
  const datos = await responsive.json();
  const datosTipoIngreso = datos.filter(dato => dato.tipo.includes("ingreso"));
  const totales = document.querySelector(".totales").cloneNode(true);
  totales.classList.remove("row-dummy");
  const totalBase = totales.querySelector(".total-base");
  const totalIva = totales.querySelector(".total-iva");
  const totalTotal = totales.querySelector(".total-total");
  // eslint-disable-next-line prefer-const
  let sumaTotalBase = 0;
  let sumaTotalIva = 0;
  let sumaTotalTotal = 0;
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
    sumaTotalBase += dato.base;
    sumaTotalIva += (dato.base * dato.tipoIva) / 100;
    sumaTotalTotal += (((dato.base * dato.tipoIva) / 100) + dato.base);
    tBody.append(filaClonada);
  }
  totalBase.textContent = `${sumaTotalBase}€`;
  totalIva.textContent = `${sumaTotalIva}€`;
  totalTotal.textContent = `${sumaTotalTotal.toFixed(2)}€`;
  tFoot.prepend(totales);
};

recogerDatos();
