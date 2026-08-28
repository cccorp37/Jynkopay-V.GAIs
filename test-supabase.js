import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
async function test() {
  const { data, error } = await supabase.from('contacts').select('*').limit(1);
  console.log("contacts:", error ? error.message : "Exists");
  const { data: d2, error: e2 } = await supabase.from('crm_contacts').select('*').limit(1);
  console.log("crm_contacts:", e2 ? e2.message : "Exists");
}
test();
