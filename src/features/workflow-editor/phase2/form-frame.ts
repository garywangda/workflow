import { FormBuilder, Formio } from '@formio/js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@formio/js/dist/formio.builder.min.css';
import type { FormAsset } from './model';

const options = { noEval: true, noDefaultSubmitButton: true, builder: { basic: false, advanced: false, data: false, premium: false, layout: false,
  workflow: { title: 'Workflow fields', default: true, weight: 0, components: {
    textfield: true, textarea: true, number: true, currency: true, datetime: true, select: true, selectboxes: true, checkbox: true, datagrid: true, file: true,
    person: { title: 'Person', key: 'person', icon: 'user', schema: { type: 'textfield', key: 'person', label: 'Person ID', input: true, workflowType: 'person' } },
    dateOnly: { title: 'Date', key: 'dateOnly', icon: 'calendar', schema: { type: 'datetime', key: 'date', label: 'Date', input: true, enableTime: false, format: 'yyyy-MM-dd' } },
  } } } };
let sequence = 0;
let dispose: (() => void) | undefined;
const send = (type: string, payload: unknown) => window.parent.postMessage({ type, payload }, location.origin);
window.addEventListener('message', async event => {
  if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== 'workflow-form-init') return;
  const current = ++sequence;
  dispose?.();
  const root = document.getElementById('form-root')!;
  const element = document.createElement('div');
  root.replaceChildren(element);
  try {
    const schema = event.data.schema as FormAsset['schema'];
    if (!Array.isArray(schema?.components)) throw new Error('Invalid form schema');
    if (event.data.preview) {
      const form = await Formio.createForm(element, schema, { noEval: true });
      if (sequence !== current) { form.destroy(); return; }
      dispose = () => form.destroy();
    } else {
      const builder = new FormBuilder(element, schema, structuredClone(options));
      dispose = () => builder.destroy();
      await builder.ready;
      if (sequence !== current) { builder.destroy(); return; }
      const changed = () => send('workflow-form-change', builder.instance.form);
      for (const name of ['saveComponent', 'updateComponent', 'removeComponent', 'addComponent', 'cancelComponent']) builder.instance.on(name, changed);
    }
    send('workflow-form-ready', null);
  } catch (error) { send('workflow-form-error', String(error)); }
});
