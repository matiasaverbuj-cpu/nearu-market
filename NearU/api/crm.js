/**
 * NEARU · API del CRM
 * Vercel Serverless Function · ruta publica: /api/crm
 *
 * Puente entre la sala privada y Airtable. El token de Airtable vive SOLO acá,
 * del lado del servidor: nunca se manda al navegador.
 *
 * Variables de entorno a cargar en Vercel (Settings > Environment Variables):
 *   AIRTABLE_TOKEN  token personal de Airtable con data.records:read y :write
 *   CRM_KEY         clave compartida que la sala manda en el header x-crm-key
 *
 * Seguridad: sin el header correcto, responde 401. La clave viaja dentro del
 * contenido cifrado de la sala, asi que solo la tiene quien pudo abrirla.
 */

const BASE = 'appK7o0z40JivpxZT';

const TABLAS = {
  constructoras: 'tblb5DkSxUSR7ktys',
  proyectos:     'tbluYSmiPLXkxPuhb',
  edificios:     'tblxuTQFaPVNPHyFJ',
  contactos:     'tblHRjrXwALRD12Jw',
  seguimientos:  'tblj9UllhLmIbSxLr',
};

// Lista blanca de campos escribibles. Si no esta acá, no se escribe —
// asi un bug en el front no puede pisar Lat/Lng ni los campos calculados.
const ESCRIBIBLES = {
  constructoras: ['Estado','Teléfono','WhatsApp','Email','Contacto (persona)','Cargo',
                  'Última llamada','Próximo paso','Fecha próximo paso','Notas','Alerta',
                  'Unidades en pipeline','Proyectos activos','Tier'],
  proyectos: ['Estado comercial','Etapa de obra','Unidades','Unidades verificadas','Pisos',
              'Estado obra','Entrega','Teléfono','Próximo paso','Fecha próximo paso','Notas',
              'Formato recomendado','Promotora'],
  edificios: ['Estado','Unidades','Unidades verificadas','Administradora (texto)',
              'Próximo paso','Fecha próximo paso','Notas','Notas de campo','Prioridad',
              'Formato recomendado'],
  contactos: ['Estado','Notas','Teléfono','WhatsApp','Email','Cargo','Nombre','Cartera declarada'],
  seguimientos: ['Resumen','Fecha','Tipo','Vendedor','Detalle','Resultado',
                 'Objeción principal','Próximo paso','Fecha próximo paso'],
};

const CAMPOS_LECTURA = {
  constructoras: ['Promotora','Tier','Estado','Teléfono','WhatsApp','Email','Web',
                  'Contacto (persona)','Cargo','Proyectos activos','Zonas','Segmento',
                  'Unidades en pipeline','Dirección','Última llamada','Próximo paso',
                  'Fecha próximo paso','Alerta','Notas','Fuente'],
  proyectos: ['Proyecto','Promotora','Zona','Unidades','Unidades verificadas','Pisos',
              'Estado obra','Etapa de obra','Entrega','Estado comercial','Venta estimada/mes',
              'Techo CAPEX','Formato recomendado','Precio desde','Teléfono','Próximo paso',
              'Fecha próximo paso','Notas','Fuente'],
  edificios: ['Edificio','Zona','Unidades','Unidades verificadas','Estado','Prioridad','Notas de campo',
              'Administradora (texto)','Próximo paso','Fecha próximo paso','Notas',
              'Venta estimada/mes','Techo CAPEX','Formato recomendado','Pisos'],
  contactos: ['Nombre','Empresa','Tipo','Prioridad','Cargo','Teléfono','WhatsApp','Email',
              'Web','Dirección','Zonas que cubre','Cartera declarada','Estado','Notas'],
  seguimientos: ['Resumen','Fecha','Tipo','Vendedor','Detalle','Resultado',
                 'Objeción principal','Próximo paso','Fecha próximo paso'],
};

async function airtable(path, opciones = {}) {
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${path}`, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  });
  const cuerpo = await r.text();
  if (!r.ok) throw Object.assign(new Error(cuerpo.slice(0, 400)), { status: r.status });
  return cuerpo ? JSON.parse(cuerpo) : {};
}

function filtrar(campos, permitidos) {
  const salida = {};
  for (const [k, v] of Object.entries(campos || {})) {
    if (permitidos.includes(k)) salida[k] = v === '' ? null : v;
  }
  return salida;
}

export default async function handler(req, res) {
  if (!process.env.AIRTABLE_TOKEN || !process.env.CRM_KEY) {
    return res.status(500).json({ error: 'Faltan AIRTABLE_TOKEN o CRM_KEY en las variables de entorno de Vercel.' });
  }
  if (req.headers['x-crm-key'] !== process.env.CRM_KEY) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const tabla = (req.query.t || cuerpo.t || 'edificios').toLowerCase();
  const tablaId = TABLAS[tabla];
  if (!tablaId) return res.status(400).json({ error: `Tabla desconocida: ${tabla}` });

  try {
    // ---- LEER ----
    if (req.method === 'GET') {
      let registros = [], offset;
      do {
        const p = new URLSearchParams({ pageSize: '100' });
        CAMPOS_LECTURA[tabla].forEach(f => p.append('fields[]', f));
        if (offset) p.set('offset', offset);
        const d = await airtable(`${encodeURIComponent(tablaId)}?${p}`);
        registros = registros.concat(d.records.map(r => ({ id: r.id, ...r.fields })));
        offset = d.offset;
      } while (offset);
      return res.status(200).json({ tabla, total: registros.length, registros });
    }

    // ---- ESCRIBIR ----
    if (req.method === 'POST' || req.method === 'PATCH') {
      const permitidos = ESCRIBIBLES[tabla];

      // crear (sin id) — se usa para la bitacora de Seguimientos
      if (!cuerpo.id) {
        const fields = filtrar(cuerpo.fields, permitidos);
        if (!Object.keys(fields).length) return res.status(400).json({ error: 'Sin campos válidos para crear.' });
        const d = await airtable(encodeURIComponent(tablaId), {
          method: 'POST',
          body: JSON.stringify({ records: [{ fields }], typecast: true }),
        });
        return res.status(200).json({ ok: true, creado: d.records[0].id });
      }

      // actualizar
      const fields = filtrar(cuerpo.fields, permitidos);
      if (!Object.keys(fields).length) return res.status(400).json({ error: 'Sin campos válidos para actualizar.' });
      await airtable(encodeURIComponent(tablaId), {
        method: 'PATCH',
        body: JSON.stringify({ records: [{ id: cuerpo.id, fields }], typecast: true }),
      });
      return res.status(200).json({ ok: true, actualizado: cuerpo.id });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (e) {
    return res.status(e.status || 500).json({ error: String(e.message || e) });
  }
}
